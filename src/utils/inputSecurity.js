// ═══════════════════════════════════════════
// INPUT SECURITY — Centralized Validation & Sanitization
// ═══════════════════════════════════════════

/**
 * Maximum allowed length for general text inputs.
 * @type {number}
 */
const MAX_TEXT_LENGTH = 500;

/**
 * Maximum allowed length for short text inputs (names, titles).
 * @type {number}
 */
const MAX_SHORT_TEXT_LENGTH = 100;

/**
 * Regex pattern matching dangerous HTML tags and script injections.
 * Matches <script>, <iframe>, <object>, <embed>, <link>, <meta>, <form>, <svg> with onload, etc.
 * @type {RegExp}
 */
const DANGEROUS_HTML_PATTERN = /<\s*\/?\s*(script|iframe|object|embed|link|meta|form|base|applet)[^>]*>/gi;

/**
 * Regex pattern matching HTML event handler attributes (onclick, onerror, onload, etc.).
 * @type {RegExp}
 */
const EVENT_HANDLER_PATTERN = /\bon\w+\s*=\s*["'][^"']*["']/gi;

/**
 * Regex pattern matching javascript: protocol URIs.
 * @type {RegExp}
 */
const JAVASCRIPT_URI_PATTERN = /javascript\s*:/gi;

/**
 * Regex pattern matching template literal injection attempts.
 * @type {RegExp}
 */
const TEMPLATE_INJECTION_PATTERN = /\$\{[^}]*\}/g;

/**
 * Regex pattern matching any remaining HTML tags.
 * @type {RegExp}
 */
const HTML_TAG_PATTERN = /<[^>]*>/g;

/**
 * Sanitizes a text input string by removing potentially dangerous content.
 * Strips HTML tags, script injections, event handlers, javascript: URIs,
 * and template literal injections. Returns safe plaintext.
 *
 * @param {string} input - The raw user input string to sanitize.
 * @param {number} [maxLength=MAX_TEXT_LENGTH] - Maximum allowed character length.
 * @returns {string} The sanitized, safe plaintext string.
 *
 * @example
 * sanitizeTextInput('<script>alert("xss")</script>Hello')
 * // Returns: 'Hello'
 *
 * @example
 * sanitizeTextInput('Normal safe text')
 * // Returns: 'Normal safe text'
 */
export function sanitizeTextInput(input, maxLength = MAX_TEXT_LENGTH) {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // 1. Remove dangerous HTML tags (script, iframe, object, embed, etc.)
  sanitized = sanitized.replace(DANGEROUS_HTML_PATTERN, '');

  // 2. Remove event handler attributes
  sanitized = sanitized.replace(EVENT_HANDLER_PATTERN, '');

  // 3. Remove javascript: protocol URIs
  sanitized = sanitized.replace(JAVASCRIPT_URI_PATTERN, '');

  // 4. Remove template literal injections
  sanitized = sanitized.replace(TEMPLATE_INJECTION_PATTERN, '');

  // 5. Remove all remaining HTML tags
  sanitized = sanitized.replace(HTML_TAG_PATTERN, '');

  // 6. Encode critical characters that could be used for injection
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // 7. Trim whitespace and enforce max length
  sanitized = sanitized.trim().slice(0, maxLength);

  return sanitized;
}

/**
 * Validates and clamps a numeric input to defined bounds.
 * Rejects NaN, Infinity, non-finite values, and returns the fallback on invalid input.
 *
 * @param {*} value - The value to validate (may be string from form input).
 * @param {number} min - Minimum allowed value (inclusive).
 * @param {number} max - Maximum allowed value (inclusive).
 * @param {number} fallback - Default value returned when input is invalid.
 * @returns {number} The validated and clamped numeric value.
 *
 * @example
 * validateNumericInput('150', 0, 500, 80)
 * // Returns: 150
 *
 * @example
 * validateNumericInput('NaN', 0, 500, 80)
 * // Returns: 80
 *
 * @example
 * validateNumericInput(999, 0, 500, 80)
 * // Returns: 500
 */
export function validateNumericInput(value, min, max, fallback) {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return fallback;
  }

  return Math.min(Math.max(num, min), max);
}

/**
 * Validates a select/dropdown value against a whitelist of allowed values.
 * Returns the fallback if the value is not in the allowed list.
 *
 * @param {string} value - The selected value to validate.
 * @param {string[]} allowedValues - Array of permitted values.
 * @param {string} fallback - Default value returned when input is not in allowed list.
 * @returns {string} The validated value or fallback.
 *
 * @example
 * validateSelectInput('gasoline', ['gasoline', 'diesel', 'hybrid', 'electric', 'none'], 'gasoline')
 * // Returns: 'gasoline'
 *
 * @example
 * validateSelectInput('malicious', ['gasoline', 'diesel'], 'gasoline')
 * // Returns: 'gasoline'
 */
export function validateSelectInput(value, allowedValues, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  return allowedValues.includes(value) ? value : fallback;
}

/**
 * Validates data retrieved from localStorage against a structural schema.
 * Returns null and logs a warning if the data doesn't conform to the expected structure.
 *
 * @param {*} data - The parsed data from localStorage.
 * @param {Object} schema - Schema definition describing expected types.
 *   Each key maps to an expected type string ('string', 'number', 'boolean', 'object', 'array').
 * @returns {*} The validated data, or null if validation fails.
 *
 * @example
 * validateStorageData({ name: 'Test', score: 85 }, { name: 'string', score: 'number' })
 * // Returns: { name: 'Test', score: 85 }
 *
 * @example
 * validateStorageData('corrupted', { name: 'string' })
 * // Returns: null
 */
export function validateStorageData(data, schema) {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof schema !== 'object' || schema === null) {
    return data;
  }

  // For object schemas, verify the data is also an object
  if (typeof data !== 'object') {
    console.warn('[Security] Storage data failed schema validation: expected object, got', typeof data);
    return null;
  }

  // Validate each schema field
  for (const [key, expectedType] of Object.entries(schema)) {
    const value = data[key];

    if (value === undefined || value === null) {
      // Allow optional/null fields
      continue;
    }

    if (expectedType === 'array') {
      if (!Array.isArray(value)) {
        console.warn(`[Security] Storage field "${key}" failed validation: expected array, got`, typeof value);
        return null;
      }
    } else if (typeof value !== expectedType) {
      console.warn(`[Security] Storage field "${key}" failed validation: expected ${expectedType}, got`, typeof value);
      return null;
    }
  }

  return data;
}

/**
 * Creates a simple in-memory rate limiter.
 * Returns a function that returns true if the action is allowed, false if rate-limited.
 *
 * @param {number} maxActions - Maximum number of actions allowed in the time window.
 * @param {number} windowMs - Time window duration in milliseconds.
 * @returns {function(): boolean} A function that returns true if action is permitted.
 *
 * @example
 * const limiter = createRateLimiter(5, 10000); // 5 actions per 10 seconds
 * limiter(); // true (1st action)
 * limiter(); // true (2nd action)
 */
export function createRateLimiter(maxActions, windowMs) {
  const timestamps = [];

  return function isAllowed() {
    const now = Date.now();
    // Remove expired timestamps
    while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }

    if (timestamps.length >= maxActions) {
      return false;
    }

    timestamps.push(now);
    return true;
  };
}

/**
 * Validates that a challenge ID matches the expected format.
 *
 * @param {string} challengeId - The challenge ID to validate.
 * @returns {boolean} True if the ID matches the expected pattern (e.g., 'd1', 'w3', 'm2').
 *
 * @example
 * validateChallengeId('d1')  // true
 * validateChallengeId('w12') // true
 * validateChallengeId('xyz') // false
 */
export function validateChallengeId(challengeId) {
  if (typeof challengeId !== 'string') {
    return false;
  }
  return /^[dwm]\d+$/.test(challengeId);
}

// Export constants for external use
export { MAX_TEXT_LENGTH, MAX_SHORT_TEXT_LENGTH };
