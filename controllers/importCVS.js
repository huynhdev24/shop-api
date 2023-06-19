const { response } = require('express');
var Author = require('../models/authors.model');
var Genre = require('../models/genres.model');
var Rating = require('../models/ratings.model');
var Book = require('../models/books.model');
var User = require('../models/users.model');
var Publisher = require('../models/publishers.model');
var cvs = require('csvtojson');
const CsvParser = require('json2csv').Parser;
var fs = require('fs');

const importCSV = {
    importAuthorCVS: async(req, res) => {
        try {
    
            var authorData = [];
            console.log(req.file.path);
            cvs()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);
                for(var x = 0; x < response.length; x++) {
                    authorData.push({
                        name: response[x].Name,
                        year: response[x].Year,
                    });
                }
                console.log(authorData)
                await Author.insertMany(authorData);
    
            })
            .catch((error) => console.log(error));
            res.send({status: 200, success: true, msg: 'thành công'});
        } catch(error) {
            res.send({status: 400, success: false, msg: error.message});
        }
    },
    importGenreCVS: async(req, res) => {
        try {
    
            var genreData = [];
            console.log(req.file.path);
            cvs()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);
                for(var x = 0; x < response.length; x++) {
                    genreData.push({
                        name: response[x].Name,
                        slug: response[x].Slug,
                    });
                }
                console.log(genreData)
                await Genre.insertMany(genreData);
    
            })
            .catch((error) => console.log(error));
            res.send({status: 200, success: true, msg: 'thành công'});
        } catch(error) {
            res.send({status: 400, success: false, msg: error.message});
        }
    },
    importRatingCVS: async(req, res) => {
        try {
    
            var ratingData = [];
            console.log(req.file.path);
            cvs()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);
                for(var x = 0; x < response.length; x++) {
                    ratingData.push({
                        user: response[x].User,
                        product: response[x].Product,
                        rating: response[x].Rating
                    });
                }
                console.log(ratingData)
                await Rating.insertMany(ratingData);
    
            })
            .catch((error) => console.log(error));
            res.send({status: 200, success: true, msg: 'thành công'});
        } catch(error) {
            res.send({status: 400, success: false, msg: error.message});
        }
    },
    importBookCVS: async(req, res) => {
        try {
    
            var bookData = [];
            console.log(req.file.path);
            cvs()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);
                for(var x = 0; x < response.length; x++) {
                    bookData.push({
                        bookId: response[x].bookId,
                        name: response[x].name,
                        year: response[x].year,
                        price: response[x].price,
                        pages: response[x].pages,
                        genre: response[x].genre,
                        author: response[x].author,
                        publisher: response[x].publisher,
                        slug: response[x].slug,
                        size: response[x].size,
                        description: response[x].description,
                        discount: response[x].discount,
                        imageUrl: response[x].imageUrl,
                        publicId: response[x].publicId,

                    });
                }
                console.log(bookData)
                await Book.insertMany(bookData);
    
            })
            .catch((error) => console.log(error));
            res.send({status: 200, success: true, msg: 'thành công'});
        } catch(error) {
            res.send({status: 400, success: false, msg: error.message});
        }
    },
    importUserCVS: async(req, res) => {
        try {
    
            var userData = [];
            console.log(req.file.path);
            cvs()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);
                for(var x = 0; x < response.length; x++) {
                    userData.push({
                        email: response[x].email,
                        service: response[x].service,
                        serviceId: response[x].serviceId,
                        password: response[x].password,
                        fullName: response[x].fullName,
                        gender: response[x].gender,
                        birthday: response[x].birthday,
                        phoneNumber: response[x].phoneNumber,
                        avatar: response[x].avatar,
                        address: response[x].address,
                        cart: response[x].cart,
                        role: response[x].role,
                        status: response[x].status
                    });
                }
                console.log(userData)
                await User.insertMany(userData);
    
            })
            .catch((error) => console.log(error));
            res.send({status: 200, success: true, msg: 'thành công'});
        } catch(error) {
            res.send({status: 400, success: false, msg: error.message});
        }
    },
    exportBookCSV: async(req, res) => {
        try {
            let books = [];
            var bookData = await Book.find();

            bookData.forEach((book) => {
                const { _id, bookId, name, year, price, pages, genre, author, publisher, slug, size, description, discount, imageUrl, publicId } = book;
                // var publisherName = await Publisher.findById(publisher);
                // let genreAll = [];
                // let authorAll = [];
                // var genreData = genre;
                // for(let i = 0; i < book.genre.length; i++) {
                //     genreAll.push(genre[i])
                // }
                // const genreAll = genre.forEach((g) => {
                //     genreAllTemp = g + '|___|';
                // })
                // console.log(genreAll);
                // for(let i = 0; i < book.author.length; i++) {
                //     authorAll.push(author[i])
                // }
                // const authorAll = author.forEach((a) => {
                //     authorAllTemp = a + '|___|';
                // })
                // console.log(authorAll);
                // books.push({ _id, bookId, name, year, price, pages, genre, author, publisher, slug, size, description, discount, imageUrl, publicId });
                books.push({ _id, bookId, name, year, price, pages, genre, author, publisher, slug, size, description, discount, imageUrl, publicId });
            })

            const csvFields = ['_id', 'bookId', 'name', 'year', 'price', 'page', 'genre', 'author', 'publisher', 'slug', 'size', 'description', 'discount', 'imageUrl', 'publicId'];
            const csvParser = new CsvParser({ csvFields });
            const csvData = csvParser.parse(books);

            // res.setHeader("Content-Type", "text/csv;charset=utf-8");
            // res.setHeader("Content-Disposition", "attachment; filename=books.csv");
            // res.setHeader("Content-Location: /data/bookstore");
            // res.status(200).end("\uFEFF" + csvData);

            fs.writeFile('data/bookstore/books.csv', "\uFEFF" + csvData, 'utf8', function(err) {
                if (err) {
                    res.send({status: 400, success: false, msg: error.message});
                } else{
                    res.status(200).send({status: 200, success: true, msg: 'thành công'});
                }
            });
            // res.status(200).end("\uFEFF" + csvData);

        } catch(error) {
            res.send({status: 400, success: false, msg: error.message});
        }
    },
} 

module.exports = importCSV;