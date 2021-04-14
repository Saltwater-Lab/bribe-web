<template>
  <div class="card" :class="{finished}">
    <!-- <img :src="topIcon" class="card__top-icon"> -->
    <div class="card__header">
      <h2 class="card__title">{{ title }}</h2>
    </div>
    <div class="card__body">

      <div class="stake-organiser -stats-flex">
        <div class="stats">
          <span class="stat -pc"><i class="fas fa-dollar-sign"></i><span class="staked-pair-balance-holder"
              id="stakedStatistic">-,---,--- </span></span>
          <small>Total Staked</small>
        </div>
        <div class="stats">
          <span class="stat -pc"><span class="apy-holder" id="singleAPY">---</span><i
              class="fas fa-percentage"></i></span>
          <small> APY</small>
        </div>
      </div>


      <div class="card__currencies">
        <!-- <div class="card__bribe-icon">
          <img src="/pics/roobee.png">
        </div> -->
        <img :src="currencyIcon" class="card__currency-icon">
        <img v-if="currencyIcon2" :src="currencyIcon2" class="card__currency-icon">
      </div>

      <div class="stake-organiser left">
        <small>Your Stake: <i class="fas fa-dollar-sign"></i><span id="stakedSingle">0.000000</span></small>
      </div>
      <!-- <div class="stake-organiser right">
        <small>Your Stake: <i class="fas fa-dollar-sign"></i><span id="stakedSingle">0.000000</span></small>
      </div> -->

      <input :placeholder="`Deposit ${inputType}`" class="deposit__input" v-model="amount" type="number">

      <div class="stake-organiser -fx-tab">
        <small class="left">BRIBE Rewards: <i class="fas fa-dollar-sign"></i><span
            id="pairRewardsValue">0.000000</span></small>
        <small @click="performClaim(this)" class="claim-reward-balance"><i
            class="fas fa-star"></i>&nbsp;Claim</small>
      </div>

      <div @click="doStake('uniswap')" class="stake-organiser -small-buy-trig-uniswap uniswap-msg">
        <span v-if="showUniswapMsg">Provide liquidity to {{ inputType }} pair on Uniswap</span>
        <!-- <span v-else><br /><br /></span> -->
      </div>
      <div class="stake-organiser -btn-flex actions">
        <a class="btn primary" @click="doStake('deposit')">
          Deposit
        </a>
        <a class="btn sec" @click="doStake('withdraw')">
          Withdraw
        </a>
      </div>
    </div>
    <!-- <div class="card__footer">
      <div class="double">
        <span class="title">Daily BRIBE pool</span>
        <span class="value">{{ dailyPool }} BRIBE</span>
      </div>
      <router-link :to="farmLink" class="start" :class="{finished}">{{ finished ? 'FINISHED' : 'START FARMING' }}</router-link>
    </div> -->
  </div>
</template>
<script>
import moment from 'moment'
import {mapState} from 'vuex'

export default {
  props: ['title', 'farmLink', 'topIcon', 'currencyIcon', 'currencyIcon2', 'dailyPool', 'finished', 'inputType'],

  data() {
    return {
      timeLeft: 0,
      finishPeriodInterval: null,
      amount: null
    }
  },

  created() {
    if (!this.finished)
      this.startFinishPeriodTimer();
  },

  computed: {
    ...mapState(['rewardsEndIn']),
    showUniswapMsg () {
      return this.inputType.includes('-')
    }
  },

  methods: {
    startFinishPeriodTimer() {
      if (this.rewardsEndIn - moment().unix() > 0) {
        this.finishPeriodInterval = setInterval(() => {
          let delta = this.rewardsEndIn - moment().unix();
          const days = Math.floor(delta / 86400);
          delta -= days * 86400;
          const hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;
          const minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;
          const seconds = delta % 60;
          this.timeLeft = `${days < 10 ? `0${days}` : days}:${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        }, 1000);
      } else {
        clearInterval(this.finishPeriodInterval);
        this.timeLeft = 0;
      }
    },
    performClaim () {},
    doStake () {}
  }
}
</script>

<style lang="scss" scoped>
.card {
    background: #fff;
    border: 2px solid rgba(107,251,147,.5);
    border-radius: 10px;
    margin: 20px;
    position: relative;
    min-width: 359px;
}

.card.finished:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 96px;
    height: 96px;
    transform: translate(-40%,-40%);
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url(/pics/finished.svg);
}
.card__top-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 68px;
    height: 68px;
    transform: translate(50%,-50%);
}
.card__header {
    padding: 23px 20px 12px;
    font-weight: 500;
    font-size: 18px;
    line-height: 140%;
    color: #000;
}
.card__header {
  border-bottom: 2px solid #6bfb93;
}
.card__body, .card__footer, .card__header, .card__rewards, .card__title {
    text-align: center;
}
.card__title {
    font-weight: 500;
    font-size: 18px;
    line-height: 140%;
    color: #000;
    margin: 0;
}
.card__body, .card__currencies {
    display: flex;
    align-items: center;
}
.card__body {
    padding: 25px 20px 8px;
    flex-direction: column;
}

.card__body, .card__footer, .card__header, .card__rewards, .card__title {
    text-align: center;
}
.card__body, .card__currencies {
    display: flex;
    align-items: center;
}
.card__bribe-icon {
    position: relative;
    width: 68px;
    height: 68px;
    margin-right: 6px;
}
.card__currency-icon {
    width: 68px;
    height: 68px;
    -o-object-fit: contain;
    object-fit: contain;
}

.card__rewards {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.card__footer {
    padding: 20px 20px 30px;
}
.card__footer .double {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
}
.card__footer .double .title {
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    color: #5c5c5c;
    padding: 0;
    margin-right: 60px;
}
.card__footer .double .value {
    font-weight: 700;
    font-size: 14px;
    line-height: 140%;
    color: #000;
}
.card__bribe-icon img {
    position: absolute;
    top: -38px;
    left: -51px;
    width: 161px;
    height: 166px;
}

// 

.stake-organiser{
  padding: 1rem 0;
  width: 100%;
}

.stake-organiser a {
  text-align: center;
  justify-content: center;
  font-weight: 800;
}
.stake-organiser small,
.-small-buy-trig-uniswap{
  font-size: .9rem;
}
.stake-organiser.-fx-tab {
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap:5px;
  font-weight: 100;
}
.stake-organiser > .stats {
  display: inline-grid;
  padding: 0;
}
.-stats-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    
}
.stake-organiser>.stats {
    display: inline-grid;
    padding: 0;
}
.stats {
    padding: 1rem 0;
    display: grid;
    grid-auto-flow: row;
    align-items: center;
    justify-items: center;
}
.left {
  text-align: left;
}
.right {
  text-align: right;
}

.claim-reward-balance {
    transition: .2s ease;
    opacity: .7;
    box-shadow: 0 0 0 1px;
    border-radius: 100px;
    padding: .2rem .4rem;
    cursor: pointer;
    line-height: 1;
}
.-btn-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
}
.stake-ui-container>:last-child {
    margin-top: auto;
}
.stake-organiser a {
    text-align: center;
    justify-content: center;
    font-weight: 800;
}
.btn {
    padding: .75rem 1.5rem;
    line-height: 1;
    background-color: #0DC4E0;
    color:#fff;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    text-align: center;
    border-radius: 100px;
    font-weight: 400;
    transition: .1s ease;
    position: relative;
    z-index: 1;
    overflow: hidden;
    cursor: pointer;
    transition: .2s;
}
.btn:hover {
  background: #2b92a2;
}

.btn.sec {
    background: 0 0;
    box-shadow: inset 0 0 0 2px #0DC4E0;
    color: #0DC4E0
}
.btn.sec:hover {
  color: #2b92a2;
  box-shadow: inset 0 0 0 2px #2b92a2;
}

.uniswap-msg {
  height: 50px;
}
</style>
