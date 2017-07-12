<template>
  <div>
    <p id="user">1010614561@qq.com</p>
    <template v-for="item in targets">
      <form-preview header-label="目标" :header-value="item.name" :body-items="item.list"></form-preview>
    </template>
    <group>
      <x-switch title="输出日志" v-model="option.log.show"></x-switch>
      <x-switch title="发送邮件" v-model="option.email.send"></x-switch>
      <x-switch title="全局关键词" v-model="qwe"></x-switch>
      <x-input title="包括" v-show="qwe" type="text" placeholder="用英文逗号分隔"></x-input>
      <x-input title="排除" v-show="qwe" type="text" placeholder="用英文逗号分隔"></x-input>
      <popup-picker title="时间间隔(s)" :data="list1" v-model="option.time"></popup-picker>
    </group>
    <br>
    <div style="margin: 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="default">添加</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="primary">提交</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <x-dialog v-model="showDialog" class="dialog-demo" :scroll="false">
      <group title="确认输入">
        <x-input title="目标" type="text" placeholder="" ></x-input>
        <x-input title="最低价格" type="text" placeholder=""></x-input>
        <x-input title="最高价格" type="text" placeholder=""></x-input>
        <x-switch title="关键词" v-model="option.keyword"></x-switch>
        <x-input title="包括" v-show="qwe" type="text" placeholder="用英文逗号分隔"></x-input>
        <x-input title="排除" v-show="qwe" type="text" placeholder="用英文逗号分隔"></x-input>
      </group>
    </x-dialog>

  </div>
</template>

<script>
  import {FormPreview, Group, Tabbar, TabbarItem, Cell, XSwitch, XButton, Flexbox, FlexboxItem, XDialog, XInput, PopupPicker} from 'vux'
  export default {
    components: {
      Group,
      Tabbar,
      TabbarItem,
      Cell,
      FormPreview,
      XSwitch,
      XButton, Flexbox, FlexboxItem,XDialog, XInput, PopupPicker
    },
    data () {
      return {
      	qwe: true,
        showDialog: true,
        list1: [[10,30,60,120,300]],
        value2: [10],
        option: {
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
          time: [60],
          email: {
            send: false,
            address: '1016812275@qq.com'
          },
          log: {
            show: true,
            color: 'green'
          }
        },
        value1: false,
        list: [
          {
            label: '价格',
            value: '300-420'
          },
          {
            label: '包括',
            value: '全新,未拆,送的,京东,抽奖'
          },
          {
            label: '排除',
            value: '几乎,基本,用过,用了,成新,9.9,差不多,仅'
          }
        ]
      }
    },
    computed: {
      targets(){
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
                value: _this.option.target[i].keyword ? _this.option.target[i].keywor.include : _this.option.keyword.include
              },
              {
                label: '排除',
                value: _this.option.target[i].keyword ? _this.option.target[i].keyword.except : _this.option.keyword.except
              }
            ]
          })
        }
        return arr;
      }
    }
  }
</script>

<style scoped>
  #user {
    font: 1.8em/1.5 '';
    text-align: center;
    font-weight: bold;
    margin: 20px 0;
  }

</style>
