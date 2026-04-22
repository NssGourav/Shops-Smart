const HttpError = require('../errors/HttpError');

class BaseService {
  ensureFound(entity, message = 'Resource not found') {
    if (!entity) {
      throw new HttpError(404, message);
    }

    return entity;
  }

  parseInteger(value, fieldName, fallback = null) {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new HttpError(400, `${fieldName} must be a valid integer`);
    }

    return parsed;
  }

  parseNumber(value, fieldName, fallback = null) {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new HttpError(400, `${fieldName} must be a valid number`);
    }

    return parsed;
  }
}

module.exports = BaseService;
