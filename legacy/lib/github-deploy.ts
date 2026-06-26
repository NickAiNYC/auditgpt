import { decryptToken, encryptToken } from '@/lib/token-crypto';
import { db } from '@/lib/db';

interface GitHubFiles {
  path: string;
  content: string;
}

interface DeployFixInput {
  userId: string;
  auditPublicId: string;
  auditId: string;
  companyName: string | null;
  files: GitHubFiles[];
  commitMessage: string;
  prTitle: string;
  prBody: string;
}

interface DeployFixResult {
  prUrl: string;
  prNumber: number;
  branchName: string;
  alreadyExisted: boolean;
}

/**
 * Load the connected GitHub integration for a user.
 */
async function getGitHubIntegration(userId: string): Promise<{
  token: string;
  repoFullName: string;
  defaultBranch: string;
}> {
  const integration = await db.integration.findUnique({
    where: { userId_provider: { userId, provider: 'github' } },
  });
  if (!integration || integration.status !== 'connected') {
    throw new Error('GitHub not connected. Connect your GitHub account first.');
  }

  const token = decryptToken(integration.accessToken);
  if (!token) throw new Error('GitHub access token not found or could not be decrypted.');

  const meta = integration.metadata ? JSON.parse(integration.metadata) : {};
  const repoFullName = meta.repositoryFullName;
  const defaultBranch = meta.defaultBranch || 'main';

  if (!repoFullName) {
    throw new Error('No repository configured. Select a repository in your settings.');
  }

  return { token, repoFullName, defaultBranch };
}

/**
 * Create or update a pull request with the approved fixes.
 * Idempotent: same auditPublicId updates the existing PR.
 */
export async function createFixPR(input: DeployFixInput): Promise<DeployFixResult> {
  const { token, repoFullName, defaultBranch } = await getGitHubIntegration(input.userId);
  const branchName = `auditgpt/fix-${input.auditPublicId}`;
  const [owner, repoName] = repoFullName.split('/');

  // Check if PR already exists for this audit
  const existingPR = await db.deployFixPR.findUnique({
    where: { auditId: input.auditId },
  });

  // Get the base branch SHA
  const baseRef = await githubAPI(token, `/repos/${owner}/${repoName}/git/ref/heads/${defaultBranch}`);
  const baseSha = baseRef.object.sha;

  // Determine starting SHA for the new branch
  let branchSha = baseSha;
  if (existingPR) {
    const existingRef = await githubAPI(
      token,
      `/repos/${owner}/${repoName}/git/ref/heads/${branchName}`,
    ).catch(() => null);
    if (existingRef) branchSha = existingRef.object.sha;
  }

  // Create blobs for each file
  const fileBlobs = await Promise.all(
    input.files.map(async (file) => {
      const blob = await githubAPI(token, `/repos/${owner}/${repoName}/git/blobs`, 'POST', {
        content: file.content,
        encoding: 'utf-8',
      });
      return { path: file.path, sha: blob.sha, mode: '100644' as const, type: 'blob' as const };
    }),
  );

  // Create tree
  const tree = await githubAPI(token, `/repos/${owner}/${repoName}/git/trees`, 'POST', {
    base_tree: branchSha,
    tree: fileBlobs,
  });

  // Create commit
  const commit = await githubAPI(token, `/repos/${owner}/${repoName}/git/commits`, 'POST', {
    message: input.commitMessage,
    tree: tree.sha,
    parents: [branchSha],
  });

  // Create or update branch
  const refPath = `/repos/${owner}/${repoName}/git/refs/heads/${branchName}`;
  if (existingPR) {
    await githubAPI(token, refPath, 'PATCH', { sha: commit.sha, force: true });
  } else {
    // Create the branch from base
    await githubAPI(token, refPath, 'POST', {
      ref: `refs/heads/${branchName}`,
      sha: branchSha,
    });
    // Then update to our commit
    await githubAPI(token, refPath, 'PATCH', { sha: commit.sha, force: true });
  }

  // Create or update pull request
  let prNumber: number;
  let prUrl: string;

  if (existingPR) {
    prNumber = existingPR.prNumber;
    prUrl = existingPR.prUrl;
    await githubAPI(token, `/repos/${owner}/${repoName}/pulls/${prNumber}`, 'PATCH', {
      body: input.prBody,
    });
  } else {
    const pr = await githubAPI(token, `/repos/${owner}/${repoName}/pulls`, 'POST', {
      title: input.prTitle,
      body: input.prBody,
      head: branchName,
      base: defaultBranch,
    });
    prNumber = pr.number;
    prUrl = pr.html_url;

    await db.deployFixPR.create({
      data: {
        auditId: input.auditId,
        userId: input.userId,
        prNumber,
        prUrl,
        branchName,
        status: 'open',
      },
    });
  }

  return { prUrl, prNumber, branchName, alreadyExisted: !!existingPR };
}

/**
 * Generate fix files from audit rebuild data.
 */
export function generateFixFiles(auditJson: any): GitHubFiles[] {
  const files: GitHubFiles[] = [];

  if (auditJson.website_fixes && Array.isArray(auditJson.website_fixes)) {
    files.push({
      path: 'AUDITGPT-FIXES.md',
      content: generateFixChecklist(auditJson),
    });
  }

  if (auditJson.action_plan && Array.isArray(auditJson.action_plan)) {
    const steps = auditJson.action_plan
      .map((step: string, i: number) => `- [ ] ${step}`)
      .join('\n');
    files.push({
      path: 'AUDITGPT-ACTION-PLAN.md',
      content: `# AuditGPT Action Plan\n\n${steps}\n`,
    });
  }

  if (auditJson.meta_fixes) {
    files.push({
      path: 'AUDITGPT-META.md',
      content: `# Meta Tag Fixes\n\n${auditJson.meta_fixes}\n`,
    });
  }

  return files;
}

function generateFixChecklist(auditJson: any): string {
  const items = auditJson.website_fixes
    .map((fix: string, i: number) => `- [ ] ${fix}`)
    .join('\n');
  return `# AuditGPT Fix Checklist\n\n${items}\n\n---\n*Generated by [AuditGPT](${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'})*\n`;
}

async function githubAPI(
  token: string,
  path: string,
  method: string = 'GET',
  body?: any,
): Promise<any> {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`GitHub API error: ${error.message} (${res.status})`);
  }

  return res.json();
}
