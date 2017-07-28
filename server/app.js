const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const fs= require('fs');
const path = require('path');
const opn = require('opn')
app.use(bodyParser.json())
app.use(express.static(__dirname + '/../dist'));
const startHunt = require(__dirname + '/fetch')
let option, result, id;


// 开始爬取
app.post('/start', function (req, res) {
  if(id){
    clearInterval(id)
  }
  option = req.body;
  fs.writeFile(path.join(__dirname + '/utils', 'option.json'), JSON.stringify(option), function (err) {
    if (err) throw err;
    console.log('write json success');
  });
  
  let response = startHunt(option)
  id = response.id;
  result = response.results
  res.send('{"msg":"start success"}');
});

// 返回配置
app.get('/getOption', function (req, res) {
  fs.readFile(path.join(__dirname + '/utils', 'option.json'),{encoding:'utf-8'}, function (err,bytesRead) {
    if (err) throw err;
    option = JSON.parse(bytesRead);
    // res.send(JSON.stringify(option));
    res.send(bytesRead);
    console.log('read json success');
  });
});

// 返回结果
app.get('/getResults', function (req, res) {
  res.send(JSON.stringify(result||{}));
});

// 启动服务
let server = app.listen(3000, function () {
  console.log('app run success at http://localhost:3000');
  opn('http://localhost:3000')
});
