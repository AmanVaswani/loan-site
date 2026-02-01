# LoanEase - Loan Application Website

A professional loan application website built with Next.js (frontend) and Node.js/Express (backend), using Supabase as the database.

## Features

- Modern, responsive landing page with loan information
- Loan application form with document uploads (PAN, Aadhaar, ITR, Bank Statement)
- Multiple loan types: Personal, Home, Business, Car, Education, Gold
- Statistics section showing disbursed loans and happy customers
- Customer testimonials
- 10-20% cashback offer on first 3 EMIs promotion
- WhatsApp and phone contact integration
- Secure file uploads to Supabase Storage
- Admin API endpoints for managing applications

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Hook Form, Zod
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **Icons**: Lucide React

## Project Structure

```
Loan_Site/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   └── lib/             # API utilities
│   └── package.json
├── backend/                  # Express backend
│   ├── src/
│   │   └── index.js         # Main server file
│   └── package.json
├── database/
│   └── schema.sql           # Database schema
├── SUPABASE_SETUP.md        # Detailed Supabase setup guide
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)

### 1. Setup Supabase

Follow the detailed guide in `SUPABASE_SETUP.md` to:
1. Create a Supabase project
2. Set up the database tables
3. Configure storage for document uploads
4. Get your API keys

### 2. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the website.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Get loan statistics |
| GET | `/api/loan-types` | Get available loan types |
| POST | `/api/applications` | Submit loan application |
| GET | `/api/applications/:id` | Get application status |
| GET | `/api/admin/applications` | Get all applications (admin) |
| PATCH | `/api/admin/applications/:id` | Update application status (admin) |

## Loan Types

1. **Personal Loan** - 10.5% - 18% interest, up to 40 Lakhs
2. **Home Loan** - 8.5% - 10% interest, up to 10 Crores
3. **Business Loan** - 12% - 20% interest, up to 5 Crores
4. **Car Loan** - 9% - 14% interest, up to 1 Crore
5. **Education Loan** - 8% - 12% interest, up to 75 Lakhs
6. **Gold Loan** - 7% - 12% interest, up to 50 Lakhs

## Customization

### Update Contact Information

Edit the phone number and WhatsApp link in:
- `frontend/src/components/Header.tsx`
- `frontend/src/components/Footer.tsx`
- `frontend/src/app/apply/page.tsx`

### Update Statistics

Modify the dummy data in:
- `backend/src/index.js` - `/api/stats` endpoint
- `frontend/src/components/Stats.tsx`

### Add More Loan Types

1. Update `backend/src/index.js` - `/api/loan-types` endpoint
2. Update `frontend/src/components/LoanTypes.tsx`
3. Update `frontend/src/components/ApplicationForm.tsx`

## Production Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Backend (Railway/Render)

1. Push your code to GitHub
2. Create a new service on Railway or Render
3. Add environment variables
4. Deploy

### Database

Your Supabase database is already in the cloud and accessible from anywhere.

## Security Considerations

1. Never expose `SUPABASE_SERVICE_KEY` to the frontend
2. Add authentication for admin endpoints in production
3. Implement rate limiting for form submissions
4. Validate file uploads on both client and server
5. Use HTTPS in production

## License

This project is for educational purposes. Customize it according to your business needs.

## Support

For issues or questions:
- Check `SUPABASE_SETUP.md` for database setup help
- Create an issue in the repository
