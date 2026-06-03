# 🍔 Food Delivery App

A full-stack food delivery platform where customers can discover restaurants, order food online, and track their orders. Shop owners can manage their restaurants and menu items, while delivery partners can handle assigned deliveries.

## 🚀 Live Demo

**Frontend:**    https://food-delivery-app-ruddy-seven.vercel.app
**Backend API:** https://food-delivery-app-4e9r.onrender.com

---

## ✨ Features

### Authentication
- Email & Password Authentication
- Google Sign-In (Firebase)
- JWT Authentication
- Refresh Token System
- Secure HTTP-only Cookies
- OTP-based Password Reset

### Customer
- Browse Restaurants
- Search Food Items
- Place Orders
- Online Payments (Razorpay)
- Track Order Status
- View Order History

### Shop Owner
- Create and Manage Shop
- Add, Edit, and Delete Food Items
- Manage Incoming Orders
- Update Order Status

### Delivery Partner
- View Assigned Deliveries
- Accept Orders
- OTP-Based Delivery Verification

### Real-Time Updates
- Socket.IO Integration
- Live Order Status Updates

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React
- Redux Toolkit
- Tailwind CSS
- Axios
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Redis Cloud
- JWT Authentication
- Socket.IO

### Services
- Razorpay
- Cloudinary
- Geoapify

### Deployment
- Vercel
- Render
- Docker

---

## 📂 Project Structure

```bash
Food_Site/
│
├── client/     # Next.js Frontend
├── server/     # Express Backend
└── docker-compose.yml
```

---

## ⚙️ Environment Variables

### Backend

```env
PORT=
MONGO_URL=
FRONTEND_URL=
ACCESS_SECRET=
REFRESH_SECRET=
NODE_ENV=
EMAIL_PASSKEY=
EMAIL=
CLOUD_NAME=
CLOUD_SECRET=
CLOUD_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
REDIS_URL=
```

### Frontend

```env
NEXT_PUBLIC_BACKEND_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GEOAPI_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

---

## 🐳 Running Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 👨‍💻 Author

**Prachi Gupta**

If you found this project interesting, consider giving it a ⭐ on GitHub.
