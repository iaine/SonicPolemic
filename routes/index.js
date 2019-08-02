var express = require('express');
var router = express.Router();
var fs = require('fs');

var co = [];

//allow into the global scope. let doesn't quite do it.
var coord = new Map();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET project listing page.
*  List of all the projects in the site
*/
router.get('/project', function(req, res, next) {
  //@todo: Get a list of all projects
  let projects =['title', 'title2', 'enmi']
  res.render('projects', { title: 'Projects', project: projects });
});

/*
* GET poto (Plain Old Timeline Object) page.
*/
router.get('/poto', function(req, res, next) {
  //@todo: Get a list of all projects
  res.render('poto', { title: 'Plain Old Timeline'});
});

/* GET project page.
*  Listen to the individual project page and tweets.
*  If no data, create new project? or just error page?
*/
router.get('/project/:id', function(req, res, next) {
  let _title = req.params.id;
  //@todo: alter this to read a database. Get by id and userid.
  //@todo: capture and create mean positions for all coordinates in an id group
  co.push( { 'x': '108', 'y': '52', 'z': '100' });
  res.render('project', { title: _title, coords: JSON.stringify(co), variables: ['','OK', 'REF', 'Q', 'KO'] });
});

/**
 * Access the data file through an endpoint.
 */
router.get('/data/:id', function(req, res, next) {
  //@todo: handle failure here. Provide a message.
  let _title = req.params.id;
  let fileData = fs.readFileSync('./data/' + _title, 'utf-8');
  res.json(fileData);
});

/* POST project page.
*  Listen to the individual project page and tweets.
*  If no data, create new project?
*/
router.post('/project/:id', function(req, res, next) {
  let _title = req.params.id;
  co.push({'x':req.body.x, 'y': req.body.y, 'z': req.body.z,
    'symbol': req.body.filter, 'freq': req.body.note});
  res.render('project', { title: _title, coords: JSON.stringify(co), variables: ['','OK', 'REF', 'Q', 'KO']  });
});

/* GET client page.
*  User will need to login in and be able to tweet.
*
*/
router.get('/client', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
*  GET the drag and drop interface
*/
router.get('/drag/:id', function(req, res, next) {
  const datasource = req.params.id;
  res.render('drag', { title: 'Mixer', datasource:datasource });
});

module.exports = router;
