const APP_URL = 'https://auditgpt.ai';
const DEV_URL = 'http://localhost:3002';

function getAppUrl() {
  return localStorage.getItem('AUDITGPT_APP_URL') || APP_URL;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function canReviewUrl(url) {
  return /^https?:\/\//i.test(url || '');
}

function buildSnapshotUrl(pageUrl) {
  const url = new URL('/snapshot', getAppUrl());
  url.searchParams.set('source', 'chrome_extension');
  url.searchParams.set('intent', 'claim_receipt');
  url.searchParams.set('url', pageUrl);
  return url.toString();
}

function buildMethodologyUrl() {
  return new URL('/claim-review-methodology', getAppUrl()).toString();
}

async function hydrateCurrentPage() {
  const tab = await getActiveTab();
  const pageUrl = document.getElementById('pageUrl');
  const scanBtn = document.getElementById('scanBtn');

  if (!tab || !canReviewUrl(tab.url)) {
    pageUrl.textContent = 'Open a public http(s) page to generate a receipt.';
    scanBtn.disabled = true;
    scanBtn.style.opacity = '0.55';
    scanBtn.style.cursor = 'not-allowed';
    return;
  }

  pageUrl.textContent = tab.url;
}

document.getElementById('scanBtn').addEventListener('click', async () => {
  const tab = await getActiveTab();

  if (!tab || !canReviewUrl(tab.url)) {
    alert('Open a public http(s) page to generate a receipt.');
    return;
  }

  await chrome.tabs.create({ url: buildSnapshotUrl(tab.url) });
});

document.getElementById('methodLink').addEventListener('click', async (event) => {
  event.preventDefault();
  await chrome.tabs.create({ url: buildMethodologyUrl() });
});

hydrateCurrentPage();

// Dev helper: run this in the popup console to test locally.
// localStorage.setItem('AUDITGPT_APP_URL', 'http://localhost:3002')
void DEV_URL;
