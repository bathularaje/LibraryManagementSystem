const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

// Define Schema
const bookSchema = new mongoose.Schema({
  bookNo: { type: String, required: true, unique: true },
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  genre: { type: String },
  publisher: { type: String },
  year: { type: Number }
});

const Book = mongoose.model('Book', bookSchema);

// POST: Add new book
app.post('/api/addbook', async (req, res) => {
  try {
    const { bookNo, bookName, author, price } = req.body;

    if (!bookNo || !bookName || !author || !price) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const existing = await Book.findOne({ bookNo });
    if (existing) {
      return res.status(409).json({ message: "Book No already exists." });
    }

    const newBook = new Book(req.body);
    await newBook.save();
    res.status(200).json({ message: 'Book added successfully!' });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET: All books
app.get('/books', async (req, res) => {
    try {
      const books = await Book.find(); // Assuming your model is named 'Book'
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch books.' });
    }
  });
  
  // Get Book by Book No
app.get('/books/:bookNo', async (req, res) => {
    try {
      const book = await Book.findOne({ bookNo: req.params.bookNo });
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving book" });
    }
  });
  
  // Update Book by Book No
  app.put('/books/:bookNo', async (req, res) => {
    try {
      const book = await Book.findOneAndUpdate(
        { bookNo: req.params.bookNo },
        req.body,
        { new: true }
      );
      if (book) {
        res.status(200).json({ message: "Book updated successfully", book });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating book" });
    }
  });
// DELETE: Remove book by Book No
app.delete('/delete/:bookNo', async (req, res) => {
  const bookNo = req.params.bookNo;

  try {
    const deletedBook = await Book.findOneAndDelete({ bookNo });

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book." });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
module.exports = app;
