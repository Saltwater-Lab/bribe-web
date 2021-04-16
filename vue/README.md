# Bribe-Frontend

## Preview Version
set .env PREVIEW_VERSION=true for a preview version that only allows checking airdrop. all other functions are disabled

## Smart Contact Configs
Ropsten Testnet

need to set .env file

fei pool 0x209120779A322aA0C26Bc15DF8d90be1aBc845ee

fei-bribe pool 0xC806881Bfc22351AF2B67d4e025C1372e0F880E4

bribe-eth pool 0xafa179EEbCB7010ff7Ec8eab2760dbA96B4B83Db

fei token 0xFab46E002BbF0b4509813474841E0716E6730136 (get testnet token at https://erc20faucet.com/)

bribe token 0xFE0A6ADbfA14C515Ee9D1bE26a1AA8252Dd1921E

fei-bribe LP 0x8d2dfd9a3411d3765b3cc8119f9f1bbf7f77c620

bribe-eth LP 0xb203a5e646c18c3afb1e5e6a341c1e718f7026c9

### Deposit

1. token.approve(spender, amount) spender is pool address, amount is "0xffffff..."

2. pool.stake(amount)

## How to run

- run `yarn`
- run `yarn start`

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

### `yarn clean`

Removes the build directory and stats.json file.

### `yarn compile`

Same as `yarn build` but without first removing the build directory and stats.json file. If you
have any `rimraf` related errors, you can delete the build directory and run this manually.
