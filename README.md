# 🍔 Food Delivery App

A full-stack Food Delivery Platform where customers can order food, shop owners can manage their restaurants and menu items, and delivery partners can handle deliveries in real time.

## 🚀 Features

### 👤 Authentication
- User Signup & Login
- Google Authentication (Firebase)
- JWT Authentication
- Access & Refresh Token System
- Secure HTTP-only Cookies
- Password Reset via OTP
- Redis-based Session Management

### 🍽 Customer Features
- Browse Restaurants
- Search Food Items
- Add Items to Cart
- Place Orders
- Online Payment Integration (Razorpay)
- Track Order Status
- View Order History

### 🏪 Shop Owner Features
- Create & Manage Shop
- Add/Edit/Delete Food Items
- Manage Orders
- Update Order Status
- View Shop Dashboard

### 🚚 Delivery Partner Features
- View Assigned Orders
- Accept Delivery Requests
- Live Order Updates
- Verify Delivery using OTP

### 📍 Location Features
- Automatic User Location Detection
- Reverse Geocoding using Geoapify
- City-Based Restaurant Discovery

### 🔄 Real-Time Features
- Socket.IO Integration
- Live Order Updates
- Real-Time Delivery Status Tracking

---

## 🛠 Tech Stack

### Frontend
- Next.js 16
- React
- Redux Toolkit
- Tailwind CSS
- Axios
- Firebase Authentication
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Redis Cloud
- JWT Authentication
- Socket.IO
- Nodemailer

### DevOps
- Docker
- Docker Compose
- Render (Backend Deployment)
- Vercel (Frontend Deployment)

### Payment Gateway
- Razorpay

---

## 📂 Project Structure

```bash
Food_Site/
│
├── client/          # Next.js Frontend
│
├── server/          # Express Backend
│
├── docker-compose.yml
│
└── README.md
```

## 🐳 Running with Docker

### Build Images

#### Backend

```bash
cd server

docker build -t food-site-server:v1 .
```

#### Frontend

```bash
cd client

docker build -t food-site-client:v1 .
```

---

### Run Using Docker Compose

```bash
docker compose up -d
```

Stop Containers:

```bash
docker compose down
```

View Logs:

```bash
docker compose logs -f
```

---

## 💻 Local Development

### Backend

```bash
cd server

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:1100
```

---

### Frontend

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User logs in.
2. Backend generates:
   - Access Token (15 minutes)
   - Refresh Token (7 days)
3. Tokens are stored in HTTP-only cookies.
4. Refresh tokens are stored in Redis.
5. Axios interceptor automatically refreshes expired access tokens.

---

## 🌐 Deployment

### Backend
- Render

### Frontend
- Vercel

### Database
- MongoDB Atlas

### Cache
- Redis Cloud

---

## 🔮 Future Improvements

- Push Notifications
- Feedbacks on food items
- Coupon System
- Recommendation Engine
- AI-powered Food Suggestions

---

## 👨‍💻 Author

Developed by **Prachi Gupta**

If you found this project useful, consider giving it a ⭐ on GitHub.
