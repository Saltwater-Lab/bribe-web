import Web3 from 'web3';
import farmingPoolABI from '../abi/FarmingPool';
import bribeTokenABI from '../abi/BribeToken';
import UniswapV2PairABI from '../abi/UniswapV2Pair';
import airdropDistributorABI from '../abi/AirdropDistributor';

const createBribeTokenContract = () => {
	const web3 = new Web3(window.ethereum || new Web3.providers.HttpProvider(process.env.VUE_APP_PROVIDER_HTTPS));
	const token = new web3.eth.Contract(bribeTokenABI, process.env.VUE_APP_BRIBE_ADDRESS);
	return token;
}

const createERC20Contract = (address) => {
	const web3 = new Web3(window.ethereum || new Web3.providers.HttpProvider(process.env.VUE_APP_PROVIDER_HTTPS));
	const token = new web3.eth.Contract(bribeTokenABI, address);
	return token;
}

const createUniswapPairContract = (address) => {
	const web3 = new Web3(window.ethereum || new Web3.providers.HttpProvider(process.env.VUE_APP_PROVIDER_HTTPS));
	const pair = new web3.eth.Contract(UniswapV2PairABI, address);
	return pair;
}

const createFarmContracts = () => {
	const web3 = new Web3(window.ethereum || new Web3.providers.HttpProvider(process.env.VUE_APP_PROVIDER_HTTPS));
	const fei = new web3.eth.Contract(farmingPoolABI, process.env.VUE_APP_FEI_FARM_ADDRESS);
	const feiBribeLP = new web3.eth.Contract(farmingPoolABI, process.env.VUE_APP_FEI_BRIBE_FARM_ADDRESS);
	const ethBribeLP = new web3.eth.Contract(farmingPoolABI, process.env.VUE_APP_ETH_BRIBE_FARM_ADDRESS);
	return [fei, feiBribeLP, ethBribeLP];
}

const createAirdropContract = () => {
	const web3 = new Web3(window.ethereum || new Web3.providers.HttpProvider(process.env.VUE_APP_PROVIDER_HTTPS));
	console.log("airdrop contract", process.env.VUE_APP_AIRDROP_CONTRACT_ADDRESS)
	const contract = new web3.eth.Contract(airdropDistributorABI, process.env.VUE_APP_AIRDROP_CONTRACT_ADDRESS);
	return contract
}

export { createBribeTokenContract, createFarmContracts, createERC20Contract, createUniswapPairContract, createAirdropContract };
