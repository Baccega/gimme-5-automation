import { ContractData, Gimme5Data } from 'Gimme5'

const WARNING_ICON = '⚠️'
const BALANCE_ICON = '💰'
const SAVINGS_ICON = '🐖'
const COSTS_ICON = '🔥'
const PROFIT_ICON = '💵'
const LOSS_ICON = '💸'
const INCREASE_ICON = '📈'
const DECREASE_ICON = '📉'
const JOY_ICON = '🎉'
const JOY_2_ICON = '🎊'
const SAD_ICON = '❗'
const SAD_2_ICON = '‼️'

export function createMessage({
  totalBalance,
  totalSavings,
  totalCosts,
  totalProfit,
  dailyTotalProfit,
  contracts,
}: Gimme5Data): string {
  const devWarning = process.env.NODE_ENV === 'development' ? `${WARNING_ICON} DEV  ` : ''

  const totalProfitIcon = totalProfit > 0 ? PROFIT_ICON : LOSS_ICON
  const totalDailyProfitIcon = dailyTotalProfit > 0 ? INCREASE_ICON : DECREASE_ICON
  const totalDailyProfitReaction = dailyTotalProfit > 0 ? JOY_ICON : SAD_ICON

  const contractText = ({ id, name, balance, profit, dailyVariation, dailyProfitVariation }: ContractData) => {
    const profitIcon = profit > 0 ? PROFIT_ICON : LOSS_ICON
    const dailyVariationIcon = dailyVariation > 0 ? INCREASE_ICON : DECREASE_ICON

    const singleReactionEmoji = dailyVariation > 0 ? JOY_ICON : SAD_ICON
    const multiReactionEmoji = dailyVariation > 0 ? JOY_2_ICON : SAD_2_ICON

    const reactionNumber = Math.round(Math.abs(dailyVariation) * 10)
    const reaction =
      reactionNumber === 0
        ? ''
        : reactionNumber === 1
        ? singleReactionEmoji
        : multiReactionEmoji.repeat(reactionNumber / 2)

    const rows = [
      `<i>${name}</i>`,
      `${BALANCE_ICON}  <b>${balance}€</b>`,
      `${profitIcon}  ${profit}€`,
      `${dailyVariationIcon}  ${dailyProfitVariation}€ (${dailyVariation}%)  ${reaction}`,
    ]
    return rows.join('\n')
  }

  const rows = [
    `${devWarning}🟠 <b>GIMME 5</b>`,
    ``,
    `${BALANCE_ICON}  <b>${totalBalance}€</b>`,
    `${SAVINGS_ICON}  ${totalSavings}€`,
    `${COSTS_ICON}  ${totalCosts}€`,
    `${totalProfitIcon}  ${totalProfit}€`,
    `${totalDailyProfitIcon}  ${dailyTotalProfit}€  ${totalDailyProfitReaction}`,
    ``,
    `${contracts.map(contractText).join('\n\n')}`,
  ]

  const formattedRows = rows.map((cur) => cur.replace(/\./g, ','))
  return formattedRows.join('\n')
}
