import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "PostgresDBPass",
    port: 5432
});

db.connect();

let books = "";
let monthNum = "";
let order = "";

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM books");
    books = result.rows;
    res.render("index.ejs", {books: books});
});

app.get("/add-book", async (req, res) => {
    res.render("create.ejs");
});

app.post("/add", async (req, res) => {
    switch (req.body.month) {
        case "January":
            monthNum = "01";
            break;
        case "February":
            monthNum = "02";
            break;
        case "March":
            monthNum = "03";
            break;
        case "April":
            monthNum = "04";
            break;
        case "May":
            monthNum = "05";
            break;
        case "June":
            monthNum = "06";
            break;
        case "July":
            monthNum = "07";
            break;
        case "August":
            monthNum = "08";
            break;
        case "September":
            monthNum = "09";
            break;
        case "October":
            monthNum = "10";
            break;
        case "November":
            monthNum = "11";
            break;
        case "December":
            monthNum = "12";
            break;
            default:
            break;
        }
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        review: req.body.review,
        rating: req.body.rating,
        date: `${req.body.year}-${monthNum}-${req.body.day}`,
        isbn: req.body.isbn,
    }
    await db.query(
        "INSERT INTO books (book_title, book_author, book_review, book_rating, book_date, book_isbn, date) VALUES ($1, $2, $3, $4, $5, $6 ,$7)",
        [newBook.title, newBook.author, newBook.review, newBook.rating, newBook.date, newBook.isbn, newBook.date]);
    res.redirect("/");
});



app.get("/edit-book/:id", async (req, res) => {
    const bookId = req.params.id;
    const bookToEdit = books.find((book) => bookId == book.id);
    const stringDate = JSON.stringify(bookToEdit.book_date);
    console.log(stringDate);
    const day = stringDate.substring(9, 11);
    const month = stringDate.substring(6, 8);
    let monthName = "";
    switch (month) {
        case "01":
            monthName = "January";
            break;
        case "02":
            monthName = "February";
            break;
        case "03":
            monthName = "March";
            break;
        case "04":
            monthName = "April";
            break;
        case "05":
            monthName = "May";
            break;
        case "06":
            monthName = "June";
            break;
        case "07":
            monthName = "July";
            break;
        case "08":
            monthName = "August";
            break;
        case "09":
            monthName = "September";
            break;
        case "10":
            monthName= "October";
            break;
        case "11":
            monthName = "November";
            break;
        case "12":
            monthName = "December";
            break;
            default:
            break;
        }
    const year = stringDate.substring(1, 5);
    res.render("create.ejs", {
        book: bookToEdit,
        bookDay: day,
        bookMonth: monthName,
        bookYear: year,
        bookId: bookId,
    });
});

app.post("/edit", async (req, res) => {
    const id = req.body.id;
    let monthNum = "";
    switch (req.body.month) {
        case "January":
            monthNum = "01";
            break;
        case "February":
            monthNum = "02";
            break;
        case "March":
            monthNum = "03";
            break;
        case "April":
            monthNum = "04";
            break;
        case "May":
            monthNum = "05";
            break;
        case "June":
            monthNum = "06";
            break;
        case "July":
            monthNum = "07";
            break;
        case "August":
            monthNum = "08";
            break;
        case "September":
            monthNum = "09";
            break;
        case "October":
            monthNum = "10";
            break;
        case "November":
            monthNum = "11";
            break;
        case "December":
            monthNum = "12";
            break;
            default:
            break;
        }
    const updateBook = {
        title: req.body.title,
        author: req.body.author,
        review: req.body.review,
        rating: req.body.rating,
        date: `${req.body.year}-${monthNum}-${req.body.day}`,
        isbn: req.body.isbn,
    }
    await db.query(
        `UPDATE books SET (book_title, book_author, book_review, book_rating, book_date, book_isbn, date) = ($1, $2, $3, $4, $5, $6, $7) WHERE id = ${id}`,
        [updateBook.title, updateBook.author, updateBook.review, updateBook.rating, updateBook.date, updateBook.isbn, updateBook.date]);
    res.redirect("/");
});


app.post("/titleasc", async (req, res) => {
       const result = await db.query("SELECT * FROM books ORDER BY book_title ASC");
       books = result.rows;
       order = "Title (ASC)";
       res.render("index.ejs", {books: books, order: order});
});

app.post("/ratingasc", async (req, res) => {    
        const result = await db.query("SELECT * FROM books ORDER BY book_rating ASC");
        books = result.rows;
        order = "Rating (ASC)";
        res.render("index.ejs", {books: books, order: order});
});

app.post("/dateasc", async (req, res) => { 
        const result = await db.query("SELECT * FROM books ORDER BY date ASC");
        books = result.rows;
        order = "Date (ASC)";
    res.render("index.ejs", {books: books, order: order});
});

app.post("/titledesc", async (req, res) => {
    const result = await db.query("SELECT * FROM books ORDER BY book_title DESC");
    books = result.rows;
    order = "Title (DESC)";
    res.render("index.ejs", {books: books, order: order});
});

app.post("/ratingdesc", async (req, res) => {    
     const result = await db.query("SELECT * FROM books ORDER BY book_rating DESC");
     books = result.rows;
     order = "Rating (DESC)";
     res.render("index.ejs", {books: books, order: order});
});

app.post("/datedesc", async (req, res) => { 
     const result = await db.query("SELECT * FROM books ORDER BY date DESC");
     books = result.rows;
     order = "Date (DESC)";
 res.render("index.ejs", {books: books, order: order});
});

app.post("/delete", async (req, res) => {
    const id = req.body.deletedBookId;
    await db.query(`DELETE FROM books WHERE id = ${id}`);
    res.redirect("/");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});