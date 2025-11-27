const express = require('express');
const path = require('path');

const app = express();
const PORT = 3666;

// Serve static files from attacker folder
app.use(express.static(path.join(__dirname, 'attacker')));

// Start HTTP server (no HTTPS)
app.listen(PORT, () => {
  console.log(`Attacker server running on port ${PORT}`);
});
