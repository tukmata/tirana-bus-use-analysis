# Tirana Bus Usage Analysis ![Dashboard Screenshot](path/to/screenshot.png)

## 📖 Overview

**Tirana Bus Usage Analysis** project aims to uncover patterns in bus usage in Tirana. It includes an interactive dashboard with advanced data visualization and filtering capabilities. This tool is perfect for urban planners, researchers, and municipal authorities looking to understand transportation dynamics better.

---

## 🚀 Features

- **Interactive Charts**: Toggle between Pie, Bar, and Line charts to explore different insights.
- **Dynamic Filtering**: Filter data by time slots, bus lines, and passenger age groups.
- **Drill-Down Functionality**: Click on chart segments to refine your analysis.
- **Export Options**: Download filtered data as CSV or PDF for further use.
- **Responsive Design**: Optimized for mobile, tablet, and desktop users.

---

## 🛠️ Installation

### Frontend Setup

#### 1. Clone the Repository
git clone https://github.com/tukmata/tirana-bus-use-analysis.git

#### 2. Navigate to the Project Directory
cd tirana-bus-use-analysis

#### 3. Install Dependencies
npm install
The node_modules directory is excluded from version control. Running npm install will recreate it.

#### 4. Start the Development Server
npm start

#### 5. Open the Application
Visit http://localhost:3000 in your browser to access the dashboard.

🛠️ Backend Setup
The backend provides the necessary API endpoints for the frontend to fetch and process bus usage data. Here's how to set it up:

#### 1. Navigate to the Backend Directory
Assuming your backend resides in the backend/ folder:

cd backend

#### 2. Set Up a Virtual Environment
Create a virtual environment for dependency management:

python3 -m venv env
source env/bin/activate  # On macOS/Linux
env\Scripts\activate     # On Windows

#### 3. Install Backend Dependencies
Install the required Python packages:

pip install -r requirements.txt

#### 4. Configure the Database
Apply migrations to set up the database schema:

python manage.py migrate

#### 5. Load Initial Data (Optional)
If you have initial data (like sample bus usage data), load it into the database:

python manage.py loaddata initial_data.json

#### 6. Start the Development Server
Run the backend development server:

python manage.py runserver

The backend will now be accessible at http://127.0.0.1:8000.

🔗 Connecting Frontend with Backend
To connect the frontend with the backend, ensure the API base URL in your frontend code matches the backend server's URL (e.g., http://127.0.0.1:8000 for local development).

Update the API configuration in src/services/api.js:

const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchAggregatedData = async () => {
    const response = await fetch(`${API_BASE_URL}/your-api-endpoint/`);
    return await response.json();
};

📊 Data Insights
Dataset
The dataset contains aggregated information about bus usage:

Metrics: Total trips, total revenue, and average yield per trip.
Categories: Data categorized by:
Time slots
Bus lines
Passenger age groups
Visualizations
Pie Chart: Demographic distribution by revenue.
Bar Chart: Yield per bus line.
Line Chart: Trends across different time slots.
🗂️ Project Structure
csharp
Copy code
tirana-bus-use-analysis/
├── public/               # Static files
├── src/                  
│   ├── components/       # Reusable React components
│   ├── services/         # API service functions
│   ├── App.js            # Main application component
│   ├── index.js          # Entry point of the application
├── backend/              # Backend files
├── .gitignore            # Git ignore file
├── package.json          # Node.js dependencies and scripts
├── README.md             # Documentation

#### 📧 Contact
For inquiries, please contact:

Name: Taulant Ukmata
Email: taulantukmata@gmail.com
LinkedIn: Your LinkedIn Profile