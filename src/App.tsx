import { useState, useCallback } from 'react';
import { Container, Typography, Box, Button, CircularProgress, CssBaseline, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import { SimulationInputs } from './components/SimulationInputs';
import { PnLChart } from './components/PnLChart';
import type { GlobalParams, TraderProfile, SimulationResult, WorkerParams } from './types';
import { exportAllToCSV } from './utils/csvExport';
import SimulationWorker from './workers/simulation.worker?worker';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const defaultGlobalParams: GlobalParams = {
  numberOfTrades: 10000,
  initialEquity: 30000,
  aggressiveCommission: 0.15,
  passiveCommission: -0.15,
};

const defaultProfile: TraderProfile = {
  id: 'default',
  name: 'Trader 1',
  pathCount: 5,
  riskRewardRatio: 2.0,
  winRate: 0.5,
  riskTakenPerTradeTicks: 5,
  passiveAggressiveRate: 0.5,
  slippage: 1,
  executionSlippageErrorRate: 0.1,
  riskManagementErrorRate: 0.05,
  riskManagementErrorMultiplier: 2.0,
};

function App() {
  const [globalParams, setGlobalParams] = useState<GlobalParams>(defaultGlobalParams);
  const [profiles, setProfiles] = useState<TraderProfile[]>([defaultProfile]);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openHelp, setOpenHelp] = useState(false);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    setResults([]);
    setProgress(0);

    const concurrency = navigator.hardwareConcurrency || 4;

    // Create simulation tasks from profiles with multiple paths per profile
    const tasks: { profileId: string; traderId: string; params: WorkerParams }[] = [];

    profiles.forEach(profile => {
      for (let i = 0; i < profile.pathCount; i++) {
        tasks.push({
          profileId: profile.id,
          traderId: `${profile.name} #${i + 1}`,
          params: {
            ...globalParams,
            riskRewardRatio: profile.riskRewardRatio,
            winRate: profile.winRate,
            riskTakenPerTradeTicks: profile.riskTakenPerTradeTicks,
            passiveAggressiveRate: profile.passiveAggressiveRate,
            slippage: profile.slippage,
            executionSlippageErrorRate: profile.executionSlippageErrorRate,
            riskManagementErrorRate: profile.riskManagementErrorRate,
            riskManagementErrorMultiplier: profile.riskManagementErrorMultiplier,
          }
        });
      }
    });

    const totalTasks = tasks.length;

    const runWorker = (task: typeof tasks[0]): Promise<SimulationResult> => {
      return new Promise((resolve, reject) => {
        const worker = new SimulationWorker();
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
        worker.onerror = (err) => {
          reject(err);
          worker.terminate();
        };
        worker.postMessage(task);
      });
    };

    const newResults: SimulationResult[] = [];

    for (let i = 0; i < totalTasks; i += concurrency) {
      const chunk = tasks.slice(i, i + concurrency).map(task => runWorker(task));
      const chunkResults = await Promise.all(chunk);

      newResults.push(...chunkResults);

      const currentCompleted = Math.min(i + concurrency, totalTasks);
      setProgress((currentCompleted / totalTasks) * 100);

      // We don't update chart incrementally to avoid flicker/performance hit during massive sims,
      // but user might want to see progress. Let's update incrementally.
      setResults(prev => [...prev, ...chunkResults]);

      await new Promise(resolve => setTimeout(resolve, 0));
    }

    setIsSimulating(false);
    setHasSimulated(true);
  }, [globalParams, profiles]);

  const handleReset = () => {
    setHasSimulated(false);
    setResults([]);
    setProgress(0);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Typography variant="h3" component="h1" align="center" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PnL Simulator
          </Typography>
          <IconButton
            onClick={() => setOpenHelp(true)}
            sx={{ position: 'absolute', right: 0, top: 0, color: 'primary.main' }}
          >
            <InfoIcon />
          </IconButton>
        </Box>

        {!hasSimulated ? (
          <>
            <SimulationInputs
              globalParams={globalParams}
              onGlobalChange={setGlobalParams}
              profiles={profiles}
              onProfilesChange={setProfiles}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={runSimulation}
                disabled={isSimulating}
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                startIcon={isSimulating ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
              >
                {isSimulating ? `Simulating... ${Math.round(progress)}% ` : 'Run Simulation'}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleReset}
              startIcon={<RefreshIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Reset / Configure
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => exportAllToCSV(results)}
              startIcon={<FileDownloadIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Export All to CSV
            </Button>
          </Box>
        )}

        {/* Show chart if we have results (even if simulating, we show partial results) */}
        {results.length > 0 && <PnLChart results={results} />}

        <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="md">
          <DialogTitle>About PnL Simulator</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              The PnL Simulator helps traders visualize the potential outcomes of their strategies by running Monte Carlo simulations. It highlights the role of variance and risk in trading.
            </DialogContentText>
            <Typography variant="h6" gutterBottom color="primary">Global Parameters</Typography>
            <DialogContentText paragraph>
              • <b>Number of Trades</b>: Total trades to simulate per path.<br />
              • <b>Initial Equity</b>: Starting account balance.<br />
              • <b>Aggressive/Passive Commission</b>: Fees for market (aggressive) vs. limit (passive) orders.
            </DialogContentText>
            <Typography variant="h6" gutterBottom color="primary">Trader Profile Parameters</Typography>
            <DialogContentText paragraph>
              • <b>Number of Paths</b>: How many simulations to run for this profile to see variance.<br />
              • <b>Risk/Reward Ratio</b>: Potential profit vs. potential loss (e.g., 2.0).<br />
              • <b>Win Rate</b>: Probability of a winning trade (0-1).<br />
              • <b>Risk Per Trade</b>: Ticks risked per trade.<br />
              • <b>Passive Order Rate</b>: % of trades using limit orders.<br />
              • <b>Slippage</b>: Ticks lost during poor execution.<br />
              • <b>Slippage Probability</b>: Likelihood of slippage occurring.<br />
              • <b>Risk Mgmt Error Rate</b>: Probability of failing to cut a loss.<br />
              • <b>Risk Mgmt Multiplier</b>: How much larger the loss is when an error occurs.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHelp(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;
