require(dotenv).config()
const express = require('express')
const parser = require('body-parser')
const passport = require('passport-facebook')
const request = require('request-promise')
const Strategy = require('passport-facebook').Strategy;
const app = express()


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

passport.use(new Strategy({
    clientID: process.env.app_id,
    clientSecret: process.env.app_secret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.use(passport.Strategy)
app.get('/login/facebook',
  passport.authenticate('facebook',{scope:['publish_actions', 'manage_pages']})
)
app.post('/facebook-search', (req, res) => {
  const  { queryTerm, searchType } = req.body;

  const options = {
    method: 'GET',
    uri: 'https://graph.facebook.com/search',
    qs: {
      access_token: config.user_access_token,
      q: queryTerm,                                                                  
      type: searchType,
      fields: searchType === 'page' ? pageFieldSet : userFieldSet
    }
}
})
  request(options)
  .then(fbRes=>{
    const parsedRes = JSON.parse(fbRes).data; 
    res.json(parsedRes);
  })

  app.get('/facebook-search/:id', (req, res) => {
    
    // you need permission for most of these fields
    const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
      
    const options = {
      method: 'GET',
      uri: `https://graph.facebook.com/v2.8/${req.params.id}`,
      qs: {
        access_token: user_access_token,
        fields: userFieldSet
      }
    };
    request(options)
      .then(fbRes => {
        res.json(fbRes);
      })
  })

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  app.get('/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });
  

app.post('/submit',(req,res)=>{
    const username = req.body
})
app.listen(3000,()=>{
    console.log("app listening at 3000")
})
