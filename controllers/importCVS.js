const { response } = require('express');
var Author = require('../models/authors.model');
var Genre = require('../models/genres.model');
var Rating = require('../models/ratings.model');
var Book = require('../models/books.model');
var cvs = require('csvtojson');

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
    }
} 

module.exports = importCSV;