const { response } = require('express');
var Author = require('../models/authors.model');

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
    }
} 

module.exports = importCSV;