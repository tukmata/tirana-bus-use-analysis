import pandas as pd

# Load the Excel file
file_path = "../../data.xlsx"
xls = pd.ExcelFile(file_path)

# Load individual sheets
survey_data = xls.parse("survey")
operation_data = xls.parse("operation")

# Step 1: Clean the Data
# Rename columns for easier reference (use English-friendly names)
survey_data.columns = [
    "timestamp", "time_slot", "station", "bus_line", "ticket_type",
    "used_lines", "trip_purpose", "main_trip_purpose", "trips", "trip_days",
    "gender", "age_group", "price_paid", "ticket_en"
]

# Drop rows with missing essential values
survey_data = survey_data.dropna(subset=["price_paid", "trips", "bus_line"])

# Ensure numeric fields are properly formatted
survey_data["price_paid"] = pd.to_numeric(survey_data["price_paid"], errors="coerce")
survey_data["trips"] = pd.to_numeric(survey_data["trips"], errors="coerce")
survey_data["bus_line"] = survey_data["bus_line"].astype(int)

# Step 2: Calculate Metrics
# Calculate Revenue and Yield
VAT_RATE = 0.20
survey_data["revenue"] = survey_data["price_paid"] * survey_data["trips"]
survey_data["yield"] = survey_data["revenue"] * (1 - VAT_RATE)

# Step 3: Aggregate Data
# Group by bus line, time slot, and age group for analysis
aggregated_data = survey_data.groupby(["bus_line", "time_slot", "age_group"]).agg(
    total_revenue=pd.NamedAgg(column="revenue", aggfunc="sum"),
    total_yield=pd.NamedAgg(column="yield", aggfunc="sum"),
    total_trips=pd.NamedAgg(column="trips", aggfunc="sum"),
    avg_yield_per_trip=pd.NamedAgg(column="yield", aggfunc="mean")
).reset_index()

# Step 4: Save Aggregated Data for Review
aggregated_data.to_csv("aggregated_data.csv", index=False)

# Optional: Display the first few rows of the aggregated data
print(aggregated_data.head())
