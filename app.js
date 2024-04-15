'use strict';
var debug = require('debug');
const express = require('express');
const db = require('better-sqlite3')('flowers.db', { verbose: console.log });
const app = express();
const path = require('path');
const fs = require('fs').promises; // Use promises version of fs
const cors = require('cors');
const bodyParser = require('body-parser');
var logger = require('morgan');

require('dotenv').config();

db.pragma('journal_mode = WAL');

// Create the flowers table
db.exec(
  'CREATE TABLE IF NOT EXISTS flowers ( \
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    image_id TEXT, \
    image_url TEXT NOT NULL, \
    name TEXT NOT NULL, \
    purchased_from TEXT, \
    color TEXT, \
    height TEXT, \
    bloom_width TEXT, \
    tag_id INTEGER NOT NULL, \
    location_id TEXT NOT NULL, \
    notes TEXT CHECK(length(notes) <= 256), \
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, \
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL \
  );'
);

// Trigger to update updated_at on update
db.exec(`
  CREATE TRIGGER IF NOT EXISTS flowers_updated_at 
  AFTER UPDATE ON flowers
  BEGIN
    UPDATE flowers 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
  END;
`);

// db.exec(
//   'CREATE INDEX IF NOT EXISTS idx_flowers_tag_id ON flowers (tag_id), \
//   '
// )

// Create the log table
db.exec(`
  CREATE TABLE IF NOT EXISTS log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flower_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);`);

db.exec(`
    DELETE FROM log WHERE timestamp < datetime('now', '-2 years');
`);

const main = require('./routes/main');
const create = require('./routes/create');
const update = require('./routes/update');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  cors({
    origin: ['http://localhost:6550', 'http://localhost:6550'],
    credentials: false,
  })
);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// Increase the limit for JSON data
app.use(express.json({ limit: '200mb' }));

// Increase the limit for URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
// app.use(
//   bodyParser.json({
//     extended: false,
//   })
// );
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', main); // Main page
app.get('/create', create); // Create new flower page
app.get('/update', update); // Update flower page

// Retrieve all flowers
app.get('/getFlowers', async (req, res) => {
  try {
    const statement = await db.prepare('SELECT * FROM flowers');
    const rows = await statement.all();
    res.status(200).send(JSON.stringify(rows));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve a flower
app.get('/getFlower/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Getting flower', id);
    const statement = db.prepare('SELECT * FROM flowers WHERE id = ?');
    const row = await statement.get(id);
    if (row) {
      res.status(201).send(JSON.stringify(row));
    } else {
      res.status(404).send('Flower not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new flower
app.post('/createFlower', async (req, res) => {
  try {
    console.log('Adding flower', req.body);
    // const inputs = req.body.inputs;
    const statement = await db.prepare(
      'INSERT INTO flowers (image_id, image_url, name, purchased_from, color, height, bloom_width, tag_id, location_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    await statement.run(
      req.body.inputs.image_id,
      req.body.inputs.image_url,
      req.body.inputs.name,
      req.body.inputs.purchased_from,
      req.body.inputs.color,
      req.body.inputs.height,
      req.body.inputs.bloom_width,
      req.body.inputs.tag_id,
      req.body.inputs.location_id,
      req.body.inputs.notes,
    );
    res.status(201).send('Flower added successfully');
  } catch (err) {
    if (err.code.includes('SQLITE_CONSTRAINT')) {
      res.status(400).send('Duplicate entry. Required fields must be unique.');
    }
    else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Update a flower
app.put('/updateFlower/:id', (req, res) => {
  const { id } = req.params;
  const { image_id, image_url, name, purchased_from, color, tag_id, location_id, notes } = req.body;
  const query =
    'UPDATE flowers SET image_id = ?, image_url = ?, name = ?, purchased_from = ?, color = ?, tag_id = ?, location_id = ?, notes = ? WHERE id = ?';
  db.run(query, [image_id, image_url, name, purchased_from, color, tag_id, location_id, notes, id], err => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Flower updated successfully');
    }
  });
});

// Update a flower
app.put('/updateFlower', async (req, res) => {
  try {
    const { row } = req.body;
    console.log('ROW ', row);
    const statement = await db.prepare(
      'UPDATE flowers SET image_id = ?, image_url = ?, name = ?, purchased_from = ?, color = ?, height = ?, bloom_width = ?, tag_id = ?, location_id = ?, notes = ? WHERE id = ?'
    );
    const rows = await statement.run(
      row.image_id,
      row.image_url,
      row.name,
      row.purchased_from,
      row.color,
      row.height,
      row.bloom_width,
      row.tag_id,
      row.location_id,
      row.notes,
      row.whereId
    );
    res.status(201).send(rows);
  } catch (err) {
    if (err.code.includes('SQLITE_CONSTRAINT')) {
      res.status(400).send('Duplicate entry in Name, Tag ID and/or Location ID');
    }
    else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.delete('/deleteFlower/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE Param', id);
  try {
    const flowers = await db.prepare('DELETE FROM flowers WHERE id = ?');
    console.log('Deleting record', flowers);
    const rows = await flowers.run(id);
    console.log('Deleting record', rows);
    res.send('Flower deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a flower
app.delete('/deleteFlowers', async (req, res) => {
  const {checked} = req.body;

  let placeholders = '';
  for (let i = 0; i < checked.length; i++) {
    console.log(i);
    if (i > 0) {
      placeholders += ', ';
    }
    placeholders += '?';
  }
  try {
    const statement = await db.prepare(`DELETE FROM flowers WHERE id IN (${placeholders})`);
    const c = statement.run(checked);
    res.send('Flower(s) deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.set('port', process.env.PORT || 6550);

var server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
});
