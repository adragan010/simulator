import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SimulationResult } from '../types';
import { Paper, Typography, Box, IconButton, Tooltip as MuiTooltip, Chip, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportToCSV } from '../utils/csvExport';

interface Props {
    results: SimulationResult[];
}

export const PnLChart: React.FC<Props> = ({ results }) => {
    const data = useMemo(() => {
        if (results.length === 0) return [];

        const numTrades = results[0].data.length;
        const chartData = [];

        for (let i = 0; i < numTrades; i++) {
            const point: any = { trade: results[0].data[i].tradeNumber };
            results.forEach((res) => {
                point[res.traderId] = res.data[i].equity;
            });
            chartData.push(point);
        }
        return chartData;
    }, [results]);

    // Group results by profile to assign same color base to all paths from same profile
    const profileGroups = useMemo(() => {
        const groups = new Map<string, SimulationResult[]>();
        results.forEach(res => {
            if (!groups.has(res.profileId)) {
                groups.set(res.profileId, []);
            }
            groups.get(res.profileId)!.push(res);
        });
        return groups;
    }, [results]);

    // Generate colors: same hue for same profile, varied saturation/lightness for different paths
    const getColor = (result: SimulationResult) => {
        const profileIds = Array.from(profileGroups.keys());
        const profileIndex = profileIds.indexOf(result.profileId);
        const hue = (profileIndex * 137.508) % 360;

        // Find which path this is within the profile
        const profileResults = profileGroups.get(result.profileId) || [];
        const pathIndex = profileResults.indexOf(result);
        const pathCount = profileResults.length;

        // Vary opacity/lightness slightly for different paths
        const lightness = 50 + (pathIndex / Math.max(pathCount - 1, 1)) * 20 - 10;
        const opacity = 0.5 + (pathIndex / Math.max(pathCount - 1, 1)) * 0.4;

        return { color: `hsl(${hue}, 70%, ${lightness}%)`, opacity };
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 3, height: 600, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Accumulated PnL Over Time
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="trade"
                            label={{ value: 'Trade #', position: 'insideBottomRight', offset: -5 }}
                            type="number"
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                            label={{ value: 'Equity ($)', angle: -90, position: 'insideLeft' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            labelFormatter={(label) => `Trade ${label}`}
                            formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                        />
                        {results.length <= 20 && <Legend />}
                        {results.map((res) => {
                            const { color, opacity } = getColor(res);
                            return (
                                <Line
                                    key={res.traderId}
                                    type="monotone"
                                    dataKey={res.traderId}
                                    name={res.traderId}
                                    stroke={color}
                                    dot={false}
                                    strokeWidth={1.5}
                                    strokeOpacity={opacity}
                                    isAnimationActive={false}
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </Paper>

            {/* Trader Summary Table */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Trader Results
                </Typography>
                <Stack spacing={2}>
                    {results.map((result) => (
                        <Box
                            key={result.traderId}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        bgcolor: getColor(result).color,
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {result.traderId}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip
                                    label={`Final Equity: $${result.finalEquity.toFixed(2)}`}
                                    color={result.finalEquity >= result.data[0].equity ? 'success' : 'error'}
                                    variant="outlined"
                                />
                                <Chip
                                    label={`PnL: $${(result.finalEquity - result.data[0].equity).toFixed(2)}`}
                                    color={result.finalEquity >= result.data[0].equity ? 'success' : 'error'}
                                />
                                <MuiTooltip title="Export to CSV">
                                    <IconButton
                                        onClick={() => exportToCSV(result)}
                                        size="small"
                                        color="primary"
                                    >
                                        <FileDownloadIcon />
                                    </IconButton>
                                </MuiTooltip>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
};
