/**
 * Soil Intelligence Platform - Main Application
 */

class SoilApp {
    constructor() {
        this.currentTab = 'preview';
        this.engineeredFeatures = [];
        this.clusterResults = null;
        this.modelResults = null;
        this.selectedCategory = 'trees';
        this.cropDatabase = this.initCropDB();
        this.init();
    }

    initCropDB() {
        const unsplash = (id) => `https://picsum.photos/seed/${id}/400/300`;

        return {
            trees: [
                {name:'Olive',img:unsplash('1591857177580-dc82b9e4e11c'),pH:[7,8],totc:[1,5],elco:[0,4],sal:'tolerant',desc:'Tolerates alkaline, clay-rich soils. Great for semi-arid regions.'},
                {name:'Date Palm',img:unsplash('1541343672885-9d6e7da02e4e'),pH:[7,8.5],totc:[0.5,3],elco:[0,8],sal:'high',desc:'Thrives in sandy, saline soils. Needs irrigation.'},
                {name:'Almond',img:unsplash('1623428067635-4a5a83945cec'),pH:[6.5,8],totc:[1,4],elco:[0,2],sal:'low',desc:'Needs good drainage. Avoid waterlogged soils.'},
                {name:'Pomegranate',img:unsplash('1615485290382-441e4d049cb5'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Prefers neutral pH, well-drained soils.'},
                {name:'Fig',img:unsplash('1603569283847-aa295f0d016a'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Adaptable to various soils. Needs well-drained soils.'},
                {name:'Carob',img:unsplash('1542273917363-3b1817f69a2d'),pH:[7,8.5],totc:[0.5,3],elco:[0,4],sal:'tolerant',desc:'Tolerates alkaline, clay-rich soils. Drought-resistant.'},
                {name:'Citrus',img:unsplash('1582979512210-99b6a53386f9'),pH:[6,7.5],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs excellent drainage. Sensitive to salinity.'},
                {name:'Apricot',img:unsplash('1560806887-1e4cd0b6cbd6'),pH:[6.5,7.5],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs good drainage. Avoid saline soils.'},
                {name:'Peach',img:unsplash('1629753250291-979952613877'),pH:[6,7.5],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Sensitive to salinity. Needs well-drained soils.'},
                {name:'Walnut',img:unsplash('1575481636764-7f2365801443'),pH:[6,7.5],totc:[1.5,5],elco:[0,2],sal:'sensitive',desc:'Needs deep, fertile, well-drained soils.'},
                {name:'Acacia',img:unsplash('1502082553048-f009c37129b9'),pH:[6,8],totc:[0.5,3],elco:[0,6],sal:'high',desc:'Highly adaptable. Tolerates poor, saline soils.'},
                {name:'Pine',img:unsplash('1542273917363-3b1817f69a2d'),pH:[6,8],totc:[0.5,3],elco:[0,3],sal:'moderate',desc:'Tolerates poor, rocky soils. Good for reforestation.'},
                {name:'Jujube',img:unsplash('1610832958506-aa56368176cf'),pH:[6,8],totc:[0.5,3],elco:[0,5],sal:'high',desc:'Tolerates poor, saline soils. Drought-resistant.'},
                {name:'Eucalyptus',img:unsplash('1513836279014-a89f7a76ae86'),pH:[6,8],totc:[0.5,3],elco:[0,3],sal:'moderate',desc:'Fast-growing. Needs deep soils.'}
            ],
            plants: [
                {name:'Wheat',img:unsplash('1501430654243-c934cec2e1c0'),pH:[6,7.5],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs fertile, well-drained soils.'},
                {name:'Barley',img:unsplash('1574323347407-f5e1ad6d020b'),pH:[6,8],totc:[1,4],elco:[0,4],sal:'moderate',desc:'More tolerant than wheat. Good for semi-arid regions.'},
                {name:'Chickpea',img:unsplash('1515543904379-3d757afe72e3'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Fixes nitrogen. Needs well-drained soils.'},
                {name:'Lentil',img:unsplash('1615937657715-bc7b4b7962c1'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Sensitive to salinity. Needs good drainage.'},
                {name:'Faba Bean',img:unsplash('1551754655-cd27e38d2076'),pH:[6,7.5],totc:[1.5,5],elco:[0,2],sal:'sensitive',desc:'Needs deep, fertile soils.'},
                {name:'Sorghum',img:unsplash('1501430654243-c934cec2e1c0'),pH:[6,8],totc:[0.5,3],elco:[0,5],sal:'high',desc:'Highly drought and salinity tolerant.'},
                {name:'Maize',img:unsplash('1551754655-cd27e38d2076'),pH:[6,7.5],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Needs high fertility and irrigation.'},
                {name:'Potato',img:unsplash('1518977676601-b53f82aba655'),pH:[5.5,6.5],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Needs loose, well-drained, slightly acidic soils.'},
                {name:'Tomato',img:unsplash('1592924357228-91a4daadcfea'),pH:[6,7],totc:[1.5,5],elco:[0,2],sal:'sensitive',desc:'Needs fertile soils and irrigation.'},
                {name:'Clover',img:unsplash('1501004318641-b39e6451bec6'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Fixes nitrogen. Good for soil improvement.'}
            ],
            vegetables: [
                {name:'Tomato',img:unsplash('1592924357228-91a4daadcfea'),pH:[6,7],totc:[1.5,5],elco:[0,2],sal:'sensitive',desc:'Needs fertile soils and consistent irrigation.'},
                {name:'Potato',img:unsplash('1518977676601-b53f82aba655'),pH:[5.5,6.5],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Needs loose, well-drained, slightly acidic soils.'},
                {name:'Onion',img:unsplash('1618512496248-a07fe83aa8cb'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Needs well-drained soils.'},
                {name:'Garlic',img:unsplash('1615477056762-a3752e5e3b59'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Similar to onion. Needs good drainage.'},
                {name:'Pepper',img:unsplash('1563565375-f3fdfdbefa83'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs warm, fertile, well-drained soils.'},
                {name:'Cabbage',img:unsplash('1594282486552-05b4d80fbb9f'),pH:[6,7.5],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Needs highly fertile soils.'},
                {name:'Carrot',img:unsplash('1598170845058-32b9d6a5da37'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs deep, loose soils.'},
                {name:'Lettuce',img:unsplash('1622206151226-18ca2c9ab4a1'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs moist, fertile soils.'},
                {name:'Spinach',img:unsplash('1576045057995-568f588f82fb'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Prefers cool, moist, fertile soils.'},
                {name:'Zucchini',img:unsplash('1563252722-6434563a985d'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs warm, fertile soils and irrigation.'},
                {name:'Eggplant',img:unsplash('1613881553903-454e5a4e191e'),pH:[6,7.5],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs warm, fertile, well-drained soils.'},
                {name:'Cucumber',img:unsplash('1449300079323-02e209d9d3a6'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Needs warm soils and consistent irrigation.'},
                {name:'Melon',img:unsplash('1571575173700-afb9492e6a50'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Needs warm, deep, well-drained soils.'},
                {name:'Pumpkin',img:unsplash('1506917728037-b6af011dc942'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Needs fertile, well-drained soils.'},
                {name:'Okra',img:unsplash('1615485290382-441e4d049cb5'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Tolerates heat. Needs irrigation.'},
                {name:'Green Bean',img:unsplash('1567373508358-5d7d5db30d24'),pH:[6,7.5],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Fixes nitrogen. Needs good drainage.'},
                {name:'Pea',img:unsplash('1592321675774-3de57f3ee0dc'),pH:[6,7],totc:[1,4],elco:[0,2],sal:'sensitive',desc:'Cool season crop. Needs well-drained soils.'},
                {name:'Cauliflower',img:unsplash('1568584711075-3d021a7c3ca3'),pH:[6,7.5],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Needs highly fertile soils.'},
                {name:'Broccoli',img:unsplash('1459411621453-7b03977f4bfc'),pH:[6,7.5],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Similar to cauliflower. Needs fertile soils.'},
                {name:'Celery',img:unsplash('1622205313162-be1d5712a43f'),pH:[6,7],totc:[2,5],elco:[0,2],sal:'sensitive',desc:'Needs fertile, moist soils.'},
                {name:'Artichoke',img:unsplash('1558618666-fcd25c85f82e'),pH:[6,7.5],totc:[1,4],elco:[0,3],sal:'moderate',desc:'Needs deep, fertile soils.'}
            ]
        };
    }

    init() {
        this.setupEvents();
        this.setupNav();
        this.setupTabs();
        this.setupUpload();
        this.updateInsights();
    }

    setupEvents() {
        document.getElementById('loadSampleBtn').addEventListener('click', () => this.loadSampleData());
        document.getElementById('loadFullBtn').addEventListener('click', () => this.loadFullDataset());
        document.getElementById('predictFertilityBtn').addEventListener('click', () => this.predictFertility());
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.borderColor = 'var(--border-color)';
                    b.style.background = 'transparent';
                    b.style.color = 'var(--text-secondary)';
                });
                e.target.classList.add('active');
                e.target.style.borderColor = 'var(--accent-green)';
                e.target.style.background = 'rgba(48, 209, 88, 0.15)';
                e.target.style.color = 'var(--accent-green)';
                this.selectedCategory = e.target.dataset.category;
            });
        });

        document.getElementById('clusterK').addEventListener('input', (e) => {
            document.getElementById('clusterKValue').textContent = e.target.value;
        });
        document.getElementById('runClustering').addEventListener('click', () => this.runClustering());
        
        document.getElementById('testSize').addEventListener('input', (e) => {
            document.getElementById('testSizeValue').textContent = e.target.value + '%';
        });
        document.getElementById('trainModels').addEventListener('click', () => this.trainModels());
        
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('mobile-open');
        });
    }

    setupNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                this.currentTab = tabId;
                if (tabId === 'distributions') this.renderDistributions();
                else if (tabId === 'correlations') this.renderCorrelations();
                else if (tabId === 'missing') this.renderMissingValues();
            });
        });
    }

    setupUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        uploadZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) this.handleFile(e.target.files[0]);
        });
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) this.handleFile(e.dataTransfer.files[0]);
        });
    }

    async handleFile(file) {
        this.showLoading(true);
        try {
            const ext = file.name.split('.').pop().toLowerCase();
            if (ext === 'csv') await dataProcessor.parseCSV(file);
            else if (['xlsx','xls'].includes(ext)) await dataProcessor.parseExcel(file);
            else throw new Error('Unsupported file format');
            this.onDataLoaded();
            this.showUploadStatus(`Loaded ${dataProcessor.data.length} rows and ${dataProcessor.columns.length} features`, 'success');
        } catch (error) {
            this.showUploadStatus(`Error: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadSampleData() {
        this.showLoading(true);
        try {
            await dataProcessor.loadSampleData();
            this.onDataLoaded();
            this.showUploadStatus(`Loaded ${dataProcessor.data.length} rows and ${dataProcessor.columns.length} features`, 'success');
        } catch (error) {
            this.showUploadStatus(`Error: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadFullDataset() {
        this.showLoading(true);
        try {
            await dataProcessor.loadFullDataset();
            this.onDataLoaded();
            this.showUploadStatus(`Loaded full dataset: ${dataProcessor.data.length} rows and ${dataProcessor.columns.length} features`, 'success');
        } catch (error) {
            this.showUploadStatus(`Error: ${error.message}. Try using a local server`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    onDataLoaded() {
        this.updateKPIs();
        this.renderPreview();
        this.populateSelectors();
        this.renderFeatureEngineering();
        this.updateInsights();
        document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
    }

    showUploadStatus(message, type) {
        const status = document.getElementById('uploadStatus');
        status.textContent = message;
        status.className = `upload-status ${type}`;
        status.classList.remove('hidden');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) overlay.classList.remove('hidden');
        else overlay.classList.add('hidden');
    }

    updateKPIs() {
        const summary = dataProcessor.getSummary();
        if (!summary) return;
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
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    renderPreview() {
        const table = document.getElementById('previewTable');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        thead.innerHTML = '';
        tbody.innerHTML = '';
        const headerRow = document.createElement('tr');
        dataProcessor.columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
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
        document.getElementById('tableInfo').textContent = `Showing ${Math.min(20, dataProcessor.data.length)} of ${dataProcessor.data.length} rows`;
    }

    populateSelectors() {
        const numericCols = dataProcessor.getAvailableNumericColumns();
        const setupSelect = (id, defaultCount) => {
            const select = document.getElementById(id);
            select.innerHTML = '';
            numericCols.forEach(col => {
                const option = document.createElement('option');
                option.value = col;
                option.textContent = col;
                select.appendChild(option);
            });
            for (let i = 0; i < Math.min(defaultCount, select.options.length); i++) {
                select.options[i].selected = true;
            }
            return select;
        };
        const distSelect = setupSelect('distFeatureSelect', 4);
        distSelect.addEventListener('change', () => this.renderDistributions());
        const corrSelect = setupSelect('corrFeatureSelect', 6);
        corrSelect.addEventListener('change', () => this.renderCorrelations());
        setupSelect('clusterFeatures', 3);
        setupSelect('targetSelect', 1);
        setupSelect('modelFeatures', 5);
    }

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
            chartDiv.innerHTML = `<div class="chart-title">${feature}</div><canvas id="distChart_${idx}"></canvas>`;
            container.appendChild(chartDiv);
            const labels = histogram.binLabels.filter((_, i) => i % 2 === 0);
            const data = histogram.counts.filter((_, i) => i % 2 === 0);
            chartManager.createHistogram(`distChart_${idx}`, labels, data, feature);
        });
    }

    renderCorrelations() {
        const select = document.getElementById('corrFeatureSelect');
        const selectedFeatures = Array.from(select.selectedOptions).map(o => o.value);
        if (selectedFeatures.length < 2) {
            document.getElementById('corrHeatmap').innerHTML = '<p style="color: #86868b; text-align: center;">Select at least 2 features</p>';
            return;
        }
        const matrix = dataProcessor.getCorrelationMatrix(selectedFeatures);
        chartManager.createHeatmap('corrHeatmap', matrix, selectedFeatures);
    }

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

    renderFeatureEngineering() {
        const container = document.getElementById('featureGrid');
        container.innerHTML = '';
        const features = [
            {name:'Nitrogen Index',formula:'TOTN / (TOTC + 1)',desc:'Measures nitrogen availability relative to organic carbon',icon:'🌿',cols:['TOTN','TOTC']},
            {name:'Phosphorus Ratio',formula:'P2O5 / (TOTN + 1)',desc:'Balanced phosphorus-to-nitrogen relationship',icon:'⚡',cols:['P2O5','TOTN']},
            {name:'Potassium Balance',formula:'K2O / (P2O5 + 1)',desc:'Potassium efficiency relative to phosphorus',icon:'💧',cols:['K2O','P2O5']},
            {name:'Fertility Score',formula:'Mean(TOTC, TOTN, P2O5, PHAQ)',desc:'Composite fertility indicator',icon:'⭐',cols:['TOTC','TOTN','P2O5','PHAQ']}
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
                <p class="feature-description">${feat.desc}</p>
                ${available && !isApplied ? `<button class="btn btn-primary" onclick="app.applyFeature('${feat.name}')" style="width: 100%;">Apply ${feat.name}</button>` : available && isApplied ? `<div class="upload-status success">✓ Already applied</div>` : ''}
            `;
            container.appendChild(card);
        });
    }

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
                const data = dataProcessor.data
                    .map(row => selectedFeatures.map(f => row[f]))
                    .filter(row => row.every(v => v !== null && !isNaN(v)));
                if (data.length === 0) {
                    alert('No valid data after removing missing values');
                    this.showLoading(false);
                    return;
                }
                const standardized = mlProcessor.standardize(data);
                const result = mlProcessor.kmeans(standardized, k);
                const pca = mlProcessor.pca(standardized, 2);
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
                this.renderClusteringResults();
            } catch (error) {
                alert('Error during clustering: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 100);
    }

    renderClusteringResults() {
        document.getElementById('clusteringResults').style.display = 'block';
        chartManager.createScatterPlot('clusterChart', this.clusterResults.clusters, 'Cluster Visualization');
        const summaryDiv = document.getElementById('clusterSummary');
        summaryDiv.innerHTML = '';
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead><tr><th>Cluster</th><th>Size</th><th>Percentage</th></tr></thead>
            <tbody>
                ${this.clusterResults.clusters.map((c, i) => `
                    <tr><td>Cluster ${i + 1}</td><td>${c.size}</td><td>${((c.size / dataProcessor.data.length) * 100).toFixed(1)}%</td></tr>
                `).join('')}
            </tbody>
        `;
        summaryDiv.appendChild(table);
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

    trainModels() {
        const target = document.getElementById('targetSelect').value;
        const features = Array.from(document.getElementById('modelFeatures').selectedOptions).map(o => o.value);
        const testSize = parseInt(document.getElementById('testSize').value) / 100;
        const selectedModels = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);
        if (!target || features.length === 0) {
            alert('Please select target and features');
            return;
        }
        this.showLoading(true);
        setTimeout(() => {
            try {
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
                const { XTrain, XTest, yTrain, yTest } = mlProcessor.trainTestSplit(X, y, testSize);
                this.modelResults = {};
                if (selectedModels.includes('linear')) {
                    const result = mlProcessor.linearRegression(XTrain, yTrain);
                    const testPreds = XTest.map(row => {
                        const withIntercept = [1, ...row];
                        return withIntercept.reduce((sum, val, i) => sum + val * result.coefficients[i], 0);
                    });
                    const r2 = this.calculateR2(yTest, testPreds);
                    const rmse = this.calculateRMSE(yTest, testPreds);
                    this.modelResults['Linear Regression'] = { ...result, r2, rmse, testPredictions: testPreds, testActual: yTest };
                }
                if (selectedModels.includes('rf')) {
                    const result = mlProcessor.randomForest(XTrain, yTrain, 30, 8);
                    const testPreds = XTest.map(row => {
                        return result.trees.map(tree => mlProcessor.predictTree(tree, row)).reduce((a, b) => a + b, 0) / result.trees.length;
                    });
                    const r2 = this.calculateR2(yTest, testPreds);
                    const rmse = this.calculateRMSE(yTest, testPreds);
                    this.modelResults['Random Forest'] = { ...result, r2, rmse, testPredictions: testPreds, testActual: yTest };
                }
                this.renderModelingResults(features);
            } catch (error) {
                alert('Error during modeling: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 100);
    }

    calculateR2(actual, predicted) {
        const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
        const ssTotal = actual.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        const ssResidual = actual.reduce((acc, val, i) => acc + Math.pow(val - predicted[i], 2), 0);
        return ssTotal === 0 ? 0 : 1 - (ssResidual / ssTotal);
    }

    calculateRMSE(actual, predicted) {
        const mse = actual.reduce((acc, val, i) => acc + Math.pow(val - predicted[i], 2), 0) / actual.length;
        return Math.sqrt(mse);
    }

    renderModelingResults(features) {
        document.getElementById('modelingResults').style.display = 'block';
        const comparisonDiv = document.getElementById('modelComparison');
        comparisonDiv.innerHTML = '';
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead><tr><th>Model</th><th>R² Score</th><th>RMSE</th></tr></thead>
            <tbody>
                ${Object.entries(this.modelResults).map(([name, result]) => `
                    <tr><td>${name}</td><td style=\"color: ${result.r2 > 0.7 ? '#30d158' : result.r2 > 0.4 ? '#ff9f0a' : '#ff453a'}\">${result.r2.toFixed(3)}</td><td>${result.rmse.toFixed(3)}</td></tr>
                `).join('')}
            </tbody>
        `;
        comparisonDiv.appendChild(table);
        const firstModel = Object.values(this.modelResults)[0];
        if (firstModel) {
            chartManager.createPredictionPlot('predictionChart', firstModel.testActual, firstModel.testPredictions, 'Predictions vs Actual');
        }
        const firstModelName = Object.keys(this.modelResults)[0];
        const firstModelResult = this.modelResults[firstModelName];
        if (firstModelResult.importance) {
            chartManager.createHorizontalBarChart('importanceChart', features, firstModelResult.importance, `${firstModelName} - Feature Importance`);
        }
        this.updateInsights();
    }

    predictFertility() {
        const totc = parseFloat(document.getElementById('predTOTC').value);
        const totn = parseFloat(document.getElementById('predTOTN').value);
        const p2o5 = parseFloat(document.getElementById('predP2O5').value);
        const k2o = parseFloat(document.getElementById('predK2O').value);
        const phaq = parseFloat(document.getElementById('predPHAQ').value);
        const hbde = parseFloat(document.getElementById('predHBDE').value);
        const elco = parseFloat(document.getElementById('predELCO').value);
        const gyps = parseFloat(document.getElementById('predGYPS').value);
        const inputs = { totc, totn, p2o5, k2o, phaq, hbde, elco, gyps };
        const missing = Object.entries(inputs).filter(([k, v]) => isNaN(v));
        if (missing.length > 0) {
            alert('Please fill in all fields with valid numbers');
            return;
        }
        const weights = { totc: 0.20, totn: 0.25, p2o5: 0.20, k2o: 0.15, phaq: 0.10, hbde: 0.05, elco: 0.03, gyps: 0.02 };
        const normalized = {
            totc: Math.min(totc / 5.0, 1),
            totn: Math.min(totn / 0.5, 1),
            p2o5: Math.min(p2o5 / 100.0, 1),
            k2o: Math.min(k2o / 300.0, 1),
            phaq: 1 - Math.abs(phaq - 6.5) / 6.5,
            hbde: Math.min(hbde / 100.0, 1),
            elco: Math.max(0, 1 - elco / 4.0),
            gyps: Math.max(0, 1 - gyps / 5.0)
        };
        let score = 0;
        for (const [key, weight] of Object.entries(weights)) {
            score += normalized[key] * weight;
        }
        score = Math.round(score * 100);
        let category, color, icon;
        if (score >= 70) { category = 'High Fertility'; color = 'var(--accent-green)'; icon = '⭐'; }
        else if (score >= 40) { category = 'Moderate Fertility'; color = 'var(--accent-orange)'; icon = '⚠️'; }
        else { category = 'Low Fertility'; color = 'var(--accent-red)'; icon = '🔴'; }
        const recommendations = [];
        if (totn < 0.1) recommendations.push({ icon: '🌿', title: 'Nitrogen Deficiency', desc: 'Add nitrogen-rich fertilizers or plant legumes.', color: 'rgba(255, 159, 10, 0.15)' });
        if (p2o5 < 20) recommendations.push({ icon: '⚡', title: 'Phosphorus Low', desc: 'Apply phosphate fertilizers.', color: 'rgba(255, 159, 10, 0.15)' });
        if (k2o < 100) recommendations.push({ icon: '💧', title: 'Potassium Low', desc: 'Add potassium fertilizers.', color: 'rgba(255, 159, 10, 0.15)' });
        if (phaq < 5.5 || phaq > 7.5) recommendations.push({ icon: '⚖️', title: 'pH Imbalance', desc: phaq < 5.5 ? 'Add lime to raise pH.' : 'Add sulfur or organic matter to lower pH.', color: 'rgba(0, 113, 227, 0.15)' });
        if (elco > 2) recommendations.push({ icon: '🧂', title: 'High Salinity', desc: 'Improve drainage, leach salts, or use salt-tolerant crops.', color: 'rgba(255, 69, 58, 0.15)' });
        if (recommendations.length === 0) recommendations.push({ icon: '✅', title: 'Soil in Good Condition', desc: 'Continue current management practices.', color: 'rgba(48, 209, 88, 0.15)' });
        document.getElementById('predictionResult').classList.remove('hidden');
        document.getElementById('predScore').textContent = score + '/100';
        document.getElementById('predCategory').textContent = icon + ' ' + category;
        document.getElementById('predCategory').style.color = color;
        const recContainer = document.getElementById('predRecommendations');
        recContainer.innerHTML = '';
        recommendations.forEach((rec, idx) => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.style.animationDelay = `${idx * 0.15}s`;
            item.innerHTML = `<div class="insight-icon" style="background: ${rec.color};">${rec.icon}</div><div class="insight-content"><h4>${rec.title}</h4><p>${rec.desc}</p></div>`;
            recContainer.appendChild(item);
        });
        this.calculateCropRecommendations(inputs);
        document.getElementById('predictionResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
calculateCropRecommendations(soilData) {
        const { phaq, totc, elco } = soilData;
        const crops = this.cropDB[this.selectedCategory];
        const scoredCrops = crops.map(crop => {
            let score = 0;
            const reasons = [];
            const warnings = [];
            const pHMid = (crop.pH[0] + crop.pH[1]) / 2;
            const pHRange = crop.pH[1] - crop.pH[0];
            const pHDist = Math.abs(phaq - pHMid);
            const pHScore = Math.max(0, 1 - pHDist / (pHRange / 2 + 1));
            score += pHScore * 30;
            if (pHScore > 0.8) reasons.push('✓ pH ideal');
            else if (pHScore > 0.5) reasons.push('~ pH acceptable');
            else warnings.push('✗ pH mismatch');
            const totcMid = (crop.totc[0] + crop.totc[1]) / 2;
            const totcScore = Math.max(0, 1 - Math.abs(totc - totcMid) / (totcMid + 1));
            score += totcScore * 25;
            if (totcScore > 0.8) reasons.push('✓ Carbon good');
            else if (totcScore > 0.5) reasons.push('~ Carbon acceptable');
            else warnings.push('✗ Low carbon');
            const elcoScore = crop.sal === 'high' ? Math.min(elco / 4, 1) : crop.sal === 'tolerant' ? Math.min(elco / 6, 1) : crop.sal === 'moderate' ? Math.max(0, 1 - elco / 4) : Math.max(0, 1 - elco / 2);
            score += elcoScore * 25;
            if (elcoScore > 0.8) reasons.push('✓ Salinity suitable');
            else if (elcoScore > 0.5) reasons.push('~ Salinity acceptable');
            else warnings.push('✗ Salinity issue');
            score += 20;
            return { ...crop, score: Math.min(100, Math.round(score)), reasons, warnings };
        });
        scoredCrops.sort((a, b) => b.score - a.score);
        const topCrops = scoredCrops.slice(0, 6);
        const categoryTitles = { trees: '🌳 Best Trees for Your Soil', plants: '🌿 Best Plants for Your Soil', vegetables: '🥕 Best Vegetables for Your Soil' };
        document.getElementById('cropCategoryTitle').textContent = categoryTitles[this.selectedCategory];
        const container = document.getElementById('cropRecommendations');
        container.innerHTML = '';
        topCrops.forEach((crop, idx) => {
            const card = document.createElement('div');
            card.style.cssText = 'background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.3s; animation: fadeInUp 0.5s ease forwards; animation-delay: ' + (idx * 0.1) + 's; opacity: 0;';
            card.innerHTML = `
                <div style="position: relative; height: 160px; overflow: hidden; background: linear-gradient(135deg, rgba(0,113,227,0.15), rgba(175,82,222,0.15)); display: flex; align-items: center; justify-content: center;">
                    <img src="${crop.img}" alt="${crop.name}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; z-index: 1;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.style.display='none'">
                    <div style="font-size: 3rem;">🌱</div>
                    <div style="position: absolute; top: 10px; right: 10px; background: ${crop.score >= 70 ? '#30d158' : crop.score >= 40 ? '#ff9f0a' : '#ff453a'}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; z-index: 2;">${crop.score}%</div>
                </div>

                <div style="padding: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1.1rem;">${crop.name}</h4>
                    <p style="margin: 0 0 0.75rem 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${crop.desc}</p>

                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                        ${crop.reasons.map(r => `<span style="background: rgba(48, 209, 88, 0.15); color: #30d158; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${r}</span>`).join('')}
                        ${crop.warnings.map(w => `<span style="background: rgba(255, 69, 58, 0.15); color: #ff453a; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${w}</span>`).join('')}
                    </div>
                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-secondary);">
                        <div>pH: ${crop.pH[0]}-${crop.pH[1]} | Carbon: ${crop.totc[0]}-${crop.totc[1]}%</div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    updateInsights() {
        const insightsDiv = document.getElementById('insightsList');
        if (!dataProcessor.data || dataProcessor.data.length === 0) {
            insightsDiv.innerHTML = '<div class="insight-item"><div class="insight-icon" style="background: rgba(0, 113, 227, 0.15);">💡</div><div class="insight-content"><h4>Welcome</h4><p>Upload a dataset or load sample data to begin analysis.</p></div></div>';
            return;
        }
        const insights = [];
        const summary = dataProcessor.getSummary();
        if (summary && summary.missingPercent > 10) {
            insights.push({ icon: '⚠️', title: 'High Missing Values', desc: `${summary.missingPercent.toFixed(1)}% of values are missing. Consider imputation.`, color: 'rgba(255, 159, 10, 0.15)' });
        }
        if (this.clusterResults) {
            insights.push({ icon: '🔍', title: 'Clustering Complete', desc: `Found ${this.clusterResults.clusters.length} distinct soil groups in your data.`, color: 'rgba(0, 113, 227, 0.15)' });
        }
        if (this.modelResults) {
            const bestModel = Object.entries(this.modelResults).sort((a, b) => b[1].r2 - a[1].r2)[0];
            insights.push({ icon: '📊', title: 'Best Model: ' + bestModel[0], desc: `R² = ${bestModel[1].r2.toFixed(3)}, RMSE = ${bestModel[1].rmse.toFixed(3)}`, color: 'rgba(48, 209, 88, 0.15)' });
        }
        if (insights.length === 0) {
            insights.push({ icon: '✅', title: 'Data Loaded', desc: `${dataProcessor.data.length} samples ready for analysis. Explore the tabs above.`, color: 'rgba(48, 209, 88, 0.15)' });
        }
        insightsDiv.innerHTML = '';
        insights.forEach((insight, idx) => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.style.animationDelay = `${idx * 0.1}s`;
            item.innerHTML = `<div class="insight-icon" style="background: ${insight.color};">${insight.icon}</div><div class="insight-content"><h4>${insight.title}</h4><p>${insight.desc}</p></div>`;
            insightsDiv.appendChild(item);
        });
    }
}

const app = new SoilApp();
