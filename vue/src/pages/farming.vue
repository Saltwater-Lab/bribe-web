<template>
  <div class="info farm-page">
    <div class="container">
      <!-- <div class="info__image">
        <img src="../assets/images/cat.png" alt="">
      </div> -->
      <div class="title heading">BRIBE FARM</div>

      <div class="total-staked">
        <h2 class="title"> <span>Total Staked:</span> {{totalStaked | dollarAmountFormat}}</h2>
      </div>
      
      <div class="farm-data subheading">
        <!-- <div class="farm-data__item">
          <h2 class="title">Est. APY</h2>
          <span class="value">{{ '123APY' }} %</span>
        </div> -->
        <!-- <div class="farm-data__item">
          <h2 class="title">Total LPs BRIBE/ETH Staked</h2>
          <span class="value">{{ '12341243$' }}</span>
        </div> -->
        <!-- <div class="farm-data__item">
          <h2 class="title">Daily BRIBE Pool Rewards</h2>
          <span class="value">{{ 'asdf' }}</span>
        </div> -->
        BRIBE is a cross-chain liquidity farm for algorithmic stablecoins
      </div>
      <!-- <h2 class="farm-label">Add LPs BRIBE/ETH from Uniswap pool to farm BRIBE!</h2> -->
      <div class="balance">
        <div class="balance__inner cards-row">
          <Card title="FEI Pool" pool-id=0 input-type="FEI" farm-link="/farming_pancake" currency-icon="/pics/fei.png" currency-icon2="" daily-pool="25 000" :finished="false" />
          <Card title="BRIBE-FEI LP Pool" pool-id=1 input-type="BRIBE-FEI" farm-link="/farming_bnb" top-icon="/pics/fei.png" currency-icon="/pics/fei.png" currency-icon2="/pics/bribe.png" daily-pool="25 000" />
          <Card title="BRIBE-ETH LP Pool" pool-id=2 input-type="BRIBE-ETH" farm-link="/farming_burger" top-icon="/pics/bribe.png" currency-icon="/pics/bribe.png" currency-icon2="/pics/eth.png" daily-pool="25 000" />
        </div>
        <div class="balance__info">
          <p class="showcase-text">
            BRIBE token address is <u>0x679fa6dc913acab6def33ec469fc6e421bc794f5</u><br>
              <a href="https://info.uniswap.org/token/0x679fa6dc913acab6def33ec469fc6e421bc794f5"><b>Trade $BRIBE on Uniswap</b></a>
          </p>
        </div>

        <div>
          <CoinsRow />
        </div>
      </div>
    </div>
    <DepositModal ref="deposit-modal" />
    <WithdrawModal ref="withdraw-modal" />
  </div>
</template>
<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import Card from '@/components/Card';
import CoinsRow from '@/components/CoinsRow';
import toFixedTwo from '@/utils/toFixedTwo';
import formatter from '@/utils/amountFormatter'

export default {
  name: "farming",

  components: {
    DepositModal,
    WithdrawModal,
    Card,
    CoinsRow
  },

  data() {
    return {
      isDepositModalShown: false,
      isWithdrawModalShown: false
    }
  },

  async created() {
    if (!this.firstEnter) {
      //await this.getRoobeeData();
    }
    // if (!this.metamaskAccount) {
    //   this.$bus.$emit('open-wallet-modal');
    // }
  },
  mounted () {
    //setTimeout(() => this.$bus.$emit('open-notice-modal'), 1000)
  },

  computed: {
    ...mapState(['farmInfo', 'isApproved', 'firstEnter', 'roobeeFarmBalance', 'metamaskAccount', 'coinPrices', 'lpData']),
    ...mapGetters(['apy']),
    totalStaked () {
      const total = this.farmInfo.reduce((sum, acc, index) => {
        sum += this.calcStakedValue((acc.totalStaked)/1e18, index)
        return sum
      }, 0)
      return total
    }
  },

  filters: {
    dollarAmountFormat (val) {
      return isNaN(val) ? '---' : '$'+formatter.format(val)
    }
  },

  methods: {
    ...mapActions(['harvest', 'approve']),

    showDepositModal() {
      this.$refs['deposit-modal'].show = true
    },

    showWithdrawModal() {
      this.$refs['withdraw-modal'].show = true
    },

    numberWithSpaces(x) {
      let parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(".");
    },

    toFixedTwo(num) {
      return toFixedTwo(num)
    },

    calcStakedValue(val, poolId) {
      // input: amount of staked tokens (already divided by 1e18)
      // output: TVL in dollar
      var reserveAmount
      if (poolId == 0) {
        return val * this.coinPrices.filter(item => item.ticker == 'FEI')[0].usd
      }
      else if (poolId == 1) {
        const feiIndex = 1 - this.lpData[0].bribeIndex
        reserveAmount = feiIndex == 0 ? this.lpData[0].reserve0 : this.lpData[0].reserve1
        reserveAmount *= (val / this.lpData[0].totalSupply) 
        return 2 * reserveAmount * this.coinPrices.filter(item => item.ticker == 'FEI')[0].usd
      }
      else if (poolId == 2) {
        const ethIndex = 1 - this.lpData[1].bribeIndex
        reserveAmount = ethIndex == 0 ? this.lpData[1].reserve0 : this.lpData[1].reserve1
        reserveAmount *= (val  / this.lpData[1].totalSupply)
        return 2 * reserveAmount * this.coinPrices.filter(item => item.ticker == 'ETH')[0].usd
      }
      return 0
    }
  }
}

</script>
<style scoped lang="scss">
.heading {
  padding: 0;
  font-family: Roboto-Bold;
  font-weight:500;
  font-size: 56px;
  letter-spacing: 6px;
}

.subheading {
  font-size: 20px;
}
.center {
  text-align: center;
}
.cards-row {
  align-items: stretch;
}

.total-staked {
  text-align: center;
  font-family: "Geometria";
  font-weight: 600;
  background-image: linear-gradient(255deg ,#b6509e 25%,#2ebac6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  .title {
    padding: 0;
  }
}
</style>
