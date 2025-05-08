// Fetch books from the API and display them
window.onload = async function() {
    try {
      const response = await fetch('http://localhost:3000/books'); // Fetch books data from API
  
      if (response.ok) {
        const books = await response.json();
        displayBooks(books);
      } else {
        alert('Failed to load books.');
      }
    } catch (error) {
      alert('Something went wrong while fetching the books.');
    }
  };
  
  function displayBooks(books) {
    const booksList = document.getElementById('books-list');
    
    if (books.length === 0) {
      booksList.innerHTML = '<p>No books available.</p>';
      return;
    }
    
    let html = '<table border="1" cellpadding="10" style="width: 100%;">';
    html += '<tr><th>Book No</th><th>Book Name</th><th>Author</th><th>Price</th><th>Genre</th><th>Publisher</th><th>Year</th></tr>';
    
    books.forEach(book => {
      html += `
        <tr>
          <td>${book.bookNo}</td>
          <td>${book.bookName}</td>
          <td>${book.author}</td>
          <td>${book.price}</td>
          <td>${book.genre}</td>
          <td>${book.publisher}</td>
          <td>${book.year}</td>
        </tr>
      `;
    });
    
    html += '</table>';
    booksList.innerHTML = html;
  }
  
