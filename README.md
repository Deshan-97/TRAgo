# TRAgo - Travel & Go Platform 🚗

A complete vehicle hire bidding platform designed for Sri Lanka, featuring full Sinhala localization and mobile-first responsive design.

## 🌟 Features

### 🏠 Landing Page
- **Hire Details Display**: Show current hire requests with pickup/dropoff locations, dates, and requirements
- **Sinhala Interface**: Complete localization in Sinhala language
- **Responsive Design**: Mobile-first approach for all devices
- **Real-time Updates**: Auto-refresh hire details every 30 seconds

### 📝 Bidding System
- **Terms & Conditions**: Mandatory agreement modal in Sinhala before bidding
- **Comprehensive Bid Form**: 
  - Driver name and contact details
  - Vehicle type selection (Car/Van/Bus)
  - Pricing for AC and Non-AC services
  - Full hire price option
  - Vehicle photo uploads (up to 20MB per image)
  - 10-digit phone number validation
- **File Upload**: Image preview with remove functionality
- **Real-time Validation**: Instant feedback for form inputs

### 🎛️ Admin Panel
- **Hire Management**: Create and manage hire requests
- **Bid Review**: View and manage submitted bids
- **Database Integration**: PostgreSQL for data persistence

### 🔧 Technical Features
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with proper schema
- **File Uploads**: Multer middleware for handling images
- **Security**: Input validation and sanitization
- **Error Handling**: Comprehensive error management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deshan-97/TRAgo.git
   cd TRAgo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   chmod +x setup-database-simple.sh
   ./setup-database-simple.sh
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Main Platform: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📁 Project Structure

```
TRAgo/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── uploads/           # File upload directory
│   ├── index.html         # Landing page
│   └── admin.html         # Admin panel
├── server/                # Backend files
│   ├── routes/            # API routes
│   ├── database/          # Database configuration
│   └── app.js             # Main server file
├── database/              # Database schema and migrations
├── package.json           # Dependencies
└── README.md             # Documentation
```

## 🌐 API Endpoints

### Hire Requests
- `GET /api/hire` - Get all hire requests
- `POST /api/hire` - Create new hire request
- `DELETE /api/hire/:id` - Delete hire request

### Bid Submissions
- `POST /api/bid` - Submit a bid (with file upload)

## 🎨 Sinhala Localization

The platform features complete Sinhala translation including:
- Interface labels and buttons
- Form field descriptions
- Error messages
- Terms and conditions
- Success notifications

## 📱 Mobile Responsive

- Mobile-first CSS design
- Touch-friendly interface
- Optimized for screens from 320px to 1920px
- Fast loading and smooth interactions

## 🔒 Security Features

- File upload validation (type and size)
- Phone number format validation
- SQL injection prevention
- Input sanitization
- CORS configuration

## 🛠️ Development

### Scripts
```bash
npm start           # Start the server
npm run dev         # Development mode with nodemon
./test-admin.sh     # Test admin functionality
./test-bid.sh       # Test bid submission
```

### Database Management
```bash
./setup-database.sh         # Full database setup
./setup-database-simple.sh  # Quick setup
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Deshan**
- GitHub: [@Deshan-97](https://github.com/Deshan-97)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub.

---

Made with ❤️ for the Sri Lankan transport industry
