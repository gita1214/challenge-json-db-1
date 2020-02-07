const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.get('/health/', api.getHealth)
app.put('/:studentId/:propertyName(*)',api.putStudent);
app.get('/:studentId/:propertyName(*)',api.getStudent);
app.delete('/:studentId/:propertyName(*)',api.deleteStudent);
app.use(middleware.handleError)
app.use(middleware.notFound)
const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
