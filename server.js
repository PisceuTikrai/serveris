// server.js
const express = require('express');
const FiveM = require('fivem-stats');
const cors = require('cors');

const app = express();
app.use(cors());

const server = new FiveM.Stats('45.81.254.89:30120');

async function measurePing() {
  const start = Date.now();
  try {
    await fetch(`http://45.81.254.89:30120/info.json`, {
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

app.listen(3001, () => {
  console.log('API veikia per http://localhost:3001');
});
