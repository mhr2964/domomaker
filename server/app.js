//path : library to handle file paths
const path = require('path');
//express : mvc framework for node
const express = require('express');
//compression : gzips responses / faster file transfer
const compression = require('compression');
//serve-favicon : library to handle favicon 
const favicon = require('serve-favicon');
//body-parser : puts POST info into HTTP body
const bodyParser = require('body-parser');
//mogoose : mongodb library for node
const mongoose = require('mongoose');
//express-handlebars : express plugin for handlebars templating
const expressHandlebars = require('express-handlebars');
//helmet : security library for express
const helmet = require('helmet');


//router.js import for mvc 
const router = require('./router.js');

//connecting to a mongodb address. 
//either the one we made in Heroku or a fallback here
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';

//Connect called here.
mongoose.connect(dbURI).catch((err) => {
    if (err){
        console.log('Could not connect to db');
        throw err;
    }
});

//port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//get express mvc server object
const app = express();

//just using helmet
app.use(helmet());

//'/assets' used as a static mirror to /hosted
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

//sets favicon file path
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

//initiate compression
app.use(compression());

//parse form POST requests as 'application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({extended: false}));

//parse json body requests
app.use(bodyParser.json());

//set up handlebars and then set it as our view engine
app.engine('handlebars', expressHandlebars.engine({defaultLayout: ''}));
app.set('view engine', 'handlebars');

//sets view file path
app.set('views', `${__dirname}/../views`);

//pass the app to the router object
router(app);

//listen on the port
app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`On port ${port}`);
});

