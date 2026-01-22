# 🗳️ Distributed Voting System

A microservices-based **Distributed Voting System** developed as a university mini project.
The system supports secure authentication, role-based access, election management, voting, fault tolerance, and containerized deployment.

---

## 📌 Project Overview

The Distributed Voting System allows:

* Users to securely register and vote
* Admins to create elections and manage candidates
* Automatic failover between primary and backup voting services
* Distributed service communication using REST APIs

The system is designed following **distributed system principles** such as scalability, fault tolerance, and service isolation.

---

## 🧱 System Architecture

The system consists of the following services:

### 🔹 Frontend (React)

* User login and registration
* Admin panel for election management
* Voting interface for users

### 🔹 Authentication Service

* User & admin registration
* Secure login using JWT
* Password hashing with bcrypt

### 🔹 Voting Service (Primary & Backup)

* Handles voting logic
* Stores votes securely
* Backup service ensures high availability

### 🔹 Watchdog Service

* Monitors the primary voting service
* Automatically switches to backup if primary fails

### 🔹 Result Service

* Manages vote counts and election results

### 🔹 Database

* MongoDB used for storing users, elections, candidates, and votes

---

## 🔐 Security Features

* Password hashing using bcrypt
* JWT-based authentication and authorization
* Role-based access control (ADMIN / USER)
* Admin registration protected using a secret key
* Users can vote only once per election

---

## 🐳 Technologies Used

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT, bcrypt
* **Containerization:** Docker & Docker Compose
* **Communication:** REST APIs

---

## 🚀 Running the Project Locally

### 🔹 Prerequisites

* Node.js
* Docker & Docker Compose
* Git

---

### 🔹 Step 1: Clone the Repository

```bash
git clone <https://github.com/pasindu-20/Distributed-Voting-System.git>
cd Distributed-Voting-System
```

---

### 🔹 Step 2: Start All Services Using Docker

```bash
docker compose up --build
```

This will start:

* Frontend (React)
* Authentication Service
* Voting Services (Primary & Backup)
* Watchdog Service
* Result Service
* MongoDB

---

### 🔹 Step 3: Access the Application

| Service          | URL                                            |
| ---------------- | ---------------------------------------------- |
| Frontend         | [http://localhost:3000](http://localhost:3000) |
| Auth Service     | [http://localhost:4000](http://localhost:4000) |
| Voting Service   | [http://localhost:5000](http://localhost:5000) |
| Watchdog Service | [http://localhost:7000](http://localhost:7000) |

---

## 🧪 Demo Accounts

### Admin Account

* Requires admin secret during registration
* Can create elections and add candidates

### User Account

* Can vote in active elections
* One vote per election

---

## 🌐 Local Network Demo (Hotspot / Wi-Fi)

The system can be accessed by other devices on the same network:

1. Find your laptop IP using `ipconfig`
2. Replace `localhost` with your IP in frontend API URLs
3. Access frontend via:

```
http://YOUR_IP:3000
```

---

## ⚠️ Notes

* Firewall may need to be temporarily disabled for network demo
* This project is designed for educational purposes
* Cloud deployment is supported but not included in this demo

---

## 📚 Future Improvements

* HTTPS & SSL support
* Rate limiting
* Blockchain-based vote verification
* Cloud deployment using Azure or AWS
* Detailed audit logs

---

## 👨‍💻 Authors

Developed as a **Distributed Systems Mini Project**
University of Kelaniya – Faculty of Computing & Technology

---

## ✅ License

This project is for educational use only.
