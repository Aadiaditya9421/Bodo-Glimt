/* ============================================================
   groq.js — Groq API client: key management + completions
   ============================================================ */

const GROQ_KEY_STORE = 'veridex_groq_key';

// In-memory key (populated from sessionStorage on load or user input)
export let groqApiKey = '';

/** Load key from sessionStorage and update the UI banner */
export function loadSavedKey() {
  try {
    const k = sessionStorage.getItem(GROQ_KEY_STORE);
    if (k) {
      groqApiKey = k;
      document.getElementById('apiKeyInput').value = '●'.repeat(Math.min(k.length, 20));
      _setStatus('saved');
    }
  } catch (e) { /* sessionStorage unavailable */ }
}

/** Called on every keypress in the API key field */
export function onApiKeyInput() {
  groqApiKey = document.getElementById('apiKeyInput').value.trim();
}

/** Save key to sessionStorage and update status badge */
export function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val) return;
  groqApiKey = val;
  try { sessionStorage.setItem(GROQ_KEY_STORE, val); } catch (e) { /* ignore */ }
  document.getElementById('apiKeyInput').value = '●'.repeat(Math.min(val.length, 20));
  _setStatus('saved');
}

function _setStatus(state) {
  const st = document.getElementById('apiStatus');
  if (state === 'saved') {
    st.textContent = '✓ Key saved';
    st.className = 'api-status saved';
  } else {
    st.textContent = 'No key saved';
    st.className = 'api-status none';
  }
}

/* ── Prompts ── */
export const TEXT_SYSTEM = `You are an expert AI content detector. Analyze the given text and return ONLY a JSON object with this exact schema:
{
  "ai_probability": <number 0-100>,
  "human_probability": <number 0-100>,
  "verdict": "<Likely AI Generated | Partially AI Generated | Likely Human Written>",
  "reasoning": "<2-3 sentence explanation of key signals found>",
  "sentences": [
    { "text": "<sentence>", "classification": "<ai|human|mixed>", "confidence": <number 0-100> }
  ]
}
ai_probability + human_probability should sum to 100. Be precise and evidence-based.`;

export const IMG_SYSTEM = `You are an expert forensic image analyst specializing in AI-generated image detection. Analyze the described image and return ONLY a JSON object:
{
  "authenticity_score": <number 0-100, where 100 = definitely authentic>,
  "verdict": "<High Authenticity | Medium Authenticity | Low Authenticity>",
  "description": "<1 sentence verdict summary>",
  "reasoning": "<2-3 sentences explaining key signals>",
  "attributes": [
    { "name": "<signal name>", "score": <number 0-100> }
  ]
}
Always include exactly 5 attributes: Pixel Entropy, Compression Artifacts, EXIF Integrity, AI-Gen Signature, Edge Coherence.`;

/**
 * Call the Groq chat completions endpoint.
 * Returns parsed JSON or null on failure.
 */
export async function callGroq(systemPrompt, userPrompt) {
  if (!groqApiKey) return null;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Groq] API error:', err);
      return null;
    }

    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(raw);
  } catch (e) {
    console.error('[Groq] Request failed:', e);
    return null;
  }
}
