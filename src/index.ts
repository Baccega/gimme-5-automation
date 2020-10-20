import * as dotenv from 'dotenv'
import storage from 'node-persist'
import { sendTelegramMessage } from './Telegram'
import { fetchGimme5Data } from './Api'
import { History } from 'History'
import { ContractData, Gimme5Data } from 'Gimme5'

dotenv.config()

function createMessage({ totalBalance, totalSavings, totalProfit, dailyTotalProfit, contracts }: Gimme5Data) {
  const devWarning = process.env.NODE_ENV === 'development' ? '⚠️ DEV  ' : ''
  const balanceIcon = '💰'
  const savingsIcon = '🐖'
  const totalProfitIcon = totalProfit > 0 ? '💵' : '💸'
  const totalDailyProfitIcon = dailyTotalProfit > 0 ? '📈' : '📉'
  const totalDailyProfitReaction = dailyTotalProfit > 0 ? '🎉' : '❗'

  const contractText = ({ id, name, balance, profit, dailyVariation, dailyProfitVariation }: ContractData) => {
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
      `<i>${name}</i>`,
      `${balanceIcon}  <b>${balance}€</b>`,
      `${profitIcon}  ${profit}€`,
      `${dailyVariationIcon}  ${dailyProfitVariation}€ (${dailyVariation}%)  ${reaction}`,
    ]
    return rows.join('\n')
  }

  const rows = [
    `${devWarning}🟠 <b>GIMME 5</b>`,
    ``,
    `${balanceIcon}  <b>${totalBalance}€</b>`,
    `${savingsIcon}  ${totalSavings}€`,
    `${totalProfitIcon}  ${totalProfit}€`,
    `${totalDailyProfitIcon}  ${dailyTotalProfit}€  ${totalDailyProfitReaction}`,
    ``,
    `${contracts.map(contractText).join('\n\n')}`,
  ]

  const formattedRows = rows.map((cur) => cur.replace(/\./g, ','))
  return formattedRows.join('\n')
}

async function main() {
  await storage.init({ dir: './storage' })

  const data: Gimme5Data = await fetchGimme5Data()

  // const data: Gimme5Data = {
  //   totalBalance: 1604.21,
  //   totalSavings: 1600,
  //   totalProfit: 4.21,
  //   dailyTotalProfit: 5.79,
  //   contracts: [
  //     {
  //       id: '426217',
  //       name: 'ACOMEA BREVE TERMINE',
  //       balance: 1456.92,
  //       profit: 6.92,
  //       dailyVariation: 0.13,
  //       dailyProfitVariation: -2.77,
  //     },
  //     {
  //       id: '446937',
  //       name: 'ACOMEA PERFORMANCE',
  //       balance: 147.29,
  //       profit: -2.71,
  //       dailyVariation: 0.21,
  //       dailyProfitVariation: -0.29,
  //     },
  //   ],
  // }

  const message = createMessage(data)

  await sendTelegramMessage(message)

  console.log(message)
  console.log('ALL DONE!')
}

main()
