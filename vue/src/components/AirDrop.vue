<template>
  <div>
    <div class="showcase-text">
      <h2>BRIBE Genesis Token Airdrop</h2>
      <p>
        Every address that participated in Fei Genesis will be airdropped BRIBE token. <br>Details will be announced in our social channels.
      </p>
    </div>

    <div id="airdropToken" class="stake-ui-container">
      <h1>
        BRIBE Token Airdrop
      </h1>
      <div class="stake-organiser -stats-flex">
        <div class="stats">
          <span class="stat -pc">
            <span id="claimableBribe">
              {{metamaskAccount ? claimableBribe : 'Locked'}}
            </span><i class="-m-l">BRIBE</i></span>
          <small>Claimable BRIBE</small>
        </div>
        <div class="stats">
          <span class="stat -pc">
            <span id="tokenBalance">
              {{metamaskAccount ? bribeBalance : 'Locked'}}
              </span><i class="-m-l">BRIBE</i></span>
          <small>BRIBE Balance</small>
        </div>
      </div>

      <div class="stake-organiser -btn-flex">
      
        <a v-if="metamaskAccount" class="btn primary" @click="doStake('redeem')">
          Claim
        </a>
        <a v-else class="btn primary">
          Locked
        </a>
      </div>
    </div>

    <p class="showcase-text">
      BRIBE token is not launched yet.<br><i class="fas fa-exclamation-triangle"></i>&nbsp;<u>Please beware of
        scams on Uniswap.</u><br>Official token address will be updated upon token generation
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api'
import web3 from 'web3'

export default {
  name: 'AirDrop',
  data () {
    return {
      bribeBalance: 0,
      claimableBribe: 0
    }
  },
  computed: {
    ...mapState(['metamaskAccount'])
  },
  watch: {
    metamaskAccount: {
      handler (address) {
        console.log("address:", address)
        this.getAirDropData(address)
      },
      immediate: true
    }
  },
  methods: {
    async getAirDropData (address) {
      if(!address) return;
      const checksum = await web3.utils.toChecksumAddress(address);
      console.log('checksum', checksum)
      const response = await api.checkAirDropStatus(checksum)
      if (response === null) {
        this.claimableBribe = 0
      } else {
        this.claimableBribe = response.decimalAmount
      }
      console.log(response)
    },
    doStake () {
      
    }
  }
}
</script>

<style scoped>
.showcase-text {
  /* margin: 4rem 2rem; */
  text-align: center;
  line-height: 1.5;
  font-size: 1.4rem;
  font-weight: 100;
  color: #4b4b4b;
  width: 100%;
}
.showcase-text u {
  cursor: pointer;
}
/* .stake-ui-container::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  background: #fff;
  z-index: -1;
  border-radius: 1rem;
} */
.stake-ui-container > :last-child {
  margin-top: auto;
}
.stake-ui-container {
  transition: .2s ease;
  border-radius: 1rem;
  padding: 1rem 1.5rem .5rem 1.5rem;
  margin: 2rem auto;
  max-width: 95vw;
  width: calc(350px - 2rem);
  background: rgba(255,255,255,0.78);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 3px 10px #eecccc;
}
.stake-ui-container h1 {
  text-align: center;
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
  color: #2e2e2e;
  position: relative;
  font-weight: 100;
}

.stake-ui-container h1::after {
  content: "";
  display: block;
  height: 1px;
  width: calc(100% + 2rem);
  bottom: -1rem;
  background: #0296f6;
  position: absolute;
  left: -1rem;
  opacity: .3;
}

.center {
  text-align: center;
}

.-stats-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}


.stats {
  padding: 1rem 0;
  display: grid;
  grid-auto-flow: row;
  align-items: center;
  justify-items: center;
}

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

.stats small {
  opacity: .4;
  font-size: .75rem;
}

.btn {
    padding: .75rem 1.5rem;
    line-height: 1;
    background-color: black;
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

</style>