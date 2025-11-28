import type { SimulationResult } from '../types';

export const exportToCSV = (result: SimulationResult) => {
    // Create CSV header
    const headers = ['Trade Number', 'Equity ($)', 'Trade PnL ($)'];

    // Create CSV rows
    const rows = result.data.map(trade => [
        trade.tradeNumber,
        trade.equity.toFixed(2),
        trade.pnl.toFixed(2)
    ]);

    // Combine header and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${result.traderId.replace(/[^a-z0-9]/gi, '_')}_simulation.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

export const exportAllToCSV = (results: SimulationResult[]) => {
    results.forEach(result => {
        // Add a small delay between downloads to prevent browser blocking
        setTimeout(() => exportToCSV(result), 100 * results.indexOf(result));
    });
};
