/**
 * Soil Intelligence Platform - Charts Module
 * Chart.js configurations and helpers
 */

class ChartManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#0071e3',
            primaryLight: '#2997ff',
            purple: '#af52de',
            green: '#30d158',
            orange: '#ff9f0a',
            red: '#ff453a',
            text: '#f5f5f7',
            textSecondary: '#a1a1a6',
            grid: 'rgba(255, 255, 255, 0.1)'
        };
        
        this.chartColors = [
            '#0071e3', '#af52de', '#30d158', '#ff9f0a', 
            '#ff453a', '#64d2ff', '#bf5af2', '#32ade6'
        ];
    }

    /**
     * Get common chart options
     */
    getCommonOptions(type = 'line') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: this.colors.textSecondary,
                        font: { family: 'Inter', size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: this.colors.text,
                    bodyColor: this.colors.textSecondary,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { family: 'Inter', size: 13, weight: '600' },
                    bodyFont: { family: 'Inter', size: 12 }
                }
            },
            scales: type !== 'doughnut' && type !== 'pie' ? {
                x: {
                    grid: { color: this.colors.grid, drawBorder: false },
                    ticks: { color: this.colors.textSecondary, font: { family: 'Inter', size: 11 } }
                },
                y: {
                    grid: { color: this.colors.grid, drawBorder: false },
                    ticks: { color: this.colors.textSecondary, font: { family: 'Inter', size: 11 } }
                }
            } : {}
        };
    }

    /**
     * Create histogram chart
     */
    createHistogram(containerId, labels, data, title) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frequency',
                    data: data,
                    backgroundColor: this.colors.primary + '80',
                    borderColor: this.colors.primary,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                ...this.getCommonOptions('bar'),
                plugins: {
                    ...this.getCommonOptions('bar').plugins,
                    title: {
                        display: true,
                        text: title,
                        color: this.colors.text,
                        font: { family: 'Inter', size: 14, weight: '600' }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create scatter plot for clustering
     */
    createScatterPlot(containerId, clusters, title) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        const datasets = clusters.map((cluster, idx) => ({
            label: `Cluster ${idx + 1}`,
            data: cluster.points.map(p => ({ x: p[0], y: p[1] })),
            backgroundColor: this.chartColors[idx % this.chartColors.length] + '80',
            borderColor: this.chartColors[idx % this.chartColors.length],
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7
        }));

        this.charts[containerId] = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                ...this.getCommonOptions('scatter'),
                plugins: {
                    ...this.getCommonOptions('scatter').plugins,
                    title: {
                        display: true,
                        text: title,
                        color: this.colors.text,
                        font: { family: 'Inter', size: 14, weight: '600' }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create bar chart for model comparison
     */
    createBarChart(containerId, labels, datasets, title) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets.map((ds, idx) => ({
                    ...ds,
                    backgroundColor: this.chartColors[idx % this.chartColors.length] + '80',
                    borderColor: this.chartColors[idx % this.chartColors.length],
                    borderWidth: 1,
                    borderRadius: 4
                }))
            },
            options: {
                ...this.getCommonOptions('bar'),
                plugins: {
                    ...this.getCommonOptions('bar').plugins,
                    title: {
                        display: true,
                        text: title,
                        color: this.colors.text,
                        font: { family: 'Inter', size: 14, weight: '600' }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create horizontal bar chart for feature importance
     */
    createHorizontalBarChart(containerId, labels, data, title) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Importance',
                    data: data,
                    backgroundColor: this.colors.primary + '80',
                    borderColor: this.colors.primary,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                ...this.getCommonOptions('bar'),
                plugins: {
                    ...this.getCommonOptions('bar').plugins,
                    title: {
                        display: true,
                        text: title,
                        color: this.colors.text,
                        font: { family: 'Inter', size: 14, weight: '600' }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create scatter plot for predictions vs actual
     */
    createPredictionPlot(containerId, actual, predicted, title) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return;

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        const min = Math.min(...actual, ...predicted);
        const max = Math.max(...actual, ...predicted);

        this.charts[containerId] = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Predictions',
                    data: actual.map((a, i) => ({ x: a, y: predicted[i] })),
                    backgroundColor: this.colors.primary + '80',
                    borderColor: this.colors.primary,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }, {
                    label: 'Perfect Prediction',
                    data: [{ x: min, y: min }, { x: max, y: max }],
                    type: 'line',
                    borderColor: this.colors.red,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                ...this.getCommonOptions('scatter'),
                plugins: {
                    ...this.getCommonOptions('scatter').plugins,
                    title: {
                        display: true,
                        text: title,
                        color: this.colors.text,
                        font: { family: 'Inter', size: 14, weight: '600' }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Create correlation heatmap using canvas
     */
    createHeatmap(containerId, matrix, columns) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        const n = columns.length;
        
        const canvas = document.createElement('canvas');
        const cellSize = Math.min(50, Math.max(30, 400 / n));
        canvas.width = cellSize * (n + 1);
        canvas.height = cellSize * (n + 1);
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Draw cells
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const value = matrix[columns[i]][columns[j]];
                const color = this.getCorrelationColor(value);
                
                ctx.fillStyle = color;
                ctx.fillRect((j + 1) * cellSize, (i + 1) * cellSize, cellSize, cellSize);
                
                // Draw value
                ctx.fillStyle = Math.abs(value) > 0.5 ? '#fff' : '#000';
                ctx.font = `${Math.max(10, cellSize * 0.3)}px Inter`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    value.toFixed(2),
                    (j + 1) * cellSize + cellSize / 2,
                    (i + 1) * cellSize + cellSize / 2
                );
            }
        }

        // Draw labels
        ctx.fillStyle = '#f5f5f7';
        ctx.font = `${Math.max(10, cellSize * 0.25)}px Inter`;
        
        for (let i = 0; i < n; i++) {
            // Row labels
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(columns[i], cellSize - 5, (i + 1) * cellSize + cellSize / 2);
            
            // Column labels
            ctx.save();
            ctx.translate((i + 1) * cellSize + cellSize / 2, cellSize - 5);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(columns[i], 0, 0);
            ctx.restore();
        }
    }

    /**
     * Get color for correlation value
     */
    getCorrelationColor(value) {
        // Red (-1) to Blue (1)
        if (value < 0) {
            const intensity = Math.abs(value);
            return `rgba(255, 69, 58, ${0.2 + intensity * 0.6})`;
        } else {
            return `rgba(0, 113, 227, ${0.2 + value * 0.6})`;
        }
    }

    /**
     * Create missing values bar chart
     */
    createMissingValuesChart(containerId, labels, data) {
        const ctx = document.getElementById(containerId);
        if (!ctx) {
            // Create canvas if it doesn't exist
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<canvas id="missingValuesCanvas"></canvas>';
                return this.createMissingValuesChart('missingValuesCanvas', labels, data);
            }
            return;
        }

        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Missing Values',
                    data: data,
                    backgroundColor: data.map(v => v > 10 ? this.colors.red + '80' : this.colors.orange + '80'),
                    borderColor: data.map(v => v > 10 ? this.colors.red : this.colors.orange),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                ...this.getCommonOptions('bar'),
                plugins: {
                    ...this.getCommonOptions('bar').plugins,
                    title: {
                        display: true,
                        text: 'Missing Values by Feature',
                        color: this.colors.text,
                        font: { family: 'Inter', size: 14, weight: '600' }
                    }
                }
            }
        });

        return this.charts[containerId];
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
}

// Create global instance
const chartManager = new ChartManager();
