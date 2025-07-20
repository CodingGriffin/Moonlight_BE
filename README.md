# Business Search & Export API

A powerful Node.js/TypeScript API for searching, scraping, and managing business information with Google Places integration, web scraping capabilities, and Google Sheets export functionality.

## 🚀 Features

- **Business Search**: Google Places API integration for location-based business discovery
- **Web Scraping**: Automated extraction of contact information and social media links
- **User Management**: JWT-based authentication with Google OAuth support
- **Data Export**: Direct export to Google Sheets with custom formatting
- **Email Integration**: OpenAI-powered email generation and Mailgun delivery
- **Favorites System**: Save and manage favorite business results
- **Real-time Data**: Live scraping of business websites for up-to-date information

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Web Scraping**: Puppeteer + Cheerio
- **APIs**: Google Places, Google Sheets, OpenAI, Mailgun
- **Cloud Storage**: Cloudinary
- **Development**: Nodemon, Concurrently

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- Google Cloud Platform account with enabled APIs:
  - Places API
  - Sheets API
  - Drive API
- OpenAI API key
- Mailgun account (optional)
- Cloudinary account (optional)

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd server
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:

```env
# Server Configuration
BUILD_MODE=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URL=mongodb://localhost:27017/business-search

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACTIVATION_TOKEN_SECRET=your_activation_token_secret

# Google APIs
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_CX=your_custom_search_engine_id
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
REDIRECT_URI=your_oauth_redirect_uri

# Email Services
SMTP_MODE=gmail
SMTP_FROMMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
MAILING_SERVICE_CLIENT_ID=your_gmail_client_id
MAILING_SERVICE_CLIENT_SECRET=your_gmail_client_secret
MAILING_SERVICE_REFRESH_TOKEN=your_gmail_refresh_token
SENDER_EMAIL_ADDRESS=your_sender_email

# Cloud Storage (Optional)
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

4. **Google Service Account Setup**
- Create a service account in Google Cloud Console
- Download the JSON key file
- Place it at `src/config/google_sheet.json`

5. **Build and Start**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔗 API Endpoints

### Authentication
```
POST /api/user/register          # User registration
POST /api/user/login             # User login
POST /api/user/google_auth       # Google OAuth login
GET  /api/user/infor             # Get user info
POST /api/user/refresh_token     # Refresh JWT token
```

### Business Search
```
GET /api/search/search           # Search businesses
  Query params:
  - q: search query (required)
  - num: result limit (default: 20)
  - lat: latitude (default: -34)
  - lng: longitude (default: 150)
  - radius: search radius in km
```

### Results Management
```
GET  /api/result/                # Get all user results
GET  /api/result/favorite        # Get favorite results
PUT  /api/result/favorite/:id    # Toggle favorite status
POST /api/result/save            # Save search results
POST /api/result/export          # Export to Google Sheets
```

### Email Services
```
GET  /api/email/                 # Get email templates
POST /api/email/send_email       # Send email campaign
GET  /api/email/create           # Generate AI email content
```

## 📊 Data Models

### User Schema
```typescript
{
  googleId: string;
  name: string;
  email: string;
  password?: string;
  role: number; // 0 = user, 1 = admin
  picture: string;
  token: string;
}
```

### Business Result Schema
```typescript
{
  userId: ObjectId;
  name: string;
  industry: string;
  formatted_address: string;
  phoneNumber: string;
  email: string;
  website: string;
  rating: number;
  isFavorite: boolean;
}
```

## 🔍 Search Flow

1. **Google Places Search**: Query businesses by location and keywords
2. **Details Enrichment**: Fetch additional details (website, phone) via Places Details API
3. **Web Scraping**: Extract email addresses and social media links from business websites
4. **Data Aggregation**: Combine all information into structured format
5. **Storage**: Save results to MongoDB with user association

## 📤 Export Features

- **Google Sheets Integration**: Create formatted spreadsheets with business data
- **Custom Styling**: Branded headers with colors and formatting
- **Public Sharing**: Automatic permission setup for easy sharing
- **Batch Processing**: Handle large datasets efficiently

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Rate limiting (recommended to add)

## 🚀 Deployment

### Vercel (Recommended)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Development

```bash
# Watch mode with TypeScript compilation
npm run dev

# Type checking
npx tsc --noEmit

# Build for production
npm run build
```

## 📝 API Usage Examples

### Search Businesses
```javascript
const response = await fetch('/api/search/search?q=restaurants&lat=40.7128&lng=-74.0060&radius=5');
const data = await response.json();
```

### Export to Google Sheets
```javascript
const exportData = {
  data: [
    {
      name: "Business Name",
      industry: "Restaurant",
      formatted_address: "123 Main St, City",
      phoneNumber: "+1234567890",
      email: "contact@business.com",
      website: "https://business.com",
      rating: 4.5
    }
  ]
};

const response = await fetch('/api/result/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(exportData)
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- Business search and scraping
- Google Sheets export
- User authentication
- Email integration
