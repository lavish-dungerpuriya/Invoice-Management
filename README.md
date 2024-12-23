---

# Invoice Management System

## Overview

This project implements a **Full-Stack Invoice Management System** using **Django REST Framework** for the backend and **React.js** with modern tools like **Tailwind CSS** for the frontend. The system allows users to create, update, view, delete, and manage invoices efficiently with a clean and responsive interface.

## Features

### Backend
1. **Django REST Framework** API:
    - CRUD operations for invoices and their details through a unified API endpoint.
    - Proper validation for all fields with meaningful error messages.
    - Line item totals and invoice totals are auto-computed.
    - Paginated responses for GET requests.
2. **Models**:
    - `Invoice`: Represents a customer invoice.
    - `InvoiceDetail`: Represents line items within an invoice.
3. **API Endpoints**:
    - `GET /api/invoices/`: Fetch all invoices with pagination.
    - `POST /api/invoices/`: Create a new invoice.
    - `PUT /api/invoices/<id>/update/`: Update an existing invoice.
    - `DELETE /api/invoices/<id>/delete/`: Delete an invoice.
4. **Validation**:
    - Ensures unique invoice numbers.
    - Positive quantities and unit prices for line items.

### Frontend
1. **React Features**:
    - **Responsive Invoice Management Interface** using Tailwind CSS.
    - Invoice list view with pagination, search, and filtering capabilities.
    - Create and edit invoice forms with dynamic line items.
    - Delete functionality with confirmation prompts.
2. **State Management**:
    - Leveraged **React Context API** for global state handling.
3. **User Experience**:
    - Loading spinners and meaningful error notifications.
    - Fully responsive design for mobile and desktop views.

## Setup Instructions

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/lavish-dungerpuriya/Invoice-Management.git
   cd Invoice-Management
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Run the server:
   ```bash
   python manage.py runserver
   ```
6. Access the API at [http://127.0.0.1:8000/api/invoices/](http://127.0.0.1:8000/api/invoices/).

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the frontend at [http://localhost:3000](http://localhost:3000).

## API Documentation

### Invoice Endpoints
1. **List Invoices**:
   - `GET /api/invoices/`
   - Parameters: `page` (optional).
2. **Create Invoice**:
   - `POST /api/invoices/`
   - Payload:
     ```json
     {
       "invoice_number": "INV001",
       "customer_name": "Lavish Dungerpuriya",
       "date": "2024-11-12",
       "details": [
         {
           "description": "Product A",
           "quantity": 2,
           "unit_price": 50.00
         }
       ]
     }
     ```
3. **Update Invoice**:
   - `PUT /api/invoices/<id>/update/`
   - Payload: Similar to create.
4. **Delete Invoice**:
   - `DELETE /api/invoices/<id>/delete/`

## Deployment

- The backend and frontend are hosted on a live server:
  - **Backend API**: [Backend URL](http://your-backend-url.com)
  - **Frontend UI**: [Frontend URL](http://your-frontend-url.com)

## Bonus Features
1. Dockerized configuration for backend and frontend.
2. Unit tests for key backend functionality.
3. Deployed on a live hosting platform.

---
