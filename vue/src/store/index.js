import Vue from 'vue'
import Vuex from 'vuex'

          // eslint-disable-next-line no-unused-vars
import { createERC20Contract, createBribeTokenContract, createFarmContracts, createUniswapPairContract, createAirdropContract } from '../utils/contract';
import WalletModule from './WalletModule';
import MetamaskConnector from '@/utils/MetamaskConnector.js'
import api from '@/api'

Vue.use(Vuex)

const BN = require('bn.js');

const VUE_APP_PREVIEW = JSON.parse(process.env.VUE_APP_PREVIEW) // only supports true/false

export default new Vuex.Store({
  state: {
    metamaskConnector: null,
    bribeToken: null,
    airdropDistributor: null,
    farmContracts: [], // 3 pools
    stakeTokens: [], // 3 tokens 
    farmInfo: [
      {
        totalStaked: 0,
        rewardPerToken: 0,
        withdrawFee: 0
      },
      {
        totalStaked: 0,
        rewardPerToken: 0,
        withdrawFee: 0
      },
      {
        totalStaked: 0,
        rewardPerToken: 0,
        withdrawFee: 0
      }
    ],

    // user specific data
    isAirdropClaimed: false,
    metamaskAccount: null,
    bribeBalance: 0,
    isApproved: [null, null, null],
    earned: [0, 0, 0],
    availableToDeposit: [0, 0, 0],
    bribeFarmBalance: [0, 0, 0],
    nextClaimTime: [0, 0, 0],

    // price data
    coinPrices: [
      { id: 'fei-protocol', ticker: 'FEI', usd: null },
      { id: 'ethereum', ticker: 'ETH', usd: null }
    ],

    // uniswap pair data
    lpData: [
      { name: 'BRIBE-FEI', address: process.env.VUE_APP_FEI_BRIBE_LP_ADDRESS },
      { name: 'BRIBE-ETH', address: process.env.VUE_APP_ETH_BRIBE_LP_ADDRESS }
    ],


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

    setAirdropDistributor(state, payload) {
      state.airdropDistributor = payload
    },

    setIsAirdropClaimed(state, payload) {
      state.isAirdropClaimed = payload
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
    
    setFarmInfo(state, payload) {
      state.farmInfo = payload
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

    setNextClaimTime(state, payload) {
      state.nextClaimTime = payload
    },

    setStakingTotalSupply(state, payload) {
      state.stakingTotalSupply = payload;
    },

    setCoinPrices(state, payload) {
      state.coinPrices = payload;
    },

    setLpData(state, payload) {
      state.lpData = payload;
    },

    resetUser(state) {
      state.metamaskAccount = null;
      state.bribeBalance = 0;
      state.isApproved = [null, null, null];
      state.earned = [0, 0, 0];
      state.availableToDeposit = [0, 0, 0];
      state.bribeFarmBalance = [0, 0, 0];
      state.nextClaimTime = [0, 0, 0];
      localStorage.removeItem('account-unlocked');
    }
  },

  actions: {
    async connectMetamask({state, commit, dispatch}) {
      //console.log('env:', process.env);


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

        commit('setAirdropDistributor', createAirdropContract());

        
        // fetch fei and eth prices
        const res = await api.getCoinsPrice()
        const newPrices = state.coinPrices.map((el) => {
          return {
            ticker: el.ticker,
            usd: parseFloat(res[el.id].usd)
          }
        })
        commit('setCoinPrices', newPrices)

        var loadContract = async (item) => {
          const contract = createUniswapPairContract(item.address)
          const result = await contract.methods.getReserves().call() // result._reserve0 is a string of big number
          const reserve0 = parseFloat(result._reserve0)
          const reserve1 = parseFloat(result._reserve1)
          const token0 = await contract.methods.token0().call()
          const bribeIndex = token0.toLowerCase() == process.env.VUE_APP_BRIBE_ADDRESS.toLowerCase() ? 0 : 1
          const bribePrice = bribeIndex == 0 ? reserve1 / reserve0 : reserve0 / reserve1
          
          const totalSupply = await contract.methods.totalSupply().call()

        
          const info = {
            name: item.name,
            address: item.address,
            contract: contract,
            reserve0: reserve0,
            reserve1: reserve1,
            totalSupply: totalSupply,
            bribePrice: bribePrice,
            bribeIndex: bribeIndex
          }
          return info
        }

        commit('setLpData', [await loadContract(state.lpData[0]), await loadContract(state.lpData[1])])

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

      dispatch('getFarmInfo');

      commit('setFirstEnter', false);
    },

    async connectAccount({state, commit, dispatch}) {
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
      if (VUE_APP_PREVIEW) { console.log("preview version"); return; }
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

          commit('setNextClaimTime', [
            parseInt(await state.farmContracts[0].methods.nextClaimTime(state.metamaskAccount).call()),
            0,
            0
          ])
  
          commit('setIsApproved', [
            (await state.stakeTokens[0].methods.allowance(state.metamaskAccount, process.env.VUE_APP_FEI_FARM_ADDRESS).call()) > 0,
            (await state.stakeTokens[1].methods.allowance(state.metamaskAccount, process.env.VUE_APP_FEI_BRIBE_FARM_ADDRESS).call()) > 0,
            (await state.stakeTokens[2].methods.allowance(state.metamaskAccount, process.env.VUE_APP_ETH_BRIBE_FARM_ADDRESS).call()) > 0,
          ]);
  
          commit('setAvailableToDeposit', [
            await state.stakeTokens[0].methods.balanceOf(state.metamaskAccount).call(),
            await state.stakeTokens[1].methods.balanceOf(state.metamaskAccount).call(),
            await state.stakeTokens[2].methods.balanceOf(state.metamaskAccount).call(),
          ]);
          
          commit('setBribeFarmBalance', [
            await state.farmContracts[0].methods.balanceOf(state.metamaskAccount).call(),
            await state.farmContracts[1].methods.balanceOf(state.metamaskAccount).call(),
            await state.farmContracts[2].methods.balanceOf(state.metamaskAccount).call(),
          ]);

        }
        console.log("user bribe balance", state.bribeBalance)
        console.log("isApproved", state.isApproved)
        console.log("earned", state.earned)
        console.log("avaiable to deposit", state.availableToDeposit)
        console.log("farm staked balance", state.bribeFarmBalance)
        console.log("next claim time", state.nextClaimTime)

      } catch (err) {
        console.log(err)
        if (!isCorrectNetwork()) {
          console.error(`index:getUserData: ${err.message}`);
          Vue.prototype.$toasted.error(`Bribe Farm: ${err.message}`, { duration: 5000 });
        }
      }
    },

    async getFarmInfo({ commit, state }) {
      if (VUE_APP_PREVIEW) { return; }
      if (state.farmContracts.length > 0) {
        try {
          // farmInfo: an array of
          // {
            //   totalStaked: 0,
            //   rewardPerToken: 0
            // }
          let result = await Promise.all([
            state.farmContracts[0].methods.totalSupply().call(),
            state.farmContracts[1].methods.totalSupply().call(),
            state.farmContracts[2].methods.totalSupply().call(),
            state.farmContracts[0].methods.rewardPerToken().call(),
            state.farmContracts[1].methods.rewardPerToken().call(),
            state.farmContracts[2].methods.rewardPerToken().call(),
            state.farmContracts[0].methods.getRewardForDuration().call(),
            state.farmContracts[1].methods.getRewardForDuration().call(),
            state.farmContracts[2].methods.getRewardForDuration().call()

          ])
          
          commit('setFarmInfo', [
            {
              totalStaked: result[0],
              rewardPerToken: result[3],
              rewardForDuration: result[6],
              withdrawFee: 1, // NOTE: manual config to save a few contract calls
              hasClaimDelay: true
            },
            {
              totalStaked: result[1],
              rewardPerToken: result[4],
              rewardForDuration: result[7],
              withdrawFee: 0,
              hasClaimDelay: false
            },
            {
              totalStaked: result[2],
              rewardPerToken: result[5],
              rewardForDuration: result[8],
              withdrawFee: 0,
              hasClaimDelay: false
            }
          ]);
        
          console.log('farmInfo',state.farmInfo)
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

    async claimAirdrop({ state, dispatch }, args) {
      var [index, amount, proof] = args
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.airdropDistributor) {
        Vue.prototype.$toasted.success('Please wait for the transaction', { duration: 0 });
        console.log(index, state.metamaskAccount, amount, proof)
        const res = await state.airdropDistributor.methods.claim(index, state.metamaskAccount, amount, proof)
          .send({from: state.metamaskAccount})
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

    async harvest({ state, dispatch }, poolId) {
      if (VUE_APP_PREVIEW) {
        Vue.prototype.$toasted.success(`Bribe farms are not open yet`, { duration: 5000 });
        return
      }
      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.earned[poolId] <= 0) {
        Vue.prototype.$toasted.error(`No claimable rewards`, { duration: 5000 });
        return
      }
      if (state.farmContracts[poolId]) {
        console.log("claim reward", poolId);
        Vue.prototype.$toasted.success('Please wait for the transaction', { duration: 0 });
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
      if (VUE_APP_PREVIEW) {
        Vue.prototype.$toasted.success(`Bribe farms are not open yet`, { duration: 5000 });
        return
      }

      if (!state.metamaskAccount) {
        Vue.prototype.$bus.$emit('open-wallet-modal');
        return
      }
      if (state.stakeTokens[poolId]) {
        try {
          var spender = state.farmContracts[poolId]._address;
          var allowance = process.env.VUE_APP_UINT_MAX;
          Vue.prototype.$toasted.success('Please wait for the transaction', { duration: 0 });
          console.log(`approve poolId ${poolId} spender ${spender} allowance ${allowance}`)
          const res = await state.stakeTokens[poolId].methods
            .approve(spender, allowance)
            .send({from:state.metamaskAccount});
          Vue.prototype.$toasted.clear();
          if (res.status) {
            Vue.prototype.$toasted.success('Transaction confirmed!', { duration: 5000 });
            dispatch('getUserData');
          }
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
          Vue.prototype.$toasted.success('Please wait for the transaction', { duration: 0 });
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
          Vue.prototype.$toasted.success('Please wait for the transaction', { duration: 0 });
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
          Vue.prototype.$toasted.success('Please wait for the transaction', { duration: 0 });
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
  },

  modules: {
    wallet: WalletModule
  }
})

const isCorrectNetwork = () => {
  if (window.ethereum.networkVersion === null) {
    window.ethereum.enable()
  }
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
