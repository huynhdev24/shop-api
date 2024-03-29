
const genreRouter = require('./genre.js')
const publisherRouter = require('./publisher')
const authorRouter = require('./author')
const bookRouter = require('./book')
const userRouter = require('./user')
const authRouter = require('./auth')

const orderRouter = require('./order');
const voucherRouter = require('./voucher');
const analyticRouter = require('./analytics');
const historyRouter = require('./history');
const importRouter = require('./cvstojson.js');
const ratingRouter = require('./ratings');
const pythonRouter = require('./pythons.js');
const recommendRouter = require('./recommend.js');
function routes(app) {
    
    app.use('/api/v1/genres', genreRouter);
    app.use('/api/v1/publishers', publisherRouter);
    app.use('/api/v1/authors', authorRouter);
    app.use('/api/v1/books', bookRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/auth', authRouter);

    app.use('/api/v1/orders', orderRouter);
    app.use('/api/v1/vouchers', voucherRouter);
    app.use('/api/v1/analytics', analyticRouter);
    app.use('/api/v1/history', historyRouter);
    app.use('/api/v1/import', importRouter);
    app.use('/api/v1/rating', ratingRouter);
    app.use('/api/v1/pythons', pythonRouter);
    app.use('/api/v1/recommend', recommendRouter);

    app.use('*', function(req, res) {
        res.status(404).json({
            error: 404,
            message: 'Not Found'
        })
    })
   
}

module.exports = routes;