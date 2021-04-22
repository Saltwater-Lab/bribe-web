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
              id="stakedStatistic">{{calcStakedValue(farmInfo[poolId].totalStaked / 1e18) | dollarAmountFormat}}</span></span>
          <small>Total Staked</small>
        </div>
        <div class="stats">
          <span class="stat -pc"><span class="apy-holder" id="singleAPY">{{calcApy() | percentFormat}}</span><i
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
        <small>Wallet Balance: <i class="fas fa-dollar-sign"></i><span id="stakedSingle">{{ availableToDeposit[poolId] / 1e18 | amountFormat }}</span></small>
        <br>
        <small>Your Stake: <i class="fas fa-dollar-sign"></i><span id="stakedSingle">{{ bribeFarmBalance[poolId] / 1e18 | amountFormat }}</span></small>
      </div>
      <!-- <div class="stake-organiser right">
        <small>Your Stake: <i class="fas fa-dollar-sign"></i><span id="stakedSingle">0.000000</span></small>
      </div> -->

      <div class="stake-organiser -fx-tab">
        <small class="left">BRIBE Rewards: <i class="fas fa-dollar-sign"></i>
        <span id="pairRewardsValue">{{ earned[poolId] / 1e18 | amountFormat}}</span></small>
        <div v-if="nextClaimTime[poolId]<Date.now()/1000">
          <small @click="doClaim()" class="claim-reward-balance"><i
              class="fas fa-star"></i>&nbsp;Claim</small>
        </div>
        <small v-else class="ml-2">Claim rewards in {{claimCountDown | timeFormat}}</small>
      </div>

      

      <!-- TODO: organize the input boxes and buttons.  -->

      <!-- <div v-if="metamaskAccount&&isApproved[poolId]" class="stake-organiser -btn-flex actions"> --> <!-- if farming pool is approved, display deposit and withdraw buttons -->
      <!-- preview version -->
      <div v-if="metamaskAccount&&isApproved[poolId]" class="stake-organiser -btn-flex actions"> 
        <div class="deposit-wrapper">
          <input :placeholder="`Amount`" class="deposit__input" v-model="depositAmount" type="number">
          <small @click="setMaxDeposit()" class="max-btn"><i class="fas fa-star"></i>&nbsp;MAX</small>
            <a class="btn primary" @click="doDeposit()">
              Deposit
            </a>
        </div>

        <div class="withdraw-wrapper">
          <input :placeholder="`Amount`" class="deposit__input" v-model="withdrawAmount" type="number" v-on:input="onWithdrawAmountChange">
          <small @click="setMaxWithdraw()" class="max-btn"><i
            class="fas fa-star"></i>&nbsp;MAX</small>
          <a class="btn sec" @click="doWithdraw()">
            Withdraw
          </a>
        </div>

      </div>
      <div v-else class="stake-organiser -btn-flex actions">
        <a class="btn primary" @click="doApprove()">
          Approve
        </a>
      </div>

      
      <div class="stake-organiser -small-buy-trig-uniswap uniswap-msg">
        <span v-if="showUniswapMsg"><a :href="`${getAddLiquidityLink()}`" target="_blank">Provide liquidity to {{ inputType }} pair on Uniswap</a></span>
        <span v-else><a href="https://app.uniswap.org/#/swap?outputCurrency=0x956f47f50a910163d8bf957cf5846d573e7f87ca" target="_blank">Get FEI from Uniswap</a></span>
      </div>
      

      <!-- <div>
        {{isApproved}}
      </div> -->
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import formatter from '@/utils/amountFormatter'

export default {
  props: ['title', 'farmLink', 'topIcon', 'currencyIcon', 'currencyIcon2', 'dailyPool', 'finished', 'inputType', 'poolId'],

  data() {
    return {
      pairContract: null,
      depositAmount: null,
      withdrawAmount: null,
      withdrawMax: false,
      claimCountDown: 0,
      timeoutRef: null
    }
  },

  computed: {
    ...mapState(['lpData', 'coinPrices','farmInfo', 'metamaskAccount', 'nextClaimTime', 'isApproved', 'farmContracts', 'stakeTokens', 'earned', 'availableToDeposit', 'bribeFarmBalance']),
    showUniswapMsg () { // show uniswap LP token address
      return this.inputType.includes('-')
    }
  },

  created: function() {
    
  },

  filters: {
    amountFormat (val) {
      return formatter.format(val)
    },
    // values could be nan if contract not loaded
    dollarAmountFormat (val) {
      return isNaN(val) ? '---' : '$'+formatter.format(val)
    },
    percentFormat(val) {
      return isNaN(val) ? '---' : formatter.format(val)+'%'
    },

    timeFormat(val) {
      var date = new Date(0)
      date.setSeconds(val); // specify value for SECONDS here
      return date.toISOString().substr(11, 8);
    },
  },

  watch: {
    nextClaimTime: {
      handler(value) {
        if (value[this.poolId] > Date.now() / 1000) {
          clearTimeout(this.timeoutRef)
          this.claimCountDown = Math.floor(this.nextClaimTime[this.poolId] - Date.now() / 1000);
          this.claimCountdownTimer();
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    ...mapActions(['approve', 'deposit', 'withdraw', 'withdrawAll', 'harvest']),
    getAddLiquidityLink() {
      if (this.poolId == 1) {
        return `https://app.uniswap.org/#/add/${process.env.VUE_APP_FEI_ADDRESS}/${process.env.VUE_APP_BRIBE_ADDRESS}`
      }
      else if (this.poolId == 2) {
        return `https://app.uniswap.org/#/add/${process.env.VUE_APP_BRIBE_ADDRESS}/ETH`
      }
    },
    claimCountdownTimer() {
      if(this.claimCountDown > 0) {
        this.timeoutRef = setTimeout(() => {
            this.claimCountDown -= 1
            this.claimCountdownTimer()
        }, 1000)
      }
    },
    calcStakedValue(val) {
      // input: amount of staked tokens (already divided by 1e18)
      // output: TVL in dollar
      var reserveAmount
      if (this.poolId == 0) {
        return val * this.coinPrices.filter(item => item.ticker == 'FEI')[0].usd
      }
      else if (this.poolId == 1) {
        const feiIndex = 1 - this.lpData[0].bribeIndex
        reserveAmount = feiIndex == 0 ? this.lpData[0].reserve0 : this.lpData[0].reserve1
        reserveAmount *= (val / this.lpData[0].totalSupply) 
        return 2 * reserveAmount * this.coinPrices.filter(item => item.ticker == 'FEI')[0].usd
      }
      else if (this.poolId == 2) {
        const ethIndex = 1 - this.lpData[1].bribeIndex
        reserveAmount = ethIndex == 0 ? this.lpData[1].reserve0 : this.lpData[1].reserve1
        reserveAmount *= (val  / this.lpData[1].totalSupply)
        return 2 * reserveAmount * this.coinPrices.filter(item => item.ticker == 'ETH')[0].usd
      }
      return 0
    },
    calcApy() {
      const annualRewardAmount = this.farmInfo[this.poolId].rewardForDuration / 1e18 * 12 // rewardForDuration is monthly reward
      const annualRewardValue = annualRewardAmount * this.lpData[0].bribePrice // quote in fei price, treat fei = 1usd, bribePrice is relative price (=reserve0/reserve1)
      const totalValueLocked = this.calcStakedValue(this.farmInfo[this.poolId].totalStaked / 1e18)
      return annualRewardValue / totalValueLocked * 100 * (this.poolId == 0 ? 1.7 : 1.25)
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
      this.depositAmount = this.availableToDeposit[this.poolId] / 1e18 - 0.00000001
    },
    setMaxWithdraw() {
      this.withdrawAmount = this.bribeFarmBalance[this.poolId] / 1e18;
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
  font-size: .8rem;
  font-weight: 400;
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
    border: 2px solid black;
}
.btn:hover {
  background: linear-gradient(to top right, #9395f7, #cf9ef0);
  border: 2px solid #cf9ef0;
}

.btn.sec {
    background: 0 0;
    // border:2px solid black;
    color: black;
}
.btn.sec:hover {
  color: #cf9ef0;
    border:2px solid #cf9ef0;
}

.uniswap-msg {
  height: 50px;
  bottom: 0;
}

.uniswap-msg a {
  color: grey;
}

.deposit-wrapper {
  margin-right: 8px;
}
.withdraw-wrapper {
  margin-left: 8px;
}

// to remove default arrows from input type number
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

input[type="number"] {
  padding-right: 55px;
  margin-left: -10px;
}
.max-btn {
  margin-left: -50px;
}
.ml-2 {
  margin-left: 8px;
}
</style>
