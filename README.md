# 💰 MoneyNest – A Smart Family Finance Tracker

🚧 MoneyNest is currently under active development, with core backend architecture, authentication, family collaboration workflows, transaction management, notifications, and financial goal systems already implemented.

The platform is being designed as a  MERN-stack application focused on collaborative family finance tracking, analytics, and financial awareness.

🌐 Live link will be shared within a few days.

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

📊 Track where money is actually being spent
👨‍👩‍👧‍👦 Manage finances together in one shared workspace
🎯 Set financial goals and spending limits
📈 Understand spending patterns using categories & labels
🔔 Stay informed with reminders and notifications
🔐 Maintain secure and role-based access control

---

# ✨ Key Features

## 👨‍👩‍👧‍👦 Family-Based Finance Management

* Create a family workspace
* Invite family members using secure invite tokens
* Shared financial tracking across the family

---

## 💸 Transaction Management

Track:

* Income
* Expenses
* Investments

Features include:

* Add transaction title, amount, notes, and descriptions
* Upload bills/documents/photos for transactions
* Add multiple categories to a single transaction
* Add multiple labels for better analytics
* Track transaction history with timestamps

---

## 🧾 Categories & Labels

* Create custom categories
* Separate categories for:

  * Income
  * Expense
  * Investment
* Add custom labels/tags for advanced filtering & analytics
* Prevent duplicate categories and labels within the same family

---

## 🎯 Financial Goals System

Create goals like:

* Monthly expense limits
* Savings targets
* Investment goals
* Income targets

Supported periods:

* Daily
* Weekly
* Monthly
* Yearly

Goal statuses include:

* Active
* Completed
* Failed

---

## 🔔 Notification System

Smart notifications for:

* Goal alerts
* Reminders
* Family activities
* Reports
* Transactions
* System updates

Supports multi-device notifications using FCM tokens.

---

## 🔐 Authentication & Security

* JWT-based authentication
* Google OAuth login support
* Refresh token management
* Password reset workflows
* Role-based authorization

### User Roles

#### 👤 Member

Can manage and track personal/family transactions.

#### 👨‍👩‍👧 Family Admin

Can manage family members, categories, and shared financial activities plus all features accessible to a member.

#### 🛠️ System Admin

Can monitor platform-level activity, logs, failed operations, and system health without accessing private family financial data.

---

## 📊 Logging & Monitoring

Advanced backend monitoring system including:

* Request logging
* Error logging
* Failed operation tracking
* Retry mechanisms for failed background tasks
* API monitoring and diagnostics

---

# 🔧 Tech Stack

### Frontend

* React
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB + Mongoose

### Authentication

* JWT
* Google OAuth

### Additional Integrations

* Cloudinary
* Firebase Cloud Messaging (FCM)
* Brevo
* Exceljs
* Node Cron

---

# 🛠️ Found a Bug or Have Suggestions?

If you notice any bugs, have feedback, or want to collaborate, feel free to reach out!

📧 Email: [aasthaoswal29@gmail.com](mailto:aasthaoswal29@gmail.com)
📬 LinkedIn: [www.linkedin.com/in/aastha-oswal-94a179344](http://www.linkedin.com/in/aastha-oswal-94a179344)

