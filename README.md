# Hirely - Job Portal

A full-stack job portal application built with React, Node.js, and MongoDB. Hirely connects job seekers with employers, providing a seamless platform for job discovery, applications, and management.

## Features

### For Job Seekers
- 🔍 Browse and search for jobs
- 📝 Apply for jobs with one click
- 👤 Create and manage user profile
- 📊 Track applied jobs
- 📱 Responsive design for mobile and desktop

### For Employers
- 🏢 Company setup and management
- ➕ Post and manage job listings
- 👥 View and manage job applications
- 📈 Track applicants and hiring metrics
- 🎯 Filter jobs by category

### Admin Features
- 🛡️ Admin dashboard
- 👨‍💼 Manage companies
- 💼 Manage job posts
- 👥 Monitor all applicants
- 🎨 Complete application management

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Redux** - State management
- **React Router** - Navigation
- **Shadcn UI** - Component library
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Multer** - File upload handling

## Project Structure

```
Hirely/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
├── backend/          # Node.js API server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=8000
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with:
```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

### Backend
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (development)

### Frontend
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Jobs
- `GET /api/job` - Get all jobs
- `GET /api/job/:id` - Get job details
- `POST /api/job` - Create new job (Admin)
- `PUT /api/job/:id` - Update job (Admin)
- `DELETE /api/job/:id` - Delete job (Admin)

### Applications
- `POST /api/application/apply` - Apply for job
- `GET /api/application` - Get applied jobs
- `GET /api/application/:id/applicants` - Get job applicants (Admin)

### Companies
- `GET /api/company` - Get all companies
- `GET /api/company/:id` - Get company details
- `POST /api/company/register` - Register company (Admin)
- `PUT /api/company/:id` - Update company (Admin)

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/hirely
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=8000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000
```

## Usage

1. **Register/Login**: Create an account as a job seeker or employer
2. **Browse Jobs**: Search and filter jobs by category
3. **Apply for Jobs**: Click on a job and apply directly
4. **Post Jobs**: Employers can post new job listings
5. **Track Applications**: Monitor your applications and applicants
6. **Admin Panel**: Manage users, jobs, and companies

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, email support@hirely.com or open an issue in the repository.

---

**Made with ❤️ by Karun**
