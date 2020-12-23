import { Gimme5Data } from 'Gimme5'
import fetch from 'node-fetch'
import { getHistory, saveHistory } from './History'
import { ContractData } from './types/Gimme5'
import { urlEncode } from './utils'

const API_DOMAIN = 'https://5gimme5.acomea.it/api'

export async function fetchGimme5Data(): Promise<Gimme5Data> {
  const { API } = await login()
  const { totalBalance, totalSavings, totalRefunds } = await statusGlobal(API)
  const totalProfit = Number((totalBalance - totalSavings + totalRefunds).toFixed(2))

  const { contracts } = await statusContracts(API)
  const { funds } = await statusFunds(API, contracts)

  const history = await getHistory(contracts)

  const contractsData = contracts.map(({ id, productName, lastContractValue, savings, refunds }) => {
    const fundsData: any = funds.find((cur: any) => cur.id === id)
    const dailyVariation = Number(fundsData.dailyVariation)

    const contractHistory = history.contracts.find((cur: any) => cur.id === id)
    const lastProfit = Number(contractHistory?.lastProfit)

    const profit = Number((lastContractValue - savings + refunds).toFixed(2))
    const dailyProfitVariation = Number((profit - lastProfit).toFixed(2))

    return {
      id,
      name: productName,
      balance: lastContractValue,
      profit,
      dailyVariation,
      dailyProfitVariation,
    }
  })

  await saveHistory(totalProfit, contracts)

  return {
    totalBalance,
    totalSavings,
    totalProfit,
    dailyTotalProfit: Number((totalProfit - Number(history.lastProfit)).toFixed(2)),
    contracts: contractsData,
  }
}

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

  const { totalBalance, totalSavings, totalRefunds } = response
  return { totalBalance: totalBalance.toFixed(2), totalSavings, totalRefunds }
}

export async function statusContracts(API: any) {
  const rawResponse = await API('contracts.json', 'numberOfResults=undefined')
  const response = await rawResponse.json()

  const contracts = await Promise.all(
    Object.values(response).map(async (cur: any) => {
      const rawResponse2 = await API(`contracts/${cur.id}.json`)
      const response2 = await rawResponse2.json()

      return {
        id: cur.id,
        lastContractValue: Number(cur.lastContractValue.toFixed(2)),
        savings: cur.savings,
        refunds: response2.refunds,
        productId: cur.productId,
        productName: cur.productName,
      }
    })
  )

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
