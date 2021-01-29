export type Gimme5Data = {
  totalBalance: number
  totalSavings: number
  realSavings: number
  totalProfit: number
  totalCosts: number
  dailyTotalProfit: number
  contracts: ContractData[]
}

export type ContractData = {
  id: string
  name: string
  balance: number
  profit: number
  dailyVariation: number
  dailyProfitVariation: number
}
