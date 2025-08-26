# Airtable Integration Setup Guide

## 🎯 What You Need for Airtable Integration

Perfect! I've implemented Airtable integration for Exposr. Here's exactly what you need:

### **Required Information:**
1. **Airtable Base ID** - Starts with "app..." (e.g., `app1234567890abcde`)
2. **Personal Access Token** - Starts with "pat..." (e.g., `pat1234567890abcdef.1234567890abcdef`)

---

## 🚀 **Step-by-Step Setup (5 minutes)**

### **Step 1: Create Airtable Account**
1. Go to [Airtable.com](https://airtable.com)
2. Sign up for a free account (free tier works perfectly)

### **Step 2: Create Your Base**
1. Click **"Create a base"**
2. Choose **"Start from scratch"**
3. Name it **"Exposr Analytics"**
4. You'll see a default table - we'll automatically create the right structure

### **Step 3: Get Your Base ID**
1. In your new base, look at the URL in your browser
2. It should look like: `https://airtable.com/app1234567890abcde/tbl...`
3. Copy the part that starts with `app` (e.g., `app1234567890abcde`)
4. This is your **Base ID**

### **Step 4: Create Personal Access Token**
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Name it **"Exposr Integration"**
4. Set scopes to:
   - ✅ **data.records:read** 
   - ✅ **data.records:write**
   - ✅ **schema.bases:read**
5. Select your **"Exposr Analytics"** base
6. Click **"Create token"**
7. **Copy the token** (starts with `pat...`) - you won't see it again!

### **Step 5: Configure Exposr**
1. Go to your Exposr admin dashboard: `http://localhost:3000#admin`
2. Enter admin password: `exposr-admin-2025`
3. Paste your **Base ID** and **Personal Access Token**
4. Click **"Connect to Airtable"**
5. If successful, you'll see "✅ Airtable Connected"

---

## 🎉 **What Happens Next**

Once connected, Exposr will automatically create **3 tables** in your Airtable base:

### **1. Analyses Table**
Every image upload creates a new record with:
- Timestamp, Analysis ID
- Image metadata (filename, size, dimensions, format)
- AI detection results (verdict, confidence score)
- User location (country/region only)
- Browser information
- Research consent status

### **2. Feedback Table**
User feedback creates records with:
- Feedback timestamp and ID
- Feedback type (accurate/inaccurate)
- Optional user comments
- Browser and platform information

### **3. Daily_Summary Table**
Daily aggregations include:
- Total analyses for the day
- AI detection statistics
- Average confidence scores
- Feedback rates and accuracy
- Research consent rates

---

## ✅ **Testing Your Setup**

### **If It's Working:**
- ✅ Console shows "Successfully sent data to Airtable"
- ✅ New records appear in your Airtable base
- ✅ Admin dashboard shows "Airtable Connected" in green

### **If It's Not Working:**
- ❌ Console shows "Airtable API error"
- ❌ No new records in Airtable
- ❌ Error messages in admin setup

### **Quick Test:**
1. Upload a test image in Exposr
2. Check your Airtable base for a new record in "Analyses" table
3. Give feedback (thumbs up/down) and check "Feedback" table

---

## 🔧 **Troubleshooting**

### **"Invalid Base ID" Error:**
- Make sure you copied the full Base ID starting with "app"
- Check that the base exists and you have access to it

### **"Invalid Access Token" Error:**
- Verify the token starts with "pat"
- Ensure the token has the correct permissions (read/write)
- Check that the token is associated with the right base

### **"Permission denied" Error:**
- Your token might not have write access to the base
- Recreate the token with proper permissions

### **No data appearing in Airtable:**
- Check browser console for error messages
- Verify both Base ID and token are correct
- Try refreshing and testing again

---

## 💡 **Why Airtable is Better Than Google Sheets**

### **Security:**
- ✅ Secure API authentication (no public editing needed)
- ✅ Token-based access control
- ✅ Granular permissions

### **Features:**
- ✅ Rich data types (select fields, dates, attachments)
- ✅ Built-in data validation
- ✅ Powerful filtering and sorting
- ✅ Custom views and dashboards
- ✅ Team collaboration tools
- ✅ Automation and integrations

### **Developer Experience:**
- ✅ Reliable REST API
- ✅ Real-time updates
- ✅ Better error handling
- ✅ No rate limiting issues

---

## 📊 **Sample Data Structure**

### **Analyses Table Fields:**
```
Timestamp: 2025-01-17T15:30:00Z
Analysis_ID: abc123def456
Filename: photo.jpg
File_Size_KB: 245
Image_Width: 1024
Image_Height: 768
File_Format: image/jpeg
AI_Detected: true
Confidence: 87
Verdict: Likely AI-generated
Country: US
Region: Georgia
Browser: Mozilla
Platform: MacIntel
Language: en-US
Research_Consent: false
Has_Feedback: false
```

### **Feedback Table Fields:**
```
Timestamp: 2025-01-17T15:35:00Z
Feedback_ID: feed123back456
Feedback_Type: accurate
Comment: The result seemed correct to me
Browser: Mozilla
Platform: MacIntel
Language: en-US
```

---

## 🚀 **Next Steps After Setup**

1. **Upload test images** to see data flowing
2. **Customize your Airtable views** for better analysis
3. **Set up Airtable automations** for notifications
4. **Create charts and dashboards** in Airtable
5. **Share the base** with your team members

Your Airtable integration is now much more secure and feature-rich than Google Sheets! 🎉
