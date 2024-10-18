const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users?.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(300).json({ message: "User successfully logged In" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn; // Get ISBN from route parameters
  const review = req.query.review; // Get review from query parameters
  console.log("req", req.query.review);
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" }); // Return if book does not exist
  }

  // Check if the book already has reviews
  if (!books[isbn].reviews) {
    books[isbn].reviews = {}; // Initialize reviews object if not present
  }

  // Add or modify the review
  books[isbn].reviews = review;

  return res.status(300).json({
    message: "Review added/modified successfully",
    reviews: books[isbn].reviews,
    book: books[isbn],
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn; // Get ISBN from route parameters

  console.log("req", req.query.review);
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" }); // Return if book does not exist
  }

  // Add or modify the review
  books[isbn].reviews = {};

  return res.status(300).json({
    message: "Delete review successfully",

    book: books[isbn],
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
