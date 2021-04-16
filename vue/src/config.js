export default {
	// providerHost: 'https://mainnet.infura.io',
	providerHost: process.env.VUE_APP_PROVIDER_HTTPS,
	providerWsUrl: process.env.VUE_APP_PROVIDER_WSS,

	// Network. 1 - mainnet; 3 - ropsten;
	networkId: 3,
	path: "44'/60'/0'/0/0"
}
