const isRequired = (value, fieldName) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `Field '${fieldName}' is required`;
  }
  return null;
};

const isValidURL = (url) => {
  if (!url) return null;
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

const isValidDate = (date) => {
  if (!date) return null;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return 'Date must be in YYYY-MM-DD format';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return 'Invalid date';
  return null;
};

const isPositiveNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  if (isNaN(num) || num < 0) return `Field '${fieldName}' must be a positive number`;
  return null;
};

const isInRange = (value, min, max, fieldName) => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  if (isNaN(num)) return `Field '${fieldName}' must be a number`;
  if (num < min || num > max) return `Field '${fieldName}' must be between ${min} and ${max}`;
  return null;
};

const minLength = (value, min, fieldName) => {
  if (!value) return null;
  if (String(value).trim().length < min) {
    return `Field '${fieldName}' must be at least ${min} characters`;
  }
  return null;
};

const maxLength = (value, max, fieldName) => {
  if (!value) return null;
  if (String(value).trim().length > max) {
    return `Field '${fieldName}' must be at most ${max} characters`;
  }
  return null;
};

const isInteger = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return null;
  if (!Number.isInteger(Number(value))) {
    return `Field '${fieldName}' must be an integer`;
  }
  return null;
};

const sanitizeString = (value) => {
  if (!value) return value;
  return String(value)
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

module.exports = {
  isRequired,
  isValidURL,
  isValidDate,
  isPositiveNumber,
  isInRange,
  minLength,
  maxLength,
  isInteger,
  sanitizeString,
};
