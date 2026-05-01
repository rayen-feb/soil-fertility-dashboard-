# 🌱 Soil Intelligence Platform

A premium, Apple-inspired data science web application for soil fertility analysis, feature engineering, clustering, and predictive modeling. Built entirely with HTML, CSS, and JavaScript for static deployment on GitHub Pages.

![Soil Intelligence Platform](https://img.shields.io/badge/Platform-Web-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages-black)

## ✨ Features

### 📊 Data Exploration
- **Interactive Data Preview** - Scrollable table with column type indicators
- **Distribution Analysis** - Histograms for numeric features
- **Correlation Heatmap** - Visual correlation matrix with color coding
- **Missing Values Analysis** - Bar chart showing missing data by feature

### 🔧 Feature Engineering
- **Nitrogen Index** - TOTN / (TOTC + 1)
- **Phosphorus Ratio** - P2O5 / (TOTN + 1)
- **Potassium Balance** - K2O / (P2O5 + 1)
- **Custom Fertility Score** - Mean of key nutrients

### 🎯 Clustering Analysis
- **K-Means Clustering** - Client-side implementation
- **PCA Visualization** - 2D scatter plot of clusters
- **Interactive Controls** - Adjust number of clusters (K)
- **Cluster Summary** - Size and percentage statistics

### 🤖 Predictive Modeling
- **Linear Regression** - Normal equation implementation
- **Random Forest** - Bootstrap aggregation with decision trees
- **Model Comparison** - R² and RMSE metrics
- **Feature Importance** - Horizontal bar chart
- **Predictions vs Actual** - Scatter plot with perfect prediction line

### 🧠 AI Insights
- **Data Quality Assessment** - Missing value analysis
- **Correlation Detection** - Strongest correlations identified
- **Clustering Insights** - Natural groupings discovery
- **Model Performance** - Best model recommendation
- **Fertility Assessment** - Overall soil health score

## 🎨 Design Philosophy

- **Apple-inspired aesthetics** - Clean, minimalist dark theme
- **Glassmorphism effects** - Translucent cards with backdrop blur
- **Smooth animations** - Gradient shifts, floating particles, fade-ins
- **Responsive design** - Mobile-friendly layout
- **Zero dependencies** - Pure HTML/CSS/JS with CDN libraries

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/soil-fertility-dashboard.git
   cd soil-fertility-dashboard
   ```

2. **Start a local server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### GitHub Pages Deployment

1. **Fork this repository**

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select source: Deploy from a branch
   - Choose branch: `main`
   - Folder: `/ (root)`

3. **Your site will be live at**
   ```
   https://yourusername.github.io/soil-fertility-dashboard/
   ```

## 📁 Project Structure

```
soil-fertility-dashboard/
├── index.html              # Main application
├── css/
│   └── style.css           # Apple-inspired dark theme
├── js/
│   ├── app.js              # Main application controller
│   ├── dataProcessor.js    # Data parsing & statistics
│   ├── charts.js           # Chart.js configurations
│   └── ml.js               # ML algorithms (K-means, regression)
├── data/
│   └── soil_data.json      # Sample dataset
└── README.md               # Documentation
```

## 📊 Dataset Format

The application accepts:
- **CSV files** - Comma-separated values
- **Excel files** - .xlsx or .xls format

Expected columns for full functionality:
- `TOTC` - Total Carbon
- `TOTN` - Total Nitrogen
- `P2O5` - Phosphorus
- `K2O` - Potassium
- `PHAQ` - pH Level

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & animations |
| JavaScript (ES6+) | Logic & interactivity |
| Chart.js | Data visualizations |
| SheetJS | Excel file parsing |
| PapaParse | CSV file parsing |
| simple-statistics | Statistical functions |

## 🧮 Machine Learning

All ML algorithms are implemented in pure JavaScript:

- **K-Means Clustering** - Lloyd's algorithm with k-means++ initialization
- **Principal Component Analysis** - Power iteration for eigenvectors
- **Linear Regression** - Normal equation with Gaussian elimination
- **Random Forest** - Bootstrap aggregation with CART decision trees
- **Feature Importance** - Permutation importance approximation

## 🎨 Customization

### Colors
Edit CSS custom properties in `css/style.css`:
```css
:root {
    --accent-blue: #0071e3;
    --accent-purple: #af52de;
    --accent-green: #30d158;
    --accent-orange: #ff9f0a;
}
```

### Charts
Modify chart configurations in `js/charts.js`:
```javascript
this.colors = {
    primary: '#0071e3',
    // ...
};
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Apple Design Resources for inspiration
- Chart.js team for visualization library
- SheetJS team for Excel parsing
- Soil science community for domain knowledge

---

Built with ❤️ for agronomists, researchers, and ML engineers.
