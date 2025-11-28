import type { WorkerParams, SimulationResult } from '../types';

self.onmessage = (e: MessageEvent<{ params: WorkerParams; traderId: string; profileId: string }>) => {
    const { params, traderId, profileId } = e.data;
    const {
        numberOfTrades,
        riskRewardRatio,
        winRate,
        aggressiveCommission,
        passiveCommission,
        passiveAggressiveRate,
        slippage,
        executionSlippageErrorRate,
        riskTakenPerTradeTicks,
        initialEquity,
    } = params;

    const tickSize = 0.01;
    const shares = 100;
    const tickValue = tickSize * shares; // $1 per tick for 100 shares

    let currentEquity = initialEquity;
    const data = [];

    // Initial point
    data.push({ tradeNumber: 0, equity: currentEquity, pnl: 0 });

    for (let i = 1; i <= numberOfTrades; i++) {
        const isWin = Math.random() < winRate;

        // Calculate Gross PnL in Ticks
        let pnlTicks = 0;
        if (isWin) {
            pnlTicks = riskTakenPerTradeTicks * riskRewardRatio;
        } else {
            // Loss case: check for risk management error
            let currentRisk = riskTakenPerTradeTicks;
            if (Math.random() < params.riskManagementErrorRate) {
                currentRisk *= params.riskManagementErrorMultiplier;
            }
            pnlTicks = -currentRisk;
        }

        // Apply Slippage
        let totalSlippageTicks = 0;
        if (Math.random() < executionSlippageErrorRate) {
            totalSlippageTicks += slippage;
        }
        if (Math.random() < executionSlippageErrorRate) {
            totalSlippageTicks += slippage;
        }

        pnlTicks -= totalSlippageTicks;

        // Calculate Commission
        let commission = 0;

        // Entry
        if (Math.random() < passiveAggressiveRate) {
            commission += passiveCommission;
        } else {
            commission += aggressiveCommission;
        }

        // Exit
        if (Math.random() < passiveAggressiveRate) {
            commission += passiveCommission;
        } else {
            commission += aggressiveCommission;
        }

        // Net PnL ($)
        const tradePnL = (pnlTicks * tickValue) - commission;
        currentEquity += tradePnL;

        data.push({
            tradeNumber: i,
            equity: currentEquity,
            pnl: tradePnL
        });
    }

    const result: SimulationResult = {
        traderId,
        profileId,
        data,
        finalEquity: currentEquity
    };

    self.postMessage(result);
};
