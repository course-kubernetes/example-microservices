const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openApiDocument = YAML.load('./openapi.yaml');

// Array di esempio per i libri
let books = [];

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Ottieni elenco dei libri
app.get('/books', (req, res) => {
  res.json(books);
});

// Aggiungi un nuovo libro
app.post('/books', (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});

// Ottieni dettaglio libro per ID
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  console.log("cerco per bookId:" + bookId);
  const book = books.find((book) => book.id == bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Libro non trovato' });
  }
});

// Aggiorna un libro
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = updatedBook;
    res.json(updatedBook);
  } else {
    res.status(404).json({ error: 'Libro non trovato' });
  }
});

// Cancella un libro
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const index = books.findIndex((book) => book.id == bookId);
  if (index !== -1) {
    const deletedBook = books.splice(index, 1)[0];
    res.json(deletedBook);
  } else {
    res.status(404).json({ error: 'Libro non trovato' });
  }
});

// Avvio del server
app.listen(3000, () => {
  console.log('Server avviato su http://localhost:3000');
});
