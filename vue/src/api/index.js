// import { apiGet, apiPost } from './default'
const requestClient = require('request')

function getCoinsPrice () {
  const uri = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,fei-protocol,frax,basis-cash,Empty-Set-Dollar,Dynamic-Set-Dollar&vs_currencies=usd'
  return new Promise((resolve, reject) => {

    requestClient.get(
      {
        uri,
        json: true
      },
      (error, response) => {
        if (error) reject(error)
        debugger; //eslint-disable-line
        resolve(response.body)
      }
    )
  })
}

function checkAirDropStatus (address) {
  const url = `https://df2eqc5ufb.execute-api.us-east-1.amazonaws.com/default/bribe_airdrop?address=${address}`
  return new Promise((resolve, reject) => {
    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response) => {
        if (error) reject(error)

        resolve(response.body)
      }
    )
  })
}

export default {
  getCoinsPrice,
  checkAirDropStatus
}
