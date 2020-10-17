import fetch from 'node-fetch'
import { urlEncode } from './utils'

const API_DOMAIN = 'https://5gimme5.acomea.it/api'

export async function login() {
  const rawResponse = await fetch(`${API_DOMAIN}/login.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncode({
      userid: process.env.GIMME_5_USERNAME,
      password: process.env.GIMME_5_PASSWORD,
      appName: 'G5APIWebV3',
      hidden: '',
    }),
  })
  const { token } = await rawResponse.json()

  const API = (endpoint: string, ...args: string[]) => {
    const params = [`token=${token}`, `apiVersion=306`, ...args]
    return fetch(`${API_DOMAIN}/${endpoint}?${params.join('&')}`)
  }

  return { token, API }
}

export async function statusGlobal(API: any) {
  const rawResponse = await API('status.json')
  const response = await rawResponse.json()

  const { totalBalance, totalSavings } = response
  return { totalBalance: totalBalance.toFixed(2), totalSavings }
}

export async function statusContracts(API: any) {
  const rawResponse = await API('contracts.json', 'numberOfResults=undefined')
  const response = await rawResponse.json()

  const contracts = Object.values(response).map((cur: any) => ({
    id: cur.id,
    lastContractValue: Number(cur.lastContractValue.toFixed(2)),
    savings: cur.savings,
    productId: cur.productId,
    productName: cur.productName,
  }))

  return { contracts }
}
export async function statusFunds(API: any, contracts: any) {
  const funds = await Promise.all(
    contracts.map(async (contract: any) => {
      const rawResponse = await API(`funds/${contract.productId}.json`)
      const response = await rawResponse.json()
      const fund = {
        id: contract.id,
        dailyVariation: Number(response.dailyVariation.toFixed(2)),
      }
      return fund
    })
  )

  return { funds }
}
