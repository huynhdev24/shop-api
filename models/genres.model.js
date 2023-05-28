const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');

// mongoose.plugin(slug);

const Schema = mongoose.Schema;

const genreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     slug: 'name',
    //     unique: true
    // }
    slug: {
        type: String,
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Genre', genreSchema);
