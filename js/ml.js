/**
 * Soil Intelligence Platform - Machine Learning Module
 * Client-side ML algorithms for clustering and regression
 */

class MLProcessor {
    constructor() {
        this.randomSeed = 42;
    }

    /**
     * Set random seed for reproducibility
     */
    setSeed(seed) {
        this.randomSeed = seed;
    }

    /**
     * Simple random number generator with seed
     */
    random() {
        this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
        return this.randomSeed / 233280;
    }

    /**
     * K-Means Clustering
     */
    kmeans(data, k, maxIterations = 100) {
        const n = data.length;
        const dimensions = data[0].length;
        
        // Initialize centroids randomly
        let centroids = [];
        const usedIndices = new Set();
        for (let i = 0; i < k; i++) {
            let idx;
            do {
                idx = Math.floor(this.random() * n);
            } while (usedIndices.has(idx));
            usedIndices.add(idx);
            centroids.push([...data[idx]]);
        }
        
        let assignments = new Array(n).fill(0);
        let iterations = 0;
        let changed = true;
        
        while (changed && iterations < maxIterations) {
            changed = false;
            iterations++;
            
            // Assign points to nearest centroid
            for (let i = 0; i < n; i++) {
                let minDist = Infinity;
                let bestCluster = 0;
                
                for (let j = 0; j < k; j++) {
                    const dist = this.euclideanDistance(data[i], centroids[j]);
                    if (dist < minDist) {
                        minDist = dist;
                        bestCluster = j;
                    }
                }
                
                if (assignments[i] !== bestCluster) {
                    assignments[i] = bestCluster;
                    changed = true;
                }
            }
            
            // Update centroids
            const newCentroids = [];
            const counts = new Array(k).fill(0);
            
            for (let j = 0; j < k; j++) {
                newCentroids.push(new Array(dimensions).fill(0));
            }
            
            for (let i = 0; i < n; i++) {
                const cluster = assignments[i];
                counts[cluster]++;
                for (let d = 0; d < dimensions; d++) {
                    newCentroids[cluster][d] += data[i][d];
                }
            }
            
            for (let j = 0; j < k; j++) {
                if (counts[j] > 0) {
                    for (let d = 0; d < dimensions; d++) {
                        newCentroids[j][d] /= counts[j];
                    }
                }
            }
            
            centroids = newCentroids;
        }
        
        // Calculate cluster statistics
        const clusters = [];
        for (let j = 0; j < k; j++) {
            const points = [];
            for (let i = 0; i < n; i++) {
                if (assignments[i] === j) {
                    points.push(data[i]);
                }
            }
            clusters.push({
                id: j,
                points: points,
                centroid: centroids[j],
                size: points.length
            });
        }
        
        return { clusters, assignments, iterations };
    }

    /**
     * Euclidean distance
     */
    euclideanDistance(a, b) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(sum);
    }

    /**
     * Principal Component Analysis (PCA)
     */
    pca(data, nComponents = 2) {
        const n = data.length;
        const dimensions = data[0].length;
        
        // Center the data
        const means = [];
        for (let d = 0; d < dimensions; d++) {
            let sum = 0;
            for (let i = 0; i < n; i++) {
                sum += data[i][d];
            }
            means.push(sum / n);
        }
        
        const centered = data.map(row => 
            row.map((val, d) => val - means[d])
        );
        
        // Compute covariance matrix
        const cov = [];
        for (let i = 0; i < dimensions; i++) {
            cov[i] = [];
            for (let j = 0; j < dimensions; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    sum += centered[k][i] * centered[k][j];
                }
                cov[i][j] = sum / (n - 1);
            }
        }
        
        // Power iteration for top eigenvectors
        const eigenvectors = [];
        let remainingCov = cov.map(row => [...row]);
        
        for (let comp = 0; comp < nComponents; comp++) {
            let vector = new Array(dimensions).fill(0).map(() => this.random() - 0.5);
            
            // Normalize
            let norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
            vector = vector.map(v => v / norm);
            
            // Power iteration
            for (let iter = 0; iter < 100; iter++) {
                const newVector = new Array(dimensions).fill(0);
                for (let i = 0; i < dimensions; i++) {
                    for (let j = 0; j < dimensions; j++) {
                        newVector[i] += remainingCov[i][j] * vector[j];
                    }
                }
                
                norm = Math.sqrt(newVector.reduce((sum, v) => sum + v * v, 0));
                vector = newVector.map(v => v / norm);
            }
            
            eigenvectors.push(vector);
            
            // Deflate covariance matrix
            for (let i = 0; i < dimensions; i++) {
                for (let j = 0; j < dimensions; j++) {
                    remainingCov[i][j] -= vector[i] * vector[j] * this.eigenvalue(remainingCov, vector);
                }
            }
        }
        
        // Project data
        const projected = centered.map(row => {
            return eigenvectors.map(eigenvector => {
                return row.reduce((sum, val, i) => sum + val * eigenvector[i], 0);
            });
        });
        
        return projected;
    }

    /**
     * Compute eigenvalue for a vector
     */
    eigenvalue(matrix, vector) {
        const n = vector.length;
        let result = 0;
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += matrix[i][j] * vector[j];
            }
            result += vector[i] * sum;
        }
        return result;
    }

    /**
     * Standardize data (z-score normalization)
     */
    standardize(data) {
        const n = data.length;
        const dimensions = data[0].length;
        
        const means = [];
        const stds = [];
        
        for (let d = 0; d < dimensions; d++) {
            const values = data.map(row => row[d]);
            const mean = values.reduce((a, b) => a + b, 0) / n;
            const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
            const std = Math.sqrt(variance);
            
            means.push(mean);
            stds.push(std);
        }
        
        return data.map(row => 
            row.map((val, d) => stds[d] === 0 ? 0 : (val - means[d]) / stds[d])
        );
    }

    /**
     * Linear Regression
     */
    linearRegression(X, y) {
        const n = X.length;
        const features = X[0].length;
        
        // Add intercept
        const XWithIntercept = X.map(row => [1, ...row]);
        
        // Normal equation: (X^T * X)^-1 * X^T * y
        const Xt = this.transpose(XWithIntercept);
        const XtX = this.matrixMultiply(Xt, XWithIntercept);
        const Xty = this.matrixVectorMultiply(Xt, y);
        
        // Solve using Gaussian elimination
        const coefficients = this.solveLinearSystem(XtX, Xty);
        
        // Predictions
        const predictions = XWithIntercept.map(row => 
            row.reduce((sum, val, i) => sum + val * coefficients[i], 0)
        );
        
        // Calculate R²
        const yMean = y.reduce((a, b) => a + b, 0) / n;
        const ssTotal = y.reduce((acc, val) => acc + Math.pow(val - yMean, 2), 0);
        const ssResidual = y.reduce((acc, val, i) => acc + Math.pow(val - predictions[i], 2), 0);
        const r2 = ssTotal === 0 ? 0 : 1 - (ssResidual / ssTotal);
        
        // Calculate RMSE
        const rmse = Math.sqrt(ssResidual / n);
        
        // Feature importance (absolute coefficients, excluding intercept)
        const importance = coefficients.slice(1).map(Math.abs);
        
        return {
            coefficients,
            predictions,
            r2,
            rmse,
            importance
        };
    }

    /**
     * Simple Random Forest approximation
     */
    randomForest(X, y, nTrees = 50, maxDepth = 10, sampleRatio = 0.7) {
        const trees = [];
        const n = X.length;
        const features = X[0].length;
        const nSamples = Math.floor(n * sampleRatio);
        
        for (let t = 0; t < nTrees; t++) {
            // Bootstrap sample
            const sampleIndices = [];
            for (let i = 0; i < nSamples; i++) {
                sampleIndices.push(Math.floor(this.random() * n));
            }
            
            const sampleX = sampleIndices.map(i => X[i]);
            const sampleY = sampleIndices.map(i => y[i]);
            
            // Build tree
            const tree = this.buildTree(sampleX, sampleY, maxDepth, 0, features);
            trees.push(tree);
        }
        
        // Predictions (average of all trees)
        const predictions = X.map((row, i) => {
            const treePreds = trees.map(tree => this.predictTree(tree, row));
            return treePreds.reduce((a, b) => a + b, 0) / treePreds.length;
        });
        
        // Calculate metrics
        const yMean = y.reduce((a, b) => a + b, 0) / n;
        const ssTotal = y.reduce((acc, val) => acc + Math.pow(val - yMean, 2), 0);
        const ssResidual = y.reduce((acc, val, i) => acc + Math.pow(val - predictions[i], 2), 0);
        const r2 = ssTotal === 0 ? 0 : 1 - (ssResidual / ssTotal);
        const rmse = Math.sqrt(ssResidual / n);
        
        // Feature importance (simplified)
        const importance = new Array(features).fill(0);
        for (let f = 0; f < features; f++) {
            // Permutation importance approximation
            const shuffledX = X.map(row => [...row]);
            for (let i = shuffledX.length - 1; i > 0; i--) {
                const j = Math.floor(this.random() * (i + 1));
                [shuffledX[i][f], shuffledX[j][f]] = [shuffledX[j][f], shuffledX[i][f]];
            }
            
            const shuffledPreds = shuffledX.map((row, i) => {
                const treePreds = trees.map(tree => this.predictTree(tree, row));
                return treePreds.reduce((a, b) => a + b, 0) / treePreds.length;
            });
            
            const shuffledError = y.reduce((acc, val, i) => acc + Math.pow(val - shuffledPreds[i], 2), 0);
            importance[f] = Math.max(0, (ssResidual - shuffledError) / ssTotal);
        }
        
        return {
            predictions,
            r2,
            rmse,
            importance,
            trees
        };
    }

    /**
     * Build a decision tree
     */
    buildTree(X, y, maxDepth, depth, nFeatures) {
        const n = X.length;
        
        // Stopping conditions
        if (depth >= maxDepth || n < 5) {
            return { value: y.reduce((a, b) => a + b, 0) / n, isLeaf: true };
        }
        
        // Find best split
        let bestFeature = -1;
        let bestThreshold = 0;
        let bestGain = -Infinity;
        
        const featureSubset = [];
        const nSubset = Math.min(nFeatures, Math.ceil(Math.sqrt(nFeatures)));
        while (featureSubset.length < nSubset) {
            const f = Math.floor(this.random() * nFeatures);
            if (!featureSubset.includes(f)) featureSubset.push(f);
        }
        
        for (const feature of featureSubset) {
            const values = X.map(row => row[feature]).sort((a, b) => a - b);
            
            for (let i = 1; i < values.length; i++) {
                const threshold = (values[i - 1] + values[i]) / 2;
                
                const leftY = [];
                const rightY = [];
                
                for (let j = 0; j < n; j++) {
                    if (X[j][feature] <= threshold) {
                        leftY.push(y[j]);
                    } else {
                        rightY.push(y[j]);
                    }
                }
                
                if (leftY.length === 0 || rightY.length === 0) continue;
                
                const gain = this.informationGain(y, leftY, rightY);
                if (gain > bestGain) {
                    bestGain = gain;
                    bestFeature = feature;
                    bestThreshold = threshold;
                }
            }
        }
        
        if (bestFeature === -1) {
            return { value: y.reduce((a, b) => a + b, 0) / n, isLeaf: true };
        }
        
        // Split data
        const leftX = [];
        const leftY = [];
        const rightX = [];
        const rightY = [];
        
        for (let i = 0; i < n; i++) {
            if (X[i][bestFeature] <= bestThreshold) {
                leftX.push(X[i]);
                leftY.push(y[i]);
            } else {
                rightX.push(X[i]);
                rightY.push(y[i]);
            }
        }
        
        return {
            feature: bestFeature,
            threshold: bestThreshold,
            left: this.buildTree(leftX, leftY, maxDepth, depth + 1, nFeatures),
            right: this.buildTree(rightX, rightY, maxDepth, depth + 1, nFeatures),
            isLeaf: false
        };
    }

    /**
     * Information gain for regression
     */
    informationGain(parent, left, right) {
        const parentVar = this.variance(parent);
        const leftWeight = left.length / parent.length;
        const rightWeight = right.length / parent.length;
        const weightedVar = leftWeight * this.variance(left) + rightWeight * this.variance(right);
        return parentVar - weightedVar;
    }

    /**
     * Variance
     */
    variance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    }

    /**
     * Predict using a tree
     */
    predictTree(tree, x) {
        if (tree.isLeaf) return tree.value;
        if (x[tree.feature] <= tree.threshold) {
            return this.predictTree(tree.left, x);
        } else {
            return this.predictTree(tree.right, x);
        }
    }

    /**
     * Matrix transpose
     */
    transpose(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }

    /**
     * Matrix multiplication
     */
    matrixMultiply(a, b) {
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result[i] = [];
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < b.length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    /**
     * Matrix-vector multiplication
     */
    matrixVectorMultiply(matrix, vector) {
        return matrix.map(row => 
            row.reduce((sum, val, i) => sum + val * vector[i], 0)
        );
    }

    /**
     * Solve linear system using Gaussian elimination
     */
    solveLinearSystem(A, b) {
        const n = A.length;
        const augmented = A.map((row, i) => [...row, b[i]]);
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Partial pivoting
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            // Eliminate
            for (let k = i + 1; k < n; k++) {
                const factor = augmented[k][i] / augmented[i][i];
                for (let j = i; j <= n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }
        
        // Back substitution
        const x = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = augmented[i][n];
            for (let j = i + 1; j < n; j++) {
                x[i] -= augmented[i][j] * x[j];
            }
            x[i] /= augmented[i][i];
        }
        
        return x;
    }

    /**
     * Train-test split
     */
    trainTestSplit(X, y, testSize = 0.2) {
        const n = X.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        
        // Shuffle
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        const splitIndex = Math.floor(n * (1 - testSize));
        const trainIndices = indices.slice(0, splitIndex);
        const testIndices = indices.slice(splitIndex);
        
        return {
            XTrain: trainIndices.map(i => X[i]),
            XTest: testIndices.map(i => X[i]),
            yTrain: trainIndices.map(i => y[i]),
            yTest: testIndices.map(i => y[i])
        };
    }
}

// Create global instance
const mlProcessor = new MLProcessor();
