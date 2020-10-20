export type History = {
  lastProfit: number
  contracts: ContractHistory[]
}

export type ContractHistory = {
  id: string
  lastProfit: number
}
