function requireFields(body, fields) {
  for (const f of fields) {
    if (body[f] === undefined || body[f] === null || body[f] === "") {
      return `Missing field: ${f}`;
    }
  }
  return null;
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

module.exports = { requireFields, normalizeEmail };

