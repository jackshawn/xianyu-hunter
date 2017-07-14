const express = require('express');
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static('../dist'));
const startHunt = require('./fetch')
let result, id;

// 开始爬取
app.post('/start', function (req, res) {
  if(id){
    clearInterval(id)
  }
  let response = startHunt(req.body)
  id = response.id;
  result = response.results
  res.send('{"msg":"start success"}');
});

// 返回结果
app.get('/getResults', function (req, res) {
  res.send(JSON.stringify(result));
});

// 启动服务
let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
