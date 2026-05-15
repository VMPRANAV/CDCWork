
# KPR CDC PLACEMENT MANAGEMENT SYSTEM

## 🚀 Overview

The CDC Management System is an end-to-end solution for managing campus placements. It allows students to maintain verified professional profiles (including academic records and coding links) and enables administrators to post jobs, manage attendance, and track the recruitment lifecycle from application to final placement.

## 🛠 Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS (v4), Radix UI, Lucide Icons, Chart.js.
* **Backend**: Node.js, Express (v5), MongoDB with Mongoose.
* **State Management**: Jotai.
* **Authentication**: JWT (JSON Web Tokens) and BcryptJS for password hashing.
* **Storage/Services**: Cloudinary (for resumes/photos), SendGrid/Nodemailer (for notifications).

## 📂 Project Structure

* **`/backend`**: Express server handling API logic, database schemas, and background services.
* **`/frontend`**: React application using a component-based architecture and modern UI libraries.
* **`models/`**: Defines the data structure for Users, Jobs, Applications, Events, and Recruitment Rounds.

## 🔑 Key Features

* **Automated Eligibility**: The system checks student records (CGPA, arrears, department) against job requirements.
* **Dynamic Recruitment Rounds**: Supports multi-stage placement processes (e.g., Aptitude, Technical, HR) through a dedicated Round Processing service.
* **Academic Verification**: Enforces strict validation for KPRIET official emails and 16-digit university registration numbers.
* **Coding Profile Integration**: Collects and displays profiles from LeetCode, HackerRank, GitHub, and Codeforces.
* **Placement Tracking**: Monitors "Placed" status, company details, and package information to ensure fair distribution of opportunities.

## ⚙️ Configuration & Installation

### Prerequisites

* Node.js (v18+)
* MongoDB Instance
* Bun or NPM

### Backend Setup

1. Navigate to `/backend`.
2. Create a `.env` file based on `.env.example`.
3. Install dependencies: `npm install`.
4. Seed the initial admin account: `npm run seed`.
5. Start the server: `npm start`.

### Frontend Setup

1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## 🛠 Troubleshooting

If you encounter errors during student registration (specifically regarding duplicate email indexes), run the following command in your MongoDB shell:

```bash
db.users.dropIndex("email_1")

```

*(Source:)*

## 📊 Database Schema (User Model)

The system maintains highly detailed user records, including:

* **Official Credentials**: Official KPRIET email (`@kpriet.ac.in`) and 16-digit Registration Number.
* **Education Logic**: A pre-save hook ensures students provide either 12th Grade or Diploma details, but not both.
* **Language Proficiency**: Tracking for Japanese (N1–N5) and German (A1–C2) certifications.
* **Placement History**: Tracks rejection history, including specific rounds and reasons for future analytics.

---

*This system was developed to modernize the placement cell operations and provide a seamless digital experience for the student body.*
