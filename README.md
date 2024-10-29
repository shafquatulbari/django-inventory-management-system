# django-inventory-management-system

## Stack - Django & React.js

### Setup & Guide

Steps (my steps):

- setup virtual environment 'python3 -m venv venv'
- activate on mac 'source venv/bin/activate'
- install dependencies 'pip3 install django djangorestframework' or any other dependencies as necessary
- create a requirements file 'pip3 freeze > requirements.txt'
- initialize project 'django-admin startproject inventoryproject'
- initialize app 'cd inventory project' and then 'python3 manage.py startapp inventory'
- initialize database 'python3 manage.py makemigrations'
- initialize database 'python3 manage.py migrate'
- 'npx create-react-app' inside inventory-frontend
- install dependencies as needed

Your Steps (For backend) (make sure you have python, venv and django installed on your local machine)

- 'source venv/bin/activate' to activate virtual environment
- 'cd inventoryproject' to get in the
- 'pip3 install -r requirements.txt' to install dependencies
- 'python3 manage.py runserver' to run the backend on localhost:8000
- 'python3 manage.py test' to run unit tests to test all the apis

Your Steps (For frontend) (React app)

- Turn on a different terminal as backend already running on one
- 'cd inventoryproject' and then 'cd inventory-frontend' to get in the frontend directory
- 'npm install' to install all dependencies
- 'npm start' to start frontend which runs on localhost:3000

Authentication

- I already have username: 'shafquat' and password: password123 for a regular user
- I already have username: 'bari' and password: password123 for a second regular user
- I already have username: 'admin' and password: password123 for admin
- I already have username: 'admin2' and password: password123 for a second admin
- I did not use django superuser to declare admin as I wanted the freedom to have more than a single admin and can choose if I am admin or not while I register
