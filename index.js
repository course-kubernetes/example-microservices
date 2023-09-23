const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openApiDocument = YAML.load('./openapi.yaml');
const SERVICE_PORT= process.env.SERVICE_PORT || 3000;
const { MongoClient, ObjectId } = require("mongodb");


// Array di esempio per i libri
let books = [];
// configurao MONGO
const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const mongoClient = new MongoClient(mongoUrl);

async function getBooks() {
  if(!mongoClient || !mongoClient.topology){
      await mongoClient.connect();
      db = mongoClient.db('corso');
  }
  var collection = db.collection('books');
  return await collection.find().toArray();
};

// Applico i middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Ottieni elenco dei libri
app.get('/books', (req, res) => {
  try {
    getBooks().then(
      (resp)=>{
          res.status(200).json(resp);
      }
    );
  }catch{
    res.status(500).send(error);
  }   
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
app.listen(SERVICE_PORT, () => {
  console.log(`Server avviato su http://localhost:${SERVICE_PORT}`);
});
