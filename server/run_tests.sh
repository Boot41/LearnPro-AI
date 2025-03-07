#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Change to server directory
cd "$(dirname "$0")"

# Set environment variables for testing
export TESTING=1

# Run a basic test that we know works for sure
echo "Running debug test to verify test setup..."
python -m pytest tests/test_debug.py -v

# Run all tests and generate coverage report
echo "Running all tests with coverage report..."
python -m pytest tests/ --cov=. --cov-report=term --cov-report=html --no-header -v

# Display coverage report location
echo "Coverage report generated in htmlcov/ directory"
echo "Open htmlcov/index.html in a browser to view detailed coverage"

# Return to original directory
cd - > /dev/null
