document.getElementById('scanBtn').addEventListener('click', async () => {
  // Grab the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url) {
    alert("Cannot audit this page.");
    return;
  }

  // The MVP redirects them to our web app's starter form, pre-filling the URL parameter
  // so they can enter their email and complete the funnel.
  const auditgptUrl = `http://localhost:3001/?url=${encodeURIComponent(tab.url)}`;
  
  // Open AuditGPT in a new tab
  await chrome.tabs.create({ url: auditgptUrl });
});
