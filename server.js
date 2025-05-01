// server.js
const express = require('express');
const FiveM = require('./index');
const cors = require('cors');

const app = express();
app.use(cors());

// Get port from environment variable or use default
const PORT = process.env.PORT || 3001;
const SERVER_IP = process.env.SERVER_IP || '45.81.254.89:30120';

const server = new FiveM.Stats(SERVER_IP);

async function measurePing() {
  const start = Date.now();
  try {
    await fetch(`http://${SERVER_IP}/info.json`, {
      method: 'GET',
      timeout: 1000
    });
    return Date.now() - start;
  } catch (err) {
    console.error('Ping error:', err);
    return 999;
  }
}

app.get('/api/status', async (req, res) => {
  try {
    const [playerCount, maxPlayers, online, resursai, ping] = await Promise.all([
      server.getPlayers(),
      server.getMaxPlayers(),
      server.getServerStatus(),
      server.getResources(),
      measurePing()
    ]);
    
    res.json({ 
      playerCount, 
      maxPlayers, 
      online, 
      resursai,
      ping: Math.round(ping)
    });
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti serverio informacijos' });
  }
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API veikia per http://localhost:${PORT}`);
});
