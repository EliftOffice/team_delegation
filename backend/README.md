# Poster Tracker Backend Setup

Since you want the posters to upload to your Google Drive (`2026posters`) and update a Google Sheet, we use Google Apps Script. This allows you to connect the web app directly to your `rmsocialstore@gmail.com` account securely.

## Step 1: Create a Google Sheet
1. Log in to your Google Account (`rmsocialstore@gmail.com`).
2. Go to [Google Sheets](https://sheets.google.com) and create a **Blank** spreadsheet.
3. Rename it to **"Media Team Poster Tracker"** (or whatever you prefer).
4. Set up the columns in the first row:
   - **Column A (A1)**: `Employee Name`
   - **Column B (B1)**: `Count`
   - **Column C (C1)**: `Last Upload Date`
5. Optional: You can fill in the employee names (Hanna, Rancy, Prisk, Vikas, Prasanna, Raviteja) in Column A directly. If you don't, the script will automatically add them when they upload their first poster.

## Step 2: Add Google Apps Script
1. In your Google Sheet, click on **Extensions** > **Apps Script**.
2. A new tab will open. Delete any code in the editor (`function myFunction() {...}`) and **paste** the entire code from the `Code.gs` file in this folder.
3. Save the project by clicking the floppy disk icon or pressing `Ctrl+S`. You can name the project "Poster Uploader".

## Step 3: Deploy as Web App
1. Click the blue **Deploy** button at the top right of the Apps Script editor.
2. Select **New deployment**.
3. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
4. Fill in the details:
   - **Description**: Poster Upload API
   - **Execute as**: `Me` (your email address)
   - **Who has access**: `Anyone` (this lets our frontend send data to it without requiring them to log in to Google).
5. Click **Deploy**.
6. Google will ask you to **Authorize access**. Click it, select your Google account, click **Advanced**, and then click **Go to Poster Uploader (unsafe)** to allow it to edit your Drive and Sheets.
7. Finally, you will be given a **Web app URL** (it looks like `https://script.google.com/macros/s/.../exec`).
8. **Copy this URL**.

## Step 4: Connect the Frontend
1. Open the frontend React code (specifically `src/App.jsx`).
2. Find the variable `const GOOGLE_SCRIPT_URL = "YOUR_SCRIPT_URL_HERE";`
3. Replace the placeholder string with the Web app URL you copied in Step 3.
4. Your complete system is now ready!
