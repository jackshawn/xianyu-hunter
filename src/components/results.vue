<template>
  <div>
    <panel :list="list" type="4"></panel>
    <div style="margin: 20px">
      <x-button type="primary" :show-loading="btnLoading" @click.native="loadMore">{{btnInfo}}</x-button>
    </div>
  </div>
</template>

<script>
  import {Panel, XButton} from 'vux'
  export default {
    components: {
      Panel,
      XButton
    },
    data () {
      return {
        btnLoading: false,
        btnInfo: '加载更多',
        list:[]
      }
    },
    mounted(){
    	this.getResults()
    },
    methods: {
    	loadMore(){
    		this.btnLoading = true;
    		this.btnInfo = '正在加载中...'
        this.getResults()
      },
      getResults(){
        let _this = this;
        var request = new XMLHttpRequest();
        request.open('GET', '/getResults');
        request.setRequestHeader("Content-type","application/json;charset=utf-8");
        request.send();
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              let results = JSON.parse(request.responseText);
              _this.list = [];
              for(let i = 0;i<results.length; i++){
                _this.list.push({
                  title: '@'+results[i].seller+':'+results[i].price,
                  desc: results[i].descr,
                  url: results[i].href,
                  meta: {
                    source: results[i].location,
                    date: results[i].time,
                    other: results[i].name
                  }
                })
              }
              _this.btnLoading = false;
              _this.btnInfo = '加载更多'
            } else {
              alert("发生错误：" + request.status);
            }
          }
        }
      }
    }
  }
</script>
