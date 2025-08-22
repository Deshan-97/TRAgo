# TravelGo - Vehicle Hire Bidding Platform

A mobile-first web platform where admins can post hire requests and vehicle owners can submit bids without requiring authentication.

## Features

### Landing Page (Public)
- **TravelGo Header** - Clean branding
- **Hire Details Display** - Shows current hire requirements from admin
- **Bid Submission** - Vehicle owners can submit offers with:
  - Name, vehicle type
  - Pricing (AC/Non-AC per km, full hire price)
  - Two photo uploads
  - Phone number
- **No Authentication Required** - Anyone can submit bids

### Admin Panel
- **Add New Hire Requests** with:
  - Pickup/Dropoff locations
  - Hire type (wedding, trip, airport transport)
  - Vehicle type (van, bus, car)
  - Passengers (1-50)
  - AC preference
  - Duration (days)
  - Additional requirements
- **View Active Hires** - Manage current requests
- **View All Bids** - Review submitted offers with photos
- **No Authentication Required** - Direct access via URL

### Technical Features
- **Mobile-First Design** - Responsive across all devices
- **PostgreSQL Database** - Reliable data storage
- **File Upload Support** - Vehicle photos with validation
- **Real-time Updates** - Auto-refresh functionality
- **Clean UI/UX** - Modern, intuitive interface

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **File Handling**: Multer for image uploads
- **Design**: Mobile-first responsive CSS

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE travelgo;
```

2. Create a user (optional):
```sql
CREATE USER travelgo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE travelgo TO travelgo_user;
```

3. Run the schema file:
```bash
psql -d travelgo -f database/schema.sql
```

### 2. Application Setup

1. Install dependencies:
```bash
npm install
```

2. Configure database connection:
Edit `server/database/config.js` with your PostgreSQL credentials:
```javascript
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'travelgo',
    password: 'your_password',
    port: 5432,
});
```

3. Start the application:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

4. Access the application:
- **Landing Page**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Project Structure

```
/
├── public/                 # Frontend files
│   ├── index.html         # Landing page
│   ├── admin.html         # Admin panel
│   ├── css/
│   │   └── styles.css     # Mobile-first styles
│   ├── js/
│   │   ├── main.js        # Landing page logic
│   │   └── admin.js       # Admin panel logic
│   └── uploads/           # Photo storage
├── server/                # Backend files
│   ├── app.js            # Main server file
│   ├── routes/
│   │   ├── hireRoutes.js # Hire request API
│   │   └── bidRoutes.js  # Bid submission API
│   └── database/
│       └── config.js     # Database configuration
├── database/
│   └── schema.sql        # Database schema
└── package.json          # Dependencies
```

## API Endpoints

### Hire Requests
- `GET /api/hire` - Get all active hire requests
- `GET /api/hire/:id` - Get specific hire request
- `POST /api/hire` - Create new hire request (Admin)
- `DELETE /api/hire/:id` - Deactivate hire request (Admin)
- `GET /api/hire/:id/bids` - Get bids for specific hire

### Bid Submissions
- `GET /api/bid` - Get all bids (Admin)
- `GET /api/bid/:id` - Get specific bid
- `POST /api/bid` - Submit new bid (Public)
- `DELETE /api/bid/:id` - Delete bid (Admin)

## Database Schema

### hire_requests
- id, pickup_location, dropoff_location
- hire_type, vehicle_type, passengers
- ac_preference, duration_days
- additional_data, created_at, is_active

### bid_submissions
- id, hire_request_id, owner_name
- vehicle_type, price_per_km_ac, price_per_km_non_ac
- full_hire_price, photo1_path, photo2_path
- phone_number, submitted_at

## Usage

### For Admins
1. Navigate to `/admin`
2. Fill in hire request details
3. Submit to make it live on landing page
4. View and manage submitted bids
5. Contact vehicle owners directly

### For Vehicle Owners
1. Visit the main page
2. View current hire requirements
3. Click "Bid for This Hire"
4. Fill in pricing and upload photos
5. Submit bid for admin review

## File Upload
- **Supported formats**: JPEG, PNG, GIF
- **Maximum size**: 5MB per image
- **Storage**: Local filesystem (`/public/uploads/`)

## Security Notes
- No authentication required as per requirements
- File upload validation implemented
- SQL injection protection via parameterized queries
- XSS protection via proper data handling

## Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License
MIT License - see LICENSE file for details
