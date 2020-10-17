import * as dotenv from 'dotenv'
import { sendTelegramMessage } from './Telegram'
import { login, statusContracts, statusFunds, statusGlobal } from './Api'

dotenv.config()

function createMessage(totalBalance: any, totalSavings: any, contracts: any, funds: any) {
  const totalProfit = Number((totalBalance - totalSavings).toFixed(2))

  const balanceIcon = '💰'
  const savingsIcon = '🐖'
  const totalProfitIcon = totalProfit > 0 ? '💵' : '💸'

  const contractText = ({ id, productName, lastContractValue, savings }: any) => {
    const { dailyVariation } = funds.find((cur: any) => cur.id === id)
    const profit = Number((lastContractValue - savings).toFixed(2))

    const profitIcon = profit > 0 ? '💵' : '💸'
    const dailyVariationIcon = dailyVariation > 0 ? '📈' : '📉'

    const singleReactionEmoji = dailyVariation > 0 ? '🎉' : '❗️'
    const multiReactionEmoji = dailyVariation > 0 ? '🎊' : '‼️'

    const reactionNumber = Math.round(Math.abs(dailyVariation) * 10)
    const reaction =
      reactionNumber === 0
        ? ''
        : reactionNumber === 1
        ? singleReactionEmoji
        : multiReactionEmoji.repeat(reactionNumber / 2)

    const rows = [
      `<i>${productName}</i>`,
      `${balanceIcon}  <b>${lastContractValue}€</b>`,
      `${profitIcon}  ${profit}€`,
      `${dailyVariationIcon}  ${dailyVariation}% ${reaction}`,
    ]
    return rows.join('\n')
  }

  const rows = [
    `🟠 <b>GIMME 5</b>`,
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

async function main() {
  const { API } = await login()
  const { totalBalance, totalSavings } = await statusGlobal(API)
  const { contracts } = await statusContracts(API)
  const { funds } = await statusFunds(API, contracts)
  // const totalBalance = 1257.0
  // const totalSavings = 1233.0
  // const contracts = [
  //   {
  //     id: 426217,
  //     lastContractValue: 1159.69,
  //     savings: 1150,
  //     productId: 'B2',
  //     productName: 'ACOMEA BREVE TERMINE',
  //   },
  //   {
  //     id: 446937,
  //     lastContractValue: 97.58,
  //     savings: 100,
  //     productId: 'R2',
  //     productName: 'ACOMEA PERFORMANCE',
  //   },
  // ]
  // const funds = [
  //   { id: 426217, dailyVariation: '0.15' },
  //   { id: 446937, dailyVariation: '-0.35' },
  // ]

  const message = createMessage(totalBalance, totalSavings, contracts, funds)

  await sendTelegramMessage(message)

  console.log(message)
  console.log('ALL DONE!')
}

main()
