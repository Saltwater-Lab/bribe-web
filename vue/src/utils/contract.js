import Web3 from 'web3';
import farmingPoolABI from '../abi/FarmingPool';
import bribeTokenABI from '../abi/BribeToken';

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

const createFarmContracts = () => {
	const web3 = new Web3(window.ethereum || new Web3.providers.HttpProvider(process.env.VUE_APP_PROVIDER_HTTPS));
	const fei = new web3.eth.Contract(farmingPoolABI, process.env.VUE_APP_FEI_FARM_ADDRESS);
	const feiBribeLP = new web3.eth.Contract(farmingPoolABI, process.env.VUE_APP_FEI_BRIBE_FARM_ADDRESS);
	const ethBribeLP = new web3.eth.Contract(farmingPoolABI, process.env.VUE_APP_ETH_BRIBE_FARM_ADDRESS);
	return [fei, feiBribeLP, ethBribeLP];
}

export { createBribeTokenContract, createFarmContracts, createERC20Contract };
