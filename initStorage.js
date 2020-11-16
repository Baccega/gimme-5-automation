const storage = require('node-persist')

async function main() {
  await storage.init({ dir: './storage' })
  await Promise.all([
    storage.setItem(`lastProfit`, LAST_TOTAL_PROFIT),
    storage.setItem(`${CONTRACT_ID}#lastProfit`, LAST_CONTRACT_PROFIT),
  ])
}

main()
