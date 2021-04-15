<template>
  <div class="info farm-page">
    <div class="container">
      <!-- <div class="info__image">
        <img src="../assets/images/cat.png" alt="">
      </div> -->
      <div class="title heading">Bribe Farms</div>
      <div class="farm-data subheading">
        <!-- <div class="farm-data__item">
          <h2 class="title">Est. APY</h2>
          <span class="value">{{ toFixedTwo(apy) }} %</span>
        </div>
        <div class="farm-data__item">
          <h2 class="title">Total LPs BRIBE/ETH Staked</h2>
          <span class="value">{{ toFixedTwo(roobeeFarmSupply / 1e18) }}</span>
        </div>
        <div class="farm-data__item">
          <h2 class="title">Daily BRIBE Pool Rewards</h2>
          <span class="value">{{ numberWithSpaces(toFixedTwo(rewardPerBlock * 5760 * 15 / 1e18)) }}</span>
        </div> -->
        BRIBE is a cross-chain liquidity mining and <br />
        vote delegation protocol for algorithmic stablecoins
      </div>
      <!-- <h2 class="farm-label">Add LPs BRIBE/ETH from Uniswap pool to farm BRIBE!</h2> -->
      <div class="balance">
        <div class="balance__inner cards-row">
          <Card title="Deposit FEI & Earn BRIBE" pool-id=0 input-type="FEI" farm-link="/farming_pancake" currency-icon="/pics/fei.png" currency-icon2="" daily-pool="25 000" :finished="false" />
          <Card title="Deposit FEI-BRIBE & Earn BRIBE" pool-id=1 input-type="FEI-BRIBE" farm-link="/farming_bnb" top-icon="/pics/fei.png" currency-icon="/pics/fei.png" currency-icon2="/pics/bribe.png" daily-pool="25 000" />
          <Card title="Deposit BRIBE-ETH & Earn BRIBE" pool-id=2 input-type="BRIBE-ETH" farm-link="/farming_burger" top-icon="/pics/bribe.png" currency-icon="/pics/bribe.png" currency-icon2="/pics/eth.png" daily-pool="25 000" />
        </div>
        <div class="balance__info">
          <AirDrop />
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
import AirDrop from "@/components/AirDrop";
import Card from '@/components/Card';
import toFixedTwo from '@/utils/toFixedTwo';

export default {
  name: "farming",

  components: {
    DepositModal,
    WithdrawModal,
    Card,
    AirDrop
  },

  data() {
    return {
      isDepositModalShown: false,
      isWithdrawModalShown: false
    }
  },

  async created() {
    if (!this.firstEnter) {
      await this.getRoobeeData();
    }
    // if (!this.metamaskAccount) {
    //   this.$bus.$emit('open-wallet-modal');
    // }
  },
  mounted () {
    setTimeout(() => this.$bus.$emit('open-notice-modal'), 1000)
  },

  computed: {
    ...mapState(['roobeeBalance', 'roobeeFarmSupply', 'earned', 'rewardPerBlock', 'isApproved', 'firstEnter', 'roobeeFarmBalance', 'metamaskAccount']),
    ...mapGetters(['apy'])
  },

  methods: {
    ...mapActions(['getRoobeeData', 'harvest', 'approve']),

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
    }
  }
}

</script>
<style scoped>
.heading {
  font-size: 60px;
}
.subheading {
  font-size: 24px;
}
.center {
  text-align: center;
}
.cards-row {
  align-items: stretch;
}
</style>
