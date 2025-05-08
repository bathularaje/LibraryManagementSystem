const request = require('supertest');
const app = require('../server'); // Adjusted path to your server.js
const mongoose = require('mongoose');

let bookId = ''; // Will hold book _id for update/delete tests
const testBookNo = '12345';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // Clean test data
  await mongoose.connection.close();
});

// Test cases
describe('Library Management System API', () => {

  // 1. Add new book
  it('should add a new book', async () => {
    const res = await request(app).post('/api/addbook').send({
      bookNo: testBookNo,
      bookName: 'Test Book',
      author: 'Test Author',
      price: 100,
      genre: 'Fiction',
      publisher: 'Test Publisher',
      year: 2023
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book added successfully!');
  });

  // 2. Reject duplicate book number
  it('should reject duplicate book number', async () => {
    const res = await request(app).post('/api/addbook').send({
      bookNo: testBookNo,
      bookName: 'Another Book',
      author: 'Another Author',
      price: 150,
      genre: 'Non-Fiction',
      publisher: 'Another Publisher',
      year: 2023
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Book No already exists.');
  });

  // 3. Reject empty form
  it('should reject empty book data', async () => {
    const res = await request(app).post('/api/addbook').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please fill in all required fields.');
  });

  // 4. Get all books
  it('should fetch all books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    bookId = res.body.find(b => b.bookNo === testBookNo)?._id;
    expect(bookId).toBeDefined();
  });

  // 5. Get book by book number
  it('should fetch book by book number', async () => {
    const res = await request(app).get(`/books/${testBookNo}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.bookNo).toBe(testBookNo);
  });

  // 6. Get non-existent book
  it('should return 404 for non-existent book', async () => {
    const res = await request(app).get('/books/00000');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });

  // 7. Update book by book number
  it('should update book details', async () => {
    const res = await request(app).put(`/books/${testBookNo}`).send({
      bookName: 'Updated Book',
      price: 120
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book updated successfully');
    expect(res.body.book.bookName).toBe('Updated Book');
  });

  // 8. Fail to update with invalid book number
  it('should fail to update invalid book number', async () => {
    const res = await request(app).put('/books/invalid').send({
      bookName: 'Invalid Book'
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });

  // 9. Delete book by book number
  it('should delete book', async () => {
    const res = await request(app).delete(`/delete/${testBookNo}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted successfully.');
  });

  // 10. Delete already deleted book
  it('should fail to delete nonexistent book', async () => {
    const res = await request(app).delete(`/delete/${testBookNo}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Book not found.');
  });
});
