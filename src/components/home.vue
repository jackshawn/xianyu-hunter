<template>
  <div>
    <tab>
      <tab-item selected @click.native="switchTab">配置信息</tab-item>
      <tab-item @click.native="switchTab">爬取结果</tab-item>
    </tab>
    <options v-show=showFirst></options>
    <results v-show=!showFirst></results>
  </div>
</template>

<script>
  import { Tab, TabItem} from 'vux'
  import options from './option.vue'
  import results from './results.vue'
  export default {
    components: {
      Tab, TabItem,
      options,
      results
    },
    data () {
      return {
        showFirst: true
      }
    },
    methods: {
    	switchTab(){
    		this.showFirst = !this.showFirst
      }
    }
  }
</script>
