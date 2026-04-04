# Bhuvanesh Portfolio — Setup Guide

## Step 1 — Install Dependencies
```bash
cd bhuvanesh-portfolio
npm install
```

## Step 2 — Setup Supabase Database
1. Go to https://supabase.com → your project
2. Click **SQL Editor** → **New Query**
3. Copy entire contents of `supabase/setup.sql`
4. Click **Run** ✅

## Step 3 — Create Admin User
1. Go to Supabase → **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Email: `bhuvaneshr206@gmail.com`
4. Set your password
5. Click **Create User** ✅

## Step 4 — Run Development Server
```bash
npm run dev
```
- Portfolio: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login

## Step 5 — Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Add environment variables in Vercel dashboard:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Admin Features
- ✅ Profile (photo, bio, links)
- ✅ Skills (add/edit/delete with levels)
- ✅ Projects (with image upload)
- ✅ Experience (work history)
- ✅ Education (academic details)
- ✅ Services (freelance offerings)
- ✅ Certificates (NPTEL etc.)
- ✅ Testimonials (client reviews)
- ✅ Messages (contact form inbox)
