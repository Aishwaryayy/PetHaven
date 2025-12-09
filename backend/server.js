
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser');


require('dotenv').config();

var app = express();

// Updated port to 5000
var port = process.env.PORT || 5000;


var mongoUri = process.env.MONGODB_URI;

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require('./routes')(app, router);

//mongodb connection
mongoose.connect(mongoUri)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(port, () => {
        console.log('🚀 Server running on port ' + port);
    });
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

app.listen(port);
console.log('Server running on port ' + port);

