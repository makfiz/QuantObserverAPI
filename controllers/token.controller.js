const { WILLEXPIRE, TOKEN } = require('../config');

async function getToken(req, res, next) {
  if (Date.now() > Date.parse(WILLEXPIRE)) {
    return res.status(403).json({
      message: 'Access is denied',
    });
  }
  return res.status(200).json({ TOKEN });
}

module.exports = {
  getToken,
};
