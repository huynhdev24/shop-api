const mongoose = require('mongoose');

//Disabled
// const slug = require('mongoose-slug-generator');
const slugger = require('mongoose-slugger-plugin');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    bookId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     slug: 'name',
    //     unique: true
    // },
    slug: {
        type: String,
    },
    year: { type: Number },
    genre: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    author:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }],
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher'
    },
    description: { type: String },
    pages: { type: Number },
    size: { type: String },
    price: { type: Number, required: true },
    discount:  { type: Number, default: 0 },
    imageUrl: { type: String, default: 'https://itbook.store/img/books/9781617294136.png'},
    publicId: { type: String }
  
}, {
    timestamps: true
})

// create a unique index for slug generation;
// here, the slugs must be unique for each name
bookSchema.index({ name: 1, slug: 1 }, { name: 'name_slug', unique: true });
// create the configuration
const sluggerOptions = new slugger.SluggerOptions({
    // the property path which stores the slug value
    slugPath: 'slug',
    // specify the properties which will be used for generating the slug
    generateFrom: ['name', 'bookId'],
    // specify the max length for the slug
    maxLength: 100,
    // the unique index, see above
    index: 'name_slug'
  });
// add the plugin
bookSchema.plugin(slugger.plugin, sluggerOptions);

module.exports = slugger.wrap(mongoose.model('Book', bookSchema));


// Add plugins
// mongoose.plugin(slug);

// module.exports = mongoose.model('Book', bookSchema);
