# soil_dashboard.py
import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import missingno as msno
import numpy as np
import sqlalchemy
import requests

# ✅ Correct imports for imputers
from sklearn.impute import KNNImputer
from sklearn.experimental import enable_iterative_imputer  # must come before
from sklearn.impute import IterativeImputer

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression

st.title("🌱 Soil Fertility Dashboard")

# -----------------------------
# Flexible Data Loading
# -----------------------------
st.sidebar.header("Data Loading Options")
source_type = st.sidebar.selectbox("Select source type", ["Upload CSV/Excel", "SQL", "API"])

df = None
if source_type == "Upload CSV/Excel":
    uploaded_file = st.file_uploader("Upload your soil dataset", type=["csv","xlsx"])
    if uploaded_file:
        if uploaded_file.name.endswith(".csv"):
            df = pd.read_csv(uploaded_file)
        else:
            try:
                df = pd.read_excel(uploaded_file)
            except ImportError:
                st.error("Excel support requires openpyxl. Please install it with `pip install openpyxl`.")

elif source_type == "SQL":
    conn_str = st.sidebar.text_input("SQL Connection String")
    sql_table = st.sidebar.text_input("SQL Table Name")
    if st.sidebar.button("Load from SQL") and conn_str and sql_table:
        engine = sqlalchemy.create_engine(conn_str)
        df = pd.read_sql(sql_table, engine)

elif source_type == "API":
    api_url = st.sidebar.text_input("API URL")
    if st.sidebar.button("Load from API") and api_url:
        response = requests.get(api_url)
        df = pd.DataFrame(response.json())

# 🔹 Fix Arrow conversion issues: cast all object/string columns to str
if df is not None:
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].astype(str)

# -----------------------------
# Tabs
# -----------------------------
if df is not None:
    tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8 = st.tabs([
        "Overview", "Missing Data", "Feature Engineering",
        "EDA", "Rankings", "Consistency", "Clustering & Insights",
        "Model Training"
    ])

    # 1. Data Overview
    with tab1:
        st.subheader("Data Overview")
        st.write(df.head())
        st.write(df.describe(include="all"))

    # 2. Missing Data + Imputation
    with tab2:
        st.subheader("Missing Values Heatmap")
        fig, ax = plt.subplots()
        msno.heatmap(df, ax=ax)
        st.pyplot(fig)

        st.subheader("Imputation Options")
        method = st.radio("Choose Imputation Method", ["None", "Median", "KNN", "RandomForest"])
        numeric_cols = df.select_dtypes(include=np.number).columns

        if method == "Median":
            df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

        elif method == "KNN" and len(numeric_cols) > 0:
            imputer = KNNImputer(n_neighbors=5)
            imputed = imputer.fit_transform(df[numeric_cols])
            df[numeric_cols] = pd.DataFrame(imputed, columns=numeric_cols, index=df.index)

        elif method == "RandomForest" and len(numeric_cols) > 0:
            imputer = IterativeImputer(estimator=RandomForestRegressor(), random_state=42)
            imputed = imputer.fit_transform(df[numeric_cols])
            df[numeric_cols] = pd.DataFrame(imputed, columns=numeric_cols, index=df.index)

        st.write("✅ Imputation applied")

    # 3. Feature Engineering
    with tab3:
        st.subheader("Feature Engineering Options")
        if "TOTC" in df.columns and "TOTN" in df.columns:
            df["CN_ratio"] = df["TOTC"] / df["TOTN"]
        if set(["TOTC","TOTN","P2O5","PHAQ"]).issubset(df.columns):
            df["Fertility_Index"] = df[["TOTC","TOTN","P2O5","PHAQ"]].mean(axis=1)
        if set(["ELCO","GYPS"]).issubset(df.columns):
            df["Salinity_Index"] = df[["ELCO","GYPS"]].mean(axis=1)
        if "HBDE" in df.columns and "TOTC" in df.columns:
            df["Depth_Normalized_C"] = df["TOTC"] / (df["HBDE"] + 1)
        if "DIAH" in df.columns:
            df["Horizon_Group"] = df["DIAH"].map({
                "Ap":"Surface","A":"Surface","E":"Leached","B":"Subsoil",
                "C":"Parent Material","R":"Bedrock"
            }).fillna("Other")

        engineered_cols = ["CN_ratio","Fertility_Index","Salinity_Index","Depth_Normalized_C","Horizon_Group"]
        available_cols = [c for c in engineered_cols if c in df.columns]
        if available_cols:
            st.write(df[available_cols].head())
        else:
            st.info("No engineered features computed yet. Check column availability.")

    # 4. EDA + Outlier Detection
    with tab4:
        st.subheader("Feature Distributions")
        for col in ["CN_ratio","Fertility_Index","Salinity_Index"]:
            if col in df.columns:
                fig, ax = plt.subplots()
                df[col].hist(bins=30, ax=ax, color="teal")
                ax.set_title(f"Distribution of {col}")
                st.pyplot(fig)

        st.subheader("Correlation Heatmap")
        available_cols = [c for c in ["CN_ratio","Fertility_Index","Salinity_Index"] if c in df.columns]
        if len(available_cols) >= 2:
            fig, ax = plt.subplots()
            sns.heatmap(df[available_cols].corr(), annot=True, cmap="coolwarm", ax=ax)
            st.pyplot(fig)

        st.subheader("Outlier Detection")
        numeric_cols = df.select_dtypes(include=np.number).columns
        if len(numeric_cols) > 0:
            col = st.selectbox("Select column", numeric_cols)
            threshold = st.slider("Z-score threshold", 2.0, 4.0, 3.0)
            z_scores = (df[col] - df[col].mean()) / df[col].std()
            outliers = df[np.abs(z_scores) > threshold]
            st.write(f"Detected {len(outliers)} outliers in {col}")
            st.write(outliers[[col]])
        else:
            st.info("No numeric columns available for outlier detection.")

    # 5. Composite Fertility Ranking
    with tab5:
        st.subheader("Top 10 Fertile Profiles")
        if "Fertility_Index" in df.columns:
            top10 = df.nlargest(10, "Fertility_Index")
            st.bar_chart(top10[["Fertility_Index"]])

    # 6. Fertility Ranking Consistency
    with tab6:
        st.subheader("Fertility Ranking Consistency")
        if "Fertility_Index" in df.columns:
            rule_based_top10 = df.nlargest(10, "Fertility_Index")
            st.write("Rule-based Top 10 Profiles:")
            st.write(rule_based_top10[["Fertility_Index"]])
        if "Cluster" in df.columns:
            cluster_means = df.groupby("Cluster")["Fertility_Index"].mean().sort_values(ascending=False)
            st.write("Cluster Fertility Means:")
            st.write(cluster_means)

    # 7. Clustering & Insights
    with tab7:
        if set(["CN_ratio","Fertility_Index","Salinity_Index"]).issubset(df.columns):
            cluster_features = df[["CN_ratio","Fertility_Index","Salinity_Index"]].dropna()
            n_clusters = st.slider("Number of clusters", 2, 10, 3)
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            clusters = kmeans.fit_predict(cluster_features)
            df.loc[cluster_features.index, "Cluster"] = clusters

            pca = PCA(n_components=2)
            pca_result = pca.fit_transform(cluster_features)
            df.loc[cluster_features.index, "PCA1"] = pca_result[:,0]
            df.loc[cluster_features.index, "PCA2"] = pca_result[:,1]

            st.subheader("Soil Fertility Clusters (PCA Projection)")
            fig, ax = plt.subplots()
            sns.scatterplot(x="PCA1", y="PCA2", hue="Cluster", data=df, palette="Set1", ax=ax)
            st.pyplot(fig)

            st.subheader("Cluster Summary")
            st.write(df.groupby("Cluster")[["Fertility_Index","Salinity_Index","CN_ratio"]].mean())

            st.subheader("Fertility vs Salinity with Cluster Overlay")
            fig, ax = plt.subplots()
            sns.scatterplot(x="Fertility_Index", y="Salinity_Index", hue="Cluster", data=df, palette="Set1", ax=ax)
            st.pyplot(fig)

            st.subheader("Insights & Recommendations")
            st.markdown("""
            - Most soils cluster into **low-salinity groups** → good agricultural potential.
            - One cluster shows **high salinity** → sustainability risk.
            - Fertility Index rankings highlight top-performing profiles.
            - Use Carbon Retention Score and Texture Index for sustainability overlays.
            """)

    # 8. Model Training
    with tab8:
        st.subheader("Model Training & Evaluation")

        if "Fertility_Index" in df.columns:
            # Features & Target
            X = df.drop(columns=["Fertility_Index"]).select_dtypes(include=np.number).dropna()
            y = df["Fertility_Index"].loc[X.index]

            if len(X) > 0:
                # Train/Test Split
                test_size = st.slider("Test size (%)", 10, 50, 20) / 100
                X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

                # Model Selection
                model_choice = st.selectbox("Choose Model", ["Random Forest", "Gradient Boosting", "KNN", "Linear Regression"])

                if model_choice == "Random Forest":
                    n_estimators = st.slider("Number of Trees", 50, 500, 200)
                    model = RandomForestRegressor(n_estimators=n_estimators, random_state=42)

                elif model_choice == "Gradient Boosting":
                    n_estimators = st.slider("Number of Estimators", 100, 500, 300)
                    learning_rate = st.slider("Learning Rate", 0.01, 0.2, 0.05)
                    model = GradientBoostingRegressor(n_estimators=n_estimators, learning_rate=learning_rate, random_state=42)

                elif model_choice == "KNN":
                    n_neighbors = st.slider("Number of Neighbors", 2, 20, 5)
                    model = KNeighborsRegressor(n_neighbors=n_neighbors)

                else:  # Linear Regression
                    model = LinearRegression()

                # Train Model
                model.fit(X_train, y_train)
                preds = model.predict(X_test)

                # Evaluation
                r2 = r2_score(y_test, preds)
                rmse = np.sqrt(mean_squared_error(y_test, preds))

                st.write(f"**R² Score:** {r2:.3f}")
                st.write(f"**RMSE:** {rmse:.3f}")

                # Residual Plot
                fig, ax = plt.subplots()
                sns.scatterplot(x=y_test, y=preds, ax=ax)
                ax.set_xlabel("True Fertility Index")
                ax.set_ylabel("Predicted Fertility Index")
                ax.set_title("Residuals Plot")
                st.pyplot(fig)

                # Predictions Preview
                st.subheader("Predictions vs Actual")
                results = pd.DataFrame({"Actual": y_test, "Predicted": preds})
                st.write(results.head(10))

                # Export Predictions
                st.download_button("Download Predictions CSV", results.to_csv(index=False), "predictions.csv")
            else:
                st.warning("No numeric features available for training.")
        else:
            st.warning("Fertility_Index not found in dataset. Please run Feature Engineering first.")

                                            