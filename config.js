const dotenv = require('dotenv');
dotenv.config();
const { TOKEN, PORT, WILLEXPIRE } = process.env;
module.exports = {
  TOKEN,
  PORT,
  WILLEXPIRE,
};
