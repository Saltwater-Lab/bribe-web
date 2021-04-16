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

      <div class="stake-organiser -fx-tab">
        <small class="left">BRIBE Rewards: <i class="fas fa-dollar-sign"></i><span
            id="pairRewardsValue">0.000000</span></small>
        <small @click="doClaim()" class="claim-reward-balance"><i
            class="fas fa-star"></i>&nbsp;Claim</small>
      </div>

      

      <!-- TODO: organize the input boxes and buttons.  -->

      <!-- <div v-if="metamaskAccount&&isApproved[poolId]" class="stake-organiser -btn-flex actions"> --> <!-- if farming pool is approved, display deposit and withdraw buttons -->
      <!-- preview version -->
      <div v-if="false" class="stake-organiser -btn-flex actions"> 
        <div>
          <input :placeholder="`Amount`" class="deposit__input" v-model="depositAmount" type="number">
            <a class="btn primary" @click="doDeposit()">
              Deposit
            </a>
            <small @click="setMaxDeposit()" class="max-btn"><i
            class="fas fa-star"></i>&nbsp;MAX</small>

        </div>

        <div>
          <input :placeholder="`Amount`" class="deposit__input" v-model="withdrawAmount" type="number" v-on:input="onWithdrawAmountChange">
          <a class="btn sec" @click="doWithdraw()">
            Withdraw
          </a>
          <small @click="setMaxWithdraw()" class="max-btn"><i
            class="fas fa-star"></i>&nbsp;MAX</small>
        </div>

      </div>
      <div v-else class="stake-organiser -btn-flex actions">
        <a class="btn primary" @click="doApprove()">
          Approve
        </a>
      </div>

      <!--
      <div class="stake-organiser -small-buy-trig-uniswap uniswap-msg">
        TODO: change href link color
        <span v-if="showUniswapMsg"><a :href="`${getAddLiquidityLink()}`">Provide liquidity to {{ inputType }} pair on Uniswap</a></span>
        <span v-else><a href="https://app.uniswap.org/#/swap?outputCurrency=0x956f47f50a910163d8bf957cf5846d573e7f87ca">Get FEI from Uniswap</a></span>
        make it a href to app.uniswap.org/add/..... 
      
      </div>
      -->
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'

export default {
  props: ['title', 'farmLink', 'topIcon', 'currencyIcon', 'currencyIcon2', 'dailyPool', 'finished', 'inputType', 'poolId'],

  data() {
    return {
      depositAmount: null,
      withdrawAmount: null,
      withdrawMax: false
    }
  },

  computed: {
    ...mapState(['rewardsEndIn', 'metamaskAccount', 'isApproved', 'farmContracts', 'stakeTokens']),
    showUniswapMsg () { // show uniswap LP token address
      return this.inputType.includes('-')
    }
  },

  methods: {
    ...mapActions(['approve', 'deposit', 'withdraw', 'withdrawAll', 'harvest']),
    getAddLiquidityLink() {
      return "https://app.uniswap.org/"
    },
    doClaim() {
      this.harvest(this.poolId)
    },
    doDeposit () {
      if (!this.depositAmount || this.depositAmount <= 0) {
        // TODO: display error msg
        return
      }

      this.deposit([this.poolId, this.depositAmount])
    },
    doWithdraw() {
      // if user have clicked "max"
      // use contract.exit function to withdraw all
      // otherwise withdraw the exact wmount
      if (!this.withdrawAmount || this.withdrawAmount <= 0) {
        // TODO: display an error msg
        return
      }

      if (this.withdrawMax) {
        this.withdrawAll(this.poolId)
      }
      else {
        this.withdraw([this.poolId, this.withdrawAmount])
      }
    },
    doApprove() {
      this.approve(this.poolId);
    },
    setMaxDeposit() {

    },
    setMaxWithdraw() {
      this.withdrawAmount = 100;
      this.withdrawMax = true;
    },
    onWithdrawAmountChange() {
      this.withdrawMax = false;
    }
  }
}
</script>

<style lang="scss" scoped>
// .card::before {
//   content: "";
//   position: absolute;
//   top: 1px;
//   left: 1px;
//   height: calc(100% - 2px);
//   width: calc(100% - 2px);
//   background: #fff;
//   z-index: -1;
//   border-radius: 1rem;
// }

.card {
    background: rgba(255,255,255,0.78);
    border-radius: 1rem;
    margin: 20px;
    position: relative;
    min-width: 359px;
    z-index: 1;
    box-shadow: 2px 2px 10px #eedddd;
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

.card__body, .card__footer, .card__header, .card__rewards, .card__title {
    text-align: center;
}
.card__title {
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    color: #000;
    margin: 0;
}
	
.card__title::after {
  content: "";
  display: block;
  height: 1px;
  width: 90%;
  background: #000000;
  position: absolute;
  opacity: 0.9;
  margin-top: 10px;
}
.card__body, .card__currencies {
    display: flex;
    align-items: center;
}
.card__body {
    padding: 5px 20px 8px;
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
  font-weight: 500;
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
    border-radius: 4px;
    padding: .2rem .4rem;
    cursor: pointer;
    line-height: 1;
}
.claim-reward-balance:hover {
    background: #acadf8;
}


.max-btn {
    transition: .2s ease;
    opacity: .7;
    box-shadow: 0 0 0 1px;
    border-radius: 3px;
    padding: .1rem .2rem;
    cursor: pointer;
    line-height: 1;
}
.max-btn:hover {
    background: #acadf8;
}

.-btn-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
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
    background-color:black;
    color:#fff;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    text-align: center;
    border-radius: 10px;
    font-weight: 400;
    transition: .1s ease;
    position: relative;
    z-index: 1;
    overflow: hidden;
    cursor: pointer;
    transition: .2s;
}
.btn:hover {
  background: linear-gradient(to top right, #9395f7, #cf9ef0);
}

.btn.sec {
    background: 0 0;
    border:2px solid black;
    color: black;
}
.btn.sec:hover {
  color: #cf9ef0;
    border:2px solid #cf9ef0;
}

.uniswap-msg {
  height: 50px;
}
</style>
