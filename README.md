![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)	![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
 ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

**BudgetMaster** is a personal budgeting web application that helps you take control of your finances. Built with FastAPI on the backend and React + TypeScript on the frontend, it offers a clean, responsive interface. Thanks to Docker containerization, the application can be easily run on any machine—simply build the container and you’re ready to go, no matter the environment.

<img width="1918" height="944" alt="Zrzut ekranu 2025-07-22 172839" src="https://github.com/user-attachments/assets/0cccfbe8-606e-4bcc-a97d-b3f1397c3e5e" />


## 🚀 Features
- **Responsive Dashboard**  
    The main dashboard displays all key metrics and financial summaries in one view, so you’re always on top of your wallet.
  
- **Monthly Budgeting**  
    Create and track budgets for each month to plan your spending step by step.
    
- **Income & Expense Tracking**  
    Log all your income and expenditures with detailed categories so nothing slips through the cracks.
    
- **Expense Planning**  
    Schedule upcoming expenses in advance—APScheduler will automatically run your planned jobs so you don’t have to remember recurring payments.
    
- **Savings Goals**  
    Set and monitor savings targets (e.g. “Save €1,000 by December”) and watch your progress in real time.
    
- **Local Currency Support**  
    Choose any local currency for your account and see values automatically adjust to your region.

    ## 🛠️ Tech Stack

- **Backend**
    
    - Framework: FastAPI
        
    - Data validation: Pydantic
        
    - ORM: SQLAlchemy
        
- **Frontend**
    
    - Library: React
        
    - Language: TypeScript
        
    - Data fetching & caching: TanstackQuery Query
        
- **Database**
    
    - PostgreSQL
        
- **Queues**
    
    - Redis
        
- **Scheduler**
    
    - APScheduler
        
- **Containerization**
    
    - Docker & Docker Compose
        
- **Testing**
    
    - pytest (95% code coverage)
        
- **API Documentation**
    
    - OpenAPI (Swagger UI)
 

 ## ⚙️ Installation & Running

1. **Clone the repository**
    
    `git clone https://github.com/tomsky93/budget_master.git`
   
   `cd budget_master`
    
3. **Start all services with Docker Compose**
    
    `docker-compose up --build`
    
4. **Access the app**
    
    - Frontend: `http://localhost:5173/`
        
    - API docs: `http://localhost:8000/docs`



https://github.com/user-attachments/assets/5bd9be91-ddc9-49cf-8629-67fdd4541d53


## 📄 Licence

MIT
