/**
 * CVBuilder Job Extractor - Content Script
 * Listens for requests to extract job details or relay messages.
 */

// Listen for messages from popup or background script
chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'PING') {
    sendResponse({ status: 'ok', url: window.location.href });
    return true;
  }
});
