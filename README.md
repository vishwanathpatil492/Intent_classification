# Intent Classification App

A full-stack application for intent classification with a FastAPI backend and React frontend.

## Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.8+**
- **Node.js 14+**
- **npm** (comes with Node.js)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vishwanathpatil492/Intent_classification.git
cd Intent_classification
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
```

#### Create a Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Model Creation (Optional)

If you need to create or retrain the model, run the Jupyter notebook:

```bash
jupyter notebook model_creation.ipynb
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

## Running the Application

### 1. Start the Backend Server

In the backend directory (with virtual environment activated):

```bash
uvicorn app:app --reload
```

The backend server will start on `http://localhost:8000`

### 2. Start the Frontend Development Server

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the interface to input text for intent classification
3. The application will send requests to the backend API and display the predicted intent

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Health check endpoint
- `POST /predict` - Intent classification endpoint
- `GET /docs` - Interactive API documentation

## Development

### Backend Development

- The main application file is `app.py`
- Model training code is in `model_creation.ipynb`
- Models are stored in the `models/` directory
- Training data is in the `data/` directory

### Frontend Development

- Main application component is in `src/App.js`
- Intent classification component is in `src/components/intent_classification.js`
- Styling is in `src/App.css`

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change the port by running `uvicorn app:app --port 8001`
   - Frontend: The system will automatically suggest an alternative port

2. **Virtual Environment Issues**
   - Make sure you've activated the virtual environment before installing packages
   - Verify activation with `which python` (should point to venv directory)

3. **Missing Dependencies**
   - Ensure all requirements are installed: `pip install -r requirements.txt`
   - For frontend: `npm install`

4. **CORS Issues**
   - The backend should be configured to allow requests from the frontend
   - Check that both servers are running on their respective ports

