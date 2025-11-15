# 🎨 HabitTrak – Frontend (React + Vite + TailwindCSS)

This is the frontend client for HabitTrak, a modern habit tracking application with streaks, insights, challenges, reminders, and visual analytics.

## ✨ Features

### 🔐 Auth Pages
- **Login**
- **Signup**
- **Protected routes** using JWT + Cookies

### 🏠 Dashboard
- **Total habits**
- **Total check-ins**
- **Average streak**
- **Strongest habit**
- **Weakest habit**
- **Quick habit listing**
- **Challenge overview**

### 📘 Habit Management
- **Create habit**
- **Edit habit**
- **Delete habit**
- **Detailed view** with:
  - Weekly insights
  - Monthly insights
  - Check-in button

### 🧩 Challenge Mode
- **View challenges**
- **Join challenges**
- **Create new challenge**
- **Participant count**
- **Challenge details page**

### 🧭 Profile
- **User info**
- **Reminders section**

## 🛠️ Tech Stack
- **React + Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **js-cookie**
- **react-hot-toast**
- **React Router**

## 📁 Project Structure
habitTrak-frontend
```
│── src/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ ├── App.jsx
│__ main.jsx 
│── index.html
└── package.json
```

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
npm install
```
2. Create a config file
In /src/utils/api.js:

javascript
export const API = "https://backend-url";
3. Start dev server
```bash
npm run dev
```
4. Build for production
```bash
npm run build
```
🌐 Deployment
Frontend deployed on versel

Backend deployed on Render / Railway / Cyclic / etc.

✔ Status
Frontend: deployed
