var express = require('express');
var fortune = require('./lib/fortune');

var app = express();
// Установка механизма представления handlebars
var handlebars = require('express-handlebars')
    .create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// провайдер статического содержимого
app.use(express.static(__dirname + '/public'));

// установка порта для сервера
app.set('port', process.env.PORT || 3000);

// маршрут для теста
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' 
        && req.query.test === '1';
    next();
});

// маршруты
app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

// пользовательская страница 404
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

// пользовательская страница 500
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express запущен на http://localhost:' + 
    app.get('port') + '; нажмите Ctrl+C для завершения.');
});