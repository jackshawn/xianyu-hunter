<template>
  <div>
    <panel :list="list" type="4"></panel>
  </div>
</template>

<script>
  import {Panel} from 'vux'
  
  export default {
    components: {
      Panel

    },
    data () {
      return {
        msg: 'Hello World!',
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
          time: 60000,
          email: {
            send: false,
            address: '1016812275@qq.com'
          },
          log: {
            show: true,
            color: 'green'
          }
        },
        type: '1',
        list: [
          {
            title: '1440',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
            url: 'http://h5.m.taobao.com/2shou/mtdetail/index.html?id=544826575080&hybrid=true'
          },
          {
            title: '标题二',
            desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
            url: '/component/cell',
            meta: {
              source: '来源信息',
              date: '时间',
              other: '其他信息'
            }
          }
        ]
      }
    }
  }
</script>

<style>

</style>
