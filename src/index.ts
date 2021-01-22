import * as dotenv from 'dotenv'
import storage from 'node-persist'
import { sendTelegramMessage } from './Telegram'
import { fetchGimme5Data } from './Api'
import { History } from 'History'
import { Gimme5Data } from 'Gimme5'
import { createMessage } from './Message'

dotenv.config()

async function main() {
  await storage.init({ dir: './storage' })

  const data: Gimme5Data = await fetchGimme5Data()

  // const data: Gimme5Data = {
  //   totalBalance: 3191.98,
  //   totalSavings: 3288.96,
  //   totalProfit: 103.02,
  //   totalCosts: 2.1,
  //   dailyTotalProfit: 0,
  //   contracts: [
  //     {
  //       id: '426217',
  //       name: 'ACOMEA BREVE TERMINE',
  //       balance: 2680.14,
  //       profit: 90.14,
  //       dailyVariation: 0.08,
  //       dailyProfitVariation: 0,
  //     },
  //     {
  //       id: '446937',
  //       name: 'ACOMEA PERFORMANCE',
  //       balance: 511.84,
  //       profit: 12.88,
  //       dailyVariation: 0.4,
  //       dailyProfitVariation: 0,
  //     },
  //   ],
  // }

  if (data.dailyTotalProfit !== 0) {
    const message = createMessage(data)

    await sendTelegramMessage(message)

    console.log(message)
    console.log('ALL DONE!')
  } else {
    console.log('Skipped')
  }
}

main()
