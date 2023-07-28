const express = require('express');
const { TOKEN } = require('./config');
const router = express.Router();
const controllers = require('../../controllers/token.controller');

router.get('/', tryCatchWrapper(controllers.getToken));

function tryCatchWrapper(Fn) {
  return async (req, res, next) => {
    try {
      await Fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = router;
