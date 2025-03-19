#!/bin/bash

# Change to server directory
cd "$(dirname "$0")"

# Set environment variables for testing
export TESTING=1

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install required packages
echo "Installing required packages..."
pip install -r requirements.txt
pip install pytest pytest-cov

# Run a basic test that we know works for sure
echo "Running debug test to verify test setup..."
python -m pytest tests/test_debug.py -v

# Run specific router tests to verify our new functionality
echo "Running router-specific tests..."
python -m pytest tests/test_give_kt.py tests/test_take_kt.py tests/test_livekit.py -v

# Run all tests and generate coverage report
echo "Running all tests with coverage report..."
python -m pytest tests/ --cov=. --cov-report=term --cov-report=html --no-header -v

# Display coverage report location
echo "Coverage report generated in htmlcov/ directory"
echo "Open htmlcov/index.html in a browser to view detailed coverage"

# Deactivate virtual environment
deactivate

# Return to original directory
cd - > /dev/null
