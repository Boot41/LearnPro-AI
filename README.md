# LearnPro AI - Personalized Learning Management System

<div align="center">
  <img src="https://img.shields.io/badge/status-production-green" alt="Production Status">
  <img src="https://img.shields.io/badge/frontend-React%2019-blue" alt="Frontend">
  <img src="https://img.shields.io/badge/backend-FastAPI-teal" alt="Backend">
  <img src="https://img.shields.io/badge/styling-TailwindCSS-38B2AC" alt="Styling">
</div>

## 🚀 Production URL

[LearnPro AI - Live Application](https://learnpro-mha4s7stfa-el.a.run.app/)

## 📋 Overview

LearnPro AI is an intelligent learning management platform that leverages artificial intelligence to create personalized learning paths tailored to each employee's unique skills, goals, and learning style. The system analyzes individual knowledge gaps and preferences to deliver customized content that maximizes engagement and knowledge retention.

## ✨ Features

### For Administrators
- **Dashboard Management**: Monitor employee progress and learning analytics
- **Project Assignment**: Create and assign projects to employees
- **Content Management**: Create and manage learning subjects and topics
- **Skill Assessment**: Design assessments to evaluate employee skills

### For Employees
- **Personalized Learning Paths**: AI-generated learning paths based on skill assessments
- **Interactive Quizzes**: Test knowledge with topic-specific quizzes
- **Progress Tracking**: Monitor learning achievements and completion rates
- **Resource Access**: Access to curated learning resources for each topic

### General Features
- **Responsive Design**: Fully responsive UI that works on mobile and desktop
- **User Authentication**: Secure login and role-based access control
- **Information Pages**: About Us, Contact, and FAQ sections

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19
- **Router**: React Router 7
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **Build Tool**: Vite

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT token-based authentication
- **Migration**: Alembic
- **AI Integration**: LLM utilities for generating personalized learning paths

## 🏗️ Project Structure

```
learnpro/
├── client/                # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── contexts/      # React context providers
│       ├── pages/         # Application pages
│       └── services/      # API service integrations
│
└── server/                # Backend FastAPI application
    ├── routers/           # API route definitions
    ├── utils/             # Utility functions and helpers
    ├── tests/             # Unit and integration tests
    ├── alembic/           # Database migrations
    ├── models.py          # SQLAlchemy ORM models
    ├── database.py        # Database connection and session
    ├── schemas.py         # Pydantic schemas
    └── main.py            # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/learnpro.git
   cd learnpro
   ```

2. **Set up the backend**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   uvicorn main:app --reload
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 👥 Default Users

The system creates a default admin user on initial startup:

- **Admin User**
  - Email: admin@learnpro.com
  - Password: admin

## 📚 Data Models

- **User**: System users (admin or employee)
- **Project**: Learning projects that can be assigned to employees
- **Subject**: Main learning categories within a project
- **Topic**: Specific learning units within subjects
- **LearningPath**: Personalized learning journeys for employees

## 🧪 Testing

```bash
cd server
pytest
```

Coverage reports can be generated with:

```bash
cd server
pytest --cov=.
```

## 🚢 Deployment

The application is deployed on Google Cloud Run with a CI/CD pipeline.

## 🔒 Environment Variables

### Backend (server/.env)
```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (client/.env)
```
VITE_API_URL=http://localhost:8000
```

## 📖 Documentation

- Backend API documentation is available at `/docs` when the server is running
- Component documentation is available in the component files

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
