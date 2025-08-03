const express = require('express');
const path = require('path');
const app = express();

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});