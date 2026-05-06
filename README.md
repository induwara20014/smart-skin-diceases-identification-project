# Smart Skin Diseases Identification Project

A comprehensive web application for skin disease identification using machine learning. This system helps users identify skin conditions through image analysis and provides expert consultation features.

## 🎯 Features

- **AI-Powered Disease Detection**: Upload skin images for automated disease identification
- **Expert Consultation**: Connected with verified doctors for second opinions
- **Interactive Chatbot**: Get instant answers about skin conditions
- **User Dashboard**: Track detection history and health records
- **District-Based Mapping**: Identify specialists by location (Sri Lanka)
- **Secure Authentication**: Role-based access control for users and doctors
- **Analytics**: Monitor disease trends and detection statistics

## 📋 Prerequisites

- **Node.js** (v14.0.0 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (create `.env` file):
```bash
cp env.example .env
```

Update the `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
PYTHON_SERVICE_URL=http://localhost:5001
```

4. Seed initial data (doctors, districts, diseases):
```bash
node seed_doctors.js
node scripts/seedDiseasesFromLabels.js
node scripts/seedSriLankaDistricts.js
node scripts/migrateDistrictIdToName.js
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (create `.env` file):
```bash
cp env.example .env
```

Update the `.env` file with:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### ML Service Setup

1. Navigate to the ML directory:
```bash
cd backend/ml
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the prediction service:
```bash
python predict.py
```

## 📁 Project Structure

```
smart-skin-diseases-identification-project/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express application setup
│   │   ├── server.js           # Server configuration
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth & role middleware
│   │   ├── services/           # Chatbot & ML services
│   │   └── utils/              # Helper functions
│   ├── ml/
│   │   ├── predict.py          # ML prediction service
│   │   ├── chatbot_service.py  # Chatbot logic
│   │   └── skin_model.h5       # Pre-trained ML model
│   ├── package.json
│   └── doctors.json            # Doctor seed data
└── frontend/
    ├── src/
    │   ├── App.jsx             # Main React component
    │   ├── components/         # React components
    │   ├── pages/              # Page components
    │   ├── contexts/           # React contexts
    │   └── api/                # API client
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Disease Detection
- `POST /api/detect/upload` - Upload and analyze skin image
- `GET /api/detect/history` - Get detection history

### Chatbot
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history` - Get chat history

### Analytics
- `GET /api/analytics/stats` - Get system statistics
- `GET /api/analytics/diseases` - Get disease trends

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🛡️ Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication with role-based access control:

- **User Role**: Standard users with access to detection and consultation
- **Doctor Role**: Verified doctors with access to patient records and analytics
- **Admin Role**: Full system access

## 🤖 ML Model Details

- **Model**: Pre-trained CNN (skin_model.h5)
- **Input**: 224x224 RGB image
- **Output**: Disease classification with confidence scores
- **Supported Diseases**: Multiple skin conditions based on training data

## 📊 Database Models

- **Account**: User/Doctor accounts with authentication
- **DetectionRecord**: Stores detection history and results
- **Disease**: Catalog of skin diseases
- **District**: Geographic information for Sri Lanka

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Support & Contact

For issues, feature requests, or questions, please:
- Open an issue on GitHub
- Contact the development team

## 🙏 Acknowledgments

- ML Model training data source
- Medical advisors and skin specialists
- Open-source libraries and frameworks used

---

**Last Updated**: May 2026