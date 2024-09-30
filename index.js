const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

// Fehlerbehandlung für "EADDRINUSE"
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} ist bereits in Benutzung`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Middleware, um JSON-Daten zu parsen
app.use(express.json());

// Einfacher GET-Endpunkt
app.get('/', (req, res) => {
  res.send('Willkommen bei meinem REST-Service!');
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

let items = [];

// GET: Alle Items abrufen
app.get('/items', (req, res) => {
  res.json(items);
});

// GET: Einzelnes Item abrufen
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
  
    let itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      res.json(items[itemIndex]);
    } else {
      res.status(404).json({ message: 'Item nicht gefunden' });
    }
  });

// POST: Neues Item hinzufügen
app.post('/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT: Item aktualisieren
app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;

  let itemIndex = items.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    items[itemIndex] = updatedItem;
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: 'Item nicht gefunden' });
  }
});

// DELETE: Item löschen
app.delete('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Item nicht gefunden' });
  }
});

// Fehler-Handling für 404 - Nicht gefundene Routen
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ressource nicht gefunden' });
  });
  
  // Fehlerbehandlung
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Interner Serverfehler' });
  });
  
