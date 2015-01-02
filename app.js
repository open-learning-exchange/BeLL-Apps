var express = require('express')
var http = require('http')
var path = require('path')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    // @todo Tie this authentication to the members database in CouchDB
    if (username === "admin" && password === "admin") // stupid example
      return done(null, {name: "admin"})

    return done(null, false, { message: 'Incorrect username.' })
  }
))

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})

//==================================================================
// Start express application
var app = express()

// all environments
app.set('port', process.env.PORT || 3000)
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.cookieParser()) 
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.session({ secret: 'securedsession' }))
app.use(passport.initialize()) // Add passport initialization
app.use(passport.session())    // Add passport initialization
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler())
}



//==================================================================
// api 

// @todo this will only work for GET operations, need to also do DELETE,
// PUT, and POST.
// http://stackoverflow.com/questions/18728039/express-req-pipe-does-not-work
app.get('/api/*', function(req, res) {
  var endpoint = require('api/' + req.path[1])
  endpoint.auth(req, res, function() {
    var apiUrl = 'http://localhost:5984';
    var url = apiUrl + req.url;
    req.pipe(request(url).pipe(res));
  })
})

//==================================================================



//==================================================================
// session routes

app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0')
})

// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user)
})

// route to log out
app.post('/logout', function(req, res){
  req.logOut()
  res.send(200)
})
//==================================================================




//==================================================================
// updater routes

var getAvailableUpdates = require('./lib/GetAvailableUpdates.js')

app.get('/get-available-updates', function(req, res) {
  getAvailableUpdates(function(err, updates) {
    if (err) return log('GetAvailableUpdates', err)
    res.send(JSON.stringify(updates))
  })
})

app.get('/run-available-updates', function(req, res) {

  var availableUpdates

  var a = function() {
    getAvailableUpdates(function(err, results){
      if (err) return log('GetAvailableUpdates', err)
      if (results.length == 0) return res.send('Nothing to do')
      availableUpdates = results
      b()
    })
  }

  // Compile a list of availableUpdates's, require them in, and run them sequentially
  var b = function() {
    if (availableUpdates.length < 1) {
      // nothing availableUpdates
      return
    }
    else {
      var i = 0
      // recursively run updates 
      function process(callback) {
        if(i == availableUpdates.length) {
          // we're all done
          res.send('ok')
        }
        else {
          var update = require(__dirname + '/scripts/' + availableUpdates[i].script)
          update(function() {
            i++
            process()
          })
        }
      }
      process()
    }           
  }
  
 

  a()

})

//==================================================================


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})
