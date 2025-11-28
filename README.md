# PnL Simulator

A Monte Carlo simulation tool for analyzing intraday trader profit and loss paths. Compare different trading strategies by simulating thousands of trades with customizable parameters.

## Description

The **PnL Simulator** is a powerful Monte Carlo simulation tool designed for traders and analysts to visualize the potential outcomes of different trading strategies over time. By simulating thousands of trades based on probabilistic parameters, it helps in understanding the variance, risk, and potential profitability of a strategy before risking real capital. It allows you to run multiple "paths" (simulations) for the same strategy to see the range of possible outcomes, highlighting the role of luck and randomness in trading.

## Input Parameters

### Global Parameters
These settings apply to the overall simulation environment.

- **Number of Trades**: The total number of trades to simulate for each path (e.g., 10,000 trades).
- **Initial Equity ($)**: The starting account balance.
- **Aggressive Commission ($)**: The fee paid per trade when taking liquidity (market orders).
- **Passive Commission ($)**: The fee paid (or rebate received, if negative) per trade when providing liquidity (limit orders).

### Trader Profile Configuration
These settings define the specific strategy and behavior of a trader.

- **Profile Name**: A label to identify the strategy (e.g., "Scalper", "Swing Trader").
- **Number of Paths**: How many separate simulation runs to execute for this single profile. This helps visualize the variance/randomness of the strategy.
- **Risk/Reward Ratio**: The ratio of potential profit to potential loss (e.g., 2.0 means you aim to make $2 for every $1 risked).
- **Win Rate (0-1)**: The probability of a trade being a winner (e.g., 0.50 for 50%).
- **Risk Per Trade (Ticks)**: The amount of price movement (in ticks) you are willing to lose on a trade.
- **Passive Order Rate (0-1)**: The percentage of trades executed with limit orders (passive) vs. market orders (aggressive). This affects which commission rate is applied.
- **Slippage (Ticks)**: The number of ticks lost due to poor execution or market movement when slippage occurs.
- **Slippage Probability (0-1)**: The likelihood of experiencing slippage on any given trade.
- **Risk Mgmt Error Rate (0-1)**: The probability that the trader makes a mistake and fails to cut a loss at the planned stop level.
- **Risk Mgmt Multiplier**: The multiplier applied to the loss when a risk management error occurs (e.g., 2.0 means the loss is double the intended risk).

## Live Demo

[View the live application](https://adragan010.github.io/simulator/)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This project automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist folder to GitHub Pages
```

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI** - Component library
- **Recharts** - Data visualization
- **Web Workers** - Parallel processing

## License

MIT
