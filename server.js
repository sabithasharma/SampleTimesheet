// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var mysql = require('mysql');
var io = require('socket.io');
var nodeMailer = require('./nodeMailer');
var fs = require('fs');
var multer  = require('multer')

// Get our API routes
const api = require('./server/routes/api');

const app = express();

var connection = mysql.createConnection({
  host: 'localhost', //mysql database host name
  user: 'root', //mysql database user name
  password: '', //mysql database password
  database: 'test' //mysql database name
});

connection.connect(function (err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
});

app.use(function(req, res, next) {
  //set headers to allow cross origin request.
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/*app.get('/fileupload', (req, res) => {
  var form = new formidable.IncomingForm();
  console.log("form =" +form);
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './EmployeeImage' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });
  });
});*/

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);


/*const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));*/
var server = app.listen(3000, "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

io = io.listen(server);

io.sockets.on("connection", function (socket) {
  console.log("sad");
  var message_to_client = {
    data: "Connection with the server established"
  }
  console.log(JSON.stringify(message_to_client));
  socket.send(JSON.stringify(message_to_client));
  console.log('Socket.io Connection with the client established');


  socket.on("message", function (data) {
    data = JSON.parse(data);
    console.log("switch case =" + JSON.stringify(data));
    switch (data.type) {
      case "createTable": createTable(socket, data);
        break;
      case "loginInfo": validateLogin(socket, data);
        break;
      case "timesheetInfo": saveTimesheet(socket, data);
        break;
      case "fetchTimesheet": fetchTimesheet(socket, data);
        break;
      case "submitTimesheet": submitTimesheet(socket, data);
        break;
      case "saveProject": saveProject(socket, data);
        break;
      case "fetchProjectList": fetchProjectList(socket, data);
        break;
      case "fetchEmployeeList": fetchEmployeeList(socket, data);
        break;
      case "imageUpload": imageUpload(socket, data);
        break;
    }
    console.log(data);
  });
});

/*function imageUpload(socket, data) {
  //var data = data.file; 
  console.log ("data type =" + data.type);
  console.log ("data file=" + JSON.stringify(data.file));
  var Name = data.fileName;
  var Files = {
    Name: {}
  };
  Files.Name = {  //Create a new Entry in The Files Variable
    FileSize: data.fileSize,
    Data: "",
    Downloaded: 0
  }
  var Place = 0;
  try {
    var Stat = fs.statSync('EmployeeImage/' + Files.Name);
    if (Stat.isFile()) {
      Files.Name.Downloaded = Stat.size;
      Place = Stat.size / 524288;
    }
  }
  catch (er) { } //It's a New File
  fs.open("EmployeeImage/" + Name, "a", 0755, function (err, fd) {
    if (err) {
      console.log(err);
    }
    else {
      Files.Name.Handler = fd; //We store the file handler so we can write to it later
      socket.emit('MoreData', { 'Place': Place, Percent: 0 });
    }
  });
}*/
function imageUpload(socket, data) {
  var tempPath =  data.filePath,
    targetPath = path.resolve('EmployeeImage/' + data.fileName);
    fs.rename(tempPath, targetPath, function (err) {
      if (err) throw err;
      console.log("Upload completed!");
    });
}

app.post('/fileupload/', function(req, res) {
  console.log("************in upload"); 
  
        var storage = multer.diskStorage({
                destination: 'EmployeeImage/',
                filename: function (req, file, cb) {
                  console.log ("req = " + req.files['sabitha']);
                  console.log("filename =" + file.fieldname);
                  cb(null, file.fieldname)
                }
              
            });
       var upload = multer({ storage : storage}).any();            
            upload(req,res,function(err) {
                if(err) {
                    console.log(err);
                    return res.end("Error uploading file.");
                } else {
                   req.files.forEach( function(f) {
                    console.log("moving files");
                     console.log(f);
                     // and move file to final destination...  
                   });
                  res.end("File has been uploaded");
                }
                });
  
      });

function createTable(socket, data) {
  var query = 'CREATE TABLE IF NOT EXISTS ' + data.tableName + ' ( \
    userId INT NOT NULL, \
    dates VARCHAR(500) NOT NULL UNIQUE, \
    normal INT , \
    overtime1 INT , \
    overtime2 INT , \
    vacationLeave INT , \
    sickLeave INT , \
    childCareLeave INT , \
    project VARCHAR(500),\
    dateNumber VARCHAR(50) UNIQUE,\
    month VARCHAR (50), \
    year VARCHAR (50) )';
  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) throw error;
    if (results) {
    }
  });
}

function validateLogin(socket, data) {
  var query = 'SELECT * FROM user WHERE username =' + "'" + data.username + "'" +
    ' AND password = ' + "'" + data.password + "'";
  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) throw error;
    if (results && results.length > 0) {
      results[0].type = "loginInfo";
      console.log("results = " + JSON.stringify(results[0]));
      socket.send(JSON.stringify(results));
    } else {
      var results = {};
      results.type = "loginInfoFailed";
      socket.send(JSON.stringify(results));
    }
  });
}

function saveTimesheet(socket, data) {
  var query = 'INSERT INTO ' + data.tableName + ' (userId, dates, normal, overtime1, overtime2, vacationLeave, sickLeave, childCareLeave, project, dateNumber, month, year) VALUES (' +
    data.userId + ',' + '"' + data.dates + '"' + ',' + data.normal + ',' + data.overtime1 + ',' +
    data.overtime2 + ',' + data.vacationLeave + ',' + data.sickLeave + ',' + data.childCareLeave + ', ' + '"' +
    data.project + '"' + ',' + data.dateNumber + ',' + data.month +
    ',' + data.year + ')';

  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) {
      console.log("err in insert dates exists");
      var updateQuery = 'UPDATE ' + data.tableName + ' SET normal = ' +
        data.normal + ',' + 'overtime1 = ' + data.overtime1 + ',' + 'overtime2 = ' + data.overtime2 + ',' +
        'vacationLeave = ' + data.vacationLeave + ',' + 'childCareLeave = ' + data.childCareLeave + ',' +
        'sickLeave = ' + data.sickLeave + ',' + 'project = ' + '"' + data.project + '"' + ',' +
        'dateNumber =' + data.dateNumber + ',' + 'month = ' + data.month + ',' + 'year = ' + '"' +
        data.year + '"' + ' WHERE userId = ' + data.userId + ' AND dates = ' + "'" + String(data.dates) + "'";
      console.log("update query = " + updateQuery);
      connection.query(updateQuery, function (error, results, fields) {
        console.log("database returned" + JSON.stringify(results));
      });
    } else {
      console.log("in else insert dates exists" + data.dateValue);
    }
  });
}

function fetchTimesheet(socket, data) {
  var query = 'SELECT * FROM ' + data.tableName + ' WHERE userId =' + "'" + data.userId + "'";
  /*var query = 'SELECT * FROM ' + data.tableName + ' WHERE userId =' + "'" + data.userId + "'" + 'AND dates > \ '
  + '"' + data.startDate + '"' + ' AND dates < ' + '"' + data.endDate + '"';*/

  //SELECT * FROM `vishal222` WHERE userid = "222" AND dates > "1/1/2018" AND dates < "5/1/2018"

  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) throw error;
    if (results && results.length > 0) {
      results[0].type = "fetchTimesheet";
      socket.send(JSON.stringify(results));
    } else {
      var results = {};
      results.type = "fetchtimesheetfailed";
      socket.send(JSON.stringify(results));
    }
  });
}

function submitTimesheet(socket, data) {
  nodeMailer.sendMail(data.managerEmail, data.username, data.tableName);
}

function saveProject(socket, data) {
  // UPDATE test.user SET projects = '["projects1","projects2"]' WHERE userid = 111;
  var query = 'UPDATE test.user SET projects = ' + '"' + data.projects + '"' + ' WHERE userId = ' + "'" + data.userId + "'";
  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) throw error;
    if (results) {
      results = [{ type: "" }]
      results[0].type = "saveProjectSuccess";
      socket.send(JSON.stringify(results));
    } else {
      var results = {};
      results.type = "saveProjectFailed";
      socket.send(JSON.stringify(results));
    }
  });
}

function fetchProjectList(socket, data) {
  var query = 'SELECT projects FROM test.user WHERE userId = ' + data.userId;
  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) throw error;
    if (results) {
      results[0].type = "fetchProjectSuccess";
      socket.send(JSON.stringify(results));
    } else {
      var results = {};
      results.type = "fetchProjectFailed";
      socket.send(JSON.stringify(results));
    }
  });
}

function fetchEmployeeList(socket, data) {
  var query = 'SELECT * FROm user where managerEmail =' + '"' + data.managerEmail + '"';
  console.log(query);
  connection.query(query, function (error, results, fields) {
    console.log("database returned" + JSON.stringify(results));
    if (error) throw error;
    if (results) {
      results[0].type = "fetchEmployeeListSuccess";
      socket.send(JSON.stringify(results));
    } else {
      var results = {};
      results.type = "fetchEmployeeListFailed";
      socket.send(JSON.stringify(results));
    }
  });
}


