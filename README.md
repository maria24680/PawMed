# 🐾 PawMed Client - Veterinary Clinic Management System

PawMed is a modern veterinary clinic management system built with **Next.js, TypeScript, Tailwind CSS, and Better Auth**. It provides a complete digital solution for pet owners, veterinarians, and administrators to manage pets, appointments, medical records, prescriptions, and clinic services.

---

## 🚀 Live Link

🔗 https://pawmed-gamma.vercel.app

---

## ✨ Features

### 🔐 Authentication
- Secure authentication using Better Auth
- User registration and login
- Session-based authentication
- Protected routes
- Role-based access control

### 👥 User Roles

#### 🐾 Client
- Create and manage pet profiles
- Explore veterinary services
- Book appointments
- View appointment history
- View prescriptions
- View medical records
- Update profile information

#### 🩺 Veterinarian
- Veterinarian dashboard
- Manage appointments
- View pet medical history
- Create prescriptions
- Manage patient records
- Track appointment statistics

#### 👑 Admin
- Admin dashboard
- Manage users
- Update user roles
- Manage clinic services
- View system statistics

---

## 🛠️ Technology Stack

### Frontend
- Next.js 16
- TypeScript
- React
- Tailwind CSS
- DaisyUI
- Framer Motion
- Lucide React
- Recharts

### Authentication
- Better Auth

### Backend Communication
- Next.js API Route Proxy
- Express.js REST API

### Database
- MongoDB

### Deployment
- Vercel

---

## 📂 Project Structure

```
pawmed-client
│
├── public
│
├── src
│   ├── app
│   │   ├── dashboard
│   │   │   ├── admin
│   │   │   ├── client
│   │   │   └── veterinarian
│   │   │
│   │   ├── login
│   │   ├── register
│   │   ├── explore
│   │   └── services
│   │
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── types
│   └── utils
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/pawmed-client.git
```

### Go to Project Folder

```bash
cd pawmed-client
```

### Install Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env.local` file:

```env
BACKEND_URL=your_backend_url

BETTER_AUTH_SECRET=your_secret

BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_url
```

---

## ▶️ Run Project Locally

Start development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🏗️ Production Build

Create production build:

```bash
npm run build
```

Run production server:

```bash
npm start
```

---

## 🎨 Design System

PawMed uses a clean veterinary healthcare color palette:

```
#E6EEC9
#C2D099
#7DA78C
#35858E
```

Features:

- Responsive design
- Modern dashboard interface
- Clean user experience
- Mobile friendly layout

---

## 🔒 Security Features

- Protected routes
- Role-based authorization
- Secure authentication
- Environment variable protection
- Server-side session validation

---

## 🔮 Future Improvements

- Stripe payment integration
- Online doctor consultation
- Real-time notifications
- Pet health reminders
- AI-based pet health assistant

---

## 👩‍💻 Developer

**Mumtahina Maria**

Computer Science & Engineering Student

GitHub:
https://github.com/maria24680