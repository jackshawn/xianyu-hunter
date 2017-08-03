// 依赖模块
const http = require('https');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode-terminal');


const startHunt = function (option) {

// 存放结果
  let results = [];
  
// 检索关键词
  let checkKeyword = function (descr, keyword) {
    let include = keyword.include.split(','),
      except,
      included = false,
      excepted = true;
    //排除关键词可为空
    if(keyword.except){
      except = keyword.except.split(',');
      for(let i of except){
        if (descr.indexOf(i) !== -1) {
          excepted = false
        }
      }
    }
    for (let i of include) {
      if (descr.indexOf(i) !== -1) {
        included = true
      }
    }
    return included && excepted;
  }

// 检索已存结果
  let checkResults = function (id) {
    let saved = false;
    for (let i of results) {
      if (i.id === id) {
        saved = true;
      }
    }
    return saved;
  }

// 打印结果
  let printLog = function () {
    if(option.log.show){
      let log = '',title;
      for (let i of results) {
        if (i.isNew) {
          title = i.name
          qrcode.generate(i.href,function (qr) {
            log += `@${i.seller}: ${i.price} \n${i.time}, ${i.title}, ${i.location} \n${i.href} \n${i.descr} \n${option.showQrcode?qr:''} \n\n`
          });
        }
      }
      if(log){
        console.log(`-------------------------------------${title}-------------------------------------`)
        console.log(log)
      }
    }
  }

// 发送结果
  let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: option.email.sourceName,
      pass: option.email.sourcePwd
    }
  });
  
  let sendEmail = function () {
    if(option.email.send){
      let mailOptions = {
        from: `"target found!!" <${option.email.sourceName}>`,
        to: option.email.address,
        subject: results[0].name,
        text: '',
        html: ''
      };
      for (let i of results) {
        if (i.isNew) {
          mailOptions.text = 'found';
          mailOptions.html += `<p>@${i.seller}</p><p>${i.price}</p><p>${i.time}, ${i.title}, ${i.location}</p>><a href="${i.href}">点我跳转</a><p>${i.descr}</p></br>`
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
  }

//重置
  let reset = function () {
    results.forEach(i => i.isNew = false)
  }

// 筛选信息
  function filterItem(html,keyword, target) {
    let $ = cheerio.load(iconv.decode(Buffer.concat(html), 'gbk'));
    let items = $('.ks-waterfall')
    for (let i = 1; i < items.length; i++) {
      let item = items.eq(i);
      let descr = item.find('.item-brief-desc').text().trim();
      let id = item.find('.item-pic a').attr('href').substr(27);
      let title = (function () {
        let t = item.find('.item-pic a').attr('title');
        if(t.indexOf('color=red') !== -1){
          return t.split('<font')[0] + t.split('font>')[t.split('font>').length - 1]
        }else{
          return t;
        }
      })()
      let href = `http://h5.m.taobao.com/2shou/mtdetail/index.html?id=${id}&hybrid=true`;
      if (checkKeyword(descr + title, keyword) && !checkResults(id)) {
        results.push({
          seller: item.find('.seller-nick').text().trim(),
          price: item.find('.price').find('em').text().trim(),
          time: item.find('.item-pub-time').text().trim(),
          location: item.find('.item-location').text().trim(),
          href: href,
          descr: descr,
          id: id,
          isNew: true,
          name: target,
          title: title
        })
      }
    }
  }

// 爬取目标
  let getInfo = function () {
    for (let i of option.target) {
      let keyword = i.keyword.on ? i.keyword : option.keyword;
      let url = `https://s.2.taobao.com/list/list.htm?start=${i.price.from}&end=${i.price.to}&q=${i.name}&ist=1`;
      http.get(url, function (res) {
        let html = [];
        res.on('data', function (data) {
          html.push(data);
        });
        res.on('end', function () {
          filterItem(html, keyword, i.name);
          printLog()
          sendEmail()
          reset()
        })
        res.on('error', function (e) {
          console.error('错误:' + e.message);
        });
      });
    }
  }
  
  getInfo();
  let intervalId = setInterval(getInfo, option.time[0]*1000)
  return {
    id: intervalId,
    results: results
  }
}
module.exports = startHunt
