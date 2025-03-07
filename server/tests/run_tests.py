#!/usr/bin/env python3
"""
LearnPro Test Runner
Run all backend tests and generate coverage report
"""

import subprocess
import os
import sys
from pathlib import Path

# Ensure we're in the right directory
os.chdir(Path(__file__).parent)

def run_tests():
    """Run all tests with pytest and generate coverage report"""
    print("🔍 Running LearnPro backend tests with coverage...")
    
    # Run pytest with coverage
    cmd = [
        "pytest", 
        "-xvs",
        "--cov=../",
        "--cov-report=term",
        "--cov-report=html:coverage_html",
        "--cov-config=.coveragerc"
    ]
    
    try:
        result = subprocess.run(cmd, check=True)
        exit_code = result.returncode
    except subprocess.CalledProcessError as e:
        print(f"❌ Tests failed with exit code {e.returncode}")
        exit_code = e.returncode
    except FileNotFoundError:
        print("❌ Error: pytest not found. Please install requirements first:")
        print("   pip install -r requirements-test.txt")
        exit_code = 1
    
    if exit_code == 0:
        print("\n✅ All tests passed!")
        print("\nCoverage report available in: coverage_html/index.html")
    
    return exit_code

if __name__ == "__main__":
    sys.exit(run_tests())
