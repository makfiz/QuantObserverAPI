const dotenv = require('dotenv');
dotenv.config();
const { TGTOKEN } = process.env;
let WSClients = {};
module.exports = {
  TGTOKEN,
  WSClients
};
