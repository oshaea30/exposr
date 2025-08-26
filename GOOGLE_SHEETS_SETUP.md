# Google Sheets Integration Setup Guide

## 🚨 Why Data Isn't Writing to Your Sheet

The current implementation cannot write directly to Google Sheets because Google requires **authentication** for write operations. Here are the solutions:

## 🔧 **Solution 1: Make Sheet Publicly Editable (Easiest)**

### Step 1: Open Your Google Sheet Sharing Settings
1. Open your Google Sheet
2. Click the **"Share"** button (top-right corner)
3. Click **"Change to anyone with the link"**
4. Set permission to **"Editor"** (not just "Viewer")
5. Click **"Done"**

⚠️ **Security Note**: This makes your sheet publicly editable. Anyone with the link can modify it.

### Step 2: Test the Integration
1. Go to your Exposr admin dashboard (`#admin`)
2. Paste your Google Sheets URL
3. Click "Initialize Sheets" 
4. Upload a test image
5. Check your Google Sheet for new data

---

## 🔒 **Solution 2: Google Apps Script (Secure)**

### Step 1: Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID_HERE');
    
    // Get or create the specified sheet
    let targetSheet = sheet.getSheetByName(data.sheetName);
    if (!targetSheet) {
      targetSheet = sheet.insertSheet(data.sheetName);
    }
    
    // Append the data
    targetSheet.appendRow(data.values);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2: Deploy the Script
1. Click **"Deploy"** > **"New deployment"**
2. Choose type: **"Web app"**
3. Set execute as: **"Me"**
4. Set access: **"Anyone"**
5. Click **"Deploy"**
6. Copy the **Web App URL**

### Step 3: Update Exposr Configuration
1. Add this to your `.env` file:
```
REACT_APP_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## 📋 **Solution 3: Google Forms Method (Backup)**

### Step 1: Create Google Form
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with fields matching your data
3. Link it to your Google Sheet
4. Get the form submission URL

### Step 2: Configure Form Submission
- Exposr can submit data via the form's endpoint
- Less elegant but works reliably

---

## 🔍 **Current Status: Fallback Mode**

Right now, Exposr is storing data locally and in the browser console. You can:

1. **Check Console Logs**: Open browser dev tools to see the data being generated
2. **Export Local Data**: Use the admin dashboard export function
3. **Manual Import**: Copy data from localStorage to your sheet

## 📊 **Testing Your Setup**

### If It's Working:
- ✅ Console shows "Successfully wrote to Google Sheets"
- ✅ New rows appear in your Google Sheet
- ✅ Admin dashboard shows "Google Sheets Configured"

### If It's Not Working:
- ❌ Console shows "Google Sheets write access not configured"
- ❌ Data only appears in localStorage
- ❌ Fallback data accumulates

## 🚀 **Quick Test**

1. Try **Solution 1** first (make sheet publicly editable)
2. Upload a test image in Exposr
3. Check your Google Sheet for new data
4. If that works, you're done!
5. If not, try **Solution 2** (Google Apps Script)

## 💡 **Pro Tips**

- **Sheet Names**: Exposr creates sheets named "Analyses", "Feedback", "Daily_Summary"
- **Headers**: The first run will add column headers automatically
- **Data Format**: Each upload creates one row with timestamp, metadata, and results
- **Privacy**: Delete codes are never sent to Google Sheets for security

## 🔧 **Troubleshooting**

### "Permission denied" errors:
- Make sure sheet is set to "Editor" permissions
- Check that the spreadsheet ID is correct

### "Invalid spreadsheet ID" errors:
- Verify the URL format: `https://docs.google.com/spreadsheets/d/[ID]/edit`
- Make sure you copied the full URL

### Data appears locally but not in sheets:
- Check browser console for error messages
- Verify sharing permissions
- Try refreshing and testing again

Once you set up any of these solutions, your Google Sheet will automatically receive data from every Exposr analysis!
