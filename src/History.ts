import { History } from 'History'
import storage from 'node-persist'

export async function saveHistory(lastProfit: any, contracts: any) {
  await Promise.all([
    storage.setItem(`lastProfit`, lastProfit),
    ...contracts.map(({ id, lastContractValue, savings }: any) =>
      storage.setItem(`${id}#lastProfit`, Number((lastContractValue - savings).toFixed(2)))
    ),
  ])
}

export async function getHistory(contracts: any): Promise<History> {
  const [lastProfitData, ...contractsData] = await Promise.all([
    storage.getItem('lastProfit'),
    ...contracts.map(async ({ id }: any) => ({ id, lastProfit: (await storage.getItem(`${id}#lastProfit`)) ?? 0 })),
  ])
  return { lastProfit: lastProfitData, contracts: [...contractsData] }
}
