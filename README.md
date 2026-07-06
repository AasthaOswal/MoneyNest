# 💰 MoneyNest – AI Powered Collaborative Family Finance Tracker

🚧 MoneyNest is currently under active development, with core backend architecture, authentication, family collaboration workflows, transaction management, real-time notifications, and financial goal systems already implemented.

The platform is being designed as a MERN-stack application focused on collaborative family finance tracking, analytics, and financial awareness.

🌐 https://project-money-nest.vercel.app/

---

# 🙋‍♀️ Why I Built This

MoneyNest was built to solve a real problem I personally experienced at home — understanding where our money was actually going.

For nearly 4 years, my family maintained handwritten expense records in notebooks. Over time, maintaining them became difficult, inconsistent, and eventually we completely stopped tracking expenses for almost 2 years.

That led to one recurring question in our house:

> “Where does all the money go?”

When we searched for apps and websites to track finances together as a family, we noticed a major gap:

* Many platforms locked collaborative family features behind paid subscriptions
* Some finance platforms themselves were entirely paid
* Others were too complicated for everyday family use

That inspired me to build **MoneyNest** — a collaborative family finance management platform where families can easily track expenses, income, investments, savings goals, and financial habits together in one centralized system.

---

# 💡 The Solution: MoneyNest

MoneyNest is a full-fledged MERN-stack web application designed specifically for collaborative family financial management.

It helps families:
📊 Track where money is actually being spent across individual and family levels
👨‍👩‍👧‍👦 Manage finances together in one shared workspace
🎯 Set personal and family-wide financial goals and spending limits
📈 Understand spending patterns using categories & labels
🔔 Stay informed with real-time in-app and email updates
🔐 Maintain secure and role-based access control

---

# ✨ Key Features

## 👨‍👩‍👧‍👦 Collaborative Family Finance Management & Dashboards

* **Dual Dashboards:** Access a **Personal Dashboard** for private financial tracking and a **Family Dashboard** for shared family wealth transparency.
* **Family Creation & Invites:** Seamlessly create a family workspace or invite family members using a secure invite link.
* **AI-Powered Financial Reports:** Automatically generates and emails comprehensive monthly financial reports using the **Groq API** powered by the **llama-3.3-70b-versatile** model, providing deeply personalized spending insights, trend anomalies, and savings recommendations.
* **Real-time updates:** Get real time updates for family dashboard and transactions using Socket.io integration. 

---

## 💸 Transaction Management

Track:

* Income
* Expenses
* Investments
* Pre-Investment Savings
* Net Savings

Features include:

* Add transaction title, amount, notes, and descriptions
* Upload bills/documents/photos for transactions
* Add multiple categories to a single transaction
* Add multiple labels for better analytics
* Track transaction history with timestamps

---

## 🧾 Categories & Labels

* Create custom categories for Income, Expense, and Investment
* Add custom labels/tags for advanced filtering & analytics
* Prevent duplicate categories and labels within the same family workspace

---

## 🎯 Financial Goals System

Manage goals across two distinct scopes: **Personal (Private) Goals** and **Family (Shared) Goals**.

### Goal Types Supported:

* **Target Type:** Set targets for Income, Investment, Pre-investment Savings, and Net Savings.
* **Limit Type:** Set spending limits for Expenses.

---

## 🔔 Multi-Channel Notification System

Stay on top of updates through a dual-channel communication engine powered by automated backend scheduling (`node-cron`):

* **In-App Notifications:** Powered by **Socket.io** for instant, real-time alert delivery while browsing the platform.
* **Email Notifications:** Directly delivered to the user's inbox for critical updates.
* **Automated Weekly Updates:** Automated weekly goal updates sent out every week via both email and in-app channels.

---

# 📑 Deep Dive: AI-Powered Report Generation & Automated Email Delivery

MoneyNest implements a robust, automated pipeline to collect multi-tenant family data, analyze it with GenAI, generate a localized PDF, and handle reliable multi-user email delivery with built-in failure isolation.

Below is the step-by-step technical breakdown of how this workflow handles reporting securely and efficiently.

---

### 📥 Step 1: Centralized Financial Data Aggregation

The process kicks off via a scheduled `node-cron` job. The architecture targets a specific family via its `familyId` and dynamic billing month (`reportMonthDate`).

* The system invokes `buildMonthlyReportData()`, querying MongoDB to aggregate total income, categorized expenses, investment metrics, and target/limit goal compliance statuses specific to that family unit.

### 🤖 Step 2: Contextual Financial Intelligence (Groq API + LLM)

Once the absolute data is compiled, it is structured into a clean JSON payload and passed to the **Groq Cloud API** running **llama-3.3-70b-versatile**.

* The LLM evaluates anomalies (e.g., *“Your food expense increased by 15% this month”*), detects goal completions, and formulates tailor-made family savings blueprints.
* *Note: For sandboxed development and local testing, this can be seamlessly swapped with `mockAiData` to optimize token usage.*

### 📄 Step 3: Server-Side PDF Compilation using pdfMake package

The combination of raw financial aggregates and AI-generated insights is fed directly into `generateMonthlyReportPdf()`.

* The server structurally renders a multi-page, visually organized financial statement.
* This file is processed entirely in-memory and converted into a highly optimized binary **Buffer**, eliminating the disk I/O overhead of writing physical temporary files to the server.

### ✉️ Step 4: Targeted User Resolution

The workflow dynamically adapts its execution scope based on whether it is running a fresh monthly run or a targeted retry:

* **Fresh Execution:** Queries all verified, active family members (`isActive: true`) linked to the `familyId`.
* **Retry Execution:** Accepts an array of precise `userIds` to run exclusively for members who failed to receive their statement previously.

### 🚀 Step 5: Isolated Delivery & Failure Segregation

To prevent one bad or bouncing email address from crashing the pipeline for the entire family, the engine wraps individual deliveries inside an isolated `try/catch` matrix:

* **Base64 Packaging:** The binary PDF buffer is compiled directly into a safe Base64 string payload and handed over to **Brevo (SMTP)**.
* **Rate-Limit Mitigation:** A deliberate `sleep(10000)` (10-second delay) is enforced between member dispatches to respect SMTP transactional rate limits and ensure maximum inbox deliverability.
* **Granular Tracking:** If a specific member's email dispatch fails, the system catches the exception, maps their metadata (`userId`, `email`, and stack trace) into a `failedUsers` matrix, and keeps processing the rest of the family.

### 🛠️ Step 6: Diagnostics Return Map

On completion, the service returns a unified status object to the calling worker:

```json
{
  "success": true,
  "failedUsers": [
    { "userId": "65f...", "email": "member@domain.com", "error": "SMTP Timeout" }
  ]
}

```

This explicit map allows the backend's **Custom Failure Recovery System** to log the exact missed operations and seamlessly retry them later.

---

## 🔐 Authentication & Security

* JWT-based authentication
* Google OAuth login support
* Password reset workflows
* Role-based authorization

### User Roles

#### 👤 Member

Can manage and track personal/family transactions.

#### 👨‍👩‍👧 Family Admin

Can manage family members, categories, and shared financial activities, plus all features accessible to a standard member.

#### 🛠️ System Admin

Can monitor platform-level activity, logs, and system health without accessing private family financial data.

---

## 📊 Logging & Monitoring

Advanced backend monitoring system including:

* Request and error logging
* Failed operation tracking
* **Automated Retry Mechanisms:** Custom failure recovery system that automatically retries failed background operations and tasks.
* API monitoring and diagnostics

---

# 🔧 Tech Stack

### Frontend

* React
* Tailwind CSS
* Socket.io-client

### Backend

* Node.js
* Express.js
* Socket.io

### Database

* MongoDB + Mongoose

### Authentication

* JWT
* Google OAuth

### Additional Integrations

* Cloudinary
* Brevo (Email Delivery)
* Exceljs
* Node Cron
* pdfMake

### Depyloyment
* Vercel - frontend
* Render - backend
* Mongo atlas - database

---

# 🛠️ Found a Bug or Have Suggestions?

If you notice any bugs, have feedback, or want to collaborate, feel free to reach out!

📧 Email: [aasthaoswal29@gmail.com](https://www.google.com/search?q=mailto%3Aaasthaoswal29%40gmail.com)
📬 LinkedIn: [www.linkedin.com/in/aastha-oswal-94a179344](http://www.linkedin.com/in/aastha-oswal-94a179344)
