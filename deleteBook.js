async function deleteBook() {
    const bookNo = document.getElementById("deleteBookNo").value;
  
    if (!bookNo) {
      alert("Please enter a Book No.");
      return;
    }
  
    const confirmation = confirm("Are you sure you want to delete this book?");
    if (!confirmation) return;
  
    try {
      const response = await fetch(`http://localhost:3000/delete/${bookNo}`, {
        method: "DELETE",
      });
  
      const result = await response.json();
      if (response.ok) {
        document.getElementById("deleteMessage").textContent = result.message;
        document.getElementById("deleteBookNo").value = "";
      } else {
        document.getElementById("deleteMessage").textContent = result.message;
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      document.getElementById("deleteMessage").textContent = "Failed to delete book.";
    }
  }
  
