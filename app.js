const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { PORT } = require('./config');
const tokenRouter = require('./routes/API/token');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/get/token', tokenRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running. Use our API on PORT: ${PORT}`);
});
