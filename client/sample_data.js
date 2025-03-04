// Export the sample data for use in services
export const sample_data = [
  {
    "product_id": "p001",
    "name": "Acme Python Pro",
    "requirements": {
      "prerequisites": [
        "Intermediate programming experience with at least one compiled language (e.g., Java, C++)",
        "Strong understanding of object-oriented programming concepts",
        "Hands-on experience with basic data structures (lists, dictionaries, sets)",
        "Familiarity with command-line interfaces and Python package management (pip, virtualenv)"
      ]
    },
    "learning_path": {
      "total_estimated_hours": 45,
      "topics": [
        {
          "topic_name": "Advanced Python Syntax & Idioms",
          "quiz": {
            "questions": [
              {
                "question": "What is a list comprehension in Python?",
                "options": [
                  "A method to create a new list by applying an expression to each item in an iterable",
                  "A function to add list elements together",
                  "A syntax error in Python",
                  "A method to sort a list"
                ],
                "correct_answer": "A method to create a new list by applying an expression to each item in an iterable"
              },
              {
                "question": "What does the 'zip' function do in Python?",
                "options": [
                  "Combines multiple iterables into a single iterable of tuples",
                  "Compresses files into a zip archive",
                  "Calculates the sum of numeric lists",
                  "Sorts two lists simultaneously"
                ],
                "correct_answer": "Combines multiple iterables into a single iterable of tuples"
              },
              {
                "question": "Which of the following is a correct generator expression?",
                "options": [
                  "[x for x in range(5)]",
                  "(x for x in range(5))",
                  "{x for x in range(5)}",
                  "<x for x in range(5)>"
                ],
                "correct_answer": "(x for x in range(5))"
              },
              {
                "question": "What best describes a shallow copy in Python?",
                "options": [
                  "Creates a new container with references to the same child objects",
                  "Creates completely independent copies of all objects",
                  "Is identical to a deep copy",
                  "Creates a new variable pointing to the same object"
                ],
                "correct_answer": "Creates a new container with references to the same child objects"
              }
            ],
            "passing_score": 75
          },
          "estimated_hours": 8,
          "assessment": {
            "threshold": 75,
            "score": null,
            "status": "pending"
          },
          "official_docs": "https://docs.python.org/3/"
        },
        {
          "topic_name": "Object-Oriented Programming in Python",
          "quiz": {
            "questions": [
              {
                "question": "Which keyword is used to define a class in Python?",
                "options": [
                  "class",
                  "def",
                  "object",
                  "module"
                ],
                "correct_answer": "class"
              },
              {
                "question": "Which method serves as the constructor in a Python class?",
                "options": [
                  "__init__",
                  "__constructor__",
                  "init",
                  "create"
                ],
                "correct_answer": "__init__"
              },
              {
                "question": "What is inheritance in object-oriented programming?",
                "options": [
                  "A mechanism where one class acquires properties and methods of another",
                  "A process of converting code into machine language",
                  "A way to hide data inside a function",
                  "A method to encapsulate variables"
                ],
                "correct_answer": "A mechanism where one class acquires properties and methods of another"
              },
              {
                "question": "How does Python support multiple inheritance?",
                "options": [
                  "By allowing a class to inherit from multiple base classes, separated by commas",
                  "By using the 'extends' keyword",
                  "By using a decorator",
                  "By manually copying attributes"
                ],
                "correct_answer": "By allowing a class to inherit from multiple base classes, separated by commas"
              }
            ],
            "passing_score": 75
          },
          "estimated_hours": 12,
          "assessment": {
            "threshold": 75,
            "score": null,
            "status": "pending"
          },
          "official_docs": "https://docs.python.org/3/tutorial/classes.html"
        }
      ]
    },
    "calendar_locked": false
  },
  {
    "product_id": "p002",
    "name": "Acme Web Developer Accelerator",
    "requirements": {
      "prerequisites": [
        "Strong grasp of HTML5, CSS3, and modern JavaScript (ES6+ features)",
        "Experience in building RESTful APIs and asynchronous programming in JavaScript",
        "Proficiency with responsive design techniques and frameworks (e.g., Bootstrap, Tailwind CSS)",
        "Basic knowledge of server-side programming (Node.js, PHP, or similar)"
      ]
    },
    "learning_path": {
      "total_estimated_hours": 55,
      "topics": [
        {
          "topic_name": "Progressive Web Applications (PWAs)",
          "quiz": {
            "questions": [
              {
                "question": "What is a primary feature of a Progressive Web App (PWA)?",
                "options": [
                  "Offline functionality",
                  "Desktop-only interface",
                  "High memory usage",
                  "No need for a web server"
                ],
                "correct_answer": "Offline functionality"
              },
              {
                "question": "Which technology enables offline capabilities in PWAs?",
                "options": [
                  "Service Workers",
                  "WebSockets",
                  "AJAX",
                  "HTTP/2"
                ],
                "correct_answer": "Service Workers"
              },
              {
                "question": "How can PWAs be installed on a device?",
                "options": [
                  "Through a browser prompt to add to home screen",
                  "By downloading an executable file",
                  "Only via app stores",
                  "By using FTP"
                ],
                "correct_answer": "Through a browser prompt to add to home screen"
              },
              {
                "question": "What is the role of a manifest file in a PWA?",
                "options": [
                  "It provides metadata about the app (e.g., icons, name)",
                  "It defines server-side routes",
                  "It contains the app's source code",
                  "It handles database connections"
                ],
                "correct_answer": "It provides metadata about the app (e.g., icons, name)"
              }
            ],
            "passing_score": 80
          },
          "estimated_hours": 12,
          "assessment": {
            "threshold": 80,
            "score": null,
            "status": "pending"
          },
          "official_docs": "https://developers.google.com/web/progressive-web-apps"
        },
        {
          "topic_name": "Advanced JavaScript Patterns & Optimization",
          "quiz": {
            "questions": [
              {
                "question": "What is the module pattern in JavaScript used for?",
                "options": [
                  "Encapsulating code and creating private/public scope",
                  "Manipulating the DOM",
                  "Styling web pages",
                  "Handling asynchronous requests"
                ],
                "correct_answer": "Encapsulating code and creating private/public scope"
              },
              {
                "question": "What does a closure in JavaScript allow you to do?",
                "options": [
                  "Access an outer function’s scope from an inner function",
                  "Bind events to DOM elements",
                  "Write CSS in JavaScript",
                  "Make synchronous AJAX calls"
                ],
                "correct_answer": "Access an outer function’s scope from an inner function"
              },
              {
                "question": "Which of the following is a benefit of using JavaScript optimization techniques?",
                "options": [
                  "Improved application performance",
                  "Increased file size",
                  "More memory usage",
                  "Complex code"
                ],
                "correct_answer": "Improved application performance"
              },
              {
                "question": "How can you reduce the load time of a JavaScript-heavy page?",
                "options": [
                  "By minifying and bundling the code",
                  "By adding more libraries",
                  "By using inline styles",
                  "By using global variables extensively"
                ],
                "correct_answer": "By minifying and bundling the code"
              }
            ],
            "passing_score": 80
          },
          "estimated_hours": 15,
          "assessment": {
            "threshold": 80,
            "score": null,
            "status": "pending"
          },
          "official_docs": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        }
      ]
    },
    "calendar_locked": false
  },
  {
    "product_id": "p003",
    "name": "Acme Data Analytics Suite",
    "requirements": {
      "prerequisites": [
        "Advanced proficiency in Python including libraries such as NumPy, Pandas, and SciPy",
        "Deep understanding of statistical methods and probability theory",
        "Hands-on experience with data visualization tools (e.g., Matplotlib, Seaborn)",
        "Familiarity with machine learning frameworks and basic algorithm implementations"
      ]
    },
    "learning_path": {
      "total_estimated_hours": 65,
      "topics": [
        {
          "topic_name": "Statistical Analysis & Hypothesis Testing",
          "quiz": {
            "questions": [
              {
                "question": "What does the null hypothesis represent?",
                "options": [
                  "No effect or relationship",
                  "A proven theory",
                  "A guaranteed outcome",
                  "An alternative assumption"
                ],
                "correct_answer": "No effect or relationship"
              },
              {
                "question": "What is a p-value in hypothesis testing?",
                "options": [
                  "The probability of observing the data if the null hypothesis is true",
                  "The chance of a Type II error",
                  "A measure of effect size",
                  "The significance level of the test"
                ],
                "correct_answer": "The probability of observing the data if the null hypothesis is true"
              },
              {
                "question": "What is a Type I error?",
                "options": [
                  "Rejecting a true null hypothesis",
                  "Failing to reject a false null hypothesis",
                  "Correctly rejecting a false null hypothesis",
                  "None of the above"
                ],
                "correct_answer": "Rejecting a true null hypothesis"
              },
              {
                "question": "Which test is used for comparing means of two independent groups?",
                "options": [
                  "t-test",
                  "Chi-square test",
                  "ANOVA",
                  "Regression analysis"
                ],
                "correct_answer": "t-test"
              }
            ],
            "passing_score": 80
          },
          "estimated_hours": 10,
          "assessment": {
            "threshold": 80,
            "score": null,
            "status": "pending"
          },
          "official_docs": "https://www.statsmodels.org/stable/index.html"
        },
        {
          "topic_name": "Machine Learning Algorithms & Evaluation",
          "quiz": {
            "questions": [
              {
                "question": "What is supervised learning?",
                "options": [
                  "Learning from labeled data",
                  "Learning from unlabeled data",
                  "Learning without any data",
                  "Learning by trial and error"
                ],
                "correct_answer": "Learning from labeled data"
              },
              {
                "question": "Which metric is commonly used for evaluating regression models?",
                "options": [
                  "Mean Squared Error (MSE)",
                  "Accuracy",
                  "F1 Score",
                  "ROC AUC"
                ],
                "correct_answer": "Mean Squared Error (MSE)"
              },
              {
                "question": "What is overfitting in machine learning?",
                "options": [
                  "Model performs well on training data but poorly on new data",
                  "Model performs well on both training and new data",
                  "Model is too simple to capture patterns",
                  "Model uses too many features intentionally"
                ],
                "correct_answer": "Model performs well on training data but poorly on new data"
              },
              {
                "question": "Which algorithm is typically used for classification tasks?",
                "options": [
                  "Decision Tree",
                  "Linear Regression",
                  "K-Means Clustering",
                  "Principal Component Analysis (PCA)"
                ],
                "correct_answer": "Decision Tree"
              }
            ],
            "passing_score": 80
          },
          "estimated_hours": 20,
          "assessment": {
            "threshold": 80,
            "score": null,
            "status": "pending"
          },
          "official_docs": "https://scikit-learn.org/stable/documentation.html"
        }
      ]
    },
    "calendar_locked": false
  }
]
