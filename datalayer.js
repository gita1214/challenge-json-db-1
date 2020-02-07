
const lodash = require('lodash')
const fs = require('fs')
const dir = './data/'
module.exports = {
    putStudentData,
    getStudentData,
  deleteStudentData
}

//Data layer methods 
function putStudentData (studentId,propertyName, value, callback, opts) {

  let newjsonData
  const propsNameArray = parseSlashString(propertyName);
  const fileName=getFile(studentId);

  fs.readFile(fileName, (err, data) => {
    if (err && err.code === 'ENOENT') {
     //Files not does not exsist then callback 
      if (opts && opts.noCreate) {
        callback(err, data)
      } else {
        newjsonData = generatejsonobject(propsNameArray, value)
   
        writeToFile(fileName,JSON.stringify(newjsonData, null, 2), callback)
      }
    } else if (!err) {
    
      // File exists, merge all data after  check the validation 
      data = JSON.parse(data)
      const isPropValid = validatepropertyname(data, propsNameArray)
      if (opts && opts.noCreate && !isPropValid) {
       
        callback(null, null)
      } else {
        newjsonData =lodash.merge(data, generatejsonobject(propsNameArray, value))
      
        writeToFile(fileName,JSON.stringify(newjsonData, null, 2), callback)
      }
    }
  })
}

function getStudentData (studentId, propertyName, callback) {
  const propsNameArray = parseSlashString(propertyName);
  const fileName=getFile(studentId);
  fs.readFile(fileName, (err, data) => {
    if (err && err.code === 'ENOENT') {
      // File does not exist
      callback(err)
    } else if (!err) {
      data = JSON.parse(data)
      callback(err, checknesteddata(data, propsNameArray||null))
    }
  })
}

function deleteStudentData (studentId, propertyName,value, callback) {
  const propsNameArray = parseSlashString(propertyName);
  const fileName=getFile(studentId);
    let newjsonData;
   var opts=  {};
    opts.noCreate=true;
  fs.readFile(fileName, (err, data) => {
    if (err && err.code === 'ENOENT') {
     //Files not does not exsist then callback 
      if (opts && opts.noCreate) {
        callback(err, data)
      } else {
        newjsonData = generatejsonobject(propsNameArray, value)
        writeToFile(fileName,JSON.stringify(newjsonData, null, 2), callback)
      }
    } else if (!err) {
      // File exists, merge all data after  check the validation 
      data = JSON.parse(data)
      const isPropValid = validatepropertyname(data, propsNameArray)
      if (opts && opts.noCreate && !isPropValid) {
       
        callback(null, null)
      } else {
        newjsonData =lodash.merge(data, generatejsonobject(propsNameArray, value))
        writeToFile(fileName,JSON.stringify(newjsonData, null, 2), callback)
      }
    }
  })
 
}


//Use some Common Methods 


function parseSlashString (string) {
    return string.split('/')
  }
function getFile (name) {
    return `${dir}${name}.json`
}
  
function writeToFile ( fileName, jsonData, callback) {
  fs.writeFile(fileName, jsonData, (err, data) => {
    if (err && err.errno === -2) {
      fs.mkdir(dir, null, function (err) {
        if (!err) {
          writeToFile(fileName, jsonData , callback)
        } else {
          callback(err, null)
        }
      })
    } else {
      callback(err, data)
    }

  })
}

function generatejsonobject (jsonarray, value) {


 
  let obj = {}
  const generatedObj = obj
  const lastIndex = jsonarray.length - 1
  for (var i = 0; i < lastIndex; ++i) {
    const key = jsonarray[i]
    obj[key] = {}
    obj = obj[key]
  }
  obj[jsonarray[lastIndex]] = value
  return generatedObj;
}
function validatepropertyname (jsonobject, jsonarray) {
  const value = jsonarray.reduce((obj, prop) => {
    return obj && obj[prop]
  }, jsonobject)

  return typeof value !== 'undefined'
}

function checknesteddata (jsondata, jsonarray) {
  let nestedData = jsondata
  lodash.each(jsonarray, value => {
    if (nestedData[value]) {
      nestedData = nestedData[value]
    } else {
      nestedData = null
      return false
    }
  })
  return nestedData
}
