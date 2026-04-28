/**
 * Opens a URL in a new window using an about:blank iframe injection.
 * This hides the URL from the browser history and makes it appear as "about:blank".
 */
export function openCloaked(url: string, title: string) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    // Falls back to regular window if popup is blocked
    window.open(url, '_blank');
    return;
  }

  const doc = win.document;
  doc.title = title;
  
  // Set styles to make the iframe fill the entire page
  const style = doc.createElement('style');
  style.textContent = `
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
    iframe { width: 100%; height: 100%; border: none; }
  `;
  doc.head.appendChild(style);

  // Create and append the iframe
  const iframe = doc.createElement('iframe');
  iframe.src = url;
  iframe.allow = "fullscreen";
  doc.body.appendChild(iframe);
}
