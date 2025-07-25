# AgriToday 🌱

A comprehensive web-based agricultural marketplace connecting farmers, buyers, and transporters with role-based access control and subscription management.

## Features

### 🚜 For Farmers
- Register and manage crops
- List produce with detailed information
- Manage orders and inventory
- Track sales and analytics

### 🛒 For Buyers
- Browse fresh produce from local farmers
- Place orders with direct farmer communication
- Request transportation services
- Track order status in real-time

### 🚛 For Transporters
- Register as delivery partner
- Accept transportation jobs
- Manage delivery routes
- Track earnings and performance

### 👨‍💼 For Admins
- Monitor all user activities
- Manage content and moderation
- View payment transactions
- Ensure system integrity
- Generate reports and analytics
- Access admin dashboard with full permissions
- Manage user roles and subscriptions

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Razorpay** for payment processing
- **Bcrypt** for password hashing
- **Nodemailer** for email services

### Frontend
- **HTML5/CSS3/JavaScript** (Vanilla)
- **Responsive Design** with mobile-first approach
- **Multi-language Support** (English, Hindi, Tamil)
- **Progressive Web App** features

### Security & Performance
- **Helmet.js** for security headers
- **Rate limiting** for API protection
- **CORS** configuration
- **Input validation** and sanitization
- **Error handling** middleware

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Razorpay account for payment integration

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgroCulture
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/agroculture

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Subscription Configuration
SUBSCRIPTION_AMOUNT=4900
SUBSCRIPTION_CURRENCY=INR
```

### 4. Database Setup
Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud service
# Update MONGODB_URI in .env with your Atlas connection string
```

### 5. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Project Structure

```
AgroCulture/
├── server/
│   ├── models/          # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   └── paymentController.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   └── payments.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   └── config/          # Configuration files
├── client/
│   ├── public/          # Static files
│   │   └── index.html
│   └── src/
│       ├── styles/      # CSS files
│       │   └── main.css
│       ├── js/          # JavaScript files
│       └── components/  # Reusable components
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── server.js           # Main server file
└── README.md           # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout user

### Payments
- `POST /api/payments/create-subscription-order` - Create subscription order
- `POST /api/payments/verify-subscription` - Verify payment
- `GET /api/payments/subscription-status` - Get subscription status
- `POST /api/payments/cancel-subscription` - Cancel subscription

### Products (Coming Soon)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (Farmers only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Coming Soon)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

## Subscription Model

AgroCulture uses a simple subscription model:
- **₹49/month** for access to role-specific features
- **Free 7-day trial** for new users
- **Google Pay & UPI** payment integration (UPI ID: 6381672467@paytm)
- **Razorpay integration** for secure credit/debit card payments
- **Premium features** require active subscription after trial period

## Multi-language Support

The application supports three languages:
- **English** (default)
- **Hindi** (हिंदी)
- **Tamil** (தமிழ்)

Language can be changed using the dropdown in the navigation bar.

## Deployment

### Current Production Environment

**Frontend (Netlify):** `https://your-netlify-app.netlify.app`
**Backend (Railway):** `https://your-railway-backend.railway.app`

### Admin Credentials

**Admin Dashboard Access:**
- **Email:** admin@agritoday.com
- **Password:** Admin@123456
- **Role:** Administrator
- **Permissions:** Full platform management

### Environment Configuration

Production environment variables are configured as follows:

```env
# Production Environment
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-netlify-app.netlify.app

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agroculture

# JWT Configuration
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=your_production_key_id
RAZORPAY_KEY_SECRET=your_production_key_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=admin@agritoday.com
EMAIL_PASS=your_app_password

# Payment Configuration
SUBSCRIPTION_AMOUNT=4900
SUBSCRIPTION_CURRENCY=INR
ADMIN_UPI_ID=6381672467@paytm
ADMIN_EMAIL=admin@agritoday.com
ADMIN_PHONE=+91 6381672467
```

### Deployment Steps

#### Frontend Deployment (Netlify)
1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Configure environment variables in Netlify dashboard

3. **Configure redirects:**
   Create a `_redirects` file in the public folder:
   ```
   /*    /index.html   200
   ```

#### Backend Deployment (Railway)
1. **Connect repository to Railway**
2. **Configure environment variables** in Railway dashboard
3. **Deploy automatically** from main branch
4. **Configure custom domain** (optional)

#### Database Setup (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access (IP whitelist)
3. Create database user with read/write permissions
4. Update `MONGODB_URI` with Atlas connection string

### Creating Admin User

To create the admin user in production, run:

```bash
node scripts/createAdmin.js
```

This will create an admin user with the credentials listed above.

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Use meaningful variable and function names

### Security Best Practices
- Validate all user inputs
- Use parameterized queries
- Implement proper error handling
- Keep dependencies updated
- Use HTTPS in production

### Testing
- Write unit tests for controllers
- Test API endpoints
- Validate payment flows
- Test responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: info@agroculture.com
- Phone: +91 98765 43210

## Roadmap

### Phase 1 (Current)
- ✅ User authentication and authorization
- ✅ Subscription management
- ✅ Basic UI/UX design
- ✅ Payment integration

### Phase 2 (Next)
- 🔄 Product management system
- 🔄 Order management
- 🔄 Real-time messaging
- 🔄 Advanced search and filtering

### Phase 3 (Future)
- 📱 Mobile application
- 🔔 Push notifications
- 📊 Advanced analytics
- 🌍 Multi-region support
- 🤖 AI-powered recommendations

---

**Built with ❤️ for the farming community**
