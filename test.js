const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const studentId = 'sita-id'
const props = 'courses/calculus/quizzes/ye0ab61'
const dataInput = { score: 80}
tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})
tape('StudentPUT', async function (t) {

  const url = `${endpoint}/${studentId}/${props}`
  jsonist.put(url, dataInput, (err, data,res) => {

    if (err) t.error(err)
    t.ok(res, ' Student PUT Data')
    t.end()
  })
})
tape('StudentGET', async function (t) {
 
  const url = `${endpoint}/${studentId}/${props}`

  jsonist.get(url, (err, data, res) => {
    if (err) {
      t.error(err)
    } else {
      t.isEquivalent(data, dataInput, 'Student GET Data')
    }
    t.end()
  })
})
tape('StudentDELETE', async function (t) {
  
  const url = `${endpoint}/${studentId}/${props}`
  jsonist.delete(url,  (err, data) => {
  
    if (err) t.error(err)
    t.ok(data, 'Student Delete Data')
    t.end()
  })
})
tape('cleanup', function (t) {
  server.close()
  t.end()
})

