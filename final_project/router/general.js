const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res.status(300).json({ message: "Registered Successfully" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here

  return res.status(300).json({ message: JSON.stringify(books, null, 4) });
});
let getAllBooks = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(JSON.stringify(books));
  }, 6000);
});

//Call the promise and wait for it to be resolved and then print a message.
getAllBooks.then((successMessage) => {
  console.log(successMessage);
});
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  const filtered_book = books[isbn];
  return res
    .status(300)
    .json({ message: JSON.stringify(filtered_book, null, 4) });
});
let getBookByISBN = new Promise((resolve, reject) => {
  let isbn = req.params.isbn;

  const filtered_book = books[isbn];

  resolve(filtered_book);
});

getBookByISBN.then((successMessage) => {
  console.log(successMessage);
});
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author.toLowerCase();

  let filtered_books = [];

  // Loop through the books object to find matching authors
  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      filtered_books.push({ isbn, ...books[isbn] });
    }
  }
  return res.status(300).json({ message: filtered_books });
});
let getBookByAuthor = new Promise((resolve, reject) => {
  let author = req.params.author.toLowerCase();

  let filtered_books = [];

  // Loop through the books object to find matching authors
  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      filtered_books.push({ isbn, ...books[isbn] });
    }
  }

  resolve(filtered_books);
});

getBookByAuthor.then((successMessage) => {
  console.log(successMessage);
});
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title.toLowerCase();

  let filtered_books = [];

  // Loop through the books object to find matching authors
  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      filtered_books.push({ isbn, ...books[isbn] });
    }
  }
  return res.status(300).json({ message: filtered_books });
});
let getBookBytitle = new Promise((resolve, reject) => {
  let title = req.params.title.toLowerCase();
  let filtered_books = [];
  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      filtered_books.push({ isbn, ...books[isbn] });
    }
  }

  resolve(filtered_books);
});

getBookBytitle.then((successMessage) => {
  console.log(successMessage);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  const filtered_book = books[isbn];
  return res.status(300).json({ message: filtered_book.reviews });
});

module.exports.general = public_users;
