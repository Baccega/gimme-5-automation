import * as dotenv from 'dotenv'
import fetch from 'node-fetch'
import { urlEncode } from './utils'

dotenv.config()

const API_DOMAIN = 'https://5gimme5.acomea.it/api'
const TELEGRAM_DOMAIN = 'https://api.telegram.org/'

function createTelegramAPI() {
  return (endpoint: string, ...args: string[]) => {
    const params = [`chat_id=${process.env.TELEGRAM_USER_ID}`, `parse_mode=HTML`, ...args]
    const rawUrl = `${TELEGRAM_DOMAIN}bot${process.env.TELEGRAM_TOKEN}/${endpoint}?${params.join('&')}`
    return fetch(encodeURI(rawUrl))
  }
}

async function login() {
  const rawResponse = await fetch(`${API_DOMAIN}/login.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncode({
      userid: process.env.GIMMI_5_USERNAME,
      password: process.env.GIMMI_5_PASSWORD,
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

async function statusGlobal(API: any) {
  const rawResponse = await API('status.json')
  const response = await rawResponse.json()

  const { totalBalance, totalSavings } = response
  return { totalBalance: totalBalance.toFixed(2), totalSavings }
}

async function statusContracts(API: any) {
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
async function statusFunds(API: any, contracts: any) {
  const funds = await Promise.all(
    contracts.map(async (contract: any) => {
      const rawResponse = await API(`funds/${contract.productId}.json`)
      const response = await rawResponse.json()
      const fund = {
        id: contract.id,
        dailyVariation: response.dailyVariation.toFixed(2),
      }
      return fund
    })
  )

  return { funds }
}

function createMessage(totalBalance: any, totalSavings: any, contracts: any, funds: any) {
  const totalProfit = (totalBalance - totalSavings).toFixed(2)

  const balanceIcon = '💰'
  const savingsIcon = '🐖'
  const totalProfitIcon = Number(totalProfit) > 0 ? '💵' : '💸'

  const contractText = ({ id, productName, lastContractValue, savings }: any) => {
    const { dailyVariation } = funds.find((cur: any) => cur.id === id)
    const profit = (lastContractValue - savings).toFixed(2)

    const profitIcon = Number(profit) > 0 ? '💵' : '💸'
    const dailyVariationIcon = Number(dailyVariation) > 0 ? '📈' : '📉'

    const rows = [
      `<i>${productName}</i>`,
      `${balanceIcon}  <b>${lastContractValue}€</b>`,
      `${profitIcon}  ${profit}€`,
      `${dailyVariationIcon}  ${dailyVariation}%`,
    ]
    return rows.join('\n')
  }

  const rows = [
    `🟠 <b>GIMMIE 5</b>`,
    ``,
    `${balanceIcon}  <b>${totalBalance}€</b>`,
    `${savingsIcon}  ${totalSavings}€`,
    `${totalProfitIcon}  ${totalProfit}€`,
    ``,
    `${contracts.map(contractText).join('\n\n')}`,
  ]

  const formattedRows = rows.map((cur) => cur.replace(/\./g, ','))
  return formattedRows.join('\n')
}

async function sendTelegram(message: string) {
  const TELEGRAM_API = createTelegramAPI()
  await TELEGRAM_API('sendMessage', `text=${message}`)
}

async function main() {
  const { API } = await login()
  const { totalBalance, totalSavings } = await statusGlobal(API)
  const { contracts } = await statusContracts(API)
  const { funds } = await statusFunds(API, contracts)

  const message = createMessage(totalBalance, totalSavings, contracts, funds)

  await sendTelegram(message)

  console.log(message)
  console.log('ALL DONE!')
}

main()
