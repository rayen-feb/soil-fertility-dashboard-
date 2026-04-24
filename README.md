🌱 Soil Fertility Dashboard
📖 Project Description
This project delivers an interactive Streamlit dashboard for soil fertility evaluation.
It integrates multiple soil datasets, applies feature engineering, and leverages machine learning models to generate insights that support soil health improvement and sustainability.

The goal is to solve a real challenge: predicting soil fertility accurately to help Tunisian farmers make better decisions about crop management, fertilization, and sustainability practices.

📊 Dataset Work
Began with a small, incomplete horizon dataset that was insufficient for fertility prediction.

Integrated additional soil datasets through mapping and harmonization to build a unified, richer foundation.

Addressed missing values and inconsistencies to ensure reliability.

Engineered new features such as CN_ratio, Salinity_Index, and Fertility_Index to capture soil quality indicators.

This integration step was crucial to move from fragmented data to a national‑scale fertility evaluation resource.

⚙️ Preprocessing
Applied data cleaning: imputation of missing values, normalization, and encoding of categorical variables.

Conducted correlation analysis to identify the most relevant fertility drivers (carbon, nitrogen, phosphorus, pH).

Reduced dimensionality by focusing on the most impactful features for modeling.

This ensured that the models were trained on meaningful, interpretable variables rather than noise.

🤖 Modeling
Implemented multiple models:

Random Forest & Gradient Boosting → captured non‑linear relationships, achieved >93% variance explained.

KNN → explored local similarity patterns, sensitive to outliers.

Linear Regression → used as a transparent baseline.

Hyperparameters tuned for balance between accuracy and generalization.

Evaluation metrics: R², RMSE, and residual analysis confirmed unbiased, robust predictions.

This modeling pipeline transformed raw soil data into actionable fertility predictions.

📈 Analysis & Real‑World Impact
Ensemble models provided the most accurate predictions.

Feature importance highlighted carbon and nitrogen as key fertility drivers, with phosphorus showing a negative correlation.

Clustering (K‑Means) segmented soils into fertility categories, complementing rule‑based classification.

🌍 Application in Tunisia
Farmers can use the dashboard to upload their soil test results and receive fertility predictions.

The system provides recommendations on soil management, helping optimize fertilizer use and reduce costs.

By identifying fertility drivers, the tool supports sustainable practices that improve soil health and reduce environmental impact.

This bridges the gap between academic soil science and real agricultural decision‑making in Tunisia.

🎯 Conclusion
This project successfully transformed incomplete horizon data into a robust fertility prediction pipeline.
It achieved the goal of delivering accurate predictions and actionable insights, supporting farmers in Tunisia to improve soil health, optimize resources, and move toward sustainable agriculture.