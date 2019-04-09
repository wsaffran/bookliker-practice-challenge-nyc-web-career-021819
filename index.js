document.addEventListener("DOMContentLoaded", function() {

  // VARIABLES
  let books = []
  let booksUl = document.querySelector('#list')
  let showPanel = document.querySelector('#show-panel')

  // FUNCTION CALLS
  functionBooks()

  // EVENT LISTENERS
  booksUl.addEventListener('click', showBook)
  showPanel.addEventListener('click', likeBook)

  // FUNCTIONS
  function fetchBooks() {
    return fetch('http://localhost:3000/books')
    .then(response => response.json())
  }
  function functionBooks() {
    fetchBooks()
    .then(bookArray => {
      books = bookArray
      appendAllBooks()
    })
  }
  function appendAllBooks() {
    booksUl.innerHTML = ''
    books.forEach(book => {
      booksUl.innerHTML += renderBook(book)
    })
  }
  function renderBook(book) {
    return `<li class="list-item" id=${book.id}> ${book.title} </li>`
  }

  function showBook(e) {
    books.forEach(book => {
      if (book.id == e.target.id) {
        let users = []
        book.users.forEach(user => {users.push(user.username)})
        showPanel.innerHTML = `
          <h1>${book.title}</h1>
          <img src='${book.img_url}'>
          <p>${book.description}</p>
          <p>${users.join(", ")}</p>
          <button class="button" id=${book.id}>Read Book</button>
        `
      }
    })
  }
  function likeBook(e) {
    if (e.target.className === 'button') {
      bookId = e.target.id
      users = books.find(book => book.id == bookId).users
      if (!(users.find(user => user.id == 1))) {
        users.push({"id": 1, "username": "pauros"})
        console.log(users);
        fetchReadBook(bookId, users)
      }
    }
  }
  function fetchReadBook(id, users) {
    return fetch(`http://localhost:3000/books/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        users: users
      })
    })
    .then(res => res.json())
    .then(data => {
      let book = books.find(book => book.id == id)
      let users = []
      book.users.forEach(user => users.push(user.username))
      showPanel.innerHTML = `
        <h1>${book.title}</h1>
        <img src='${book.img_url}'>
        <p>${book.description}</p>
        <p>${users.join(", ")}</p>
        <button class="button" id=${book.id}>Read Book</button>
      `
    })
  }

});
