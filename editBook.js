async function searchBook() {
    const bookNo = document.getElementById("searchBookNo").value;
  
    if (!bookNo) {
      alert("Please enter a Book No to search.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/books/${bookNo}`);
      const book = await response.json();
  
      if (response.ok) {
        document.getElementById("editForm").style.display = "block";
        document.getElementById("bookNo").value = book.bookNo;
        document.getElementById("bookName").value = book.bookName;
        document.getElementById("author").value = book.author;
        document.getElementById("price").value = book.price;
        document.getElementById("genre").value = book.genre;
        document.getElementById("publisher").value = book.publisher;
        document.getElementById("year").value = book.year;
      } else {
        alert("Book not found.");
      }
    } catch (error) {
      alert("Error fetching book details.");
    }
  }
  
  document.getElementById("updateBookForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const bookNo = document.getElementById("bookNo").value;
    const updatedBook = {
      bookName: document.getElementById("bookName").value,
      author: document.getElementById("author").value,
      price: document.getElementById("price").value,
      genre: document.getElementById("genre").value,
      publisher: document.getElementById("publisher").value,
      year: document.getElementById("year").value,
    };
  
    try {
      const response = await fetch(`http://localhost:3000/books/${bookNo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });
  
      if (response.ok) {
        alert("Book updated successfully!");
        document.getElementById("updateBookForm").reset();
        document.getElementById("editForm").style.display = "none";
      } else {
        alert("Failed to update book.");
      }
    } catch (error) {
      alert("Error updating book.");
    }
  });
  
