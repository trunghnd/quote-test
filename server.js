//this is a Node Express server
//king-prawn-app-2xlek.ondigitalocean.app
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()

const { auth } = require('./classes/hubspot/auth.js')
const { Contact } = require('./classes/hubspot/contact.js')
const { Quote } = require('./classes/hubspot/quote.js')
// const { LineItem } = require('./classes/hubspot/lineItem.js')

const { Session } = require('./classes/stripe/session.js')


const serverUrl = process.env.SERVER_URL

//setup express server
const app = express()

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

router.get('/quotes/:id', async (req, res) => {


  let id = req.params.id
  try {
    let quote = new Quote()
    await quote.load(id)
    console.log(quote)
    let session = new Session()
    await session.loadFromQuote(quote)
    res.redirect(session.data.url)
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