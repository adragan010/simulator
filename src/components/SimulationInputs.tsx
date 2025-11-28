import React from 'react';
import { TextField, Typography, Paper, Box, Button, IconButton, Divider, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { GlobalParams, TraderProfile } from '../types';

interface Props {
    globalParams: GlobalParams;
    onGlobalChange: (params: GlobalParams) => void;
    profiles: TraderProfile[];
    onProfilesChange: (profiles: TraderProfile[]) => void;
}

export const SimulationInputs: React.FC<Props> = ({ globalParams, onGlobalChange, profiles, onProfilesChange }) => {

    const handleGlobalChange = (key: keyof GlobalParams, value: string) => {
        const numValue = parseFloat(value);
        onGlobalChange({
            ...globalParams,
            [key]: isNaN(numValue) ? 0 : numValue,
        });
    };

    const handleProfileChange = (id: string, key: keyof TraderProfile, value: string) => {
        const newProfiles = profiles.map(p => {
            if (p.id !== id) return p;
            if (key === 'name') return { ...p, name: value };
            const numValue = parseFloat(value);
            return { ...p, [key]: isNaN(numValue) ? 0 : numValue };
        });
        onProfilesChange(newProfiles);
    };

    const addProfile = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        const newProfile: TraderProfile = {
            id: newId,
            name: `Trader ${profiles.length + 1}`,
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
        onProfilesChange([...profiles, newProfile]);
    };

    const removeProfile = (id: string) => {
        onProfilesChange(profiles.filter(p => p.id !== id));
    };

    return (
        <Box>
            {/* Global Parameters */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Global Parameters
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Number of Trades"
                            type="number"
                            value={globalParams.numberOfTrades}
                            onChange={(e) => handleGlobalChange('numberOfTrades', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Initial Equity ($)"
                            type="number"
                            value={globalParams.initialEquity}
                            onChange={(e) => handleGlobalChange('initialEquity', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Aggressive Commission ($)"
                            type="number"
                            inputProps={{ step: 0.01 }}
                            value={globalParams.aggressiveCommission}
                            onChange={(e) => handleGlobalChange('aggressiveCommission', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Passive Commission ($)"
                            type="number"
                            inputProps={{ step: 0.01 }}
                            value={globalParams.passiveCommission}
                            onChange={(e) => handleGlobalChange('passiveCommission', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Trader Profiles */}
            {profiles.map((profile) => (
                <Paper key={profile.id} elevation={3} sx={{ p: 3, mb: 3, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            {profile.name} Configuration
                        </Typography>
                        {profiles.length > 1 && (
                            <IconButton onClick={() => removeProfile(profile.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Profile Name"
                                value={profile.name}
                                onChange={(e) => handleProfileChange(profile.id, 'name', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Number of Paths"
                                type="number"
                                value={profile.pathCount}
                                onChange={(e) => handleProfileChange(profile.id, 'pathCount', e.target.value)}
                                helperText="Multiple simulations to show randomness"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Risk/Reward Ratio"
                                type="number"
                                inputProps={{ step: 0.1 }}
                                value={profile.riskRewardRatio}
                                onChange={(e) => handleProfileChange(profile.id, 'riskRewardRatio', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Win Rate (0-1)"
                                type="number"
                                inputProps={{ step: 0.01, min: 0, max: 1 }}
                                value={profile.winRate}
                                onChange={(e) => handleProfileChange(profile.id, 'winRate', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Risk Per Trade (Ticks)"
                                type="number"
                                value={profile.riskTakenPerTradeTicks}
                                onChange={(e) => handleProfileChange(profile.id, 'riskTakenPerTradeTicks', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Passive Order Rate (0-1)"
                                type="number"
                                inputProps={{ step: 0.01, min: 0, max: 1 }}
                                value={profile.passiveAggressiveRate}
                                onChange={(e) => handleProfileChange(profile.id, 'passiveAggressiveRate', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Slippage (Ticks)"
                                type="number"
                                value={profile.slippage}
                                onChange={(e) => handleProfileChange(profile.id, 'slippage', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Slippage Probability (0-1)"
                                type="number"
                                inputProps={{ step: 0.01, min: 0, max: 1 }}
                                value={profile.executionSlippageErrorRate}
                                onChange={(e) => handleProfileChange(profile.id, 'executionSlippageErrorRate', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Risk Mgmt Error Rate (0-1)"
                                type="number"
                                inputProps={{ step: 0.01, min: 0, max: 1 }}
                                value={profile.riskManagementErrorRate}
                                onChange={(e) => handleProfileChange(profile.id, 'riskManagementErrorRate', e.target.value)}
                                helperText="Prob. of assuming more risk"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Risk Mgmt Multiplier"
                                type="number"
                                inputProps={{ step: 0.1, min: 1 }}
                                value={profile.riskManagementErrorMultiplier}
                                onChange={(e) => handleProfileChange(profile.id, 'riskManagementErrorMultiplier', e.target.value)}
                                helperText="Multiplier on loss when error occurs"
                            />
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button startIcon={<AddIcon />} onClick={addProfile} variant="outlined">
                    Add Trader Profile
                </Button>
            </Box>
        </Box>
    );
};
