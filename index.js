const express = require('express')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express()

const whitelist = ['http://localhost:3000', process.env.REACT_APP_URL, process.env.REACT_APP_URL_1]
const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
app.use(cors(corsOptions))

const connectMongoDB = require('./db')

connectMongoDB()

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const routes = require('./routes')

routes(app)

const PORT = process.env.PORT || 5000


app.listen(PORT, function() {
    console.log(`Server đang chạy PORT ${PORT}`)
})