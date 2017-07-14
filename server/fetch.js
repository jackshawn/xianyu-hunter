// 依赖模块
var http = require('https');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var nodemailer = require('nodemailer');


var startHunt = function (option) {

// 存放结果
  var results = []
  
  var transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: '745640545@qq.com',
      pass: 'euoqxnbmrjzkbfch'
    }
  });



// 检索关键词
  var checkKeyword = function (descr, keyword) {
    var include = keyword.include.split(','),
      except = keyword.except.split(','),
      included = false,
      excepted = true;
    for (var i = 0; i < except.length; i++) {
      if (descr.indexOf(except[i]) !== -1) {
        excepted = false
      }
    }
    for (var j = 0; j < include.length; j++) {
      if (descr.indexOf(include[j]) !== -1) {
        included = true
      }
    }
    return included && excepted;
  }

// 检索已存结果
  var checkResults = function (id) {
    var saved = false;
    for (var i = 0; i < results.length; i++) {
      if (results[i].id === id) {
        saved = true;
      }
    }
    return saved;
  }

// 打印结果
  var printLog = function (title) {
    var info = ''
    for (var i = 0; i < results.length; i++) {
      if (results[i].isNew) {
        info += '@' + results[i].seller + ':' + results[i].price + '\n' + results[i].time + ',' + results[i].location + '\n' + results[i].href + '\n' + results[i].descr + '\n\n'
      }
    }
    if(info){
      console.log('-----------------------------------------'+title+'-----------------------------------------');
      console.log(info)
    }
  }

// 发送结果
  var sendEmail = function (subject) {
    var mailOptions = {
      from: '"target found!!" <745640545@qq.com>',
      to: option.email.address,
      subject: subject,
      text: '',
      html: ''
    };
    for (var i = 0; i < results.length; i++) {
      if (results[i].isNew) {
        mailOptions.text = 'found';
        mailOptions.html += ('<p>@' + results[i].seller + '</p><p>' + results[i].price + '</p><a href="' + results[i].href + '">点我跳转</a></br><p>' + results[i].descr + '</p></br></br>')
      }
    }
    if(mailOptions.text){
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
      });
    }
  }

//重置
  var reset = function () {
    for (var i = 0; i < results.length; i++) {
      results[i].isNew = false;
    }
  }

// 筛选信息
  function filterItem(html,keyword, target) {
    var $ = cheerio.load(iconv.decode(Buffer.concat(html), 'gbk'));
    var items = $('.ks-waterfall')
    for (var i = 0; i < items.length; i++) {
      var item = items.eq(i);
      var descr = item.find('.item-brief-desc').text().trim();
      var id = item.find('.item-pic a').toString().substr(36,12)
      var href = 'http://h5.m.taobao.com/2shou/mtdetail/index.html?id=' + id + '&hybrid=true';
      if (checkKeyword(descr, keyword) && !checkResults(id)) {
        results.push({
          seller: item.find('.seller-nick').text().trim(),
          price: item.find('.price').find('em').text().trim(),
          time: item.find('.item-pub-time').text().trim(),
          location: item.find('.item-location').text().trim(),
          href: href,
          descr: descr,
          id: id,
          isNew: true,
          name: target
        })
      }
    }
  }

// 爬取目标
  var getInfo = function () {
    for(var i = 0;i< option.target.length;i++){
      (function () {
        var keyword = option.target[i].keyword.on ? option.target[i].keyword : option.keyword;
        var target = option.target[i];
        var url = 'https://s.2.taobao.com/list/list.htm?start=' + target.price.from + '&end=' + target.price.to + '&q=' + target.name + '&ist=1';
        http.get(url, function (res) {
          var html = [];
          res.on('data', function (data) {
            html.push(data);
          });
          res.on('end', function () {
            filterItem(html, keyword, target.name);
            if(option.log.show){
              printLog(target.name)
            }
            if(option.email.send){
              sendEmail(target.name)
            }
            reset()
          })
          res.on('error', function (e) {
            console.error('错误:' + e.message);
          });
        });
      })()
    }
  }
  
  getInfo();
  var intervalId = setInterval(getInfo, option.time[0]*1000)
  return {
    id: intervalId,
    results: results
  }
}
module.exports = startHunt
