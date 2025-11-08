const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const STATE_MAP = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

router.get('/', (req, res) => {
  const readyState = mongoose.connection.readyState;

  const dbInfo = mongoose.connection && mongoose.connection.host
    ? {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    : null;

  res.json({
    status: readyState === 1 ? 'ok' : 'error',
    db: {
      state: STATE_MAP[readyState] || readyState,
      info: dbInfo
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
