# ShopNow E-Commerce Application

Welcome to **ShopNow**, a modern e-commerce shopping platform built using a Node.js + Express backend and a React + Vite frontend. It features user authentication, a dynamic cart and wishlist, order placement, real-time reviews, and automated transaction email notifications.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Downloading and Cloning](#downloading-and-cloning)
3. [Backend Setup & Installation](#backend-setup--installation)
4. [Frontend Setup & Installation](#frontend-setup--installation)
5. [Environment Configurations (`.env`)](#environment-configurations-env)
6. [How & Where to Get Credentials](#how--where-to-get-credentials)
7. [Running the Application](#running-the-application)

---

## Prerequisites
Ensure you have the following installed on your system before proceeding:
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A modern web browser
- Git command-line tool

---

## Downloading and Cloning

To download the repository on your local system, run the following command in your terminal:
```bash
git clone https://github.com/kaushal-kumar-2109/ShopNow-IBM.git
cd ShopNow-IBM
```

---

## Backend Setup & Installation

Navigate to the `backend` folder and install all the Node.js package dependencies:
```bash
cd backend
npm install
```

### Configure Environment Variables
Copy the configuration template to create your `.env` file:
```bash
cp env.example .env
```
Open the `.env` file and fill in your database, email, and JWT secret credentials (see the [Environment Configurations](#environment-configurations-env) section below for details).

### Seed the Database (Optional but Recommended)
To populate the database with initial users, products, and comments, run the seed command:
```bash
npm run seed
```
*(This will delete any existing records and create 400 user profiles, 5000 products, and related reviews.)*

---

## Frontend Setup & Installation

Open a new terminal window, navigate to the `frontend` folder, and install its package dependencies:
```bash
cd frontend
npm install
```

---

## Environment Configurations (`.env`)

The backend requires a `.env` file containing the following keys:

| Environment Variable | Description | Example / Default Value |
| :--- | :--- | :--- |
| `PORT` | The port number on which the backend server will run. | `3000` |
| `WEB` | Sets the application context mode. Use `local` for local execution or `production` for hosting. | `local` |
| `MONGO_DB_URL` | The primary connection string for a shared replica-set MongoDB database. | `mongodb://<user>:<password>@ac-shard-00.mongodb.net:27017/?ssl=true...` |
| `MONGO_DB_SRV_URL` | The standard cluster connection string for MongoDB Atlas. | `mongodb+srv://<user>:<password>@shop-now.mongodb.net/?appName=shop-now` |
| `SMTP_USER_EMAIL` | The Google Gmail account used to send transaction receipt/recovery emails. | `your-email@gmail.com` |
| `SMTP_USER_PASS` | The secure 16-character Google App Password (not your account login password). | `abcd efgh ijkl mnop` |
| `JWT_SECRET` | A secure, random string used to encrypt JSON Web Tokens for authentication. | `a_very_long_cryptographically_secure_random_string` |

---

## How & Where to Get Credentials

### 1. MongoDB Connection URLs (`MONGO_DB_URL` & `MONGO_DB_SRV_URL`)
To connect the application to a cloud MongoDB instance:
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Shared Cluster (Free Tier) and deploy a database.
3. Go to **Database Access** -> **Add New Database User**. Choose Password authentication and assign the user the role of *Read and write to any database*.
4. Go to **Network Access** -> **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`) for local testing.
5. In the Clusters overview, click **Connect** on your database cluster.
6. Select **Drivers** under *Connect to your application*.
7. Copy the connection string provided (it starts with `mongodb+srv://` or `mongodb://`). Replace `<username>` and `<password>` with the database credentials you set up in step 3.

### 2. Gmail SMTP Credentials (`SMTP_USER_EMAIL` & `SMTP_USER_PASS`)
This project uses Nodemailer to send OTP verification codes, order invoices, and cancellation emails. Due to Google's security guidelines, you cannot use your regular Gmail password. You must generate an **App Password**:
1. Log in to your Google Account at [Google Accounts](https://myaccount.google.com/).
2. Navigate to the **Security** tab in the left-hand menu.
3. Ensure **2-Step Verification** is enabled under the *Signing in to Google* section.
4. Search for or click on **App passwords** (usually found at the bottom of the *2-Step Verification* page).
5. Enter a custom name for your app (e.g., `ShopNow App`).
6. Click **Create**. Google will display a yellow box containing a **16-character password** (e.g., `kpgq ajpq xlax ayos`).
7. Copy this code (removing spaces) and insert it as the value for `SMTP_USER_PASS` in your `.env`.

### 3. JSON Web Token Secret (`JWT_SECRET`)
The token secret is used to sign and verify user authentication sessions:
- You can create any random alphanumeric string, but for production, generate a secure hex key using your command prompt or terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Copy the output value and paste it as the `JWT_SECRET`.

---

## Running the Application

### Running Backend Server
From the `backend` folder, run:
```bash
npm run dev
```
The console will log:
```text
Connected to MongoDB!
Server Port is set to: 3000
Server is running on: http://localhost:3000
```

### Running Frontend Client
From the `frontend` folder, run:
```bash
npm run dev
```
The React development server will start at:
- **Local URL**: [http://localhost:5173](http://localhost:5173)

Open the local URL in your web browser to access the ShopNow application!
