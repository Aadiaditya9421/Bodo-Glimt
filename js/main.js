/* ============================================================
   main.js — Application entry point
             Bootstraps all modules, wires global event handlers
   ============================================================ */

import { loadSavedKey, onApiKeyInput, saveApiKey } from './groq.js';
import { showPage, switchMode } from './ui.js';
import {
  onUrlInput, validateUrl, handleDrop, handleFile,
  clearImageInput, initPasteZone, runImageAnalysis,
} from './imageAnalyzer.js';
import {
  onTextInput, clearTextInput, loadSample, runTextAnalysis,
} from './textAnalyzer.js';

/* ── Expose functions to inline HTML handlers ── */
// (Because we use type="module", inline onclick handlers need
//  functions on window unless we attach them via addEventListener)
window.showPage          = showPage;
window.switchMode        = switchMode;
window.onApiKeyInput     = onApiKeyInput;
window.saveApiKey        = saveApiKey;
window.onUrlInput        = onUrlInput;
window.validateUrl       = validateUrl;
window.handleDrop        = handleDrop;
window.handleFile        = handleFile;
window.clearImageInput   = clearImageInput;
window.runImageAnalysis  = runImageAnalysis;
window.onTextInput       = onTextInput;
window.clearTextInput    = clearTextInput;
window.loadSample        = loadSample;
window.runTextAnalysis   = runTextAnalysis;

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  loadSavedKey();   // Restore saved Groq API key from sessionStorage
  initPasteZone();  // Attach clipboard paste listener to paste zone
});
