/**
 * Soil Intelligence Platform - Data Processor
 * Handles data parsing, statistics, and transformations
 */

class DataProcessor {
    constructor() {
        this.data = null;
        this.columns = [];
        this.numericColumns = [];
        this.categoricalColumns = [];
    }

    /**
     * Parse CSV file using PapaParse
     */
    async parseCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    this.data = results.data;
                    this.analyzeColumns();
                    resolve(this.data);
                },
                error: (error) => reject(error)
            });
        });
    }

    /**
     * Parse Excel file using SheetJS
     */
    async parseExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    this.data = XLSX.utils.sheet_to_json(firstSheet, { defval: null });
                    this.analyzeColumns();
                    resolve(this.data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Load sample data from JSON
     */
    async loadSampleData() {
        try {
            const response = await fetch('data/soil_data.json');
            const jsonData = await response.json();
            this.data = jsonData.data.map(row => {
                // Convert empty strings back to null
                const newRow = {};
                for (const [key, value] of Object.entries(row)) {
                    newRow[key] = value === '' ? null : value;
                }
                return newRow;
            });
            this.analyzeColumns();
            return this.data;
        } catch (error) {
            console.error('Error loading sample data:', error);
            throw error;
        }
    }

    /**
     * Load full Unified Soil Dataset from JSON
     */
    async loadFullDataset() {
        try {
            const response = await fetch('data/soil_data_full.json');
            const jsonData = await response.json();
            this.data = jsonData.data.map(row => {
                // Convert empty strings back to null
                const newRow = {};
                for (const [key, value] of Object.entries(row)) {
                    newRow[key] = value === '' ? null : value;
                }
                return newRow;
            });
            this.analyzeColumns();
            return this.data;
        } catch (error) {
            console.error('Error loading full dataset:', error);
            throw error;
        }
    }


    /**
     * Analyze columns and classify them
     */
    analyzeColumns() {
        if (!this.data || this.data.length === 0) return;

        this.columns = Object.keys(this.data[0]);
        this.numericColumns = [];
        this.categoricalColumns = [];

        for (const col of this.columns) {
            const values = this.data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
            const numericCount = values.filter(v => typeof v === 'number' || !isNaN(parseFloat(v))).length;
            
            if (numericCount / values.length > 0.8) {
                this.numericColumns.push(col);
                // Convert to numbers
                this.data.forEach(row => {
                    if (row[col] !== null && row[col] !== undefined && row[col] !== '') {
                        row[col] = parseFloat(row[col]);
                    }
                });
            } else {
                this.categoricalColumns.push(col);
            }
        }
    }

    /**
     * Get basic statistics for a column
     */
    getColumnStats(column) {
        const values = this.data
            .map(row => row[column])
            .filter(v => v !== null && v !== undefined && !isNaN(v));

        if (values.length === 0) return null;

        const sorted = [...values].sort((a, b) => a - b);
        const n = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const min = sorted[0];
        const max = sorted[n - 1];
        
        // Median
        const mid = Math.floor(n / 2);
        const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
        
        // Standard deviation
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
        const std = Math.sqrt(variance);

        // Quartiles
        const q1 = sorted[Math.floor(n * 0.25)];
        const q3 = sorted[Math.floor(n * 0.75)];

        return { n, mean, median, min, max, std, q1, q3 };
    }

    /**
     * Get missing value counts
     */
    getMissingValues() {
        const missing = {};
        for (const col of this.columns) {
            const count = this.data.filter(row => 
                row[col] === null || row[col] === undefined || row[col] === ''
            ).length;
            if (count > 0) {
                missing[col] = count;
            }
        }
        return missing;
    }

    /**
     * Calculate correlation matrix
     */
    getCorrelationMatrix(columns) {
        const matrix = {};
        for (const col1 of columns) {
            matrix[col1] = {};
            for (const col2 of columns) {
                const values1 = this.data.map(row => row[col1]).filter(v => v !== null && !isNaN(v));
                const values2 = this.data.map(row => row[col2]).filter(v => v !== null && !isNaN(v));
                
                // Find common indices
                const pairs = [];
                for (let i = 0; i < this.data.length; i++) {
                    const v1 = this.data[i][col1];
                    const v2 = this.data[i][col2];
                    if (v1 !== null && v2 !== null && !isNaN(v1) && !isNaN(v2)) {
                        pairs.push([v1, v2]);
                    }
                }
                
                if (pairs.length > 1) {
                    matrix[col1][col2] = this.correlation(pairs.map(p => p[0]), pairs.map(p => p[1]));
                } else {
                    matrix[col1][col2] = 0;
                }
            }
        }
        return matrix;
    }

    /**
     * Calculate Pearson correlation
     */
    correlation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
        const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Create histogram bins
     */
    createHistogram(column, bins = 30) {
        const values = this.data
            .map(row => row[column])
            .filter(v => v !== null && !isNaN(v));

        if (values.length === 0) return null;

        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / bins;
        
        const counts = new Array(bins).fill(0);
        const binEdges = [];

        for (let i = 0; i <= bins; i++) {
            binEdges.push(min + i * binWidth);
        }

        for (const value of values) {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            counts[binIndex]++;
        }

        return { counts, binEdges, binLabels: binEdges.slice(0, -1).map((e, i) => `${e.toFixed(2)}-${binEdges[i + 1].toFixed(2)}`) };
    }

    /**
     * Apply feature engineering
     */
    engineerFeature(name, formula) {
        if (!this.data) return;

        switch (name) {
            case 'Nitrogen_Index':
                if (this.columns.includes('TOTN') && this.columns.includes('TOTC')) {
                    this.data.forEach(row => {
                        if (row.TOTN !== null && row.TOTC !== null) {
                            row.Nitrogen_Index = row.TOTN / (row.TOTC + 1);
                        }
                    });
                    if (!this.numericColumns.includes('Nitrogen_Index')) {
                        this.numericColumns.push('Nitrogen_Index');
                    }
                }
                break;
            
            case 'Phosphorus_Ratio':
                if (this.columns.includes('P2O5') && this.columns.includes('TOTN')) {
                    this.data.forEach(row => {
                        if (row.P2O5 !== null && row.TOTN !== null) {
                            row.Phosphorus_Ratio = row.P2O5 / (row.TOTN + 1);
                        }
                    });
                    if (!this.numericColumns.includes('Phosphorus_Ratio')) {
                        this.numericColumns.push('Phosphorus_Ratio');
                    }
                }
                break;
            
            case 'Potassium_Balance':
                if (this.columns.includes('K2O') && this.columns.includes('P2O5')) {
                    this.data.forEach(row => {
                        if (row.K2O !== null && row.P2O5 !== null) {
                            row.Potassium_Balance = row.K2O / (row.P2O5 + 1);
                        }
                    });
                    if (!this.numericColumns.includes('Potassium_Balance')) {
                        this.numericColumns.push('Potassium_Balance');
                    }
                }
                break;
            
            case 'Fertility_Score':
                const cols = ['TOTC', 'TOTN', 'P2O5', 'PHAQ'];
                if (cols.every(c => this.columns.includes(c))) {
                    this.data.forEach(row => {
                        const values = cols.map(c => row[c]).filter(v => v !== null && !isNaN(v));
                        if (values.length > 0) {
                            row.Fertility_Score = values.reduce((a, b) => a + b, 0) / values.length;
                        }
                    });
                    if (!this.numericColumns.includes('Fertility_Score')) {
                        this.numericColumns.push('Fertility_Score');
                    }
                }
                break;
        }

        // Update columns list
        this.columns = Object.keys(this.data[0]);
    }

    /**
     * Get data summary
     */
    getSummary() {
        if (!this.data) return null;

        const totalCells = this.data.length * this.columns.length;
        const missingCells = Object.values(this.getMissingValues()).reduce((a, b) => a + b, 0);
        
        let fertilityScore = null;
        if (this.columns.includes('Fertility_Score')) {
            const scores = this.data.map(row => row.Fertility_Score).filter(v => v !== null && !isNaN(v));
            if (scores.length > 0) {
                fertilityScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
        } else if (['TOTC', 'TOTN', 'P2O5', 'PHAQ'].every(c => this.columns.includes(c))) {
            const scores = this.data.map(row => {
                const values = [row.TOTC, row.TOTN, row.P2O5, row.PHAQ].filter(v => v !== null && !isNaN(v));
                return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
            }).filter(v => v !== null);
            if (scores.length > 0) {
                fertilityScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
        }

        return {
            samples: this.data.length,
            features: this.columns.length,
            missingPercent: totalCells > 0 ? (missingCells / totalCells) * 100 : 0,
            fertilityScore
        };
    }

    /**
     * Filter numeric columns that exist in data
     */
    getAvailableNumericColumns() {
        return this.numericColumns.filter(col => this.columns.includes(col));
    }
}

// Create global instance
const dataProcessor = new DataProcessor();
