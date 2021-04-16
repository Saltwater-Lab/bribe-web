<template>
  <div class="col-md-12" id="price_div" style="text-align: center; vertical-align: middle;">
    <div id="inner_price_div">
      <div class="price_panel" v-for="item in coins" :key="item.id">
        <img :src="item.logo" class="img-fluid">
        {{ item.ticker }}: <span id="price_panel_0">{{ item.usd }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'CoinsRow',
  data () {
    return {
      coins: [
        { id: 'frax', ticker: 'FRAX',logo: '/pics/frax.webp', usd: '---' },
        { id: 'fei-protocol', ticker: 'FEI',logo: '/pics/fei.png', usd: '---' },
        { id: 'basis-cash', ticker: 'BAC',logo: '/pics/bac.webp', usd: '---' },
        { id: 'empty-set-dollar', ticker: 'ESD',logo: '/pics/esd.webp', usd: '---' },
        { id: 'dynamic-set-dollar', ticker: 'DSD',logo: '/pics/dsd.webp', usd: '---' },
      ]
    }
  },
  async mounted () {
    const res = await api.getCoinsPrice()
    console.log(res)
    this.formatCoinsData(res)
    /*
      basis-cash: {usd: 0.311962}
      dynamic-set-dollar: {usd: 0.077057}
      empty-set-dollar: {usd: 0.178339}
      fei-protocol: {usd: 0.76293}
      frax: {usd: 1.01}
    */
  },
  methods: {
    formatCoinsData (data) {
      this.coins.map((el) => {
        el.usd = data[el.id].usd
      })

    }
  }
}
</script>

<style scoped>
.price_panel{
	display: inline-block;
	font-size: 20px;
	margin-left: 20px;
	margin-right: 20px;
  font-weight: 800;
}
.img-fluid {
  border-radius: 50px;
  width: auto;
  max-height: 50px;
  vertical-align: middle;
  top: -2px;
  position: relative;
}

</style>