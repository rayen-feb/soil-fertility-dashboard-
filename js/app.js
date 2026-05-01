/**
 * Soil Intelligence Platform - Main Application
 * Orchestrates all modules and handles UI interactions
 */

class SoilApp {
    constructor() {
        this.currentTab = 'preview';
        this.engineeredFeatures = [];
        this.clusterResults = null;
        this.modelResults = null;
        
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupTabs();
        this.setupFileUpload();
        this.updateInsights();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Load sample data button
        document.getElementById('loadSampleBtn').addEventListener('click', () => {
            this.loadSampleData();
        });

        // Load full dataset button
        document.getElementById('loadFullBtn').addEventListener('click', () => {
            this.loadFullDataset();
        });


        // Clustering controls
        document.getElementById('clusterK').addEventListener('input', (e) => {
            document.getElementById('clusterKValue').textContent = e.target.value;
        });

        document.getElementById('runClustering').addEventListener('click', () => {
            this.runClustering();
        });

        // Modeling controls
        document.getElementById('testSize').addEventListener('input', (e) => {
            document.getElementById('testSizeValue').textContent = e.target.value + '%';
        });

        document.getElementById('trainModels').addEventListener('click', () => {
            this.trainModels();
        });

        // Mobile menu
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('mobile-open');
        });
    }

    /**
     * Setup smooth scrolling navigation
     */
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Setup tab switching
     */
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Update active states
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                this.currentTab = tabId;
                
                // Refresh charts if needed
                if (tabId === 'distributions') {
                    this.renderDistributions();
                } else if (tabId === 'correlations') {
                    this.renderCorrelations();
                } else if (tabId === 'missing') {
                    this.renderMissingValues();
                }
            });
        });
    }

    /**
     * Setup file upload with drag and drop
     */
    setupFileUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        // Click to upload
        uploadZone.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFile(e.dataTransfer.files[0]);
            }
        });
    }

    /**
     * Handle uploaded file
     */
    async handleFile(file) {
        this.showLoading(true);
        
        try {
            const extension = file.name.split('.').pop().toLowerCase();
            
            if (extension === 'csv') {
                await dataProcessor.parseCSV(file);
            } else if (['xlsx', 'xls'].includes(extension)) {
                await dataProcessor.parseExcel(file);
            } else {
                throw new Error('Unsupported file format');
            }
            
            this.onDataLoaded();
            this.showUploadStatus(`✅ Loaded ${dataProcessor.data.length} rows and ${dataProcessor.columns.length} features`, 'success');
        } catch (error) {
            console.error('Error loading file:', error);
            this.showUploadStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Load sample data
     */
    async loadSampleData() {
        this.showLoading(true);
        
        try {
            await dataProcessor.loadSampleData();
            this.onDataLoaded();
            this.showUploadStatus(`✅ Loaded ${dataProcessor.data.length} rows and ${dataProcessor.columns.length} features`, 'success');
        } catch (error) {
            console.error('Error loading sample data:', error);
            this.showUploadStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Load full Unified Soil Dataset
     */
    async loadFullDataset() {
        this.showLoading(true);
        
        try {
            await dataProcessor.loadFullDataset();
            this.onDataLoaded();
            this.showUploadStatus(`✅ Loaded full dataset: ${dataProcessor.data.length} rows and ${dataProcessor.columns.length} features`, 'success');
        } catch (error) {
            console.error('Error loading full dataset:', error);
            this.showUploadStatus(`❌ Error: ${error.message}. Try using a local server (python -m http.server 8000)`, 'error');
        } finally {
            this.showLoading(false);
        }
    }


    /**
     * Callback when data is loaded
     */
    onDataLoaded() {
        this.updateKPIs();
        this.renderPreview();
        this.populateSelectors();
        this.renderFeatureEngineering();
        this.updateInsights();
        
        // Scroll to overview
        document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Show upload status message
     */
    showUploadStatus(message, type) {
        const status = document.getElementById('uploadStatus');
        status.textContent = message;
        status.className = `upload-status ${type}`;
        status.classList.remove('hidden');
    }

    /**
     * Show/hide loading overlay
     */
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    /**
     * Update KPI cards
     */
    updateKPIs() {
        const summary = dataProcessor.getSummary();
        if (!summary) return;

        // Animate counters
        this.animateCounter('kpiSamples', summary.samples);
        this.animateCounter('kpiFeatures', summary.features);
        
        const missingEl = document.getElementById('kpiMissing');
        missingEl.textContent = summary.missingPercent.toFixed(1) + '%';
        
        const missingTrend = document.getElementById('kpiMissingTrend');
        if (summary.missingPercent < 5) {
            missingTrend.innerHTML = '<i class="fas fa-check-circle"></i><span>Good</span>';
            missingTrend.className = 'kpi-trend up';
        } else {
            missingTrend.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>High</span>';
            missingTrend.className = 'kpi-trend down';
        }

        const fertilityEl = document.getElementById('kpiFertility');
        const fertilityTrend = document.getElementById('kpiFertilityTrend');
        
        if (summary.fertilityScore !== null) {
            fertilityEl.textContent = summary.fertilityScore.toFixed(2);
            fertilityTrend.innerHTML = '<i class="fas fa-check-circle"></i><span>Calculated</span>';
            fertilityTrend.className = 'kpi-trend up';
        } else {
            fertilityEl.textContent = '--';
            fertilityTrend.innerHTML = '<span>Need features</span>';
            fertilityTrend.className = 'kpi-trend';
        }
    }

    /**
     * Animate number counter
     */
    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        const duration = 1000;
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    /**
     * Render data preview table
     */
    renderPreview() {
        const table = document.getElementById('previewTable');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        
        // Clear existing
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Headers
        const headerRow = document.createElement('tr');
        dataProcessor.columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Data rows (first 20)
        const previewData = dataProcessor.data.slice(0, 20);
        previewData.forEach(row => {
            const tr = document.createElement('tr');
            dataProcessor.columns.forEach(col => {
                const td = document.createElement('td');
                const value = row[col];
                td.textContent = value !== null && value !== undefined ? value : '—';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        // Info
        document.getElementById('tableInfo').textContent = 
            `Showing ${Math.min(20, dataProcessor.data.length)} of ${dataProcessor.data.length} rows`;
    }

    /**
     * Populate feature selectors
     */
    populateSelectors() {
        const numericCols = dataProcessor.getAvailableNumericColumns();
        
        // Distribution features
        const distSelect = document.getElementById('distFeatureSelect');
        distSelect.innerHTML = '';
        numericCols.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            distSelect.appendChild(option);
        });
        
        // Select first 4 by default
        for (let i = 0; i < Math.min(4, distSelect.options.length); i++) {
            distSelect.options[i].selected = true;
        }
        
        distSelect.addEventListener('change', () => this.renderDistributions());

        // Correlation features
        const corrSelect = document.getElementById('corrFeatureSelect');
        corrSelect.innerHTML = '';
        numericCols.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            corrSelect.appendChild(option);
        });
        
        for (let i = 0; i < Math.min(6, corrSelect.options.length); i++) {
            corrSelect.options[i].selected = true;
        }
        
        corrSelect.addEventListener('change', () => this.renderCorrelations());

        // Clustering features
        const clusterSelect = document.getElementById('clusterFeatures');
        clusterSelect.innerHTML = '';
        numericCols.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            clusterSelect.appendChild(option);
        });
        
        for (let i = 0; i < Math.min(3, clusterSelect.options.length); i++) {
            clusterSelect.options[i].selected = true;
        }

        // Modeling features
        const targetSelect = document.getElementById('targetSelect');
        targetSelect.innerHTML = '';
        numericCols.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            targetSelect.appendChild(option);
        });

        const modelFeatures = document.getElementById('modelFeatures');
        modelFeatures.innerHTML = '';
        numericCols.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            modelFeatures.appendChild(option);
        });
        
        for (let i = 0; i < Math.min(5, modelFeatures.options.length); i++) {
            modelFeatures.options[i].selected = true;
        }
    }

    /**
     * Render distribution charts
     */
    renderDistributions() {
        const select = document.getElementById('distFeatureSelect');
        const selectedFeatures = Array.from(select.selectedOptions).map(o => o.value);
        const container = document.getElementById('distCharts');
        
        container.innerHTML = '';
        
        selectedFeatures.forEach((feature, idx) => {
            const histogram = dataProcessor.createHistogram(feature, 20);
            if (!histogram) return;
            
            const chartDiv = document.createElement('div');
            chartDiv.className = 'chart-container';
            chartDiv.innerHTML = `
                <div class="chart-title">${feature}</div>
                <canvas id="distChart_${idx}"></canvas>
            `;
            container.appendChild(chartDiv);
            
            // Use simplified labels
            const labels = histogram.binLabels.filter((_, i) => i % 2 === 0);
            const data = histogram.counts.filter((_, i) => i % 2 === 0);
            
            chartManager.createHistogram(`distChart_${idx}`, labels, data, feature);
        });
    }

    /**
     * Render correlation heatmap
     */
    renderCorrelations() {
        const select = document.getElementById('corrFeatureSelect');
        const selectedFeatures = Array.from(select.selectedOptions).map(o => o.value);
        
        if (selectedFeatures.length < 2) {
            document.getElementById('corrHeatmap').innerHTML = 
                '<p style="color: #86868b; text-align: center;">Select at least 2 features</p>';
            return;
        }
        
        const matrix = dataProcessor.getCorrelationMatrix(selectedFeatures);
        chartManager.createHeatmap('corrHeatmap', matrix, selectedFeatures);
    }

    /**
     * Render missing values chart
     */
    renderMissingValues() {
        const missing = dataProcessor.getMissingValues();
        const container = document.getElementById('missingChart');
        
        if (Object.keys(missing).length === 0) {
            container.innerHTML = '<div class="upload-status success">No missing values found!</div>';
            return;
        }
        
        const sorted = Object.entries(missing).sort((a, b) => b[1] - a[1]);
        const labels = sorted.map(([col]) => col);
        const data = sorted.map(([_, count]) => count);
        
        container.innerHTML = '<canvas id="missingValuesCanvas"></canvas>';
        chartManager.createMissingValuesChart('missingValuesCanvas', labels, data);
    }

    /**
     * Render feature engineering cards
     */
    renderFeatureEngineering() {
        const container = document.getElementById('featureGrid');
        container.innerHTML = '';
        
        const features = [
            {
                name: 'Nitrogen Index',
                formula: 'TOTN / (TOTC + 1)',
                description: 'Measures nitrogen availability relative to organic carbon',
                icon: '🌿',
                cols: ['TOTN', 'TOTC']
            },
            {
                name: 'Phosphorus Ratio',
                formula: 'P2O5 / (TOTN + 1)',
                description: 'Balanced phosphorus-to-nitrogen relationship',
                icon: '⚡',
                cols: ['P2O5', 'TOTN']
            },
            {
                name: 'Potassium Balance',
                formula: 'K2O / (P2O5 + 1)',
                description: 'Potassium efficiency relative to phosphorus',
                icon: '💧',
                cols: ['K2O', 'P2O5']
            },
            {
                name: 'Fertility Score',
                formula: 'Mean(TOTC, TOTN, P2O5, PHAQ)',
                description: 'Composite fertility indicator',
                icon: '⭐',
                cols: ['TOTC', 'TOTN', 'P2O5', 'PHAQ']
            }
        ];
        
        features.forEach((feat, idx) => {
            const available = feat.cols.every(c => dataProcessor.columns.includes(c));
            const statusColor = available ? '#30d158' : '#ff453a';
            const statusText = available ? 'Ready' : 'Missing Data';
            const colName = feat.name.replace(' ', '_');
            const isApplied = dataProcessor.columns.includes(colName);
            
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML = `
                <div class="feature-header">
                    <span class="feature-icon">${feat.icon}</span>
                    <div>
                        <h3 class="feature-title">${feat.name}</h3>
                        <div class="feature-status ${available ? 'ready' : 'missing'}">● ${statusText}</div>
                    </div>
                </div>
                <div class="feature-formula">${feat.formula}</div>
                <p class="feature-description">${feat.description}</p>
                ${available && !isApplied ? `
                    <button class="btn btn-primary" onclick="app.applyFeature('${feat.name}')" style="width: 100%;">
                        Apply ${feat.name}
                    </button>
                ` : available && isApplied ? `
                    <div class="upload-status success">✓ Already applied</div>
                ` : ''}
            `;
            container.appendChild(card);
        });
    }

    /**
     * Apply a feature engineering transformation
     */
    applyFeature(name) {
        this.showLoading(true);
        
        setTimeout(() => {
            dataProcessor.engineerFeature(name);
            this.renderFeatureEngineering();
            this.updateKPIs();
            this.populateSelectors();
            this.updateInsights();
            this.showLoading(false);
        }, 500);
    }

    /**
     * Run clustering analysis
     */
    runClustering() {
        const featureSelect = document.getElementById('clusterFeatures');
        const selectedFeatures = Array.from(featureSelect.selectedOptions).map(o => o.value);
        const k = parseInt(document.getElementById('clusterK').value);
        
        if (selectedFeatures.length < 2) {
            alert('Please select at least 2 features');
            return;
        }
        
        this.showLoading(true);
        
        setTimeout(() => {
            try {
                // Extract data
                const data = dataProcessor.data
                    .map(row => selectedFeatures.map(f => row[f]))
                    .filter(row => row.every(v => v !== null && !isNaN(v)));
                
                if (data.length === 0) {
                    alert('No valid data after removing missing values');
                    this.showLoading(false);
                    return;
                }
                
                // Standardize
                const standardized = mlProcessor.standardize(data);
                
                // Run K-means
                const result = mlProcessor.kmeans(standardized, k);
                
                // PCA for visualization
                const pca = mlProcessor.pca(standardized, 2);
                
                // Store results
                this.clusterResults = {
                    clusters: result.clusters.map((cluster, idx) => ({
                        ...cluster,
                        points: cluster.points.map((_, i) => {
                            const globalIdx = result.assignments.indexOf(idx);
                            return pca[globalIdx] || [0, 0];
                        })
                    })),
                    assignments: result.assignments,
                    pca: pca
                };
                
                // Render results
                this.renderClusteringResults();
                
            } catch (error) {
                console.error('Clustering error:', error);
                alert('Error during clustering: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 100);
    }

    /**
     * Render clustering results
     */
    renderClusteringResults() {
        document.getElementById('clusteringResults').style.display = 'block';
        
        // Scatter plot
        chartManager.createScatterPlot('clusterChart', this.clusterResults.clusters, 'Cluster Visualization');
        
        // Summary
        const summaryDiv = document.getElementById('clusterSummary');
        summaryDiv.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Cluster</th>
                    <th>Size</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${this.clusterResults.clusters.map((c, i) => `
                    <tr>
                        <td>Cluster ${i + 1}</td>
                        <td>${c.size}</td>
                        <td>${((c.size / dataProcessor.data.length) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        summaryDiv.appendChild(table);
        
        // Insights
        const insightsDiv = document.getElementById('clusterInsights');
        insightsDiv.innerHTML = '';
        
        this.clusterResults.clusters.forEach((cluster, idx) => {
            const insight = document.createElement('div');
            insight.className = 'insight-item';
            insight.style.animationDelay = `${idx * 0.1}s`;
            insight.innerHTML = `
                <div class="insight-icon" style="background: rgba(0, 113, 227, 0.15);">🔍</div>
                <div class="insight-content">
                    <h4>Cluster ${idx + 1}</h4>
                    <p>${cluster.size} samples (${((cluster.size / dataProcessor.data.length) * 100).toFixed(1)}% of dataset)</p>
                </div>
            `;
            insightsDiv.appendChild(insight);
        });
        
        this.updateInsights();
    }

    /**
     * Train predictive models
     */
    trainModels() {
        const targetSelect = document.getElementById('targetSelect');
        const target = targetSelect.value;
        
        const featureSelect = document.getElementById('modelFeatures');
        const features = Array.from(featureSelect.selectedOptions).map(o => o.value);
        
        const testSize = parseInt(document.getElementById('testSize').value) / 100;
        
        const selectedModels = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
            .map(cb => cb.value);
        
        if (!target || features.length === 0) {
            alert('Please select target and features');
            return;
        }
        
        this.showLoading(true);
        
        setTimeout(() => {
            try {
                // Prepare data
                const cleanData = dataProcessor.data.filter(row => {
                    if (row[target] === null || isNaN(row[target])) return false;
                    return features.every(f => row[f] !== null && !isNaN(row[f]));
                });
                
                const X = cleanData.map(row => features.map(f => row[f]));
                const y = cleanData.map(row => row[target]);
                
                if (X.length === 0) {
                    alert('No valid data after removing missing values');
                    this.showLoading(false);
                    return;
                }
                
                // Split data
                const { XTrain, XTest, yTrain, yTest } = mlProcessor.trainTestSplit(X, y, testSize);
                
                // Train models
                this.modelResults = {};
                
                if (selectedModels.includes('linear')) {
                    const result = mlProcessor.linearRegression(XTrain, yTrain);
                    const testPreds = XTest.map(row => {
                        const withIntercept = [1, ...row];
                        return withIntercept.reduce((sum, val, i) => sum + val * result.coefficients[i], 0);
                    });
                    
                    const r2 = this.calculateR2(yTest, testPreds);
                    const rmse = this.calculateRMSE(yTest, testPreds);
                    
                    this.modelResults['Linear Regression'] = {
                        ...result,
                        r2,
                        rmse,
                        testPredictions: testPreds,
                        testActual: yTest
                    };
                }
                
                if (selectedModels.includes('rf')) {
                    const result = mlProcessor.randomForest(XTrain, yTrain, 30, 8);
                    const testPreds = XTest.map(row => {
                        return result.trees.map(tree => mlProcessor.predictTree(tree, row))
                            .reduce((a, b) => a + b, 0) / result.trees.length;
                    });
                    
                    const r2 = this.calculateR2(yTest, testPreds);
                    const rmse = this.calculateRMSE(yTest, testPreds);
                    
                    this.modelResults['Random Forest'] = {
                        ...result,
                        r2,
                        rmse,
                        testPredictions: testPreds,
                        testActual: yTest
                    };
                }
                
                this.renderModelingResults(features);
                
            } catch (error) {
                console.error('Modeling error:', error);
                alert('Error during modeling: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 100);
    }

    /**
     * Calculate R² score
     */
    calculateR2(actual, predicted) {
        const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
        const ssTotal = actual.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        const ssResidual = actual.reduce((acc, val, i) => acc + Math.pow(val - predicted[i], 2), 0);
        return ssTotal === 0 ? 0 : 1 - (ssResidual / ssTotal);
    }

    /**
     * Calculate RMSE
     */
    calculateRMSE(actual, predicted) {
        const mse = actual.reduce((acc, val, i) => acc + Math.pow(val - predicted[i], 2), 0) / actual.length;
        return Math.sqrt(mse);
    }

    /**
     * Render modeling results
     */
    renderModelingResults(features) {
        document.getElementById('modelingResults').style.display = 'block';
        
        // Comparison table
        const comparisonDiv = document.getElementById('modelComparison');
        comparisonDiv.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Model</th>
                    <th>R² Score</th>
                    <th>RMSE</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(this.modelResults).map(([name, result]) => `
                    <tr>
                        <td>${name}</td>
                        <td style="color: ${result.r2 > 0.7 ? '#30d158' : result.r2 > 0.4 ? '#ff9f0a' : '#ff453a'}">
                            ${result.r2.toFixed(3)}
                        </td>
                        <td>${result.rmse.toFixed(3)}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        comparisonDiv.appendChild(table);
        
        // Predictions plot
        const firstModel = Object.values(this.modelResults)[0];
        if (firstModel) {
            chartManager.createPredictionPlot(
                'predictionChart',
                firstModel.testActual,
                firstModel.testPredictions,
                'Predictions vs Actual'
            );
        }
        
        // Feature importance
        const firstModelName = Object.keys(this.modelResults)[0];
        const firstModelResult = this.modelResults[firstModelName];
        if (firstModelResult.importance) {
            chartManager.createHorizontalBarChart(
                'importanceChart',
                features,
                firstModelResult.importance,
                `${firstModelName} - Feature Importance`
            );
        }
        
        this.updateInsights();
    }

    /**
     * Generate and display insights
     */
    updateInsights() {
        const container = document.getElementById('insightsList');
        container.innerHTML = '';
        
        if (!dataProcessor.data) {
            container.innerHTML = `
                <div class="insight-item">
                    <div class="insight-icon" style="background: rgba(0, 113, 227, 0.15);">ℹ️</div>
                    <div class="insight-content">
                        <h4>Welcome</h4>
                        <p>Upload your soil data or load the sample dataset to get started.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        const insights = [];
        
        // Data quality
        const summary = dataProcessor.getSummary();
        if (summary.missingPercent > 5) {
            insights.push({
                icon: '⚠️',
                title: 'Data Quality Alert',
                description: `Dataset has ${summary.missingPercent.toFixed(1)}% missing values. Consider data cleaning.`,
                color: 'rgba(255, 159, 10, 0.15)'
            });
        } else {
            insights.push({
                icon: '✅',
                title: 'Data Quality Excellent',
                description: `Dataset has only ${summary.missingPercent.toFixed(1)}% missing values.`,
                color: 'rgba(48, 209, 88, 0.15)'
            });
        }
        
        // Correlation insight
        const numericCols = dataProcessor.getAvailableNumericColumns();
        if (numericCols.length >= 2) {
            const matrix = dataProcessor.getCorrelationMatrix(numericCols.slice(0, 5));
            let maxCorr = 0;
            let maxPair = ['', ''];
            
            for (let i = 0; i < numericCols.length; i++) {
                for (let j = i + 1; j < numericCols.length; j++) {
                    const corr = Math.abs(matrix[numericCols[i]]?.[numericCols[j]] || 0);
                    if (corr > maxCorr) {
                        maxCorr = corr;
                        maxPair = [numericCols[i], numericCols[j]];
                    }
                }
            }
            
            if (maxCorr > 0.5) {
                insights.push({
                    icon: '🔗',
                    title: 'Strong Correlation Detected',
                    description: `${maxPair[0]} and ${maxPair[1]} show ${maxCorr.toFixed(2)} correlation.`,
                    color: 'rgba(0, 113, 227, 0.15)'
                });
            }
        }
        
        // Clustering insight
        if (this.clusterResults) {
            insights.push({
                icon: '🎯',
                title: 'Clustering Results',
                description: `Data groups into ${this.clusterResults.clusters.length} distinct clusters.`,
                color: 'rgba(175, 82, 222, 0.15)'
            });
        }
        
        // Modeling insight
        if (this.modelResults && Object.keys(this.modelResults).length > 0) {
            const bestModel = Object.entries(this.modelResults)
                .sort((a, b) => b[1].r2 - a[1].r2)[0];
            insights.push({
                icon: '🤖',
                title: 'Best Performing Model',
                description: `${bestModel[0]} achieved R² = ${bestModel[1].r2.toFixed(3)}.`,
                color: 'rgba(48, 209, 88, 0.15)'
            });
        }
        
        // Fertility insight
        if (summary.fertilityScore !== null) {
            let status, desc;
            if (summary.fertilityScore > 0.7) {
                status = 'High';
                desc = 'Soils show excellent fertility potential.';
            } else if (summary.fertilityScore > 0.4) {
                status = 'Moderate';
                desc = 'Soils have moderate fertility. Consider amendments.';
            } else {
                status = 'Low';
                desc = 'Soils show low fertility. Intervention recommended.';
            }
            
            insights.push({
                icon: '🌱',
                title: `Overall Fertility: ${status}`,
                description: desc,
                color: 'rgba(0, 113, 227, 0.15)'
            });
        }
        
        // Render insights
        insights.forEach((insight, idx) => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.style.animationDelay = `${idx * 0.15}s`;
            item.innerHTML = `
                <div class="insight-icon" style="background: ${insight.color};">${insight.icon}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            `;
            container.appendChild(item);
        });
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SoilApp();
});
