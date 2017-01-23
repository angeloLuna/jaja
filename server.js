  var express = require('express'),
  path = require('path'),
  app = express(),
  bodyParser = require('body-parser');;

var stripe = require("stripe")("4aG06EjCZfAfEGtoBi6p5PQdXOHzYdkn");

// app.use(express.bodyParser());
app.use(bodyParser.json());

// Set the public folders to serve public assets
app.use('/scripts', express.static('src/scripts'));
app.use('/styles', express.static('src/styles'));
app.use('/images', express.static('src/images'));
app.use('/app', express.static('src/app'))
app.use('/assets', express.static('src/assets'))
app.use('/modules', express.static('src/modules'))
app.use('/', express.static('src'))

// Catch default route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.post('/createCustomer', function (req, res) {
  var token = req.body.stripeToken; // Using Express
  stripe.customers.create({
    email: req.body.email,
    source : token,
  }).then(function (customer, error) {
    console.log("customer", customer)
    res.send(customer.id);
  })

});

//TRAER CLIENTE
app.post('/retrieveCustomer', function (req, res) {
  var perfilStripe = req.body.perfilStripe
  stripe.customers.retrieve(
    perfilStripe,
    function(err, customer) {
      res.send(customer)
    }
  );

});


//TRAER TARJETAS
app.post('/retrieveCard', function (req, res) {
  stripe.customers.listCards(req.body.perfilStripe, function(err, cards) {
    res.send(cards)
  });
});

//CREAR TARJETA
app.post('/createCard', function (req, res) {

  stripe.customers.createSource(req.body.perfilStripe, {
    source: req.body.stripeToken,
  }).then(function () {
    stripe.customers.listCards(req.body.perfilStripe, function(err, cards) {
      res.send(cards)
    });
  })



});

//BORRAR TARJETA
app.post('/deleteCard', function (req, res) {
  console.log(req.body)
  stripe.customers.deleteCard(req.body.perfilStripe, req.body.card.id).then(function () {
    stripe.customers.listCards(req.body.perfilStripe, function(err, cards) {
      res.send(cards)
    });
  });

});







app.post('/pay', function (req, res) {
console.log(req)
// Create a Customer:




  // var params= {
  //   amount: req.body.total*100, // Amount in cents
  //   currency: "mxn",
  //   source: req.body.token,
  //   description:'Jelpmi servicio agendado'
  // };
  // console.log(params);
  // var charge = stripe.charges.create(params, function(err, charge) {
  //   console.log("OK")
  //   if (err && err.type === 'StripeCardError') {
  //     // The card has been declined
  //   }
  // });

  res.send('POST request to the homepage');
});




module.exports = app;

app.listen(3000);
