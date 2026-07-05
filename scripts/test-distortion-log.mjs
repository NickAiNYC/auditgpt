import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const domain = process.env.GUARDIAN_DOMAIN || 'lumieresaesthetics.com';
  const query = `${domain} weight loss claims`;
  const answerPayload = JSON.stringify({
    source: 'ai-answer-simulation',
    answer: `Observed claims on ${domain} related to "${query}"`,
    timestamp: new Date().toISOString(),
    simulated: true,
  });

  const status = 'observed';
  const digest = crypto.createHash('sha256')
    .update(`${domain}::${query}::${status}`)
    .digest('hex');
  
  const id = crypto.randomUUID();

  await prisma.$executeRawUnsafe(
    `INSERT OR IGNORE INTO DistortionLog (id, domain, query, answerPayload, status, digest, checkedAt, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    id, domain, query, answerPayload, status, digest
  );

  console.log('=== DISTORTION LOG WRITTEN ===');
  console.log('ID:', id);
  console.log('Domain:', domain);
  console.log('Query:', query);
  console.log('Status:', status);
  console.log('Digest:', digest);

  // Verify by reading it back
  const rows = await prisma.$queryRawUnsafe(
    'SELECT id, domain, query, status, digest, checkedAt FROM DistortionLog WHERE digest = ?',
    digest
  );
  console.log('\n=== VERIFICATION ===');
  console.log('Row found:', JSON.stringify(rows, null, 2));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
