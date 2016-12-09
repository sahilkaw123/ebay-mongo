var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var home = require('./routes/home');
//var routes = require('./routes/index');
//var users = require('./routes/users');
var session = require('client-sessions');
var product = require('./routes/product');
var cart = require('./routes/cart');
var detail = require('./routes/detail');
var cart = require('./routes/cart');
var order = require('./routes/order');
var order = require('./routes/order');
var bid = require('./routes/bid');
var sell = require('./routes/sell');
var profile = require('./routes/profile');
var mongo = require('./routes/mongo');
//
var passport = require('passport');
var passportlocal = require('passport-local');
var passport1 = require('./routes/passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
//
var app = express();

//Url for session collections in mongoDb
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSession);

//all environments
app.use(expressSession({
    secret: 'cmpe273_teststring',
    resave: false,  //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
	duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: mongoSessionConnectURL
    })
})); // setting time for the session to be active when the window is open // 5 minutes
app.use(passport.initialize());
//
/*app.use(expressSession({
    secret: "CMPE273_passport",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionConnectURL
    })
}));

*/
//
app.use(session({

    cookieName: 'session',
    secret: 'cmpe273_test_string',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000, })); // setting time for the session to be active when the window is open // 5 minutes

// view engine setup
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//

app.use(app.router);
//app.use('/', routes);
//app.use('/users', users);
//mysql.createConnectionPool();

//GET
app.get('/', home.signin);
app.get('/signin', home.signin);
app.get('/homepage',home.redirectToHomepage);
//Today
app.get('/signup', home.signup);
app.get('/success', home.success);
app.get('/exists', home.exists);
app.get('/getMyProducts', product.getMyProducts);
app.get('/detail', product.detailofPage);
app.get('/detailProduct', detail.detailProduct);
app.get('/cart', cart.displayCartPage);
app.get('/displayProducts', cart.displayProducts);
app.get('/order', order.confirmOrder);
app.get('/checkOutProducts', order.checkOutProducts);
//app.get('detail', product.detailofPage);
app.get('/placeOrder', order.confirmPage);
app.get('/getCreditCardDetails', order.getCreditCardDetails);
app.get('/confirmBidPage', bid.confirmBidPage);

app.get('/bidTimeFetch', bid.bidTimeFetch);
app.get('/updateMoney', order.updateMoney);

//Bid Get
app.get('/bidProduct' , bid.bidProduct);
app.get('/bid', bid.bidPage);
//Sell Get
app.get('/sell', sell.loadSellPage);
app.get('/profile', profile.openProfilePage);
app.get('/profileDetail', profile.profileDetail);
app.get('/person', profile.person);
app.get('/personDetail', profile.personDetail);
app.get('/historyProduct',bid.historyProduct);
//app.get('/confirm',order.confirmPage);
app.get('/list',sell.listPage);
app.get('/listDetail',sell.listProd);


//POST
app.post('/checksignin' , home.checksignin);
app.get('/signout', home.logout);
app.get('/bidHistory', bid.bidHistory);

//app.post('/signout',home.logout);
//Today
app.post('/afterSignUp', home.afterSignUp);
app.post('/addProducts' , cart.addProducts);
app.post('/updatePerson' , profile.updatePerson);
//app.post('/buyProducts' , cart.buyProducts);
app.post('/detailofProducts', detail.detailofProducts);
app.post('/detailofBidProducts', detail.detailofBidProducts);
app.post('/removeProducts', cart.removeProducts);


//BID POST
app.post('/bidCmp', bid.bidCmp);
app.post('/insertProduct',sell.insertProduct);
app.post('/bidHistoryProd', bid.bidHistoryProd);

//cron jobs 
var cronjob = require('node-cron-job');


cronjob.setJobsPath(__dirname + '/routes/bid_job.js');  // Absolute path to the jobs module. 
 
cronjob.startJob('bid_job');
//
// catch 404 and forward to error handler

//logs generator
var win_logger = require('winston');

win_logger.add(
	win_logger.transports.File, {
    filename: 'logsofProg.log',
    level: 'info',
    json: true,
    eol: 'rn', // for Windows, or `eol: ‘n’,` for *NIX OSs
    timestamp: true
  }
);
//
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//app.get('/session', routes.session);
//app.get('/sessionEnd', routes.sessionEnd);

app.post('/checksignin1', function(req, res, next) {

    console.log("sahil");
    console.log(req.body.username);

    passport.authenticate('checksignin1', function(err, results, info) {
        if(results.status == "200"){
            req.session.data={"key":results.key,"name":results.name,"signInAs":results.signInAs};
        }
        res.send(results);
    })(req, res, next);
});

//connect to the mongo collection session and then create Server
mongo.connect(mongoSessionConnectURL, function(){
    console.log('Connected to mongo at: ' + mongoSessionConnectURL);
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
