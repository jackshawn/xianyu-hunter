<template>
  <div>
    <p id="user" v-show="option.email.send">{{option.email.address}}</p>
    <template v-for="(item,index) in targets">
      <form-preview header-label="目标" :header-value="item.name" :body-items="item.list"
                    @click.native="showItem(index)"></form-preview>
    </template>
    <group>
      <x-switch title="输出日志" v-model="option.log.show"></x-switch>
      <x-switch title="显示二维码" v-model="option.showQrcode"></x-switch>
      <x-switch title="发送邮件" v-model="option.email.send"></x-switch>
      <x-input title="发件邮箱地址" v-show="option.email.send" v-model="option.email.sourceName" type="text" placeholder="接受邮件的邮箱地址"></x-input>
      <x-input title="发件邮箱授权密码" v-show="option.email.send" v-model="option.email.sourcePwd" type="text" placeholder="发送邮件邮箱客户端授权密码"></x-input>
      <x-input title="收件邮箱" v-show="option.email.send" v-model="option.email.address" type="text" placeholder="接受邮件的邮箱地址"></x-input>
      <x-switch title="全局关键词" v-model="option.keyword.on"></x-switch>
      <x-input title="包括" v-show="option.keyword.on" v-model="option.keyword.include" type="text" placeholder="用英文逗号分隔"></x-input>
      <x-input title="排除" v-show="option.keyword.on" v-model="option.keyword.except" type="text" placeholder="用英文逗号分隔,可以为空"></x-input>
      <popup-picker title="时间间隔(s)" :data="timeList" v-model="option.time"></popup-picker>
    </group>
    <br>
    <div style="margin: 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="default" @click.native="addItem">添加</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary" @click.native="submit">提交</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <x-dialog v-model="showDialog" hide-on-blur>
      <group>
        <x-input title="目标" type="text" placeholder="" v-model="itemData.name"></x-input>
        <x-input title="最低价格" type="text" placeholder="" v-model="itemData.price.from"></x-input>
        <x-input title="最高价格" type="text" placeholder="" v-model="itemData.price.to"></x-input>
        <x-switch title="指定关键词" v-model="itemData.keyword.on"></x-switch>
        <x-input title="包括" v-show="itemData.keyword.on" v-model="itemData.keyword.include" type="text"
                 placeholder="用英文逗号分隔"></x-input>
        <x-input title="排除" v-show="itemData.keyword.on" v-model="itemData.keyword.except" type="text"
                 placeholder="用英文逗号分隔,可以为空"></x-input>
      </group>
      
      <div style="margin: 20px">
        <flexbox>
          <flexbox-item>
            <x-button type="warn" :disabled="deleBtnState" @click.native="deleItem">删除</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" @click.native="saveItem">确定</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </x-dialog>
    <toast v-model="showAlert" type="warn" :time="2000">输入不能为空</toast>
  </div>
</template>

<script>
  import {
    FormPreview, Group, Tabbar, TabbarItem, Cell, XSwitch, XButton, Flexbox, FlexboxItem, XDialog, XInput, PopupPicker, Toast
  } from 'vux'
  export default {
    components: {Group, Tabbar, TabbarItem, Cell, FormPreview, XSwitch, XButton, Flexbox, FlexboxItem, XDialog, XInput, PopupPicker, Toast
    },
    data () {
      return {
        showDialog: false,
        showAlert: false,
        deleBtnState: true,
        timeList: [[10, 30, 60, 120, 300]],
        option: undefined,
        itemData: {
          index: 0,
          name: '',
          price: {
            from: '',
            to: ''
          },
          keyword: {
            on: false,
            include: '',
            except: ''
          }
        },
        targets: []
      }
    },
    methods: {
      initTargets(){
        let arr = [],
          _this = this;
        for (let i = 0; i < _this.option.target.length; i++) {
          arr.push({
            name: _this.option.target[i].name,
            list: [
              {
                label: '价格',
                value: _this.option.target[i].price.from + '-' + _this.option.target[i].price.to
              },
              {
                label: '包括',
                value: _this.option.target[i].keyword.on ? _this.option.target[i].keyword.include : _this.option.keyword.include
              },
              {
                label: '排除',
                value: _this.option.target[i].keyword.on ? _this.option.target[i].keyword.except : _this.option.keyword.except
              }
            ]
          })
        }
        this.targets =  arr;
      },
      showItem(index){
        this.showDialog = true;
        this.deleBtnState = false;
        let target = this.option.target[index];
        this.itemData.index = index
        this.itemData.name = target.name
        this.itemData.price.from = target.price.from
        this.itemData.price.to = target.price.to
        this.itemData.keyword.on = target.keyword.on;
        if (target.keyword.on) {
          this.itemData.keyword.include = target.keyword.include;
          this.itemData.keyword.except = target.keyword.except
        }else{
          this.itemData.keyword.include = this.option.keyword.include;
          this.itemData.keyword.except = this.option.keyword.except
        }
      },
      addItem(){
        this.showDialog = true;
        this.deleBtnState = true;
        let i = this.option.target.length;
        this.itemData = {
        	index: i,
          name: '',
          price: {
            from: '',
            to: ''
          },
          keyword: {
            on: false,
            include: '',
            except: ''
          }
        }
      },
      saveItem(){
      	let _this = this
        let showAlert = function () {
          _this.showAlert = true;
        }
        let save = function () {
          let i = _this.itemData.index;
          _this.option.target[i] = {
            name: '',
            price: {
              from: '',
              to: ''
            },
            keyword: {
              on: false,
              include: '',
              except: ''
            }
          }
          _this.option.target[i].name = _this.itemData.name;
          _this.option.target[i].price.from = _this.itemData.price.from;
          _this.option.target[i].price.to = _this.itemData.price.to;
          if(_this.itemData.keyword.on){
          	_this.option.target[i].keyword = {
          		on: true,
          		include: _this.itemData.keyword.include,
              except: _this.itemData.keyword.except
            }
          }else{
            _this.option.target[i].keyword = {
              on: false,
              include: _this.option.keyword.include,
              except: _this.option.keyword.except
            }
          }
          _this.initTargets()
          _this.showDialog = false;
        }
        if (_this.itemData.keyword.on) {
          if (_this.itemData.name && _this.itemData.price.from && _this.itemData.price.to && _this.itemData.keyword.include) {
            save()
          } else {
            showAlert()
          }
        } else {
          if (_this.itemData.name && _this.itemData.price.from && _this.itemData.price.to) {
            save()
          } else {
            showAlert()
          }
        }
      },
      deleItem(){
      	let index = this.itemData.index
        for(let i = 0;i<this.option.target.length;i++){
      		if(i===index){
            this.option.target.splice(i, 1)
          }
        }
        this.initTargets()
        this.showDialog = false;
      },
      submit(){
      	let option = this.option;
        let request = new XMLHttpRequest();
        request.open('POST', '/start');
        request.setRequestHeader("Content-type","application/json;charset=utf-8");
        request.send(JSON.stringify(option));
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              console.log(JSON.parse(request.responseText));
            } else {
              alert("发生错误：" + request.status);
            }
          }
        }
      }
    },
    mounted(){
    	let _this = this;
      let request = new XMLHttpRequest();
      request.open('GET', '/getOption');
      request.setRequestHeader("Content-type","application/json;charset=utf-8");
      request.send();
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 200) {
            _this.option = JSON.parse(request.responseText);
            _this.initTargets()
            _this.submit()
          } else {
            alert("发生错误：" + request.status);
          }
        }
      }
    }
  }
</script>

<style scoped>
  #user {
    font-size: 1.5em;
    line-height: 1.5em;
    text-align: center;
    font-weight: bold;
    margin: 20px 0;
  }
</style>
