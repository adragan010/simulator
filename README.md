# PnL Simulator

A Monte Carlo simulation tool for analyzing intraday trader profit and loss paths. Compare different trading strategies by simulating thousands of trades with customizable parameters.

## Features

- **Global Parameters**: Set number of trades, initial equity, and commission structure
- **Multiple Trader Profiles**: Compare different strategies side-by-side
- **Real-time Visualization**: Interactive charts showing accumulated PnL over time
- **Web Workers**: Non-blocking simulations using parallel processing
- **Customizable Parameters**:
  - Risk/Reward Ratio
  - Win Rate
  - Risk per Trade (in ticks)
  - Passive vs Aggressive Order Rate
  - Slippage and Execution Error Rate

## Live Demo

[View the live application](https://yourusername.github.io/path-simulator/)

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
