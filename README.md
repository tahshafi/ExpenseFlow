# Expense Tracker

A comprehensive full-stack expense tracking application designed to help you manage your finances, track spending habits, and set budgets. Built with a modern React frontend and a robust Node.js/Express backend.

## Features

- **Dashboard**: Real-time overview of your finances with visual analytics, savings rates, and transaction summaries.
- **Expense Tracking**: Log daily expenses with categories, dates, and a unique "Worthiness" feature to analyze if a purchase was truly worth it.
- **Income Management**: Track various income sources to calculate total savings.
- **Budget Management**: Set monthly budgets for specific categories (e.g., Food, Transport) and track your spending progress against limits.
- **Analytics**: Visualize spending patterns and "Worthy vs. Unworthy" expense breakdown.
- **Secure Authentication**: User signup and login functionality protected by JWT.

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks & Context
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local instance or Atlas connection)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense_tracker
   ```

2. **Backend Setup**
   Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```
   
   *(Optional)* Seed the database with dummy data:
   ```bash
   node seeder.js
   ```

3. **Frontend Setup**
   Open a new terminal, navigate to the project root, and install dependencies:
   ```bash
   # From the project root
   npm install
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and go to `http://localhost:8080` (or the port provided by Vite).

## Project Structure

- `src/` - Frontend source code (Pages, Components, Context, API hooks)
- `server/` - Backend source code (Models, Controllers, Routes, Config)
