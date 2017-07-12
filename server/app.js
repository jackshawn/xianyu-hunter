var express = require('express');
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.static('../dist'));
var startHunt = require('./fetch')
var result;
// app.post('/start', function (req, res) {
//   // result = req.body
//   console.log(result.count)
//   res.send(result);
//   // res.send('{"msg":"success"}');
// });
var option = {
  target: [
    {
      name: 'kindle',
      price: {
        from: 300,
        to: 420
      }
    },
    {
      name: 'surfacepro4',
      price: {
        from: 3000,
        to: 5500
      }
    },
    {
      name: 'ipad 10.5',
      price: {
        from: 4000,
        to: 4500
      }
    }
  ],
  keyword: {
    include: '全新,未拆,送的,京东,抽奖',
    except: '几乎,基本,用过,用了,成新,9.9,差不多,仅'
  },
  time: 60000,
  email: {
    send: false,
    address: '1016812275@qq.com'
  },
  log: {
    show: true,
    color: 'green'
  }
}

  result = startHunt(option)
  console.log(result.results)

setInterval(function () {
  result.count++
},2000)
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Example app listening at http://%s:%s', host, port);
});
