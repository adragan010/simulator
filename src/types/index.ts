export interface GlobalParams {
    numberOfTrades: number;
    initialEquity: number;
    aggressiveCommission: number;
    passiveCommission: number;
}

export interface TraderProfile {
    id: string;
    name: string;
    pathCount: number; // Number of simulation paths for this configuration
    riskRewardRatio: number;
    winRate: number; // 0-1
    riskTakenPerTradeTicks: number;
    passiveAggressiveRate: number; // 0-1
    slippage: number;
    executionSlippageErrorRate: number; // 0-1
    riskManagementErrorRate: number; // 0-1
    riskManagementErrorMultiplier: number; // > 1
}

export interface WorkerParams extends GlobalParams, Omit<TraderProfile, 'id' | 'name' | 'pathCount'> { }

export interface TradeResult {
    tradeNumber: number;
    equity: number;
    pnl: number;
}

export interface SimulationResult {
    traderId: string; // "ProfileName #PathIndex"
    profileId: string;
    data: TradeResult[];
    finalEquity: number;
}
