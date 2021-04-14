// import { apiGet, apiPost } from './default'
const requestClient = require('request')


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
  checkAirDropStatus
}
