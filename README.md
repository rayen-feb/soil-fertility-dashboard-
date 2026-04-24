# 🌱 Soil Fertility Dashboard

A Streamlit-based data science project for **soil fertility evaluation, feature engineering, clustering, and predictive modeling**.  
This dashboard helps researchers, agronomists, and data scientists explore soil datasets, detect missing values, engineer fertility indices, visualize distributions, cluster profiles, and train predictive models.

---

## 📊 Features

- **Flexible Data Loading**
  - Upload CSV/Excel files
  - Connect to SQL databases
  - Fetch data from APIs

- **Missing Data Handling**
  - Visualize missing values with heatmaps
  - Apply imputation methods: Median, KNN, Random Forest

- **Feature Engineering**
  - Compute CN ratio (Carbon/Nitrogen)
  - Fertility Index (TOTC, TOTN, P2O5, PHAQ)
  - Salinity Index (ELCO, GYPS)
  - Depth-normalized carbon
  - Horizon grouping

- **Exploratory Data Analysis (EDA)**
  - Distribution plots
  - Correlation heatmaps
  - Outlier detection with Z-scores

- **Ranking & Consistency**
  - Top 10 fertile profiles
  - Compare rule-based vs cluster-based rankings

- **Clustering & Insights**
  - KMeans clustering with PCA visualization
  - Cluster summaries and recommendations

- **Model Training**
  - Train/test split
  - Models: Random Forest, Gradient Boosting, KNN, Linear Regression
  - Evaluation metrics: R², RMSE
  - Residual plots
  - Export predictions as CSV

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/rayen-feb/soil-fertility-dashboard.git
cd soil-fertility-dashboard
###  2. create a virtual envirenment
python -m venv venv
# Activate it:
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
### 3. install dependencies
pip install -r requirements.txt
### 3.run the dashboard
streamlit run soil_dashboard.py
