import Vue from 'vue'
import Vuex from 'vuex'

import { createERC20Contract, createBribeTokenContract, createFarmContracts } from '../utils/contract';
import WalletModule from './WalletModule';
import MetamaskConnector from '@/utils/MetamaskConnector.js'

Vue.use(Vuex)

const BN = require('bn.js');

export default new Vuex.Store({
  state: {
    metamaskConnector: null,
    bribeToken: null,
    graph: null,
    farmContracts: [], // 3 pools
    stakeTokens: [], // 3 tokens 
    farmInfo: [
      {
        totalStaked: 0,
        rewardPerToken: 0,
        rewardPerDuration: 0
      },
      {
        totalStaked: 0,
        rewardPerToken: 0,
        rewardPerDuration: 0
      },
      {
        totalStaked: 0,
        rewardPerToken: 0,
        rewardPerDuration: 0
      }
    ],

    // user specific data
    metamaskAccount: null,
    bribeBalance: 0,
    isApproved: [false, false, false],
    earned: [0, 0, 0],
    availableToDeposit: [0, 0, 0],
    bribeFarmBalance: [0, 0, 0],


    firstEnter: true
  },

  mutations: {
    setMetamaskAccount(state, payload) {
      state.metamaskAccount = payload
    },

    setStakeTokens(state, payload) {
      state.stakeTokens = payload
    },

    setFarmContracts(state, payload) {
      state.farmContracts = payload
    },

    setBribeToken(state, payload) {
      state.bribeToken = payload
    },

    setBribeBalance(state, payload) {
      state.bribeBalance = payload
    },

    setMetamaskConnector(state, payload) {
      state.metamaskConnector = payload
    },

    setFirstEnter(state, payload) {
      state.firstEnter = payload
    },

    setIsApproved(state, payload) {
      state.isApproved = payload
    },

    setAvailableToDeposit(state, payload) {
      state.availableToDeposit = payload
    },

    setBribeFarmBalance(state, payload) {
      state.bribeFarmBalance = payload
    },

    setRewardsDuration(state, payload) {
      state.rewardsDuration = payload
    },

    setEarned(state, payload) {
      state.earned = payload
    },

    setGraph(state, payload) {
      state.graph = payload;
    },

    setStakingTotalSupply(state, payload) {
      state.stakingTotalSupply = payload;
    },

    resetUser(state) {
      state.metamaskAccount = null;
      state.bribeBalance = 0;
      state.isApproved = false;
      state.earned = [0, 0, 0];
      state.availableToDeposit = [0, 0, 0];
      state.bribeFarmBalance = [0, 0, 0];
      localStorage.removeItem('account-unlocked');
    }
  },

  actions: {
    async connectMetamask({state, commit, dispatch}) {
      //console.log('env:', process.env);

      dispatch('getFarmInfo');

      if (!state.metamaskConnector) {
        commit('setMetamaskConnector', new MetamaskConnector())
        // creating contracts
        commit('setFarmContracts', createFarmContracts());
        commit('setBribeToken', createBribeTokenContract());
        commit('setStakeTokens', [
          createERC20Contract(process.env.VUE_APP_FEI_ADDRESS),
          createERC20Contract(process.env.VUE_APP_FEI_BRIBE_LP_ADDRESS),
          createERC20Contract(process.env.VUE_APP_ETH_BRIBE_LP_ADDRESS)
        ])

        if (!state.metamaskConnector || state.metamaskConnector.status == 'NOT_INSTALLED') {
          localStorage.removeItem('account-unlocked')
        } else {
          state.metamaskConnector.eth.on('accountsChanged', async (accounts) => {
            if (!state.firstEnter) {
              if (accounts[0]) {
                commit('setMetamaskAccount', accounts[0])
                dispatch('getUserData')
              } else {
                commit('resetUser');
              }
            }
          })
        }
      }

      if (localStorage.getItem('account-unlocked') == 'true') {
        dispatch('connectAccount');
      }

      commit('setFirstEnter', false);
    },

    async connectAccount({state, commit, dispatch}) {
      if (!isCorrectNetwork) { return }
      const accounts = await state.metamaskConnector.getAccounts();
      if (accounts) {
        if (accounts.status == 'CONNECTED') {
          commit('setMetamaskAccount', accounts.data[0])
          localStorage.setItem('account-unlocked', true);
          if (!state.firstEnter) {
            Vue.prototype.$toasted.success('Successfully connected to the account');
            Vue.prototype.$bus.$emit('close-wallet-modal');
          }
          dispatch('getUserData');
        } else if (accounts.status == 'NOT_INSTALLED') {
          Vue.prototype.$toasted.error("You must install Metamask first", {duration: 5000});
          window.open('https://metamask.io/', '_blank');
        }
      } else {
        if (!state.firstEnter) {
          Vue.prototype.$toasted.error("Couldn't find any accounts");
        }
      }
    },

    async getUserData({commit, state}) {
      if (process.env.VUE_APP_PREVIEW) { return; }
      try{
        if (state.metamaskAccount) {
          if (!state.bribeToken) {
            Vue.prototype.$toasted.error(`Bribe Token: the contract is not connected`, { duration: 5000 });
            return 
          }
          console.log("farms", state.farmContracts)
          if (!state.farmContracts[0]) {
            Vue.prototype.$toasted.error(`Bribe Farm: the contract is not connected`, { duration: 5000 });
            return
          }
  
          commit('setBribeBalance', await state.bribeToken.methods.balanceOf(state.metamaskAccount).call());
          
          commit('setEarned', [
            await state.farmContracts[0].methods.earned(state.metamaskAccount).call(),
            await state.farmContracts[1].methods.earned(state.metamaskAccount).call(),
            await state.farmContracts[2].methods.earned(state.metamaskAccount).call(),
          ]);
  
          commit('setIsApproved', Promise.all([
            (await state.bribeToken.methods.allowance(state.metamaskAccount, process.env.VUE_APP_FEI_FARM_ADDRESS).call()) > 0,
            (await state.bribeToken.methods.allowance(state.metamaskAccount, process.env.VUE_APP_FEI_BRIBE_FARM_ADDRESS).call()) > 0,
            (await state.bribeToken.methods.allowance(state.metamaskAccount, process.env.VUE_APP_ETH_BRIBE_FARM_ADDRESS).call()) > 0,
          ]));
  
          commit('setAvailableToDeposit', Promise.all([
            await state.stakeTokens[0].methods.balanceOf(state.metamaskAccount).call(),
            await state.stakeTokens[1].methods.balanceOf(state.metamaskAccount).call(),
            await state.stakeTokens[2].methods.balanceOf(state.metamaskAccount).call(),
          ]));
          
          commit('setBribeFarmBalance', Promise.all([
            await state.farmContracts[0].methods.balanceOf(state.metamaskAccount).call(),
            await state.farmContracts[1].methods.balanceOf(state.metamaskAccount).call(),
            await state.farmContracts[2].methods.balanceOf(state.metamaskAccount).call(),
          ]));
        }

      } catch (err) {
        if (isCorrectNetwork()) {
          console.error(`index:getUserData: ${err.message}`);
          Vue.prototype.$toasted.error(`Bribe Farm: ${err.message}`, { duration: 5000 });
        }
      }
    },

    async getFarmInfo({ commit, state }) {
      if (process.env.VUE_APP_PREVIEW) { return; }
      if (state.farmContracts) {
        try {
          // farmInfo: an array of
          // {
            //   totalStaked: 0,
            //   rewardPerToken: 0,
            //   rewardPerDuration: 0
            // }
          
          let result = await Promise.all([
            state.farmContracts[0].methods.totalSupply().call(),
            state.farmContracts[1].methods.totalSupply().call(),
            state.farmContracts[2].methods.totalSupply().call(),
            state.farmContracts[0].methods.rewardPerToken().call(),
            state.farmContracts[1].methods.rewardPerToken().call(),
            state.farmContracts[2].methods.rewardPerToken().call(),
            state.farmContracts[0].methods.rewardPerDuration().call(),
            state.farmContracts[1].methods.rewardPerDuration().call(),
            state.farmContracts[2].methods.rewardPerDuration().call()
          ])
          
          commit('setFarmInfo', [
            {
              totalStaked: result[0],
              rewardPerToken: result[3],
              rewardPerDuration: result[6]
            },
            {
              totalStaked: result[1],
              rewardPerToken: result[4],
              rewardPerDuration: result[7]
            },
            {
              totalStaked: result[2],
              rewardPerToken: result[5],
              rewardPerDuration: result[8]
            }
          ]);
        } catch (err) {
          if (isCorrectNetwork()) {
            console.error(`index:getFarmInfo: ${err.message}`);
            Vue.prototype.$toasted.error(`Bribe Farm: ${err.message}`, { duration: 5000 });
          }
        }
      }

      // graph
      // var xhr = new XMLHttpRequest();
      // xhr.onload = () => {
      //   commit('setGraph', JSON.parse(xhr.responseText).data);
      // };
      // xhr.open("POST", "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2", true);
      // let data = "{\"operationName\":\"tokens\",\"variables\":{},\"query\":\"fragment TokenFields on Token {\\n  id\\n  name\\n  symbol\\n  derivedETH\\n  tradeVolume\\n  tradeVolumeUSD\\n  untrackedVolumeUSD\\n  totalLiquidity\\n  txCount\\n  __typename\\n}\\n\\nquery tokens {\\n  tokens(where: {id: \\\"0xa31b1767e09f842ecfd4bc471fe44f830e3891aa\\\"}) {\\n    ...TokenFields\\n    __typename\\n  }\\n  pairs0: pairs(where: {token0: \\\"0xa31b1767e09f842ecfd4bc471fe44f830e3891aa\\\"}, first: 50, orderBy: reserveUSD, orderDirection: desc) {\\n    id\\n    __typename\\n  token0 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  token1 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }}\\n}\\n\"}"
      // xhr.send(data);
    },

    async harvest({ state, dispatch }, poolId) {
      if (process.env.VUE_APP_PREVIEW) {
        Vue.prototype.$toasted.success(`Bribe farms are not open yet`, { duration: 5000 });
        return
      }
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.farmContracts[poolId]) {
        console.log("claim reward", poolId);
        Vue.prototype.$toasted.success('Please wait', { duration: 5000 });
        const res = await state.farmContracts[poolId].methods.getReward().send({from: state.metamaskAccount})
        Vue.prototype.$toasted.clear();
        if (res.status) {
          Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
          dispatch('getUserData');
        }
      } else {
        Vue.prototype.$toasted.clear();
        Vue.prototype.$toasted.error(`Bribe Farm: the contract is not connected`, { duration: 5000 });
      }
    },

    async approve({ state, dispatch }, poolId) {
      if (process.env.VUE_APP_PREVIEW) {
        Vue.prototype.$toasted.success(`Bribe farms are not open yet`, { duration: 5000 });
        return
      }

      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.stakeTokens[poolId]) {
        try {
          var spender = state.farmContracts[poolId].address;
          var allowance = process.env.VUE_APP_UINT_MAX;
          console.log(`approve poolId ${poolId} spender ${spender} allowance ${allowance}`)
          await state.stakeTokens[poolId].methods
            .approve(spender, allowance)
            .send({from:state.metamaskAccount});
          dispatch('getUserData');
        } catch (err) {
          console.error(`index:approve: ${err.message}`);
          Vue.prototype.$toasted.error(err.message, { duration: 5000 });
        }
      } else {
        Vue.prototype.$toasted.clear();
        Vue.prototype.$toasted.error(`The contract is not connected`, { duration: 5000 });
      }
    },

    async deposit({ state, dispatch }, args) {
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      var [poolId, amount] = args;
      if (state.farmContracts && state.farmContracts[poolId]) {
        try {
          console.log(`deposit poolId ${poolId} amount ${amount}`)
          Vue.prototype.$toasted.success('Please wait', { duration: 5000 });
          const res = await state.farmContracts[poolId].methods.stake((new BN((amount * 1e18).toLocaleString('fullwide', {useGrouping:false}), 10))).send({from:state.metamaskAccount})
          Vue.prototype.$toasted.clear();
          if (res.status) {
            Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
            dispatch('getUserData');
          }
        } catch (err) {
          if (err.code == 'INVALID_ARGUMENT')
            Vue.prototype.$toasted.error(`Invalid Amount`, { duration: 5000 });
          else {
            console.error(`Deposit: ${err}`);
            console.error(`index:deposit: ${err.message}`);
            Vue.prototype.$toasted.error(err.message, { duration: 5000 });
          }
        }
      } else {
        Vue.prototype.$toasted.clear();
        Vue.prototype.$toasted.error(`Bribe Farm: the contract is not connected`, { duration: 5000 });
      }
    },

    async withdraw({ state, dispatch }, args) {
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      var [poolId, amount] = args;
      if (state.farmContracts && state.farmContracts[poolId]) {
        try {
          console.log(`withdraw poolId ${poolId} amount ${amount}`)
          Vue.prototype.$toasted.success('Please wait', { duration: 5000 });
          const res = await state.farmContracts[poolId].methods.withdraw((new BN((amount * 1e18).toLocaleString('fullwide', {useGrouping:false}), 10))).send({from:state.metamaskAccount});
          Vue.prototype.$toasted.clear();
          if (res.status) {
            Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
            dispatch('getUserData');
          }
        } catch (err) {
          if (err.code == 'INVALID_ARGUMENT')
            Vue.prototype.$toasted.error(`Invalid Amount`, { duration: 5000 });
          else {
            console.error(`index:withdraw: ${err.message}`);
            Vue.prototype.$toasted.error(err.message, { duration: 5000 });
          }
        }
      } else {
        Vue.prototype.$toasted.clear();
        Vue.prototype.$toasted.error(`Bribe Farm: the contract is not connected`, { duration: 5000 });
      }
    },
    
    async withdrawAll({ state, dispatch }, poolId) {
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.farmContracts && state.farmContracts[poolId]) {
        try {
          console.log(`withdrawAll poolId ${poolId}`)
          Vue.prototype.$toasted.success('Please wait', { duration: 5000 });
          const res = await state.farmContracts[poolId].methods.exit().send({from:state.metamaskAccount});
          Vue.prototype.$toasted.clear();
          if (res.status) {
            Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
            dispatch('getUserData');
          }
        } catch (err) {
          if (err.code == 'INVALID_ARGUMENT')
            Vue.prototype.$toasted.error(`Invalid Amount`, { duration: 5000 });
          else {
            console.error(`index:withdrawAll: ${err.message}`);
            Vue.prototype.$toasted.error(err.message, { duration: 5000 });
          }
        }
      } else {
        Vue.prototype.$toasted.clear();
        Vue.prototype.$toasted.error(`Bribe Farm: the contract is not connected`, { duration: 5000 });
      }
    },
  },

  getters: {
    apy(state) {
      if (state.graph && state.stakingTotalSupply) {
        const token0 = state.graph.pairs0[0].token0;
        const yReward = (state.rewardPerBlock / state.bribeFarmSupply) * 31536000
        const bribePrice = token0.derivedETH
        const totalLiquidity = token0.totalLiquidity * 2 * token0.derivedETH
        const lpPrice = totalLiquidity / (state.stakingTotalSupply/1e18)
        if (lpPrice)
          // apy = (yReward * bribePrice) / lpPrice * 100
          return (yReward * bribePrice) / lpPrice * 100
      }
      return 0
    }
  },

  modules: {
    wallet: WalletModule
  }
})

const isCorrectNetwork = () => {
  console.log("window network version", window.ethereum.networkVersion)
  if (window.ethereum.networkVersion == (process.env.NODE_ENV === 'production' ? 1 : 3)) return true // ropsten = 3, mainnet = 1
  networkError();
  return false
}

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const networkError = debounce(() => {
  const desiredNetwork = process.env.NODE_ENV === 'production' ? 'MAINNET' : 'ROPSTEN';
  Vue.prototype.$toasted.error(`Wrong network, please connect to ${desiredNetwork}`, { duration: 5000});
}, 2000);
