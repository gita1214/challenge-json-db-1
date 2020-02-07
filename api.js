
const datalayer = require('./datalayer');
module.exports = {
  getHealth,
  putStudent,
  getStudent,
  deleteStudent
}
async function getHealth (req, res, next) {
  res.status(200).json({ success: true })
}
async function putStudent (req, res) {

 
  const value = req.body;
 
  datalayer.putStudentData(req.params.studentId, req.params.propertyName, value, (err, data) => {  
    if (!err) {
      res.status(200).json({ success: true })
    } else {
      res.status(500).send(err)
    }
   })

}
async function getStudent (req, res) {

  datalayer.getStudentData(req.params.studentId,req.params.propertyName, (err, data) => {
    if (!err && data) {
      res.status(200).json(data)
    } else {
      res.sendStatus(404)
    }
  })

}
async function deleteStudent (req, res) {
 
  const value = req.body;
  datalayer.deleteStudentData(req.params.studentId, req.params.propertyName,value, (err, data) => {
    if (err) {
      res.status(404).send(err)
    } else {
      res.status(200).json({ success: true })
    }
  })

}