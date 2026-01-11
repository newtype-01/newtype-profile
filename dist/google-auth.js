// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = import.meta.require;

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC = "\x1B";
  var CSI = `${ESC}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI}${x + 1}G`;
      return `${CSI}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI}${-x}D`;
      else if (x > 0)
        ret += `${CSI}${x}C`;
      if (y < 0)
        ret += `${CSI}${-y}A`;
      else if (y > 0)
        ret += `${CSI}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI}${count}A`,
    down: (count = 1) => `${CSI}${count}B`,
    forward: (count = 1) => `${CSI}${count}C`,
    backward: (count = 1) => `${CSI}${count}D`,
    nextLine: (count = 1) => `${CSI}E`.repeat(count),
    prevLine: (count = 1) => `${CSI}F`.repeat(count),
    left: `${CSI}G`,
    hide: `${CSI}?25l`,
    show: `${CSI}?25h`,
    save: `${ESC}7`,
    restore: `${ESC}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI}S`.repeat(count),
    down: (count = 1) => `${CSI}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI}2J`,
    up: (count = 1) => `${CSI}1J`.repeat(count),
    down: (count = 1) => `${CSI}J`.repeat(count),
    line: `${CSI}2K`,
    lineEnd: `${CSI}K`,
    lineStart: `${CSI}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS((exports, module) => {
  var p = process || {};
  var argv = p.argv || [];
  var env = p.env || {};
  var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
  var formatter = (open, close, replace = open) => (input) => {
    let string = "" + input, index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };
  var replaceClose = (string, close, replace, index) => {
    let result = "", cursor = 0;
    do {
      result += string.substring(cursor, index) + replace;
      cursor = index + close.length;
      index = string.indexOf(close, cursor);
    } while (~index);
    return result + string.substring(cursor);
  };
  var createColors = (enabled = isColorSupported) => {
    let f = enabled ? formatter : () => String;
    return {
      isColorSupported: enabled,
      reset: f("\x1B[0m", "\x1B[0m"),
      bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: f("\x1B[3m", "\x1B[23m"),
      underline: f("\x1B[4m", "\x1B[24m"),
      inverse: f("\x1B[7m", "\x1B[27m"),
      hidden: f("\x1B[8m", "\x1B[28m"),
      strikethrough: f("\x1B[9m", "\x1B[29m"),
      black: f("\x1B[30m", "\x1B[39m"),
      red: f("\x1B[31m", "\x1B[39m"),
      green: f("\x1B[32m", "\x1B[39m"),
      yellow: f("\x1B[33m", "\x1B[39m"),
      blue: f("\x1B[34m", "\x1B[39m"),
      magenta: f("\x1B[35m", "\x1B[39m"),
      cyan: f("\x1B[36m", "\x1B[39m"),
      white: f("\x1B[37m", "\x1B[39m"),
      gray: f("\x1B[90m", "\x1B[39m"),
      bgBlack: f("\x1B[40m", "\x1B[49m"),
      bgRed: f("\x1B[41m", "\x1B[49m"),
      bgGreen: f("\x1B[42m", "\x1B[49m"),
      bgYellow: f("\x1B[43m", "\x1B[49m"),
      bgBlue: f("\x1B[44m", "\x1B[49m"),
      bgMagenta: f("\x1B[45m", "\x1B[49m"),
      bgCyan: f("\x1B[46m", "\x1B[49m"),
      bgWhite: f("\x1B[47m", "\x1B[49m"),
      blackBright: f("\x1B[90m", "\x1B[39m"),
      redBright: f("\x1B[91m", "\x1B[39m"),
      greenBright: f("\x1B[92m", "\x1B[39m"),
      yellowBright: f("\x1B[93m", "\x1B[39m"),
      blueBright: f("\x1B[94m", "\x1B[39m"),
      magentaBright: f("\x1B[95m", "\x1B[39m"),
      cyanBright: f("\x1B[96m", "\x1B[39m"),
      whiteBright: f("\x1B[97m", "\x1B[39m"),
      bgBlackBright: f("\x1B[100m", "\x1B[49m"),
      bgRedBright: f("\x1B[101m", "\x1B[49m"),
      bgGreenBright: f("\x1B[102m", "\x1B[49m"),
      bgYellowBright: f("\x1B[103m", "\x1B[49m"),
      bgBlueBright: f("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
      bgCyanBright: f("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: f("\x1B[107m", "\x1B[49m")
    };
  };
  module.exports = createColors();
  module.exports.createColors = createColors;
});

// src/auth/antigravity/types.ts
var MODEL_FAMILIES = ["claude", "gemini-flash", "gemini-pro"];
// src/auth/antigravity/constants.ts
var ANTIGRAVITY_CLIENT_ID = "1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com";
var ANTIGRAVITY_CLIENT_SECRET = "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";
var ANTIGRAVITY_CALLBACK_PORT = 51121;
var ANTIGRAVITY_REDIRECT_URI = `http://localhost:${ANTIGRAVITY_CALLBACK_PORT}/oauth-callback`;
var ANTIGRAVITY_SCOPES = [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/cclog",
  "https://www.googleapis.com/auth/experimentsandconfigs"
];
var ANTIGRAVITY_ENDPOINT_FALLBACKS = [
  "https://daily-cloudcode-pa.sandbox.googleapis.com",
  "https://daily-cloudcode-pa.googleapis.com",
  "https://cloudcode-pa.googleapis.com"
];
var ANTIGRAVITY_API_VERSION = "v1internal";
var ANTIGRAVITY_HEADERS = {
  "User-Agent": "google-api-nodejs-client/9.15.1",
  "X-Goog-Api-Client": "google-cloud-sdk vscode_cloudshelleditor/0.1",
  "Client-Metadata": JSON.stringify({
    ideType: "IDE_UNSPECIFIED",
    platform: "PLATFORM_UNSPECIFIED",
    pluginType: "GEMINI"
  })
};
var ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc";
var GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
var GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
var GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";
var ANTIGRAVITY_TOKEN_REFRESH_BUFFER_MS = 60000;
var SKIP_THOUGHT_SIGNATURE_VALIDATOR = "skip_thought_signature_validator";
var ANTIGRAVITY_SYSTEM_PROMPT = `<identity>
You are Antigravity, a powerful agentic AI coding assistant designed by the Google Deepmind team working on Advanced Agentic Coding.
You are pair programming with a USER to solve their coding task. The task may require creating a new codebase, modifying or debugging an existing codebase, or simply answering a question.
The USER will send you requests, which you must always prioritize addressing. Along with each USER request, we will attach additional metadata about their current state, such as what files they have open and where their cursor is.
This information may or may not be relevant to the coding task, it is up for you to decide.
</identity>

<tool_calling>
Call tools as you normally would. The following list provides additional guidance to help you avoid errors:
  - **Absolute paths only**. When using tools that accept file path arguments, ALWAYS use the absolute file path.
</tool_calling>

<web_application_development>
## Technology Stack
Your web applications should be built using the following technologies:
1. **Core**: Use HTML for structure and Javascript for logic.
2. **Styling (CSS)**: Use Vanilla CSS for maximum flexibility and control. Avoid using TailwindCSS unless the USER explicitly requests it; in this case, first confirm which TailwindCSS version to use.
3. **Web App**: If the USER specifies that they want a more complex web app, use a framework like Next.js or Vite. Only do this if the USER explicitly requests a web app.
4. **New Project Creation**: If you need to use a framework for a new app, use \`npx\` with the appropriate script, but there are some rules to follow:
   - Use \`npx -y\` to automatically install the script and its dependencies
   - You MUST run the command with \`--help\` flag to see all available options first
   - Initialize the app in the current directory with \`./\` (example: \`npx -y create-vite-app@latest ./\`)
</web_application_development>
`;
var REASONING_EFFORT_BUDGET_MAP = {
  none: 0,
  auto: -1,
  minimal: 512,
  low: 1024,
  medium: 8192,
  high: 24576,
  xhigh: 32768
};
var ANTIGRAVITY_MODEL_CONFIGS = {
  "gemini-2.5-flash": {
    thinkingType: "numeric",
    min: 0,
    max: 24576,
    zeroAllowed: true
  },
  "gemini-2.5-flash-lite": {
    thinkingType: "numeric",
    min: 0,
    max: 24576,
    zeroAllowed: true
  },
  "gemini-2.5-computer-use-preview-10-2025": {
    thinkingType: "numeric",
    min: 128,
    max: 32768,
    zeroAllowed: false
  },
  "gemini-3-pro-preview": {
    thinkingType: "levels",
    min: 128,
    max: 32768,
    zeroAllowed: false,
    levels: ["low", "high"]
  },
  "gemini-3-flash-preview": {
    thinkingType: "levels",
    min: 128,
    max: 32768,
    zeroAllowed: false,
    levels: ["minimal", "low", "medium", "high"]
  },
  "gemini-claude-sonnet-4-5-thinking": {
    thinkingType: "numeric",
    min: 1024,
    max: 200000,
    zeroAllowed: false
  },
  "gemini-claude-opus-4-5-thinking": {
    thinkingType: "numeric",
    min: 1024,
    max: 200000,
    zeroAllowed: false
  }
};
function normalizeModelId(model) {
  let normalized = model;
  if (normalized.includes("/")) {
    normalized = normalized.split("/").pop() || normalized;
  }
  if (normalized.startsWith("antigravity-")) {
    normalized = normalized.substring("antigravity-".length);
  }
  normalized = normalized.replace(/-thinking-(low|medium|high)$/, "");
  normalized = normalized.replace(/-(high|low)$/, "");
  return normalized;
}
function alias2ModelName(modelName) {
  if (modelName.startsWith("gemini-claude-")) {
    return modelName.substring("gemini-".length);
  }
  return modelName;
}
// src/auth/antigravity/oauth.ts
async function buildAuthURL(projectId, clientId = ANTIGRAVITY_CLIENT_ID, port = ANTIGRAVITY_CALLBACK_PORT) {
  const state = crypto.randomUUID().replace(/-/g, "");
  const redirectUri = `http://localhost:${port}/oauth-callback`;
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", ANTIGRAVITY_SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return {
    url: url.toString(),
    state
  };
}
async function exchangeCode(code, redirectUri, clientId = ANTIGRAVITY_CLIENT_ID, clientSecret = ANTIGRAVITY_CLIENT_SECRET) {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type
  };
}
async function fetchUserInfo(accessToken) {
  const response = await fetch(`${GOOGLE_USERINFO_URL}?alt=json`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }
  const data = await response.json();
  return {
    email: data.email || "",
    name: data.name,
    picture: data.picture
  };
}
function startCallbackServer(timeoutMs = 5 * 60 * 1000) {
  let server = null;
  let timeoutId = null;
  let resolveCallback = null;
  let rejectCallback = null;
  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (server) {
      server.stop();
      server = null;
    }
  };
  const fetchHandler = (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/oauth-callback") {
      const code = url.searchParams.get("code") || "";
      const state = url.searchParams.get("state") || "";
      const error = url.searchParams.get("error") || undefined;
      let responseBody;
      if (code && !error) {
        responseBody = "<html><body><h1>Login successful</h1><p>You can close this window.</p></body></html>";
      } else {
        responseBody = "<html><body><h1>Login failed</h1><p>Please check the CLI output.</p></body></html>";
      }
      setTimeout(() => {
        cleanup();
        if (resolveCallback) {
          resolveCallback({ code, state, error });
        }
      }, 100);
      return new Response(responseBody, {
        status: 200,
        headers: { "Content-Type": "text/html" }
      });
    }
    return new Response("Not Found", { status: 404 });
  };
  try {
    server = Bun.serve({
      port: ANTIGRAVITY_CALLBACK_PORT,
      fetch: fetchHandler
    });
  } catch (error) {
    server = Bun.serve({
      port: 0,
      fetch: fetchHandler
    });
  }
  const actualPort = server.port;
  const redirectUri = `http://localhost:${actualPort}/oauth-callback`;
  const waitForCallback = () => {
    return new Promise((resolve, reject) => {
      resolveCallback = resolve;
      rejectCallback = reject;
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("OAuth callback timeout"));
      }, timeoutMs);
    });
  };
  return {
    port: actualPort,
    redirectUri,
    waitForCallback,
    close: cleanup
  };
}
// src/auth/antigravity/token.ts
class AntigravityTokenRefreshError extends Error {
  code;
  description;
  status;
  statusText;
  responseBody;
  constructor(options) {
    super(options.message);
    this.name = "AntigravityTokenRefreshError";
    this.code = options.code;
    this.description = options.description;
    this.status = options.status;
    this.statusText = options.statusText;
    this.responseBody = options.responseBody;
  }
  get isInvalidGrant() {
    return this.code === "invalid_grant";
  }
  get isNetworkError() {
    return this.status === 0;
  }
}
function parseOAuthErrorPayload(text) {
  if (!text) {
    return {};
  }
  try {
    const payload = JSON.parse(text);
    let code;
    if (typeof payload.error === "string") {
      code = payload.error;
    } else if (payload.error && typeof payload.error === "object") {
      code = payload.error.status ?? payload.error.code;
    }
    return {
      code,
      description: payload.error_description
    };
  } catch {
    return { description: text };
  }
}
function isTokenExpired(tokens) {
  const expirationTime = tokens.timestamp + tokens.expires_in * 1000;
  return Date.now() >= expirationTime - ANTIGRAVITY_TOKEN_REFRESH_BUFFER_MS;
}
var MAX_REFRESH_RETRIES = 3;
var INITIAL_RETRY_DELAY_MS = 1000;
function calculateRetryDelay(attempt) {
  return Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt), 1e4);
}
function isRetryableError(status) {
  if (status === 0)
    return true;
  if (status === 429)
    return true;
  if (status >= 500 && status < 600)
    return true;
  return false;
}
async function refreshAccessToken(refreshToken, clientId = ANTIGRAVITY_CLIENT_ID, clientSecret = ANTIGRAVITY_CLIENT_SECRET) {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret
  });
  let lastError;
  for (let attempt = 0;attempt <= MAX_REFRESH_RETRIES; attempt++) {
    try {
      const response = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });
      if (response.ok) {
        const data = await response.json();
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token || refreshToken,
          expires_in: data.expires_in,
          token_type: data.token_type
        };
      }
      const responseBody = await response.text().catch(() => {
        return;
      });
      const parsed = parseOAuthErrorPayload(responseBody);
      lastError = new AntigravityTokenRefreshError({
        message: parsed.description || `Token refresh failed: ${response.status} ${response.statusText}`,
        code: parsed.code,
        description: parsed.description,
        status: response.status,
        statusText: response.statusText,
        responseBody
      });
      if (parsed.code === "invalid_grant") {
        throw lastError;
      }
      if (!isRetryableError(response.status)) {
        throw lastError;
      }
      if (attempt < MAX_REFRESH_RETRIES) {
        const delay = calculateRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      if (error instanceof AntigravityTokenRefreshError) {
        throw error;
      }
      lastError = new AntigravityTokenRefreshError({
        message: error instanceof Error ? error.message : "Network error during token refresh",
        status: 0,
        statusText: "Network Error"
      });
      if (attempt < MAX_REFRESH_RETRIES) {
        const delay = calculateRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new AntigravityTokenRefreshError({
    message: "Token refresh failed after all retries",
    status: 0,
    statusText: "Max Retries Exceeded"
  });
}
function parseStoredToken(stored) {
  const parts = stored.split("|");
  const [refreshToken, projectId, managedProjectId] = parts;
  return {
    refreshToken: refreshToken || "",
    projectId: projectId || undefined,
    managedProjectId: managedProjectId || undefined
  };
}
function formatTokenForStorage(refreshToken, projectId, managedProjectId) {
  return `${refreshToken}|${projectId}|${managedProjectId || ""}`;
}
// src/auth/antigravity/project.ts
var projectContextCache = new Map;
function debugLog(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-project] ${message}`);
  }
}
var CODE_ASSIST_METADATA = {
  ideType: "IDE_UNSPECIFIED",
  platform: "PLATFORM_UNSPECIFIED",
  pluginType: "GEMINI"
};
function extractProjectId(project) {
  if (!project)
    return;
  if (typeof project === "string") {
    const trimmed = project.trim();
    return trimmed || undefined;
  }
  if (typeof project === "object" && "id" in project) {
    const id = project.id;
    if (typeof id === "string") {
      const trimmed = id.trim();
      return trimmed || undefined;
    }
  }
  return;
}
function getDefaultTierId(allowedTiers) {
  if (!allowedTiers || allowedTiers.length === 0)
    return;
  for (const tier of allowedTiers) {
    if (tier?.isDefault)
      return tier.id;
  }
  return allowedTiers[0]?.id;
}
function isFreeTier(tierId) {
  if (!tierId)
    return true;
  const lower = tierId.toLowerCase();
  return lower === "free" || lower === "free-tier" || lower.startsWith("free");
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function callLoadCodeAssistAPI(accessToken, projectId) {
  const metadata = { ...CODE_ASSIST_METADATA };
  if (projectId)
    metadata.duetProject = projectId;
  const requestBody = { metadata };
  if (projectId)
    requestBody.cloudaicompanionProject = projectId;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "User-Agent": ANTIGRAVITY_HEADERS["User-Agent"],
    "X-Goog-Api-Client": ANTIGRAVITY_HEADERS["X-Goog-Api-Client"],
    "Client-Metadata": ANTIGRAVITY_HEADERS["Client-Metadata"]
  };
  for (const baseEndpoint of ANTIGRAVITY_ENDPOINT_FALLBACKS) {
    const url = `${baseEndpoint}/${ANTIGRAVITY_API_VERSION}:loadCodeAssist`;
    debugLog(`[loadCodeAssist] Trying: ${url}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        debugLog(`[loadCodeAssist] Failed: ${response.status} ${response.statusText}`);
        continue;
      }
      const data = await response.json();
      debugLog(`[loadCodeAssist] Success: ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      debugLog(`[loadCodeAssist] Error: ${err}`);
      continue;
    }
  }
  debugLog(`[loadCodeAssist] All endpoints failed`);
  return null;
}
async function onboardManagedProject(accessToken, tierId, projectId, attempts = 10, delayMs = 5000) {
  debugLog(`[onboardUser] Starting with tierId=${tierId}, projectId=${projectId || "none"}`);
  const metadata = { ...CODE_ASSIST_METADATA };
  if (projectId)
    metadata.duetProject = projectId;
  const requestBody = { tierId, metadata };
  if (!isFreeTier(tierId)) {
    if (!projectId) {
      debugLog(`[onboardUser] Non-FREE tier requires projectId, returning undefined`);
      return;
    }
    requestBody.cloudaicompanionProject = projectId;
  }
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "User-Agent": ANTIGRAVITY_HEADERS["User-Agent"],
    "X-Goog-Api-Client": ANTIGRAVITY_HEADERS["X-Goog-Api-Client"],
    "Client-Metadata": ANTIGRAVITY_HEADERS["Client-Metadata"]
  };
  debugLog(`[onboardUser] Request body: ${JSON.stringify(requestBody)}`);
  for (let attempt = 0;attempt < attempts; attempt++) {
    debugLog(`[onboardUser] Attempt ${attempt + 1}/${attempts}`);
    for (const baseEndpoint of ANTIGRAVITY_ENDPOINT_FALLBACKS) {
      const url = `${baseEndpoint}/${ANTIGRAVITY_API_VERSION}:onboardUser`;
      debugLog(`[onboardUser] Trying: ${url}`);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          debugLog(`[onboardUser] Failed: ${response.status} ${response.statusText} - ${errorText}`);
          continue;
        }
        const payload = await response.json();
        debugLog(`[onboardUser] Response: ${JSON.stringify(payload)}`);
        const managedProjectId = payload.response?.cloudaicompanionProject?.id;
        if (payload.done && managedProjectId) {
          debugLog(`[onboardUser] Success! Got managed project ID: ${managedProjectId}`);
          return managedProjectId;
        }
        if (payload.done && projectId) {
          debugLog(`[onboardUser] Done but no managed ID, using original: ${projectId}`);
          return projectId;
        }
        debugLog(`[onboardUser] Not done yet, payload.done=${payload.done}`);
      } catch (err) {
        debugLog(`[onboardUser] Error: ${err}`);
        continue;
      }
    }
    if (attempt < attempts - 1) {
      debugLog(`[onboardUser] Waiting ${delayMs}ms before next attempt...`);
      await wait(delayMs);
    }
  }
  debugLog(`[onboardUser] All attempts exhausted, returning undefined`);
  return;
}
async function fetchProjectContext(accessToken) {
  debugLog(`[fetchProjectContext] Starting...`);
  const cached = projectContextCache.get(accessToken);
  if (cached) {
    debugLog(`[fetchProjectContext] Returning cached result: ${JSON.stringify(cached)}`);
    return cached;
  }
  const loadPayload = await callLoadCodeAssistAPI(accessToken);
  if (loadPayload?.cloudaicompanionProject) {
    const projectId = extractProjectId(loadPayload.cloudaicompanionProject);
    debugLog(`[fetchProjectContext] loadCodeAssist returned project: ${projectId}`);
    if (projectId) {
      const result = { cloudaicompanionProject: projectId };
      projectContextCache.set(accessToken, result);
      debugLog(`[fetchProjectContext] Using loadCodeAssist project ID: ${projectId}`);
      return result;
    }
  }
  if (!loadPayload) {
    debugLog(`[fetchProjectContext] loadCodeAssist returned null, trying with fallback project ID`);
    const fallbackPayload = await callLoadCodeAssistAPI(accessToken, ANTIGRAVITY_DEFAULT_PROJECT_ID);
    const fallbackProjectId = extractProjectId(fallbackPayload?.cloudaicompanionProject);
    if (fallbackProjectId) {
      const result = { cloudaicompanionProject: fallbackProjectId };
      projectContextCache.set(accessToken, result);
      debugLog(`[fetchProjectContext] Using fallback project ID: ${fallbackProjectId}`);
      return result;
    }
    debugLog(`[fetchProjectContext] Fallback also failed, using default: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
    return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
  }
  const currentTierId = loadPayload.currentTier?.id;
  debugLog(`[fetchProjectContext] currentTier: ${currentTierId}, allowedTiers: ${JSON.stringify(loadPayload.allowedTiers)}`);
  if (currentTierId && !isFreeTier(currentTierId)) {
    debugLog(`[fetchProjectContext] PAID tier detected (${currentTierId}), using fallback: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
    return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
  }
  const defaultTierId = getDefaultTierId(loadPayload.allowedTiers);
  const tierId = defaultTierId ?? "free-tier";
  debugLog(`[fetchProjectContext] Resolved tierId: ${tierId}`);
  if (!isFreeTier(tierId)) {
    debugLog(`[fetchProjectContext] Non-FREE tier (${tierId}) without project, using fallback: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
    return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
  }
  debugLog(`[fetchProjectContext] FREE tier detected (${tierId}), calling onboardUser...`);
  const managedProjectId = await onboardManagedProject(accessToken, tierId);
  if (managedProjectId) {
    const result = {
      cloudaicompanionProject: managedProjectId,
      managedProjectId
    };
    projectContextCache.set(accessToken, result);
    debugLog(`[fetchProjectContext] Got managed project ID: ${managedProjectId}`);
    return result;
  }
  debugLog(`[fetchProjectContext] Failed to get managed project ID, using fallback: ${ANTIGRAVITY_DEFAULT_PROJECT_ID}`);
  return { cloudaicompanionProject: ANTIGRAVITY_DEFAULT_PROJECT_ID };
}
function clearProjectContextCache(accessToken) {
  if (accessToken) {
    projectContextCache.delete(accessToken);
  } else {
    projectContextCache.clear();
  }
}
function invalidateProjectContextByRefreshToken(_refreshToken) {
  projectContextCache.clear();
  debugLog(`[invalidateProjectContextByRefreshToken] Cleared all project context cache due to refresh token invalidation`);
}
// src/auth/antigravity/request.ts
function buildRequestHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "User-Agent": ANTIGRAVITY_HEADERS["User-Agent"],
    "X-Goog-Api-Client": ANTIGRAVITY_HEADERS["X-Goog-Api-Client"],
    "Client-Metadata": ANTIGRAVITY_HEADERS["Client-Metadata"]
  };
}
function extractModelFromBody(body) {
  const model = body.model;
  if (typeof model === "string" && model.trim()) {
    return model.trim();
  }
  return;
}
function extractModelFromUrl(url) {
  const match = url.match(/\/models\/([^:]+):/);
  if (match && match[1]) {
    return match[1];
  }
  return;
}
function extractActionFromUrl(url) {
  const match = url.match(/\/models\/[^:]+:(\w+)/);
  if (match && match[1]) {
    return match[1];
  }
  return;
}
function buildAntigravityUrl(baseEndpoint, action, streaming) {
  const query = streaming ? "?alt=sse" : "";
  return `${baseEndpoint}/${ANTIGRAVITY_API_VERSION}:${action}${query}`;
}
function getDefaultEndpoint() {
  return ANTIGRAVITY_ENDPOINT_FALLBACKS[0];
}
function generateRequestId() {
  return `agent-${crypto.randomUUID()}`;
}
function injectSystemPrompt(wrappedBody) {
  if (!wrappedBody.request || typeof wrappedBody.request !== "object") {
    return;
  }
  const req = wrappedBody.request;
  if (req.systemInstruction && typeof req.systemInstruction === "object") {
    const existing = req.systemInstruction;
    if (existing.parts && Array.isArray(existing.parts)) {
      const firstPart = existing.parts[0];
      if (firstPart && typeof firstPart === "object" && "text" in firstPart) {
        const text = firstPart.text;
        if (text.includes("<identity>")) {
          return;
        }
      }
    }
  }
  const newParts = [{ text: ANTIGRAVITY_SYSTEM_PROMPT }];
  if (req.systemInstruction && typeof req.systemInstruction === "object") {
    const existing = req.systemInstruction;
    if (existing.parts && Array.isArray(existing.parts)) {
      for (const part of existing.parts) {
        if (part && typeof part === "object" && "text" in part) {
          newParts.push(part);
        }
      }
    }
  }
  req.systemInstruction = {
    role: "user",
    parts: newParts
  };
}
function wrapRequestBody(body, projectId, modelName, sessionId) {
  const requestPayload = { ...body };
  delete requestPayload.model;
  let normalizedModel = modelName;
  if (normalizedModel.startsWith("antigravity-")) {
    normalizedModel = normalizedModel.substring("antigravity-".length);
  }
  const apiModel = alias2ModelName(normalizedModel);
  debugLog2(`[MODEL] input="${modelName}" \u2192 normalized="${normalizedModel}" \u2192 api="${apiModel}"`);
  const requestObj = {
    ...requestPayload,
    sessionId,
    toolConfig: {
      ...requestPayload.toolConfig || {},
      functionCallingConfig: {
        mode: "VALIDATED"
      }
    }
  };
  delete requestObj.safetySettings;
  const wrappedBody = {
    project: projectId,
    model: apiModel,
    userAgent: "antigravity",
    requestType: "agent",
    requestId: generateRequestId(),
    request: requestObj
  };
  injectSystemPrompt(wrappedBody);
  return wrappedBody;
}
function debugLog2(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-request] ${message}`);
  }
}
function injectThoughtSignatureIntoFunctionCalls(body, signature) {
  const effectiveSignature = signature || SKIP_THOUGHT_SIGNATURE_VALIDATOR;
  debugLog2(`[TSIG][INJECT] signature=${effectiveSignature.substring(0, 30)}... (${signature ? "provided" : "default"})`);
  debugLog2(`[TSIG][INJECT] body keys: ${Object.keys(body).join(", ")}`);
  const contents = body.contents;
  if (!contents || !Array.isArray(contents)) {
    debugLog2(`[TSIG][INJECT] No contents array! Has messages: ${!!body.messages}`);
    return body;
  }
  debugLog2(`[TSIG][INJECT] Found ${contents.length} content blocks`);
  let injectedCount = 0;
  const modifiedContents = contents.map((content) => {
    if (!content.parts || !Array.isArray(content.parts)) {
      return content;
    }
    const modifiedParts = content.parts.map((part) => {
      if (part.functionCall && !part.thoughtSignature) {
        injectedCount++;
        return {
          ...part,
          thoughtSignature: effectiveSignature
        };
      }
      return part;
    });
    return { ...content, parts: modifiedParts };
  });
  debugLog2(`[TSIG][INJECT] injected signature into ${injectedCount} functionCall(s)`);
  return { ...body, contents: modifiedContents };
}
function isStreamingRequest(url, body) {
  const action = extractActionFromUrl(url);
  if (action === "streamGenerateContent") {
    return true;
  }
  if (body.stream === true) {
    return true;
  }
  return false;
}
function transformRequest(options) {
  const {
    url,
    body,
    accessToken,
    projectId,
    sessionId,
    modelName,
    endpointOverride,
    thoughtSignature
  } = options;
  const effectiveModel = modelName || extractModelFromBody(body) || extractModelFromUrl(url) || "gemini-3-pro-high";
  const streaming = isStreamingRequest(url, body);
  const action = streaming ? "streamGenerateContent" : "generateContent";
  const endpoint = endpointOverride || getDefaultEndpoint();
  const transformedUrl = buildAntigravityUrl(endpoint, action, streaming);
  const headers = buildRequestHeaders(accessToken);
  if (streaming) {
    headers["Accept"] = "text/event-stream";
  }
  const bodyWithSignature = injectThoughtSignatureIntoFunctionCalls(body, thoughtSignature);
  const wrappedBody = wrapRequestBody(bodyWithSignature, projectId, effectiveModel, sessionId);
  return {
    url: transformedUrl,
    headers,
    body: wrappedBody,
    streaming
  };
}
// src/auth/antigravity/response.ts
function extractUsageFromHeaders(headers) {
  const cached = headers.get("x-antigravity-cached-content-token-count");
  const total = headers.get("x-antigravity-total-token-count");
  const prompt = headers.get("x-antigravity-prompt-token-count");
  const candidates = headers.get("x-antigravity-candidates-token-count");
  if (!cached && !total && !prompt && !candidates) {
    return;
  }
  const usage = {};
  if (cached) {
    const parsed = parseInt(cached, 10);
    if (!isNaN(parsed)) {
      usage.cachedContentTokenCount = parsed;
    }
  }
  if (total) {
    const parsed = parseInt(total, 10);
    if (!isNaN(parsed)) {
      usage.totalTokenCount = parsed;
    }
  }
  if (prompt) {
    const parsed = parseInt(prompt, 10);
    if (!isNaN(parsed)) {
      usage.promptTokenCount = parsed;
    }
  }
  if (candidates) {
    const parsed = parseInt(candidates, 10);
    if (!isNaN(parsed)) {
      usage.candidatesTokenCount = parsed;
    }
  }
  return Object.keys(usage).length > 0 ? usage : undefined;
}
function extractRetryAfterMs(response, errorBody) {
  const retryAfterHeader = response.headers.get("Retry-After");
  if (retryAfterHeader) {
    const seconds = parseFloat(retryAfterHeader);
    if (!isNaN(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }
  const retryAfterMsHeader = response.headers.get("retry-after-ms");
  if (retryAfterMsHeader) {
    const ms = parseInt(retryAfterMsHeader, 10);
    if (!isNaN(ms) && ms > 0) {
      return ms;
    }
  }
  if (!errorBody) {
    return;
  }
  const error = errorBody.error;
  if (!error?.details || !Array.isArray(error.details)) {
    return;
  }
  const retryInfo = error.details.find((detail) => detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo");
  if (!retryInfo?.retryDelay || typeof retryInfo.retryDelay !== "string") {
    return;
  }
  const match = retryInfo.retryDelay.match(/^([\d.]+)s$/);
  if (match?.[1]) {
    const seconds = parseFloat(match[1]);
    if (!isNaN(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }
  return;
}
function parseErrorBody(text) {
  try {
    const parsed = JSON.parse(text);
    if (parsed.error && typeof parsed.error === "object") {
      const errorObj = parsed.error;
      return {
        message: String(errorObj.message || "Unknown error"),
        type: errorObj.type ? String(errorObj.type) : undefined,
        code: errorObj.code
      };
    }
    if (parsed.message && typeof parsed.message === "string") {
      return {
        message: parsed.message,
        type: parsed.type ? String(parsed.type) : undefined,
        code: parsed.code
      };
    }
    return;
  } catch {
    return {
      message: text || "Unknown error"
    };
  }
}
async function transformResponse(response) {
  const headers = new Headers(response.headers);
  const usage = extractUsageFromHeaders(headers);
  if (!response.ok) {
    const text = await response.text();
    const error = parseErrorBody(text);
    const retryAfterMs = extractRetryAfterMs(response, error ? { error } : undefined);
    let errorBody;
    try {
      errorBody = JSON.parse(text);
    } catch {
      errorBody = { error: { message: text } };
    }
    const retryMs = extractRetryAfterMs(response, errorBody) ?? retryAfterMs;
    if (retryMs) {
      headers.set("Retry-After", String(Math.ceil(retryMs / 1000)));
      headers.set("retry-after-ms", String(retryMs));
    }
    return {
      response: new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers
      }),
      usage,
      retryAfterMs: retryMs,
      error
    };
  }
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  if (!isJson) {
    return { response, usage };
  }
  try {
    const text = await response.text();
    const parsed = JSON.parse(text);
    let transformedBody = parsed;
    if (parsed.response !== undefined) {
      transformedBody = parsed.response;
    }
    return {
      response: new Response(JSON.stringify(transformedBody), {
        status: response.status,
        statusText: response.statusText,
        headers
      }),
      usage
    };
  } catch {
    return { response, usage };
  }
}
function transformSseLine(line) {
  if (!line.startsWith("data:")) {
    return line;
  }
  const json = line.slice(5).trim();
  if (!json || json === "[DONE]") {
    return line;
  }
  try {
    const parsed = JSON.parse(json);
    if (parsed.response !== undefined) {
      return `data: ${JSON.stringify(parsed.response)}`;
    }
    return line;
  } catch {
    return line;
  }
}
function createSseTransformStream() {
  const decoder = new TextDecoder;
  const encoder = new TextEncoder;
  let buffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split(`
`);
      buffer = lines.pop() || "";
      for (const line of lines) {
        const transformed = transformSseLine(line);
        controller.enqueue(encoder.encode(transformed + `
`));
      }
    },
    flush(controller) {
      if (buffer) {
        const transformed = transformSseLine(buffer);
        controller.enqueue(encoder.encode(transformed));
      }
    }
  });
}
async function transformStreamingResponse(response) {
  const headers = new Headers(response.headers);
  const usage = extractUsageFromHeaders(headers);
  if (!response.ok) {
    const text = await response.text();
    const error = parseErrorBody(text);
    let errorBody;
    try {
      errorBody = JSON.parse(text);
    } catch {
      errorBody = { error: { message: text } };
    }
    const retryAfterMs = extractRetryAfterMs(response, errorBody);
    if (retryAfterMs) {
      headers.set("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
      headers.set("retry-after-ms", String(retryAfterMs));
    }
    return {
      response: new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers
      }),
      usage,
      retryAfterMs,
      error
    };
  }
  const contentType = response.headers.get("content-type") ?? "";
  const isEventStream = contentType.includes("text/event-stream") || response.url.includes("alt=sse");
  if (!isEventStream) {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      let transformedBody2 = parsed;
      if (parsed.response !== undefined) {
        transformedBody2 = parsed.response;
      }
      return {
        response: new Response(JSON.stringify(transformedBody2), {
          status: response.status,
          statusText: response.statusText,
          headers
        }),
        usage
      };
    } catch {
      return {
        response: new Response(text, {
          status: response.status,
          statusText: response.statusText,
          headers
        }),
        usage
      };
    }
  }
  if (!response.body) {
    return { response, usage };
  }
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.set("content-type", "text/event-stream; charset=utf-8");
  const transformStream = createSseTransformStream();
  const transformedBody = response.body.pipeThrough(transformStream);
  return {
    response: new Response(transformedBody, {
      status: response.status,
      statusText: response.statusText,
      headers
    }),
    usage
  };
}
function isStreamingResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("text/event-stream") || response.url.includes("alt=sse");
}
// src/auth/antigravity/tools.ts
function normalizeToolsForGemini(tools) {
  if (!tools || tools.length === 0) {
    return;
  }
  const functionDeclarations = [];
  for (const tool of tools) {
    if (!tool || typeof tool !== "object") {
      continue;
    }
    const toolType = tool.type ?? "function";
    if (toolType === "function" && tool.function) {
      const declaration = {
        name: tool.function.name
      };
      if (tool.function.description) {
        declaration.description = tool.function.description;
      }
      if (tool.function.parameters) {
        declaration.parameters = tool.function.parameters;
      } else {
        declaration.parameters = { type: "object", properties: {} };
      }
      functionDeclarations.push(declaration);
    } else if (toolType !== "function" && process.env.ANTIGRAVITY_DEBUG === "1") {
      console.warn(`[antigravity-tools] Unsupported tool type: "${toolType}". Tool will be skipped.`);
    }
  }
  if (functionDeclarations.length === 0) {
    return;
  }
  return { functionDeclarations };
}
// src/auth/antigravity/thinking.ts
var DEFAULT_THINKING_BUDGET = 16000;
function shouldIncludeThinking(model) {
  if (!model || typeof model !== "string") {
    return false;
  }
  const lowerModel = model.toLowerCase();
  if (lowerModel.endsWith("-high")) {
    return true;
  }
  if (lowerModel.includes("thinking")) {
    return true;
  }
  return false;
}
function isThinkingPart(part) {
  if (part.thought === true) {
    return true;
  }
  if (part.type === "thinking" || part.type === "reasoning") {
    return true;
  }
  return false;
}
function extractThinkingBlocks(response) {
  const thinkingBlocks = [];
  if (response.candidates && Array.isArray(response.candidates)) {
    for (const candidate of response.candidates) {
      const parts = candidate.content?.parts;
      if (!parts || !Array.isArray(parts)) {
        continue;
      }
      for (let i = 0;i < parts.length; i++) {
        const part = parts[i];
        if (!part || typeof part !== "object") {
          continue;
        }
        if (isThinkingPart(part)) {
          const block = {
            text: part.text || "",
            index: thinkingBlocks.length
          };
          if (part.thought === true && part.thoughtSignature) {
            block.signature = part.thoughtSignature;
          } else if (part.signature) {
            block.signature = part.signature;
          }
          thinkingBlocks.push(block);
        }
      }
    }
  }
  if (response.content && Array.isArray(response.content)) {
    for (let i = 0;i < response.content.length; i++) {
      const item = response.content[i];
      if (!item || typeof item !== "object") {
        continue;
      }
      if (item.type === "thinking" || item.type === "reasoning") {
        thinkingBlocks.push({
          text: item.text || "",
          signature: item.signature,
          index: thinkingBlocks.length
        });
      }
    }
  }
  const combinedThinking = thinkingBlocks.map((b) => b.text).join(`

`);
  return {
    thinkingBlocks,
    combinedThinking,
    hasThinking: thinkingBlocks.length > 0
  };
}
function transformCandidateThinking(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return candidate;
  }
  const content = candidate.content;
  if (!content || typeof content !== "object" || !Array.isArray(content.parts)) {
    return candidate;
  }
  const thinkingTexts = [];
  const transformedParts = content.parts.map((part) => {
    if (part && typeof part === "object" && part.thought === true) {
      thinkingTexts.push(part.text || "");
      return {
        ...part,
        type: "reasoning",
        thought: undefined
      };
    }
    return part;
  });
  const result = {
    ...candidate,
    content: { ...content, parts: transformedParts }
  };
  if (thinkingTexts.length > 0) {
    result.reasoning_content = thinkingTexts.join(`

`);
  }
  return result;
}
function transformAnthropicThinking(content) {
  if (!content || !Array.isArray(content)) {
    return content;
  }
  return content.map((block) => {
    if (block && typeof block === "object" && block.type === "thinking") {
      return {
        type: "reasoning",
        text: block.text || "",
        ...block.signature ? { signature: block.signature } : {}
      };
    }
    return block;
  });
}
function transformResponseThinking(response) {
  if (!response || typeof response !== "object") {
    return response;
  }
  const result = { ...response };
  if (Array.isArray(result.candidates)) {
    result.candidates = result.candidates.map(transformCandidateThinking);
  }
  if (Array.isArray(result.content)) {
    result.content = transformAnthropicThinking(result.content);
  }
  return result;
}
function extractThinkingConfig(requestPayload, generationConfig, extraBody) {
  const thinkingConfig = generationConfig?.thinkingConfig ?? extraBody?.thinkingConfig ?? requestPayload.thinkingConfig;
  if (thinkingConfig && typeof thinkingConfig === "object") {
    const config = thinkingConfig;
    return {
      includeThoughts: Boolean(config.includeThoughts),
      thinkingBudget: typeof config.thinkingBudget === "number" ? config.thinkingBudget : DEFAULT_THINKING_BUDGET
    };
  }
  const anthropicThinking = extraBody?.thinking ?? requestPayload.thinking;
  if (anthropicThinking && typeof anthropicThinking === "object") {
    const thinking = anthropicThinking;
    if (thinking.type === "enabled" || thinking.budgetTokens) {
      return {
        includeThoughts: true,
        thinkingBudget: typeof thinking.budgetTokens === "number" ? thinking.budgetTokens : DEFAULT_THINKING_BUDGET
      };
    }
  }
  const reasoningEffort = requestPayload.reasoning_effort ?? extraBody?.reasoning_effort;
  if (reasoningEffort && typeof reasoningEffort === "string") {
    const budget = REASONING_EFFORT_BUDGET_MAP[reasoningEffort];
    if (budget !== undefined) {
      if (reasoningEffort === "none") {
        return { deleteThinkingConfig: true };
      }
      return {
        includeThoughts: true,
        thinkingBudget: budget
      };
    }
  }
  return;
}
function getModelThinkingConfig(model) {
  const normalized = normalizeModelId(model);
  if (ANTIGRAVITY_MODEL_CONFIGS[normalized]) {
    return ANTIGRAVITY_MODEL_CONFIGS[normalized];
  }
  if (normalized.includes("gemini-3")) {
    return {
      thinkingType: "levels",
      min: 128,
      max: 32768,
      zeroAllowed: false,
      levels: ["low", "high"]
    };
  }
  if (normalized.includes("gemini-2.5")) {
    return {
      thinkingType: "numeric",
      min: 0,
      max: 24576,
      zeroAllowed: true
    };
  }
  if (normalized.includes("claude")) {
    return {
      thinkingType: "numeric",
      min: 1024,
      max: 200000,
      zeroAllowed: false
    };
  }
  return;
}
function budgetToLevel(budget, model) {
  const config = getModelThinkingConfig(model);
  if (!config?.levels) {
    return "medium";
  }
  const budgetMap = {
    512: "minimal",
    1024: "low",
    8192: "medium",
    24576: "high"
  };
  if (budgetMap[budget]) {
    return budgetMap[budget];
  }
  return config.levels[config.levels.length - 1] || "high";
}
function applyThinkingConfigToRequest(requestBody, model, config) {
  if ("deleteThinkingConfig" in config && config.deleteThinkingConfig) {
    if (requestBody.request && typeof requestBody.request === "object") {
      const req2 = requestBody.request;
      if (req2.generationConfig && typeof req2.generationConfig === "object") {
        const genConfig2 = req2.generationConfig;
        delete genConfig2.thinkingConfig;
      }
    }
    return;
  }
  const modelConfig = getModelThinkingConfig(model);
  if (!modelConfig) {
    return;
  }
  if (!requestBody.request || typeof requestBody.request !== "object") {
    return;
  }
  const req = requestBody.request;
  if (!req.generationConfig || typeof req.generationConfig !== "object") {
    req.generationConfig = {};
  }
  const genConfig = req.generationConfig;
  genConfig.thinkingConfig = {};
  const thinkingConfig = genConfig.thinkingConfig;
  thinkingConfig.include_thoughts = true;
  if (modelConfig.thinkingType === "numeric") {
    thinkingConfig.thinkingBudget = config.thinkingBudget;
  } else if (modelConfig.thinkingType === "levels") {
    const budget = config.thinkingBudget ?? DEFAULT_THINKING_BUDGET;
    let level = budgetToLevel(budget, model);
    level = level.toLowerCase();
    thinkingConfig.thinkingLevel = level;
  }
}
// src/auth/antigravity/thought-signature-store.ts
var signatureStore = new Map;
var sessionIdStore = new Map;
function setThoughtSignature(sessionKey, signature) {
  if (sessionKey && signature) {
    signatureStore.set(sessionKey, signature);
  }
}
function getThoughtSignature(sessionKey) {
  return signatureStore.get(sessionKey);
}
function getOrCreateSessionId(fetchInstanceId, sessionId) {
  if (sessionId) {
    sessionIdStore.set(fetchInstanceId, sessionId);
    return sessionId;
  }
  const existing = sessionIdStore.get(fetchInstanceId);
  if (existing) {
    return existing;
  }
  const n = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  const newSessionId = `-${n}`;
  sessionIdStore.set(fetchInstanceId, newSessionId);
  return newSessionId;
}
// src/auth/antigravity/message-converter.ts
function debugLog3(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-converter] ${message}`);
  }
}
function convertOpenAIToGemini(messages, thoughtSignature) {
  debugLog3(`Converting ${messages.length} messages, signature: ${thoughtSignature ? "present" : "none"}`);
  const contents = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      contents.push({
        role: "user",
        parts: [{ text: typeof msg.content === "string" ? msg.content : "" }]
      });
      continue;
    }
    if (msg.role === "user") {
      const parts = convertContentToParts(msg.content);
      contents.push({ role: "user", parts });
      continue;
    }
    if (msg.role === "assistant") {
      const parts = [];
      if (msg.content) {
        parts.push(...convertContentToParts(msg.content));
      }
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        for (const toolCall of msg.tool_calls) {
          let args = {};
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch {
            args = {};
          }
          const part = {
            functionCall: {
              name: toolCall.function.name,
              args
            }
          };
          part.thoughtSignature = thoughtSignature || SKIP_THOUGHT_SIGNATURE_VALIDATOR;
          debugLog3(`Injected signature into functionCall: ${toolCall.function.name} (${thoughtSignature ? "provided" : "default"})`);
          parts.push(part);
        }
      }
      if (parts.length > 0) {
        contents.push({ role: "model", parts });
      }
      continue;
    }
    if (msg.role === "tool") {
      let response = {};
      try {
        response = typeof msg.content === "string" ? JSON.parse(msg.content) : { result: msg.content };
      } catch {
        response = { result: msg.content };
      }
      const toolName = msg.name || "unknown";
      contents.push({
        role: "user",
        parts: [{
          functionResponse: {
            name: toolName,
            response
          }
        }]
      });
      continue;
    }
  }
  debugLog3(`Converted to ${contents.length} content blocks`);
  return contents;
}
function convertContentToParts(content) {
  if (!content) {
    return [{ text: "" }];
  }
  if (typeof content === "string") {
    return [{ text: content }];
  }
  const parts = [];
  for (const part of content) {
    if (part.type === "text" && part.text) {
      parts.push({ text: part.text });
    } else if (part.type === "image_url" && part.image_url?.url) {
      const url = part.image_url.url;
      if (url.startsWith("data:")) {
        const match = url.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }
    }
  }
  return parts.length > 0 ? parts : [{ text: "" }];
}
function hasOpenAIMessages(body) {
  return Array.isArray(body.messages) && body.messages.length > 0;
}
function convertRequestBody(body, thoughtSignature) {
  if (!hasOpenAIMessages(body)) {
    debugLog3("No messages array found, returning body as-is");
    return body;
  }
  const messages = body.messages;
  const contents = convertOpenAIToGemini(messages, thoughtSignature);
  const converted = { ...body };
  delete converted.messages;
  converted.contents = contents;
  debugLog3(`Converted body: messages \u2192 contents (${contents.length} blocks)`);
  return converted;
}
// src/auth/antigravity/storage.ts
import { promises as fs } from "fs";
import { join as join2, dirname } from "path";

// src/shared/data-path.ts
import * as path from "path";
import * as os from "os";
function getDataDir() {
  return process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share");
}
function getOpenCodeStorageDir() {
  return path.join(getDataDir(), "opencode", "storage");
}

// src/auth/antigravity/storage.ts
function getDataDir2() {
  return join2(getDataDir(), "opencode");
}
function getStoragePath() {
  return join2(getDataDir2(), "oh-my-opencode-accounts.json");
}
async function loadAccounts(path2) {
  const storagePath = path2 ?? getStoragePath();
  try {
    const content = await fs.readFile(storagePath, "utf-8");
    const data = JSON.parse(content);
    if (!isValidAccountStorage(data)) {
      return null;
    }
    return data;
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === "ENOENT") {
      return null;
    }
    if (error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }
}
async function saveAccounts(storage, path2) {
  const storagePath = path2 ?? getStoragePath();
  await fs.mkdir(dirname(storagePath), { recursive: true });
  const content = JSON.stringify(storage, null, 2);
  const tempPath = `${storagePath}.tmp.${process.pid}.${Date.now()}`;
  await fs.writeFile(tempPath, content, { encoding: "utf-8", mode: 384 });
  try {
    await fs.rename(tempPath, storagePath);
  } catch (error) {
    await fs.unlink(tempPath).catch(() => {});
    throw error;
  }
}
function isValidAccountStorage(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  const obj = data;
  if (typeof obj.version !== "number") {
    return false;
  }
  if (!Array.isArray(obj.accounts)) {
    return false;
  }
  if (typeof obj.activeIndex !== "number") {
    return false;
  }
  return true;
}

// src/auth/antigravity/accounts.ts
function isRateLimitedForFamily(account, family) {
  const resetTime = account.rateLimits[family];
  return resetTime !== undefined && Date.now() < resetTime;
}

class AccountManager {
  accounts = [];
  currentIndex = 0;
  activeIndex = 0;
  constructor(auth, storedAccounts) {
    if (storedAccounts && storedAccounts.accounts.length > 0) {
      const validActiveIndex = typeof storedAccounts.activeIndex === "number" && storedAccounts.activeIndex >= 0 && storedAccounts.activeIndex < storedAccounts.accounts.length ? storedAccounts.activeIndex : 0;
      this.activeIndex = validActiveIndex;
      this.currentIndex = validActiveIndex;
      this.accounts = storedAccounts.accounts.map((acc, index) => ({
        index,
        parts: {
          refreshToken: acc.refreshToken,
          projectId: acc.projectId,
          managedProjectId: acc.managedProjectId
        },
        access: index === validActiveIndex ? auth.access : acc.accessToken,
        expires: index === validActiveIndex ? auth.expires : acc.expiresAt,
        rateLimits: acc.rateLimits ?? {},
        lastUsed: 0,
        email: acc.email,
        tier: acc.tier
      }));
    } else {
      this.activeIndex = 0;
      this.currentIndex = 0;
      const parts = parseStoredToken(auth.refresh);
      this.accounts.push({
        index: 0,
        parts,
        access: auth.access,
        expires: auth.expires,
        rateLimits: {},
        lastUsed: 0
      });
    }
  }
  getAccountCount() {
    return this.accounts.length;
  }
  getCurrentAccount() {
    if (this.activeIndex >= 0 && this.activeIndex < this.accounts.length) {
      return this.accounts[this.activeIndex] ?? null;
    }
    return null;
  }
  getAccounts() {
    return [...this.accounts];
  }
  getCurrentOrNextForFamily(family) {
    for (const account of this.accounts) {
      this.clearExpiredRateLimits(account);
    }
    const current = this.getCurrentAccount();
    if (current) {
      if (!isRateLimitedForFamily(current, family)) {
        const betterTierAvailable = current.tier !== "paid" && this.accounts.some((a) => a.tier === "paid" && !isRateLimitedForFamily(a, family));
        if (!betterTierAvailable) {
          current.lastUsed = Date.now();
          return current;
        }
      }
    }
    const next = this.getNextForFamily(family);
    if (next) {
      this.activeIndex = next.index;
    }
    return next;
  }
  getNextForFamily(family) {
    const available = this.accounts.filter((a) => !isRateLimitedForFamily(a, family));
    if (available.length === 0) {
      return null;
    }
    const paidAvailable = available.filter((a) => a.tier === "paid");
    const pool = paidAvailable.length > 0 ? paidAvailable : available;
    const account = pool[this.currentIndex % pool.length];
    if (!account) {
      return null;
    }
    this.currentIndex++;
    account.lastUsed = Date.now();
    return account;
  }
  markRateLimited(account, retryAfterMs, family) {
    account.rateLimits[family] = Date.now() + retryAfterMs;
  }
  clearExpiredRateLimits(account) {
    const now = Date.now();
    for (const family of MODEL_FAMILIES) {
      if (account.rateLimits[family] !== undefined && now >= account.rateLimits[family]) {
        delete account.rateLimits[family];
      }
    }
  }
  addAccount(parts, access, expires, email, tier) {
    this.accounts.push({
      index: this.accounts.length,
      parts,
      access,
      expires,
      rateLimits: {},
      lastUsed: 0,
      email,
      tier
    });
  }
  removeAccount(index) {
    if (index < 0 || index >= this.accounts.length) {
      return false;
    }
    this.accounts.splice(index, 1);
    if (index < this.activeIndex) {
      this.activeIndex--;
    } else if (index === this.activeIndex) {
      this.activeIndex = Math.min(this.activeIndex, Math.max(0, this.accounts.length - 1));
    }
    if (index < this.currentIndex) {
      this.currentIndex--;
    } else if (index === this.currentIndex) {
      this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.accounts.length - 1));
    }
    for (let i = 0;i < this.accounts.length; i++) {
      this.accounts[i].index = i;
    }
    return true;
  }
  async save(path2) {
    const storage = {
      version: 1,
      accounts: this.accounts.map((acc) => ({
        email: acc.email ?? "",
        tier: acc.tier ?? "free",
        refreshToken: acc.parts.refreshToken,
        projectId: acc.parts.projectId ?? "",
        managedProjectId: acc.parts.managedProjectId,
        accessToken: acc.access ?? "",
        expiresAt: acc.expires ?? 0,
        rateLimits: acc.rateLimits
      })),
      activeIndex: Math.max(0, this.activeIndex)
    };
    await saveAccounts(storage, path2);
  }
  toAuthDetails() {
    const current = this.getCurrentAccount() ?? this.accounts[0];
    if (!current) {
      throw new Error("No accounts available");
    }
    const allRefreshTokens = this.accounts.map((acc) => formatTokenForStorage(acc.parts.refreshToken, acc.parts.projectId ?? "", acc.parts.managedProjectId)).join("|||");
    return {
      type: "oauth",
      refresh: allRefreshTokens,
      access: current.access ?? "",
      expires: current.expires ?? 0
    };
  }
}

// src/auth/antigravity/fetch.ts
function debugLog4(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-fetch] ${message}`);
  }
}
function isRetryableError2(status) {
  if (status === 0)
    return true;
  if (status === 429)
    return true;
  if (status >= 500 && status < 600)
    return true;
  return false;
}
function getModelFamilyFromModelName(modelName) {
  const lower = modelName.toLowerCase();
  if (lower.includes("claude") || lower.includes("anthropic"))
    return "claude";
  if (lower.includes("flash"))
    return "gemini-flash";
  if (lower.includes("gemini"))
    return "gemini-pro";
  return null;
}
function getModelFamilyFromUrl(url) {
  if (url.includes("claude"))
    return "claude";
  if (url.includes("flash"))
    return "gemini-flash";
  return "gemini-pro";
}
function getModelFamily(url, init) {
  if (init?.body && typeof init.body === "string") {
    try {
      const body = JSON.parse(init.body);
      if (typeof body.model === "string") {
        const fromModel = getModelFamilyFromModelName(body.model);
        if (fromModel)
          return fromModel;
      }
    } catch {}
  }
  return getModelFamilyFromUrl(url);
}
var GCP_PERMISSION_ERROR_PATTERNS = [
  "PERMISSION_DENIED",
  "does not have permission",
  "Cloud AI Companion API has not been used",
  "has not been enabled"
];
function isGcpPermissionError(text) {
  return GCP_PERMISSION_ERROR_PATTERNS.some((pattern) => text.includes(pattern));
}
function calculateRetryDelay2(attempt) {
  return Math.min(200 * Math.pow(2, attempt), 2000);
}
async function isRetryableResponse(response) {
  if (isRetryableError2(response.status))
    return true;
  if (response.status === 403) {
    try {
      const text = await response.clone().text();
      if (text.includes("SUBSCRIPTION_REQUIRED") || text.includes("Gemini Code Assist license")) {
        debugLog4(`[RETRY] 403 SUBSCRIPTION_REQUIRED detected, will retry with next endpoint`);
        return true;
      }
    } catch {}
  }
  return false;
}
async function attemptFetch(options) {
  const { endpoint, url, init, accessToken, projectId, sessionId, modelName, thoughtSignature } = options;
  debugLog4(`Trying endpoint: ${endpoint}`);
  try {
    const rawBody = init.body;
    if (rawBody !== undefined && typeof rawBody !== "string") {
      debugLog4(`Non-string body detected (${typeof rawBody}), signaling pass-through`);
      return "pass-through";
    }
    let parsedBody = {};
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = {};
      }
    }
    debugLog4(`[BODY] Keys: ${Object.keys(parsedBody).join(", ")}`);
    debugLog4(`[BODY] Has contents: ${!!parsedBody.contents}, Has messages: ${!!parsedBody.messages}`);
    if (parsedBody.contents) {
      const contents = parsedBody.contents;
      debugLog4(`[BODY] contents length: ${contents.length}`);
      contents.forEach((c, i) => {
        debugLog4(`[BODY] contents[${i}].role: ${c.role}, parts: ${JSON.stringify(c.parts).substring(0, 200)}`);
      });
    }
    if (parsedBody.tools && Array.isArray(parsedBody.tools)) {
      const normalizedTools = normalizeToolsForGemini(parsedBody.tools);
      if (normalizedTools) {
        parsedBody.tools = normalizedTools;
      }
    }
    if (hasOpenAIMessages(parsedBody)) {
      debugLog4(`[CONVERT] Converting OpenAI messages to Gemini contents`);
      parsedBody = convertRequestBody(parsedBody, thoughtSignature);
      debugLog4(`[CONVERT] After conversion - Has contents: ${!!parsedBody.contents}`);
    }
    const transformed = transformRequest({
      url,
      body: parsedBody,
      accessToken,
      projectId,
      sessionId,
      modelName,
      endpointOverride: endpoint,
      thoughtSignature
    });
    const effectiveModel = modelName || transformed.body.model;
    const thinkingConfig = extractThinkingConfig(parsedBody, parsedBody.generationConfig, parsedBody);
    if (thinkingConfig) {
      debugLog4(`[THINKING] Applying thinking config for model: ${effectiveModel}`);
      applyThinkingConfigToRequest(transformed.body, effectiveModel, thinkingConfig);
      debugLog4(`[THINKING] Thinking config applied successfully`);
    }
    debugLog4(`[REQ] streaming=${transformed.streaming}, url=${transformed.url}`);
    const maxPermissionRetries = 10;
    for (let attempt = 0;attempt <= maxPermissionRetries; attempt++) {
      const response = await fetch(transformed.url, {
        method: init.method || "POST",
        headers: transformed.headers,
        body: JSON.stringify(transformed.body),
        signal: init.signal
      });
      debugLog4(`[RESP] status=${response.status} content-type=${response.headers.get("content-type") ?? ""} url=${response.url}`);
      if (response.status === 401) {
        debugLog4(`[401] Unauthorized response detected, signaling token refresh needed`);
        return "needs-refresh";
      }
      if (response.status === 403) {
        try {
          const text = await response.clone().text();
          if (isGcpPermissionError(text)) {
            if (attempt < maxPermissionRetries) {
              const delay = calculateRetryDelay2(attempt);
              debugLog4(`[RETRY] GCP permission error, retry ${attempt + 1}/${maxPermissionRetries} after ${delay}ms`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
            debugLog4(`[RETRY] GCP permission error, max retries exceeded`);
          }
        } catch {}
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        let retryAfterMs = 60000;
        if (retryAfter) {
          const parsed = parseInt(retryAfter, 10);
          if (!isNaN(parsed) && parsed > 0) {
            retryAfterMs = parsed * 1000;
          } else {
            const httpDate = Date.parse(retryAfter);
            if (!isNaN(httpDate)) {
              retryAfterMs = Math.max(0, httpDate - Date.now());
            }
          }
        }
        debugLog4(`[429] Rate limited, retry-after: ${retryAfterMs}ms`);
        await response.body?.cancel();
        return { type: "rate-limited", retryAfterMs, status: 429 };
      }
      if (response.status >= 500 && response.status < 600) {
        debugLog4(`[5xx] Server error ${response.status}, marking for rotation`);
        await response.body?.cancel();
        return { type: "rate-limited", retryAfterMs: 300000, status: response.status };
      }
      if (!response.ok && await isRetryableResponse(response)) {
        debugLog4(`Endpoint failed: ${endpoint} (status: ${response.status}), trying next`);
        return null;
      }
      return response;
    }
    return null;
  } catch (error) {
    debugLog4(`Endpoint failed: ${endpoint} (${error instanceof Error ? error.message : "Unknown error"}), trying next`);
    return null;
  }
}
function extractSignatureFromResponse(parsed) {
  if (!parsed.candidates || !Array.isArray(parsed.candidates)) {
    return;
  }
  for (const candidate of parsed.candidates) {
    const parts = candidate.content?.parts;
    if (!parts || !Array.isArray(parts)) {
      continue;
    }
    for (const part of parts) {
      const sig = part.thoughtSignature || part.thought_signature;
      if (sig && typeof sig === "string") {
        return sig;
      }
    }
  }
  return;
}
async function transformResponseWithThinking(response, modelName, fetchInstanceId) {
  const streaming = isStreamingResponse(response);
  let result;
  if (streaming) {
    result = await transformStreamingResponse(response);
  } else {
    result = await transformResponse(response);
  }
  if (streaming) {
    return result.response;
  }
  try {
    const text = await result.response.clone().text();
    debugLog4(`[TSIG][RESP] Response text length: ${text.length}`);
    const parsed = JSON.parse(text);
    debugLog4(`[TSIG][RESP] Parsed keys: ${Object.keys(parsed).join(", ")}`);
    debugLog4(`[TSIG][RESP] Has candidates: ${!!parsed.candidates}, count: ${parsed.candidates?.length ?? 0}`);
    const signature = extractSignatureFromResponse(parsed);
    debugLog4(`[TSIG][RESP] Signature extracted: ${signature ? signature.substring(0, 30) + "..." : "NONE"}`);
    if (signature) {
      setThoughtSignature(fetchInstanceId, signature);
      debugLog4(`[TSIG][STORE] Stored signature for ${fetchInstanceId}`);
    } else {
      debugLog4(`[TSIG][WARN] No signature found in response!`);
    }
    if (shouldIncludeThinking(modelName)) {
      const thinkingResult = extractThinkingBlocks(parsed);
      if (thinkingResult.hasThinking) {
        const transformed = transformResponseThinking(parsed);
        return new Response(JSON.stringify(transformed), {
          status: result.response.status,
          statusText: result.response.statusText,
          headers: result.response.headers
        });
      }
    }
  } catch {}
  return result.response;
}
function createAntigravityFetch(getAuth, client, providerId, clientId, clientSecret, accountManager) {
  let cachedTokens = null;
  let cachedProjectId = null;
  let lastAccountIndex = null;
  const fetchInstanceId = crypto.randomUUID();
  let manager = accountManager || null;
  let accountsLoaded = false;
  const fetchFn = async (url, init = {}) => {
    debugLog4(`Intercepting request to: ${url}`);
    const auth = await getAuth();
    if (!auth.access || !auth.refresh) {
      throw new Error("Antigravity: No authentication tokens available");
    }
    let refreshParts = parseStoredToken(auth.refresh);
    if (!accountsLoaded && !manager && auth.refresh) {
      try {
        const storedAccounts = await loadAccounts();
        if (storedAccounts) {
          manager = new AccountManager({ refresh: auth.refresh, access: auth.access || "", expires: auth.expires || 0 }, storedAccounts);
          debugLog4(`[ACCOUNTS] Loaded ${manager.getAccountCount()} accounts from storage`);
        }
      } catch (error) {
        debugLog4(`[ACCOUNTS] Failed to load accounts, falling back to single-account: ${error instanceof Error ? error.message : "Unknown"}`);
      }
      accountsLoaded = true;
    }
    let currentAccount = null;
    if (manager) {
      const family = getModelFamily(url, init);
      currentAccount = manager.getCurrentOrNextForFamily(family);
      if (currentAccount) {
        debugLog4(`[ACCOUNTS] Using account ${currentAccount.index + 1}/${manager.getAccountCount()} for ${family}`);
        if (lastAccountIndex === null || lastAccountIndex !== currentAccount.index) {
          if (lastAccountIndex !== null) {
            debugLog4(`[ACCOUNTS] Account changed from ${lastAccountIndex + 1} to ${currentAccount.index + 1}, clearing cached state`);
          } else if (cachedProjectId) {
            debugLog4(`[ACCOUNTS] First account introduced, clearing cached state`);
          }
          cachedProjectId = null;
          cachedTokens = null;
        }
        lastAccountIndex = currentAccount.index;
        if (currentAccount.access && currentAccount.expires) {
          auth.access = currentAccount.access;
          auth.expires = currentAccount.expires;
        }
        refreshParts = {
          refreshToken: currentAccount.parts.refreshToken,
          projectId: currentAccount.parts.projectId,
          managedProjectId: currentAccount.parts.managedProjectId
        };
      }
    }
    if (!cachedTokens) {
      cachedTokens = {
        type: "antigravity",
        access_token: auth.access,
        refresh_token: refreshParts.refreshToken,
        expires_in: auth.expires ? Math.floor((auth.expires - Date.now()) / 1000) : 3600,
        timestamp: auth.expires ? auth.expires - 3600 * 1000 : Date.now()
      };
    } else {
      cachedTokens.access_token = auth.access;
      cachedTokens.refresh_token = refreshParts.refreshToken;
    }
    if (isTokenExpired(cachedTokens)) {
      debugLog4("Token expired, refreshing...");
      try {
        const newTokens = await refreshAccessToken(refreshParts.refreshToken, clientId, clientSecret);
        cachedTokens = {
          type: "antigravity",
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_in: newTokens.expires_in,
          timestamp: Date.now()
        };
        clearProjectContextCache();
        const formattedRefresh = formatTokenForStorage(newTokens.refresh_token, refreshParts.projectId || "", refreshParts.managedProjectId);
        await client.set(providerId, {
          access: newTokens.access_token,
          refresh: formattedRefresh,
          expires: Date.now() + newTokens.expires_in * 1000
        });
        debugLog4("Token refreshed successfully");
      } catch (error) {
        if (error instanceof AntigravityTokenRefreshError) {
          if (error.isInvalidGrant) {
            debugLog4(`[REFRESH] Token revoked (invalid_grant), clearing caches`);
            invalidateProjectContextByRefreshToken(refreshParts.refreshToken);
            clearProjectContextCache();
          }
          throw new Error(`Antigravity: Token refresh failed: ${error.description || error.message}${error.code ? ` (${error.code})` : ""}`);
        }
        throw new Error(`Antigravity: Token refresh failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    if (!cachedProjectId) {
      const projectContext = await fetchProjectContext(cachedTokens.access_token);
      cachedProjectId = projectContext.cloudaicompanionProject || "";
      debugLog4(`[PROJECT] Fetched project ID: "${cachedProjectId}"`);
    }
    const projectId = cachedProjectId;
    debugLog4(`[PROJECT] Using project ID: "${projectId}"`);
    let modelName;
    if (init.body) {
      try {
        const body = typeof init.body === "string" ? JSON.parse(init.body) : init.body;
        if (typeof body.model === "string") {
          modelName = body.model;
        }
      } catch {}
    }
    const maxEndpoints = Math.min(ANTIGRAVITY_ENDPOINT_FALLBACKS.length, 3);
    const sessionId = getOrCreateSessionId(fetchInstanceId);
    const thoughtSignature = getThoughtSignature(fetchInstanceId);
    debugLog4(`[TSIG][GET] sessionId=${sessionId}, signature=${thoughtSignature ? thoughtSignature.substring(0, 20) + "..." : "none"}`);
    let hasRefreshedFor401 = false;
    const executeWithEndpoints = async () => {
      for (let i = 0;i < maxEndpoints; i++) {
        const endpoint = ANTIGRAVITY_ENDPOINT_FALLBACKS[i];
        const response = await attemptFetch({
          endpoint,
          url,
          init,
          accessToken: cachedTokens.access_token,
          projectId,
          sessionId,
          modelName,
          thoughtSignature
        });
        if (response === "pass-through") {
          debugLog4("Non-string body detected, passing through with auth headers");
          const headersWithAuth = {
            ...init.headers,
            Authorization: `Bearer ${cachedTokens.access_token}`
          };
          return fetch(url, { ...init, headers: headersWithAuth });
        }
        if (response === "needs-refresh") {
          if (hasRefreshedFor401) {
            debugLog4("[401] Already refreshed once, returning unauthorized error");
            return new Response(JSON.stringify({
              error: {
                message: "Authentication failed after token refresh",
                type: "unauthorized",
                code: "token_refresh_failed"
              }
            }), {
              status: 401,
              statusText: "Unauthorized",
              headers: { "Content-Type": "application/json" }
            });
          }
          debugLog4("[401] Refreshing token and retrying...");
          hasRefreshedFor401 = true;
          try {
            const newTokens = await refreshAccessToken(refreshParts.refreshToken, clientId, clientSecret);
            cachedTokens = {
              type: "antigravity",
              access_token: newTokens.access_token,
              refresh_token: newTokens.refresh_token,
              expires_in: newTokens.expires_in,
              timestamp: Date.now()
            };
            clearProjectContextCache();
            const formattedRefresh = formatTokenForStorage(newTokens.refresh_token, refreshParts.projectId || "", refreshParts.managedProjectId);
            await client.set(providerId, {
              access: newTokens.access_token,
              refresh: formattedRefresh,
              expires: Date.now() + newTokens.expires_in * 1000
            });
            debugLog4("[401] Token refreshed, retrying request...");
            return executeWithEndpoints();
          } catch (refreshError) {
            if (refreshError instanceof AntigravityTokenRefreshError) {
              if (refreshError.isInvalidGrant) {
                debugLog4(`[401] Token revoked (invalid_grant), clearing caches`);
                invalidateProjectContextByRefreshToken(refreshParts.refreshToken);
                clearProjectContextCache();
              }
              debugLog4(`[401] Token refresh failed: ${refreshError.description || refreshError.message}`);
              return new Response(JSON.stringify({
                error: {
                  message: refreshError.description || refreshError.message,
                  type: refreshError.isInvalidGrant ? "token_revoked" : "unauthorized",
                  code: refreshError.code || "token_refresh_failed"
                }
              }), {
                status: 401,
                statusText: "Unauthorized",
                headers: { "Content-Type": "application/json" }
              });
            }
            debugLog4(`[401] Token refresh failed: ${refreshError instanceof Error ? refreshError.message : "Unknown error"}`);
            return new Response(JSON.stringify({
              error: {
                message: refreshError instanceof Error ? refreshError.message : "Unknown error",
                type: "unauthorized",
                code: "token_refresh_failed"
              }
            }), {
              status: 401,
              statusText: "Unauthorized",
              headers: { "Content-Type": "application/json" }
            });
          }
        }
        if (response && typeof response === "object" && "type" in response && response.type === "rate-limited") {
          const rateLimitInfo = response;
          const family = getModelFamily(url, init);
          if (rateLimitInfo.retryAfterMs > 5000 && manager && currentAccount) {
            manager.markRateLimited(currentAccount, rateLimitInfo.retryAfterMs, family);
            await manager.save();
            debugLog4(`[RATE-LIMIT] Account ${currentAccount.index + 1} rate-limited for ${family}, rotating...`);
            const nextAccount = manager.getCurrentOrNextForFamily(family);
            if (nextAccount && nextAccount.index !== currentAccount.index) {
              debugLog4(`[RATE-LIMIT] Switched to account ${nextAccount.index + 1}`);
              return fetchFn(url, init);
            }
          }
          const isLastEndpoint = i === maxEndpoints - 1;
          if (isLastEndpoint) {
            const isServerError = rateLimitInfo.status >= 500;
            debugLog4(`[RATE-LIMIT] No alternative account or endpoint, returning ${rateLimitInfo.status}`);
            return new Response(JSON.stringify({
              error: {
                message: isServerError ? `Server error (${rateLimitInfo.status}). Retry after ${Math.ceil(rateLimitInfo.retryAfterMs / 1000)} seconds` : `Rate limited. Retry after ${Math.ceil(rateLimitInfo.retryAfterMs / 1000)} seconds`,
                type: isServerError ? "server_error" : "rate_limit",
                code: isServerError ? "server_error" : "rate_limited"
              }
            }), {
              status: rateLimitInfo.status,
              statusText: isServerError ? "Server Error" : "Too Many Requests",
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(Math.ceil(rateLimitInfo.retryAfterMs / 1000))
              }
            });
          }
          debugLog4(`[RATE-LIMIT] No alternative account available, trying next endpoint`);
          continue;
        }
        if (response && response instanceof Response) {
          debugLog4(`Success with endpoint: ${endpoint}`);
          const transformedResponse = await transformResponseWithThinking(response, modelName || "", fetchInstanceId);
          return transformedResponse;
        }
      }
      const errorMessage = `All Antigravity endpoints failed after ${maxEndpoints} attempts`;
      debugLog4(errorMessage);
      return new Response(JSON.stringify({
        error: {
          message: errorMessage,
          type: "endpoint_failure",
          code: "all_endpoints_failed"
        }
      }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" }
      });
    };
    return executeWithEndpoints();
  };
  return fetchFn;
}
// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { stdin as j, stdout as M } from "process";
import O from "readline";
import { Writable as X } from "stream";
function DD({ onlyFirst: e = false } = {}) {
  const t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
  return new RegExp(t, e ? undefined : "g");
}
var uD = DD();
function P(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
  return e.replace(uD, "");
}
function L(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var W = { exports: {} };
(function(e) {
  var u = {};
  e.exports = u, u.eastAsianWidth = function(F) {
    var s = F.charCodeAt(0), i = F.length == 2 ? F.charCodeAt(1) : 0, D = s;
    return 55296 <= s && s <= 56319 && 56320 <= i && i <= 57343 && (s &= 1023, i &= 1023, D = s << 10 | i, D += 65536), D == 12288 || 65281 <= D && D <= 65376 || 65504 <= D && D <= 65510 ? "F" : D == 8361 || 65377 <= D && D <= 65470 || 65474 <= D && D <= 65479 || 65482 <= D && D <= 65487 || 65490 <= D && D <= 65495 || 65498 <= D && D <= 65500 || 65512 <= D && D <= 65518 ? "H" : 4352 <= D && D <= 4447 || 4515 <= D && D <= 4519 || 4602 <= D && D <= 4607 || 9001 <= D && D <= 9002 || 11904 <= D && D <= 11929 || 11931 <= D && D <= 12019 || 12032 <= D && D <= 12245 || 12272 <= D && D <= 12283 || 12289 <= D && D <= 12350 || 12353 <= D && D <= 12438 || 12441 <= D && D <= 12543 || 12549 <= D && D <= 12589 || 12593 <= D && D <= 12686 || 12688 <= D && D <= 12730 || 12736 <= D && D <= 12771 || 12784 <= D && D <= 12830 || 12832 <= D && D <= 12871 || 12880 <= D && D <= 13054 || 13056 <= D && D <= 19903 || 19968 <= D && D <= 42124 || 42128 <= D && D <= 42182 || 43360 <= D && D <= 43388 || 44032 <= D && D <= 55203 || 55216 <= D && D <= 55238 || 55243 <= D && D <= 55291 || 63744 <= D && D <= 64255 || 65040 <= D && D <= 65049 || 65072 <= D && D <= 65106 || 65108 <= D && D <= 65126 || 65128 <= D && D <= 65131 || 110592 <= D && D <= 110593 || 127488 <= D && D <= 127490 || 127504 <= D && D <= 127546 || 127552 <= D && D <= 127560 || 127568 <= D && D <= 127569 || 131072 <= D && D <= 194367 || 177984 <= D && D <= 196605 || 196608 <= D && D <= 262141 ? "W" : 32 <= D && D <= 126 || 162 <= D && D <= 163 || 165 <= D && D <= 166 || D == 172 || D == 175 || 10214 <= D && D <= 10221 || 10629 <= D && D <= 10630 ? "Na" : D == 161 || D == 164 || 167 <= D && D <= 168 || D == 170 || 173 <= D && D <= 174 || 176 <= D && D <= 180 || 182 <= D && D <= 186 || 188 <= D && D <= 191 || D == 198 || D == 208 || 215 <= D && D <= 216 || 222 <= D && D <= 225 || D == 230 || 232 <= D && D <= 234 || 236 <= D && D <= 237 || D == 240 || 242 <= D && D <= 243 || 247 <= D && D <= 250 || D == 252 || D == 254 || D == 257 || D == 273 || D == 275 || D == 283 || 294 <= D && D <= 295 || D == 299 || 305 <= D && D <= 307 || D == 312 || 319 <= D && D <= 322 || D == 324 || 328 <= D && D <= 331 || D == 333 || 338 <= D && D <= 339 || 358 <= D && D <= 359 || D == 363 || D == 462 || D == 464 || D == 466 || D == 468 || D == 470 || D == 472 || D == 474 || D == 476 || D == 593 || D == 609 || D == 708 || D == 711 || 713 <= D && D <= 715 || D == 717 || D == 720 || 728 <= D && D <= 731 || D == 733 || D == 735 || 768 <= D && D <= 879 || 913 <= D && D <= 929 || 931 <= D && D <= 937 || 945 <= D && D <= 961 || 963 <= D && D <= 969 || D == 1025 || 1040 <= D && D <= 1103 || D == 1105 || D == 8208 || 8211 <= D && D <= 8214 || 8216 <= D && D <= 8217 || 8220 <= D && D <= 8221 || 8224 <= D && D <= 8226 || 8228 <= D && D <= 8231 || D == 8240 || 8242 <= D && D <= 8243 || D == 8245 || D == 8251 || D == 8254 || D == 8308 || D == 8319 || 8321 <= D && D <= 8324 || D == 8364 || D == 8451 || D == 8453 || D == 8457 || D == 8467 || D == 8470 || 8481 <= D && D <= 8482 || D == 8486 || D == 8491 || 8531 <= D && D <= 8532 || 8539 <= D && D <= 8542 || 8544 <= D && D <= 8555 || 8560 <= D && D <= 8569 || D == 8585 || 8592 <= D && D <= 8601 || 8632 <= D && D <= 8633 || D == 8658 || D == 8660 || D == 8679 || D == 8704 || 8706 <= D && D <= 8707 || 8711 <= D && D <= 8712 || D == 8715 || D == 8719 || D == 8721 || D == 8725 || D == 8730 || 8733 <= D && D <= 8736 || D == 8739 || D == 8741 || 8743 <= D && D <= 8748 || D == 8750 || 8756 <= D && D <= 8759 || 8764 <= D && D <= 8765 || D == 8776 || D == 8780 || D == 8786 || 8800 <= D && D <= 8801 || 8804 <= D && D <= 8807 || 8810 <= D && D <= 8811 || 8814 <= D && D <= 8815 || 8834 <= D && D <= 8835 || 8838 <= D && D <= 8839 || D == 8853 || D == 8857 || D == 8869 || D == 8895 || D == 8978 || 9312 <= D && D <= 9449 || 9451 <= D && D <= 9547 || 9552 <= D && D <= 9587 || 9600 <= D && D <= 9615 || 9618 <= D && D <= 9621 || 9632 <= D && D <= 9633 || 9635 <= D && D <= 9641 || 9650 <= D && D <= 9651 || 9654 <= D && D <= 9655 || 9660 <= D && D <= 9661 || 9664 <= D && D <= 9665 || 9670 <= D && D <= 9672 || D == 9675 || 9678 <= D && D <= 9681 || 9698 <= D && D <= 9701 || D == 9711 || 9733 <= D && D <= 9734 || D == 9737 || 9742 <= D && D <= 9743 || 9748 <= D && D <= 9749 || D == 9756 || D == 9758 || D == 9792 || D == 9794 || 9824 <= D && D <= 9825 || 9827 <= D && D <= 9829 || 9831 <= D && D <= 9834 || 9836 <= D && D <= 9837 || D == 9839 || 9886 <= D && D <= 9887 || 9918 <= D && D <= 9919 || 9924 <= D && D <= 9933 || 9935 <= D && D <= 9953 || D == 9955 || 9960 <= D && D <= 9983 || D == 10045 || D == 10071 || 10102 <= D && D <= 10111 || 11093 <= D && D <= 11097 || 12872 <= D && D <= 12879 || 57344 <= D && D <= 63743 || 65024 <= D && D <= 65039 || D == 65533 || 127232 <= D && D <= 127242 || 127248 <= D && D <= 127277 || 127280 <= D && D <= 127337 || 127344 <= D && D <= 127386 || 917760 <= D && D <= 917999 || 983040 <= D && D <= 1048573 || 1048576 <= D && D <= 1114109 ? "A" : "N";
  }, u.characterLength = function(F) {
    var s = this.eastAsianWidth(F);
    return s == "F" || s == "W" || s == "A" ? 2 : 1;
  };
  function t(F) {
    return F.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  u.length = function(F) {
    for (var s = t(F), i = 0, D = 0;D < s.length; D++)
      i = i + this.characterLength(s[D]);
    return i;
  }, u.slice = function(F, s, i) {
    textLen = u.length(F), s = s || 0, i = i || 1, s < 0 && (s = textLen + s), i < 0 && (i = textLen + i);
    for (var D = "", C = 0, n = t(F), E = 0;E < n.length; E++) {
      var a = n[E], o = u.length(a);
      if (C >= s - (o == 2 ? 1 : 0))
        if (C + o <= i)
          D += a;
        else
          break;
      C += o;
    }
    return D;
  };
})(W);
var tD = W.exports;
var eD = L(tD);
var FD = function() {
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};
var sD = L(FD);
function p(e, u = {}) {
  if (typeof e != "string" || e.length === 0 || (u = { ambiguousIsNarrow: true, ...u }, e = P(e), e.length === 0))
    return 0;
  e = e.replace(sD(), "  ");
  const t = u.ambiguousIsNarrow ? 1 : 2;
  let F = 0;
  for (const s of e) {
    const i = s.codePointAt(0);
    if (i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879)
      continue;
    switch (eD.eastAsianWidth(s)) {
      case "F":
      case "W":
        F += 2;
        break;
      case "A":
        F += t;
        break;
      default:
        F += 1;
    }
  }
  return F;
}
var w = 10;
var N = (e = 0) => (u) => `\x1B[${u + e}m`;
var I = (e = 0) => (u) => `\x1B[${38 + e};5;${u}m`;
var R = (e = 0) => (u, t, F) => `\x1B[${38 + e};2;${u};${t};${F}m`;
var r = { modifier: { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], overline: [53, 55], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29] }, color: { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], blackBright: [90, 39], gray: [90, 39], grey: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] }, bgColor: { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgBlackBright: [100, 49], bgGray: [100, 49], bgGrey: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] } };
Object.keys(r.modifier);
var iD = Object.keys(r.color);
var CD = Object.keys(r.bgColor);
[...iD, ...CD];
function rD() {
  const e = new Map;
  for (const [u, t] of Object.entries(r)) {
    for (const [F, s] of Object.entries(t))
      r[F] = { open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m` }, t[F] = r[F], e.set(s[0], s[1]);
    Object.defineProperty(r, u, { value: t, enumerable: false });
  }
  return Object.defineProperty(r, "codes", { value: e, enumerable: false }), r.color.close = "\x1B[39m", r.bgColor.close = "\x1B[49m", r.color.ansi = N(), r.color.ansi256 = I(), r.color.ansi16m = R(), r.bgColor.ansi = N(w), r.bgColor.ansi256 = I(w), r.bgColor.ansi16m = R(w), Object.defineProperties(r, { rgbToAnsi256: { value: (u, t, F) => u === t && t === F ? u < 8 ? 16 : u > 248 ? 231 : Math.round((u - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(u / 255 * 5) + 6 * Math.round(t / 255 * 5) + Math.round(F / 255 * 5), enumerable: false }, hexToRgb: { value: (u) => {
    const t = /[a-f\d]{6}|[a-f\d]{3}/i.exec(u.toString(16));
    if (!t)
      return [0, 0, 0];
    let [F] = t;
    F.length === 3 && (F = [...F].map((i) => i + i).join(""));
    const s = Number.parseInt(F, 16);
    return [s >> 16 & 255, s >> 8 & 255, s & 255];
  }, enumerable: false }, hexToAnsi256: { value: (u) => r.rgbToAnsi256(...r.hexToRgb(u)), enumerable: false }, ansi256ToAnsi: { value: (u) => {
    if (u < 8)
      return 30 + u;
    if (u < 16)
      return 90 + (u - 8);
    let t, F, s;
    if (u >= 232)
      t = ((u - 232) * 10 + 8) / 255, F = t, s = t;
    else {
      u -= 16;
      const C = u % 36;
      t = Math.floor(u / 36) / 5, F = Math.floor(C / 6) / 5, s = C % 6 / 5;
    }
    const i = Math.max(t, F, s) * 2;
    if (i === 0)
      return 30;
    let D = 30 + (Math.round(s) << 2 | Math.round(F) << 1 | Math.round(t));
    return i === 2 && (D += 60), D;
  }, enumerable: false }, rgbToAnsi: { value: (u, t, F) => r.ansi256ToAnsi(r.rgbToAnsi256(u, t, F)), enumerable: false }, hexToAnsi: { value: (u) => r.ansi256ToAnsi(r.hexToAnsi256(u)), enumerable: false } }), r;
}
var ED = rD();
var d = new Set(["\x1B", "\x9B"]);
var oD = 39;
var y = "\x07";
var V = "[";
var nD = "]";
var G = "m";
var _ = `${nD}8;;`;
var z = (e) => `${d.values().next().value}${V}${e}${G}`;
var K = (e) => `${d.values().next().value}${_}${e}${y}`;
var aD = (e) => e.split(" ").map((u) => p(u));
var k = (e, u, t) => {
  const F = [...u];
  let s = false, i = false, D = p(P(e[e.length - 1]));
  for (const [C, n] of F.entries()) {
    const E = p(n);
    if (D + E <= t ? e[e.length - 1] += n : (e.push(n), D = 0), d.has(n) && (s = true, i = F.slice(C + 1).join("").startsWith(_)), s) {
      i ? n === y && (s = false, i = false) : n === G && (s = false);
      continue;
    }
    D += E, D === t && C < F.length - 1 && (e.push(""), D = 0);
  }
  !D && e[e.length - 1].length > 0 && e.length > 1 && (e[e.length - 2] += e.pop());
};
var hD = (e) => {
  const u = e.split(" ");
  let t = u.length;
  for (;t > 0 && !(p(u[t - 1]) > 0); )
    t--;
  return t === u.length ? e : u.slice(0, t).join(" ") + u.slice(t).join("");
};
var lD = (e, u, t = {}) => {
  if (t.trim !== false && e.trim() === "")
    return "";
  let F = "", s, i;
  const D = aD(e);
  let C = [""];
  for (const [E, a] of e.split(" ").entries()) {
    t.trim !== false && (C[C.length - 1] = C[C.length - 1].trimStart());
    let o = p(C[C.length - 1]);
    if (E !== 0 && (o >= u && (t.wordWrap === false || t.trim === false) && (C.push(""), o = 0), (o > 0 || t.trim === false) && (C[C.length - 1] += " ", o++)), t.hard && D[E] > u) {
      const c = u - o, f = 1 + Math.floor((D[E] - c - 1) / u);
      Math.floor((D[E] - 1) / u) < f && C.push(""), k(C, a, u);
      continue;
    }
    if (o + D[E] > u && o > 0 && D[E] > 0) {
      if (t.wordWrap === false && o < u) {
        k(C, a, u);
        continue;
      }
      C.push("");
    }
    if (o + D[E] > u && t.wordWrap === false) {
      k(C, a, u);
      continue;
    }
    C[C.length - 1] += a;
  }
  t.trim !== false && (C = C.map((E) => hD(E)));
  const n = [...C.join(`
`)];
  for (const [E, a] of n.entries()) {
    if (F += a, d.has(a)) {
      const { groups: c } = new RegExp(`(?:\\${V}(?<code>\\d+)m|\\${_}(?<uri>.*)${y})`).exec(n.slice(E).join("")) || { groups: {} };
      if (c.code !== undefined) {
        const f = Number.parseFloat(c.code);
        s = f === oD ? undefined : f;
      } else
        c.uri !== undefined && (i = c.uri.length === 0 ? undefined : c.uri);
    }
    const o = ED.codes.get(Number(s));
    n[E + 1] === `
` ? (i && (F += K("")), s && o && (F += z(o))) : a === `
` && (s && o && (F += z(s)), i && (F += K(i)));
  }
  return F;
};
function Y(e, u, t) {
  return String(e).normalize().replace(/\r\n/g, `
`).split(`
`).map((F) => lD(F, u, t)).join(`
`);
}
var xD = ["up", "down", "left", "right", "space", "enter", "cancel"];
var B = { actions: new Set(xD), aliases: new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"], ["\x03", "cancel"], ["escape", "cancel"]]) };
function $(e, u) {
  if (typeof e == "string")
    return B.aliases.get(e) === u;
  for (const t of e)
    if (t !== undefined && $(t, u))
      return true;
  return false;
}
function BD(e, u) {
  if (e === u)
    return;
  const t = e.split(`
`), F = u.split(`
`), s = [];
  for (let i = 0;i < Math.max(t.length, F.length); i++)
    t[i] !== F[i] && s.push(i);
  return s;
}
var AD = globalThis.process.platform.startsWith("win");
var S = Symbol("clack:cancel");
function pD(e) {
  return e === S;
}
function m(e, u) {
  const t = e;
  t.isTTY && t.setRawMode(u);
}
var gD = Object.defineProperty;
var vD = (e, u, t) => (u in e) ? gD(e, u, { enumerable: true, configurable: true, writable: true, value: t }) : e[u] = t;
var h = (e, u, t) => (vD(e, typeof u != "symbol" ? u + "" : u, t), t);

class x {
  constructor(u, t = true) {
    h(this, "input"), h(this, "output"), h(this, "_abortSignal"), h(this, "rl"), h(this, "opts"), h(this, "_render"), h(this, "_track", false), h(this, "_prevFrame", ""), h(this, "_subscribers", new Map), h(this, "_cursor", 0), h(this, "state", "initial"), h(this, "error", ""), h(this, "value");
    const { input: F = j, output: s = M, render: i, signal: D, ...C } = u;
    this.opts = C, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = i.bind(this), this._track = t, this._abortSignal = D, this.input = F, this.output = s;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(u, t) {
    const F = this._subscribers.get(u) ?? [];
    F.push(t), this._subscribers.set(u, F);
  }
  on(u, t) {
    this.setSubscriber(u, { cb: t });
  }
  once(u, t) {
    this.setSubscriber(u, { cb: t, once: true });
  }
  emit(u, ...t) {
    const F = this._subscribers.get(u) ?? [], s = [];
    for (const i of F)
      i.cb(...t), i.once && s.push(() => F.splice(F.indexOf(i), 1));
    for (const i of s)
      i();
  }
  prompt() {
    return new Promise((u, t) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), u(S);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      const F = new X;
      F._write = (s, i, D) => {
        this._track && (this.value = this.rl?.line.replace(/\t/g, ""), this._cursor = this.rl?.cursor ?? 0, this.emit("value", this.value)), D();
      }, this.input.pipe(F), this.rl = O.createInterface({ input: this.input, output: F, tabSize: 2, prompt: "", escapeCodeTimeout: 50, terminal: true }), O.emitKeypressEvents(this.input, this.rl), this.rl.prompt(), this.opts.initialValue !== undefined && this._track && this.rl.write(this.opts.initialValue), this.input.on("keypress", this.onKeypress), m(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), m(this.input, false), u(S);
      });
    });
  }
  onKeypress(u, t) {
    if (this.state === "error" && (this.state = "active"), t?.name && (!this._track && B.aliases.has(t.name) && this.emit("cursor", B.aliases.get(t.name)), B.actions.has(t.name) && this.emit("cursor", t.name)), u && (u.toLowerCase() === "y" || u.toLowerCase() === "n") && this.emit("confirm", u.toLowerCase() === "y"), u === "\t" && this.opts.placeholder && (this.value || (this.rl?.write(this.opts.placeholder), this.emit("value", this.opts.placeholder))), u && this.emit("key", u.toLowerCase()), t?.name === "return") {
      if (this.opts.validate) {
        const F = this.opts.validate(this.value);
        F && (this.error = F instanceof Error ? F.message : F, this.state = "error", this.rl?.write(this.value));
      }
      this.state !== "error" && (this.state = "submit");
    }
    $([u, t?.name, t?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), m(this.input, false), this.rl?.close(), this.rl = undefined, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const u = Y(this._prevFrame, process.stdout.columns, { hard: true }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, u * -1));
  }
  render() {
    const u = Y(this._render(this) ?? "", process.stdout.columns, { hard: true });
    if (u !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const t = BD(this._prevFrame, u);
        if (this.restoreCursor(), t && t?.length === 1) {
          const F = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F)), this.output.write(import_sisteransi.erase.lines(1));
          const s = u.split(`
`);
          this.output.write(s[F]), this._prevFrame = u, this.output.write(import_sisteransi.cursor.move(0, s.length - F - 1));
          return;
        }
        if (t && t?.length > 1) {
          const F = t[0];
          this.output.write(import_sisteransi.cursor.move(0, F)), this.output.write(import_sisteransi.erase.down());
          const s = u.split(`
`).slice(F);
          this.output.write(s.join(`
`)), this._prevFrame = u;
          return;
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(u), this.state === "initial" && (this.state = "active"), this._prevFrame = u;
    }
  }
}

class dD extends x {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(u) {
    super(u, false), this.value = !!u.initialValue, this.on("value", () => {
      this.value = this._value;
    }), this.on("confirm", (t) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = t, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
}
var A;
A = new WeakMap;
var OD = Object.defineProperty;
var PD = (e, u, t) => (u in e) ? OD(e, u, { enumerable: true, configurable: true, writable: true, value: t }) : e[u] = t;
var J = (e, u, t) => (PD(e, typeof u != "symbol" ? u + "" : u, t), t);

class LD extends x {
  constructor(u) {
    super(u, false), J(this, "options"), J(this, "cursor", 0), this.options = u.options, this.cursor = this.options.findIndex(({ value: t }) => t === u.initialValue), this.cursor === -1 && (this.cursor = 0), this.changeValue(), this.on("cursor", (t) => {
      switch (t) {
        case "left":
        case "up":
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
      }
      this.changeValue();
    });
  }
  get _value() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._value.value;
  }
}

// node_modules/@clack/prompts/dist/index.mjs
var import_picocolors = __toESM(require_picocolors(), 1);
var import_sisteransi2 = __toESM(require_src(), 1);
import y2 from "process";
function ce() {
  return y2.platform !== "win32" ? y2.env.TERM !== "linux" : !!y2.env.CI || !!y2.env.WT_SESSION || !!y2.env.TERMINUS_SUBLIME || y2.env.ConEmuTask === "{cmd::Cmder}" || y2.env.TERM_PROGRAM === "Terminus-Sublime" || y2.env.TERM_PROGRAM === "vscode" || y2.env.TERM === "xterm-256color" || y2.env.TERM === "alacritty" || y2.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var V2 = ce();
var u = (t, n) => V2 ? t : n;
var le = u("\u25C6", "*");
var L2 = u("\u25A0", "x");
var W2 = u("\u25B2", "x");
var C = u("\u25C7", "o");
var ue = u("\u250C", "T");
var o = u("\u2502", "|");
var d2 = u("\u2514", "\u2014");
var k2 = u("\u25CF", ">");
var P2 = u("\u25CB", " ");
var A2 = u("\u25FB", "[\u2022]");
var T = u("\u25FC", "[+]");
var F = u("\u25FB", "[ ]");
var $e = u("\u25AA", "\u2022");
var _2 = u("\u2500", "-");
var me = u("\u256E", "+");
var de = u("\u251C", "+");
var pe = u("\u256F", "+");
var q = u("\u25CF", "\u2022");
var D = u("\u25C6", "*");
var U = u("\u25B2", "!");
var K2 = u("\u25A0", "x");
var b2 = (t) => {
  switch (t) {
    case "initial":
    case "active":
      return import_picocolors.default.cyan(le);
    case "cancel":
      return import_picocolors.default.red(L2);
    case "error":
      return import_picocolors.default.yellow(W2);
    case "submit":
      return import_picocolors.default.green(C);
  }
};
var G2 = (t) => {
  const { cursor: n, options: r2, style: i } = t, s = t.maxItems ?? Number.POSITIVE_INFINITY, c = Math.max(process.stdout.rows - 4, 0), a = Math.min(c, Math.max(s, 5));
  let l2 = 0;
  n >= l2 + a - 3 ? l2 = Math.max(Math.min(n - a + 3, r2.length - a), 0) : n < l2 + 2 && (l2 = Math.max(n - 2, 0));
  const $2 = a < r2.length && l2 > 0, g = a < r2.length && l2 + a < r2.length;
  return r2.slice(l2, l2 + a).map((p2, v, f) => {
    const j2 = v === 0 && $2, E = v === f.length - 1 && g;
    return j2 || E ? import_picocolors.default.dim("...") : i(p2, v + l2 === n);
  });
};
var ye = (t) => {
  const n = t.active ?? "Yes", r2 = t.inactive ?? "No";
  return new dD({ active: n, inactive: r2, initialValue: t.initialValue ?? true, render() {
    const i = `${import_picocolors.default.gray(o)}
${b2(this.state)}  ${t.message}
`, s = this.value ? n : r2;
    switch (this.state) {
      case "submit":
        return `${i}${import_picocolors.default.gray(o)}  ${import_picocolors.default.dim(s)}`;
      case "cancel":
        return `${i}${import_picocolors.default.gray(o)}  ${import_picocolors.default.strikethrough(import_picocolors.default.dim(s))}
${import_picocolors.default.gray(o)}`;
      default:
        return `${i}${import_picocolors.default.cyan(o)}  ${this.value ? `${import_picocolors.default.green(k2)} ${n}` : `${import_picocolors.default.dim(P2)} ${import_picocolors.default.dim(n)}`} ${import_picocolors.default.dim("/")} ${this.value ? `${import_picocolors.default.dim(P2)} ${import_picocolors.default.dim(r2)}` : `${import_picocolors.default.green(k2)} ${r2}`}
${import_picocolors.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var ve = (t) => {
  const n = (r2, i) => {
    const s = r2.label ?? String(r2.value);
    switch (i) {
      case "selected":
        return `${import_picocolors.default.dim(s)}`;
      case "active":
        return `${import_picocolors.default.green(k2)} ${s} ${r2.hint ? import_picocolors.default.dim(`(${r2.hint})`) : ""}`;
      case "cancelled":
        return `${import_picocolors.default.strikethrough(import_picocolors.default.dim(s))}`;
      default:
        return `${import_picocolors.default.dim(P2)} ${import_picocolors.default.dim(s)}`;
    }
  };
  return new LD({ options: t.options, initialValue: t.initialValue, render() {
    const r2 = `${import_picocolors.default.gray(o)}
${b2(this.state)}  ${t.message}
`;
    switch (this.state) {
      case "submit":
        return `${r2}${import_picocolors.default.gray(o)}  ${n(this.options[this.cursor], "selected")}`;
      case "cancel":
        return `${r2}${import_picocolors.default.gray(o)}  ${n(this.options[this.cursor], "cancelled")}
${import_picocolors.default.gray(o)}`;
      default:
        return `${r2}${import_picocolors.default.cyan(o)}  ${G2({ cursor: this.cursor, options: this.options, maxItems: t.maxItems, style: (i, s) => n(i, s ? "active" : "inactive") }).join(`
${import_picocolors.default.cyan(o)}  `)}
${import_picocolors.default.cyan(d2)}
`;
    }
  } }).prompt();
};
var J2 = `${import_picocolors.default.gray(o)}  `;

// src/auth/antigravity/cli.ts
async function promptAddAnotherAccount(currentCount) {
  if (!process.stdout.isTTY) {
    return false;
  }
  const result = await ye({
    message: `Add another Google account?
Currently have ${currentCount} accounts (max 10)`
  });
  if (pD(result)) {
    return false;
  }
  return result;
}
async function promptAccountTier() {
  if (!process.stdout.isTTY) {
    return "free";
  }
  const tier = await ve({
    message: "Select account tier",
    options: [
      { value: "free", label: "Free" },
      { value: "paid", label: "Paid" }
    ]
  });
  if (pD(tier)) {
    return "free";
  }
  return tier;
}

// node_modules/open/index.js
import process8 from "process";
import path2 from "path";
import { fileURLToPath } from "url";
import childProcess3 from "child_process";
import fs6, { constants as fsConstants2 } from "fs/promises";

// node_modules/wsl-utils/index.js
import { promisify as promisify2 } from "util";
import childProcess2 from "child_process";
import fs5, { constants as fsConstants } from "fs/promises";

// node_modules/is-wsl/index.js
import process2 from "process";
import os2 from "os";
import fs4 from "fs";

// node_modules/is-inside-container/index.js
import fs3 from "fs";

// node_modules/is-docker/index.js
import fs2 from "fs";
var isDockerCached;
function hasDockerEnv() {
  try {
    fs2.statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
}
function hasDockerCGroup() {
  try {
    return fs2.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return false;
  }
}
function isDocker() {
  if (isDockerCached === undefined) {
    isDockerCached = hasDockerEnv() || hasDockerCGroup();
  }
  return isDockerCached;
}

// node_modules/is-inside-container/index.js
var cachedResult;
var hasContainerEnv = () => {
  try {
    fs3.statSync("/run/.containerenv");
    return true;
  } catch {
    return false;
  }
};
function isInsideContainer() {
  if (cachedResult === undefined) {
    cachedResult = hasContainerEnv() || isDocker();
  }
  return cachedResult;
}

// node_modules/is-wsl/index.js
var isWsl = () => {
  if (process2.platform !== "linux") {
    return false;
  }
  if (os2.release().toLowerCase().includes("microsoft")) {
    if (isInsideContainer()) {
      return false;
    }
    return true;
  }
  try {
    return fs4.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !isInsideContainer() : false;
  } catch {
    return false;
  }
};
var is_wsl_default = process2.env.__IS_WSL_TEST__ ? isWsl : isWsl();

// node_modules/powershell-utils/index.js
import process3 from "process";
import { Buffer } from "buffer";
import { promisify } from "util";
import childProcess from "child_process";
var execFile = promisify(childProcess.execFile);
var powerShellPath = () => `${process3.env.SYSTEMROOT || process3.env.windir || String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;
var executePowerShell = async (command, options = {}) => {
  const {
    powerShellPath: psPath,
    ...execFileOptions
  } = options;
  const encodedCommand = executePowerShell.encodeCommand(command);
  return execFile(psPath ?? powerShellPath(), [
    ...executePowerShell.argumentsPrefix,
    encodedCommand
  ], {
    encoding: "utf8",
    ...execFileOptions
  });
};
executePowerShell.argumentsPrefix = [
  "-NoProfile",
  "-NonInteractive",
  "-ExecutionPolicy",
  "Bypass",
  "-EncodedCommand"
];
executePowerShell.encodeCommand = (command) => Buffer.from(command, "utf16le").toString("base64");
executePowerShell.escapeArgument = (value) => `'${String(value).replaceAll("'", "''")}'`;

// node_modules/wsl-utils/utilities.js
function parseMountPointFromConfig(content) {
  for (const line of content.split(`
`)) {
    if (/^\s*#/.test(line)) {
      continue;
    }
    const match = /^\s*root\s*=\s*(?<mountPoint>"[^"]*"|'[^']*'|[^#]*)/.exec(line);
    if (!match) {
      continue;
    }
    return match.groups.mountPoint.trim().replaceAll(/^["']|["']$/g, "");
  }
}

// node_modules/wsl-utils/index.js
var execFile2 = promisify2(childProcess2.execFile);
var wslDrivesMountPoint = (() => {
  const defaultMountPoint = "/mnt/";
  let mountPoint;
  return async function() {
    if (mountPoint) {
      return mountPoint;
    }
    const configFilePath = "/etc/wsl.conf";
    let isConfigFileExists = false;
    try {
      await fs5.access(configFilePath, fsConstants.F_OK);
      isConfigFileExists = true;
    } catch {}
    if (!isConfigFileExists) {
      return defaultMountPoint;
    }
    const configContent = await fs5.readFile(configFilePath, { encoding: "utf8" });
    const parsedMountPoint = parseMountPointFromConfig(configContent);
    if (parsedMountPoint === undefined) {
      return defaultMountPoint;
    }
    mountPoint = parsedMountPoint;
    mountPoint = mountPoint.endsWith("/") ? mountPoint : `${mountPoint}/`;
    return mountPoint;
  };
})();
var powerShellPathFromWsl = async () => {
  const mountPoint = await wslDrivesMountPoint();
  return `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`;
};
var powerShellPath2 = is_wsl_default ? powerShellPathFromWsl : powerShellPath;
var canAccessPowerShellPromise;
var canAccessPowerShell = async () => {
  canAccessPowerShellPromise ??= (async () => {
    try {
      const psPath = await powerShellPath2();
      await fs5.access(psPath, fsConstants.X_OK);
      return true;
    } catch {
      return false;
    }
  })();
  return canAccessPowerShellPromise;
};
var wslDefaultBrowser = async () => {
  const psPath = await powerShellPath2();
  const command = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`;
  const { stdout } = await executePowerShell(command, { powerShellPath: psPath });
  return stdout.trim();
};
var convertWslPathToWindows = async (path2) => {
  if (/^[a-z]+:\/\//i.test(path2)) {
    return path2;
  }
  try {
    const { stdout } = await execFile2("wslpath", ["-aw", path2], { encoding: "utf8" });
    return stdout.trim();
  } catch {
    return path2;
  }
};

// node_modules/define-lazy-prop/index.js
function defineLazyProperty(object, propertyName, valueGetter) {
  const define = (value) => Object.defineProperty(object, propertyName, { value, enumerable: true, writable: true });
  Object.defineProperty(object, propertyName, {
    configurable: true,
    enumerable: true,
    get() {
      const result = valueGetter();
      define(result);
      return result;
    },
    set(value) {
      define(value);
    }
  });
  return object;
}

// node_modules/default-browser/index.js
import { promisify as promisify6 } from "util";
import process6 from "process";
import { execFile as execFile6 } from "child_process";

// node_modules/default-browser-id/index.js
import { promisify as promisify3 } from "util";
import process4 from "process";
import { execFile as execFile3 } from "child_process";
var execFileAsync = promisify3(execFile3);
async function defaultBrowserId() {
  if (process4.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const { stdout } = await execFileAsync("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
  const match = /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(stdout);
  const browserId = match?.groups.id ?? "com.apple.Safari";
  if (browserId === "com.apple.safari") {
    return "com.apple.Safari";
  }
  return browserId;
}

// node_modules/run-applescript/index.js
import process5 from "process";
import { promisify as promisify4 } from "util";
import { execFile as execFile4, execFileSync } from "child_process";
var execFileAsync2 = promisify4(execFile4);
async function runAppleScript(script, { humanReadableOutput = true, signal } = {}) {
  if (process5.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const outputArguments = humanReadableOutput ? [] : ["-ss"];
  const execOptions = {};
  if (signal) {
    execOptions.signal = signal;
  }
  const { stdout } = await execFileAsync2("osascript", ["-e", script, outputArguments], execOptions);
  return stdout.trim();
}

// node_modules/bundle-name/index.js
async function bundleName(bundleId) {
  return runAppleScript(`tell application "Finder" to set app_path to application file id "${bundleId}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
}

// node_modules/default-browser/windows.js
import { promisify as promisify5 } from "util";
import { execFile as execFile5 } from "child_process";
var execFileAsync3 = promisify5(execFile5);
var windowsBrowserProgIds = {
  MSEdgeHTM: { name: "Edge", id: "com.microsoft.edge" },
  MSEdgeBHTML: { name: "Edge Beta", id: "com.microsoft.edge.beta" },
  MSEdgeDHTML: { name: "Edge Dev", id: "com.microsoft.edge.dev" },
  AppXq0fevzme2pys62n3e0fbqa7peapykr8v: { name: "Edge", id: "com.microsoft.edge.old" },
  ChromeHTML: { name: "Chrome", id: "com.google.chrome" },
  ChromeBHTML: { name: "Chrome Beta", id: "com.google.chrome.beta" },
  ChromeDHTML: { name: "Chrome Dev", id: "com.google.chrome.dev" },
  ChromiumHTM: { name: "Chromium", id: "org.chromium.Chromium" },
  BraveHTML: { name: "Brave", id: "com.brave.Browser" },
  BraveBHTML: { name: "Brave Beta", id: "com.brave.Browser.beta" },
  BraveDHTML: { name: "Brave Dev", id: "com.brave.Browser.dev" },
  BraveSSHTM: { name: "Brave Nightly", id: "com.brave.Browser.nightly" },
  FirefoxURL: { name: "Firefox", id: "org.mozilla.firefox" },
  OperaStable: { name: "Opera", id: "com.operasoftware.Opera" },
  VivaldiHTM: { name: "Vivaldi", id: "com.vivaldi.Vivaldi" },
  "IE.HTTP": { name: "Internet Explorer", id: "com.microsoft.ie" }
};
var _windowsBrowserProgIdMap = new Map(Object.entries(windowsBrowserProgIds));

class UnknownBrowserError extends Error {
}
async function defaultBrowser(_execFileAsync = execFileAsync3) {
  const { stdout } = await _execFileAsync("reg", [
    "QUERY",
    " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
    "/v",
    "ProgId"
  ]);
  const match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(stdout);
  if (!match) {
    throw new UnknownBrowserError(`Cannot find Windows browser in stdout: ${JSON.stringify(stdout)}`);
  }
  const { id } = match.groups;
  const browser = windowsBrowserProgIds[id];
  if (!browser) {
    throw new UnknownBrowserError(`Unknown browser ID: ${id}`);
  }
  return browser;
}

// node_modules/default-browser/index.js
var execFileAsync4 = promisify6(execFile6);
var titleize = (string) => string.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (x2) => x2.toUpperCase());
async function defaultBrowser2() {
  if (process6.platform === "darwin") {
    const id = await defaultBrowserId();
    const name = await bundleName(id);
    return { name, id };
  }
  if (process6.platform === "linux") {
    const { stdout } = await execFileAsync4("xdg-mime", ["query", "default", "x-scheme-handler/http"]);
    const id = stdout.trim();
    const name = titleize(id.replace(/.desktop$/, "").replace("-", " "));
    return { name, id };
  }
  if (process6.platform === "win32") {
    return defaultBrowser();
  }
  throw new Error("Only macOS, Linux, and Windows are supported");
}

// node_modules/is-in-ssh/index.js
import process7 from "process";
var isInSsh = Boolean(process7.env.SSH_CONNECTION || process7.env.SSH_CLIENT || process7.env.SSH_TTY);
var is_in_ssh_default = isInSsh;

// node_modules/open/index.js
var fallbackAttemptSymbol = Symbol("fallbackAttempt");
var __dirname2 = import.meta.url ? path2.dirname(fileURLToPath(import.meta.url)) : "";
var localXdgOpenPath = path2.join(__dirname2, "xdg-open");
var { platform, arch } = process8;
var tryEachApp = async (apps, opener) => {
  if (apps.length === 0) {
    return;
  }
  const errors = [];
  for (const app of apps) {
    try {
      return await opener(app);
    } catch (error) {
      errors.push(error);
    }
  }
  throw new AggregateError(errors, "Failed to open in all supported apps");
};
var baseOpen = async (options) => {
  options = {
    wait: false,
    background: false,
    newInstance: false,
    allowNonzeroExitCode: false,
    ...options
  };
  const isFallbackAttempt = options[fallbackAttemptSymbol] === true;
  delete options[fallbackAttemptSymbol];
  if (Array.isArray(options.app)) {
    return tryEachApp(options.app, (singleApp) => baseOpen({
      ...options,
      app: singleApp,
      [fallbackAttemptSymbol]: true
    }));
  }
  let { name: app, arguments: appArguments = [] } = options.app ?? {};
  appArguments = [...appArguments];
  if (Array.isArray(app)) {
    return tryEachApp(app, (appName) => baseOpen({
      ...options,
      app: {
        name: appName,
        arguments: appArguments
      },
      [fallbackAttemptSymbol]: true
    }));
  }
  if (app === "browser" || app === "browserPrivate") {
    const ids = {
      "com.google.chrome": "chrome",
      "google-chrome.desktop": "chrome",
      "com.brave.browser": "brave",
      "org.mozilla.firefox": "firefox",
      "firefox.desktop": "firefox",
      "com.microsoft.msedge": "edge",
      "com.microsoft.edge": "edge",
      "com.microsoft.edgemac": "edge",
      "microsoft-edge.desktop": "edge",
      "com.apple.safari": "safari"
    };
    const flags = {
      chrome: "--incognito",
      brave: "--incognito",
      firefox: "--private-window",
      edge: "--inPrivate"
    };
    let browser;
    if (is_wsl_default) {
      const progId = await wslDefaultBrowser();
      const browserInfo = _windowsBrowserProgIdMap.get(progId);
      browser = browserInfo ?? {};
    } else {
      browser = await defaultBrowser2();
    }
    if (browser.id in ids) {
      const browserName = ids[browser.id.toLowerCase()];
      if (app === "browserPrivate") {
        if (browserName === "safari") {
          throw new Error("Safari doesn't support opening in private mode via command line");
        }
        appArguments.push(flags[browserName]);
      }
      return baseOpen({
        ...options,
        app: {
          name: apps[browserName],
          arguments: appArguments
        }
      });
    }
    throw new Error(`${browser.name} is not supported as a default browser`);
  }
  let command;
  const cliArguments = [];
  const childProcessOptions = {};
  let shouldUseWindowsInWsl = false;
  if (is_wsl_default && !isInsideContainer() && !is_in_ssh_default && !app) {
    shouldUseWindowsInWsl = await canAccessPowerShell();
  }
  if (platform === "darwin") {
    command = "open";
    if (options.wait) {
      cliArguments.push("--wait-apps");
    }
    if (options.background) {
      cliArguments.push("--background");
    }
    if (options.newInstance) {
      cliArguments.push("--new");
    }
    if (app) {
      cliArguments.push("-a", app);
    }
  } else if (platform === "win32" || shouldUseWindowsInWsl) {
    command = await powerShellPath2();
    cliArguments.push(...executePowerShell.argumentsPrefix);
    if (!is_wsl_default) {
      childProcessOptions.windowsVerbatimArguments = true;
    }
    if (is_wsl_default && options.target) {
      options.target = await convertWslPathToWindows(options.target);
    }
    const encodedArguments = ["$ProgressPreference = 'SilentlyContinue';", "Start"];
    if (options.wait) {
      encodedArguments.push("-Wait");
    }
    if (app) {
      encodedArguments.push(executePowerShell.escapeArgument(app));
      if (options.target) {
        appArguments.push(options.target);
      }
    } else if (options.target) {
      encodedArguments.push(executePowerShell.escapeArgument(options.target));
    }
    if (appArguments.length > 0) {
      appArguments = appArguments.map((argument) => executePowerShell.escapeArgument(argument));
      encodedArguments.push("-ArgumentList", appArguments.join(","));
    }
    options.target = executePowerShell.encodeCommand(encodedArguments.join(" "));
    if (!options.wait) {
      childProcessOptions.stdio = "ignore";
    }
  } else {
    if (app) {
      command = app;
    } else {
      const isBundled = !__dirname2 || __dirname2 === "/";
      let exeLocalXdgOpen = false;
      try {
        await fs6.access(localXdgOpenPath, fsConstants2.X_OK);
        exeLocalXdgOpen = true;
      } catch {}
      const useSystemXdgOpen = process8.versions.electron ?? (platform === "android" || isBundled || !exeLocalXdgOpen);
      command = useSystemXdgOpen ? "xdg-open" : localXdgOpenPath;
    }
    if (appArguments.length > 0) {
      cliArguments.push(...appArguments);
    }
    if (!options.wait) {
      childProcessOptions.stdio = "ignore";
      childProcessOptions.detached = true;
    }
  }
  if (platform === "darwin" && appArguments.length > 0) {
    cliArguments.push("--args", ...appArguments);
  }
  if (options.target) {
    cliArguments.push(options.target);
  }
  const subprocess = childProcess3.spawn(command, cliArguments, childProcessOptions);
  if (options.wait) {
    return new Promise((resolve, reject) => {
      subprocess.once("error", reject);
      subprocess.once("close", (exitCode) => {
        if (!options.allowNonzeroExitCode && exitCode !== 0) {
          reject(new Error(`Exited with code ${exitCode}`));
          return;
        }
        resolve(subprocess);
      });
    });
  }
  if (isFallbackAttempt) {
    return new Promise((resolve, reject) => {
      subprocess.once("error", reject);
      subprocess.once("spawn", () => {
        subprocess.once("close", (exitCode) => {
          subprocess.off("error", reject);
          if (exitCode !== 0) {
            reject(new Error(`Exited with code ${exitCode}`));
            return;
          }
          subprocess.unref();
          resolve(subprocess);
        });
      });
    });
  }
  subprocess.unref();
  return new Promise((resolve, reject) => {
    subprocess.once("error", reject);
    subprocess.once("spawn", () => {
      subprocess.off("error", reject);
      resolve(subprocess);
    });
  });
};
var open = (target, options) => {
  if (typeof target !== "string") {
    throw new TypeError("Expected a `target`");
  }
  return baseOpen({
    ...options,
    target
  });
};
function detectArchBinary(binary) {
  if (typeof binary === "string" || Array.isArray(binary)) {
    return binary;
  }
  const { [arch]: archBinary } = binary;
  if (!archBinary) {
    throw new Error(`${arch} is not supported`);
  }
  return archBinary;
}
function detectPlatformBinary({ [platform]: platformBinary }, { wsl } = {}) {
  if (wsl && is_wsl_default) {
    return detectArchBinary(wsl);
  }
  if (!platformBinary) {
    throw new Error(`${platform} is not supported`);
  }
  return detectArchBinary(platformBinary);
}
var apps = {
  browser: "browser",
  browserPrivate: "browserPrivate"
};
defineLazyProperty(apps, "chrome", () => detectPlatformBinary({
  darwin: "google chrome",
  win32: "chrome",
  linux: ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]
}, {
  wsl: {
    ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
  }
}));
defineLazyProperty(apps, "brave", () => detectPlatformBinary({
  darwin: "brave browser",
  win32: "brave",
  linux: ["brave-browser", "brave"]
}, {
  wsl: {
    ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
    x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
  }
}));
defineLazyProperty(apps, "firefox", () => detectPlatformBinary({
  darwin: "firefox",
  win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
  linux: "firefox"
}, {
  wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
}));
defineLazyProperty(apps, "edge", () => detectPlatformBinary({
  darwin: "microsoft edge",
  win32: "msedge",
  linux: ["microsoft-edge", "microsoft-edge-dev"]
}, {
  wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}));
defineLazyProperty(apps, "safari", () => detectPlatformBinary({
  darwin: "Safari"
}));
var open_default = open;

// src/auth/antigravity/browser.ts
function debugLog5(message) {
  if (process.env.ANTIGRAVITY_DEBUG === "1") {
    console.log(`[antigravity-browser] ${message}`);
  }
}
async function openBrowserURL(url) {
  debugLog5(`Opening browser: ${url}`);
  try {
    await open_default(url);
    debugLog5("Browser opened successfully");
    return true;
  } catch (error) {
    debugLog5(`Failed to open browser: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// src/auth/antigravity/plugin.ts
var GOOGLE_PROVIDER_ID = "google";
var MAX_ACCOUNTS = 10;
function isOAuthAuth(auth) {
  return auth.type === "oauth";
}
async function createGoogleAntigravityAuthPlugin({
  client
}) {
  let cachedClientId = ANTIGRAVITY_CLIENT_ID;
  let cachedClientSecret = ANTIGRAVITY_CLIENT_SECRET;
  const authHook = {
    provider: GOOGLE_PROVIDER_ID,
    loader: async (auth, provider) => {
      const currentAuth = await auth();
      if (process.env.ANTIGRAVITY_DEBUG === "1") {
        console.log("[antigravity-plugin] loader called");
        console.log("[antigravity-plugin] auth type:", currentAuth?.type);
        console.log("[antigravity-plugin] auth keys:", Object.keys(currentAuth || {}));
      }
      if (!isOAuthAuth(currentAuth)) {
        if (process.env.ANTIGRAVITY_DEBUG === "1") {
          console.log("[antigravity-plugin] NOT OAuth auth, returning empty");
        }
        return {};
      }
      if (process.env.ANTIGRAVITY_DEBUG === "1") {
        console.log("[antigravity-plugin] OAuth auth detected, creating custom fetch");
      }
      let accountManager = null;
      try {
        const storedAccounts = await loadAccounts();
        if (storedAccounts) {
          accountManager = new AccountManager(currentAuth, storedAccounts);
          if (process.env.ANTIGRAVITY_DEBUG === "1") {
            console.log(`[antigravity-plugin] Loaded ${accountManager.getAccountCount()} accounts from storage`);
          }
        } else if (currentAuth.refresh.includes("|||")) {
          const tokens = currentAuth.refresh.split("|||");
          const firstToken = tokens[0];
          accountManager = new AccountManager({ refresh: firstToken, access: currentAuth.access || "", expires: currentAuth.expires || 0 }, null);
          for (let i = 1;i < tokens.length; i++) {
            const parts = parseStoredToken(tokens[i]);
            accountManager.addAccount(parts);
          }
          await accountManager.save();
          if (process.env.ANTIGRAVITY_DEBUG === "1") {
            console.log("[antigravity-plugin] Migrated multi-account auth to storage");
          }
        }
      } catch (error) {
        if (process.env.ANTIGRAVITY_DEBUG === "1") {
          console.error(`[antigravity-plugin] Failed to load accounts: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      cachedClientId = provider.options?.clientId || ANTIGRAVITY_CLIENT_ID;
      cachedClientSecret = provider.options?.clientSecret || ANTIGRAVITY_CLIENT_SECRET;
      if (process.env.ANTIGRAVITY_DEBUG === "1" && (cachedClientId !== ANTIGRAVITY_CLIENT_ID || cachedClientSecret !== ANTIGRAVITY_CLIENT_SECRET)) {
        console.log("[antigravity-plugin] Using custom credentials from provider.options");
      }
      const authClient = {
        set: async (providerId, authData) => {
          await client.auth.set({
            body: {
              type: "oauth",
              access: authData.access || "",
              refresh: authData.refresh || "",
              expires: authData.expires || 0
            },
            path: { id: providerId }
          });
        }
      };
      const getAuth = async () => {
        const authState = await auth();
        if (isOAuthAuth(authState)) {
          return {
            access: authState.access,
            refresh: authState.refresh,
            expires: authState.expires
          };
        }
        return {};
      };
      const antigravityFetch = createAntigravityFetch(getAuth, authClient, GOOGLE_PROVIDER_ID, cachedClientId, cachedClientSecret);
      return {
        fetch: antigravityFetch,
        apiKey: "antigravity-oauth",
        accountManager
      };
    },
    methods: [
      {
        type: "oauth",
        label: "OAuth with Google (Antigravity)",
        authorize: async () => {
          const serverHandle = startCallbackServer();
          const { url, state: expectedState } = await buildAuthURL(undefined, cachedClientId, serverHandle.port);
          const browserOpened = await openBrowserURL(url);
          return {
            url,
            instructions: browserOpened ? "Opening browser for sign-in. We'll automatically detect when you're done." : "Please open the URL above in your browser to sign in.",
            method: "auto",
            callback: async () => {
              try {
                const result = await serverHandle.waitForCallback();
                if (result.error) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error(`[antigravity-plugin] OAuth error: ${result.error}`);
                  }
                  return { type: "failed" };
                }
                if (!result.code) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error("[antigravity-plugin] No authorization code received");
                  }
                  return { type: "failed" };
                }
                if (result.state !== expectedState) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error("[antigravity-plugin] State mismatch - possible CSRF attack");
                  }
                  return { type: "failed" };
                }
                const redirectUri = `http://localhost:${serverHandle.port}/oauth-callback`;
                const tokens = await exchangeCode(result.code, redirectUri, cachedClientId, cachedClientSecret);
                if (!tokens.refresh_token) {
                  serverHandle.close();
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error("[antigravity-plugin] OAuth response missing refresh_token");
                  }
                  return { type: "failed" };
                }
                let email;
                try {
                  const userInfo = await fetchUserInfo(tokens.access_token);
                  email = userInfo.email;
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.log(`[antigravity-plugin] Authenticated as: ${email}`);
                  }
                } catch {}
                const projectContext = await fetchProjectContext(tokens.access_token);
                const projectId = projectContext.cloudaicompanionProject || "";
                const tier = await promptAccountTier();
                const expires = Date.now() + tokens.expires_in * 1000;
                const accounts = [{
                  parts: {
                    refreshToken: tokens.refresh_token,
                    projectId,
                    managedProjectId: projectContext.managedProjectId
                  },
                  access: tokens.access_token,
                  expires,
                  email,
                  tier,
                  projectId
                }];
                await client.tui.showToast({
                  body: {
                    message: `Account 1 authenticated${email ? ` (${email})` : ""}`,
                    variant: "success"
                  }
                });
                while (accounts.length < MAX_ACCOUNTS) {
                  const addAnother = await promptAddAnotherAccount(accounts.length);
                  if (!addAnother)
                    break;
                  const additionalServerHandle = startCallbackServer();
                  const { url: additionalUrl, state: expectedAdditionalState } = await buildAuthURL(undefined, cachedClientId, additionalServerHandle.port);
                  const additionalBrowserOpened = await openBrowserURL(additionalUrl);
                  if (!additionalBrowserOpened) {
                    await client.tui.showToast({
                      body: {
                        message: `Please open in browser: ${additionalUrl}`,
                        variant: "warning"
                      }
                    });
                  }
                  try {
                    const additionalResult = await additionalServerHandle.waitForCallback();
                    if (additionalResult.error || !additionalResult.code) {
                      additionalServerHandle.close();
                      await client.tui.showToast({
                        body: {
                          message: "Skipping this account...",
                          variant: "warning"
                        }
                      });
                      continue;
                    }
                    if (additionalResult.state !== expectedAdditionalState) {
                      additionalServerHandle.close();
                      await client.tui.showToast({
                        body: {
                          message: "State mismatch, skipping...",
                          variant: "warning"
                        }
                      });
                      continue;
                    }
                    const additionalRedirectUri = `http://localhost:${additionalServerHandle.port}/oauth-callback`;
                    const additionalTokens = await exchangeCode(additionalResult.code, additionalRedirectUri, cachedClientId, cachedClientSecret);
                    if (!additionalTokens.refresh_token) {
                      additionalServerHandle.close();
                      if (process.env.ANTIGRAVITY_DEBUG === "1") {
                        console.error("[antigravity-plugin] Additional account OAuth response missing refresh_token");
                      }
                      await client.tui.showToast({
                        body: {
                          message: "Account missing refresh token, skipping...",
                          variant: "warning"
                        }
                      });
                      continue;
                    }
                    let additionalEmail;
                    try {
                      const additionalUserInfo = await fetchUserInfo(additionalTokens.access_token);
                      additionalEmail = additionalUserInfo.email;
                    } catch {}
                    const additionalProjectContext = await fetchProjectContext(additionalTokens.access_token);
                    const additionalProjectId = additionalProjectContext.cloudaicompanionProject || "";
                    const additionalTier = await promptAccountTier();
                    const additionalExpires = Date.now() + additionalTokens.expires_in * 1000;
                    accounts.push({
                      parts: {
                        refreshToken: additionalTokens.refresh_token,
                        projectId: additionalProjectId,
                        managedProjectId: additionalProjectContext.managedProjectId
                      },
                      access: additionalTokens.access_token,
                      expires: additionalExpires,
                      email: additionalEmail,
                      tier: additionalTier,
                      projectId: additionalProjectId
                    });
                    additionalServerHandle.close();
                    await client.tui.showToast({
                      body: {
                        message: `Account ${accounts.length} authenticated${additionalEmail ? ` (${additionalEmail})` : ""}`,
                        variant: "success"
                      }
                    });
                  } catch (error) {
                    additionalServerHandle.close();
                    if (process.env.ANTIGRAVITY_DEBUG === "1") {
                      console.error(`[antigravity-plugin] Additional account OAuth failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                    }
                    await client.tui.showToast({
                      body: {
                        message: "Failed to authenticate additional account, skipping...",
                        variant: "warning"
                      }
                    });
                    continue;
                  }
                }
                const firstAccount = accounts[0];
                try {
                  const accountManager = new AccountManager({
                    refresh: formatTokenForStorage(firstAccount.parts.refreshToken, firstAccount.projectId, firstAccount.parts.managedProjectId),
                    access: firstAccount.access,
                    expires: firstAccount.expires
                  }, null);
                  for (let i = 1;i < accounts.length; i++) {
                    const acc = accounts[i];
                    accountManager.addAccount(acc.parts, acc.access, acc.expires, acc.email, acc.tier);
                  }
                  const currentAccount = accountManager.getCurrentAccount();
                  if (currentAccount) {
                    currentAccount.email = firstAccount.email;
                    currentAccount.tier = firstAccount.tier;
                  }
                  await accountManager.save();
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.log(`[antigravity-plugin] Saved ${accounts.length} accounts to storage`);
                  }
                } catch (error) {
                  if (process.env.ANTIGRAVITY_DEBUG === "1") {
                    console.error(`[antigravity-plugin] Failed to save accounts: ${error instanceof Error ? error.message : "Unknown error"}`);
                  }
                }
                const allRefreshTokens = accounts.map((acc) => formatTokenForStorage(acc.parts.refreshToken, acc.projectId, acc.parts.managedProjectId)).join("|||");
                return {
                  type: "success",
                  access: firstAccount.access,
                  refresh: allRefreshTokens,
                  expires: firstAccount.expires
                };
              } catch (error) {
                serverHandle.close();
                if (process.env.ANTIGRAVITY_DEBUG === "1") {
                  console.error(`[antigravity-plugin] OAuth flow failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
                return { type: "failed" };
              }
            }
          };
        }
      }
    ]
  };
  return {
    auth: authHook
  };
}
// src/google-auth.ts
var GoogleAntigravityAuthPlugin = async (ctx) => {
  return createGoogleAntigravityAuthPlugin(ctx);
};
var google_auth_default = GoogleAntigravityAuthPlugin;
export {
  google_auth_default as default
};
