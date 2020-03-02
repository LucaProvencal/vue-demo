const express = require('express')
const cors = require('cors')
const serveStatic = require('serve-static')
const path = require('path')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
// const OktaJwtVerifier = require('@okta/jwt-verifier')

// const oktaJwtVerifier = new OktaJwtVerifier({
//   clientId: '{clientId}',
//   issuer: 'https://{yourOktaDomain}/oauth2/default'
// })

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
// app.use((req, res, next) => {
//   // require every request to have an authorization header
//   // if (!req.headers.authorization) {
//   //   return next(new Error('Authorization header is required'))
//   // }
//   let parts = req.headers.authorization.trim().split(' ')
//   let accessToken = parts.pop()
//   oktaJwtVerifier.verifyAccessToken(accessToken)
//     .then(jwt => {
//       req.user = {
//         uid: jwt.claims.uid,
//         email: jwt.claims.sub
//       }
//       next()
//     })
//     .catch(next) // jwt did not verify!
// })

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite'
})

// Define our Post model
// id, createdAt, and updatedAt are added by sequelize automatically
let Shape = database.define('shapes', {
  title: Sequelize.STRING,
})

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource
let userResource = finale.resource({
  model: Shape,
  endpoints: ['/shapes', '/shapes/:id']
})

// Resets the database and launches the express app on :8081
database
  .sync({ force: true })
  .then(() => {
    app.listen(8081, () => {
      console.log('listening to port localhost:8081')
    })
  })

  