document.getElementById("addBookForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const bookData = {
        bookNo: document.getElementById("bookNo").value,
        bookName: document.getElementById("bookName").value,
        author: document.getElementById("author").value,
        price: parseFloat(document.getElementById("price").value),
        genre: document.getElementById("genre").value,
        publisher: document.getElementById("publisher").value,
        year: parseInt(document.getElementById("year").value)
    };

    try {
        const response = await fetch("http://localhost:3000/api/addbook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookData)
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            this.reset();
        }
    } catch (error) {
        alert("Something went wrong while adding the book.");
    }
});
