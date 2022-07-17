//this is a Node Express server
//king-prawn-app-2xlek.ondigitalocean.app
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const { auth } = require('./classes/hubspot/auth.js')
const { Contact } = require('./classes/hubspot/contact.js')
const { Quote } = require('./classes/hubspot/quote.js')
// const { LineItem } = require('./classes/hubspot/lineItem.js')

const { Session } = require('./classes/stripe/session.js')


const serverUrl = process.env.SERVER_URL

//setup express server
const app = express()


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_70ojqhbdnveQhlB6z2HI0jnJsiWplW3g";
app.post('/stripe-payment-status', express.raw({type: 'application/json'}),async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  let stripeSession
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      stripeSession = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      stripeSession = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      stripeSession = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed

      let quoteId = stripeSession.client_reference_id
      let quote = new Quote()
      await quote.load(quoteId)
      console.log(quote)
      // quote.data.hs_payment_status = 'PAID'
      quote.data.hs_payment_enabled = true
      quote.data.hs_payment_date = Date.now()
      
      let result = await quote.save()
      console.log(result)

      break;
    case 'checkout.session.expired':
      stripeSession = event.data.object;
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  console.log(stripeSession)
  // Return a 200 response to acknowledge receipt of the event
  response.send();
})







app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(logger('dev'))

//setup routes
var router = express.Router()

router.get('/testing', (req, res) => {

  res.send('<h1>Testing is working</h1>')

})

router.get('/success', (req, res) => {

  res.send('<h1>Payment has been made. Nicer looking page is comming soon</h1>')

})
router.post('/stripe-payment-status', (req, res) => {

  res.send('<h1>Payment has been made. Nicer looking page is comming soon</h1>')

})

router.get('/contact', async (req, res) => {
  let contact = new Contact()
  await contact.load(331151)
  console.log(contact)

  // try {
  //   await contact.load(331151)
  // } catch (error) {
  //   console.error(error);
  // }
  res.send('<h1>Testing is working</h1>')

})

router.get('/quotes/:slug', async (req, res) => {


  let slug = req.params.slug
  try {
    let quote = await Quote.search('hs_slug', slug)
    if (quote) {
      let session = new Session()
      await session.loadFromQuote(quote)
      res.redirect(session.data.url)
    } else {
      res.send('<h1>Quote not found</h1>')
    }


  } catch (error) {
    console.error(error);
    res.send('<h1>Oops</h1>')
  }


})


// router.get('/upload-file', async (req, res) => {
//   let result = await File.upload()
//   res.json('Hi')
// })


router.get('/login', async (req, res) => {

  // let cred = await auth.getAccessToken()
  console.log(req.query.code)
  let cred = await auth.login(req.query.code)
  res.json(cred)

})

//use server to serve up routes
app.use('/', router)

// launch our backend into a port
const apiPort = 80;
app.listen(apiPort, () => console.log('Listening on port ' + apiPort));


