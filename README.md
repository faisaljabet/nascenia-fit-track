# Nascenia FitTrack - Team Fitness Progress Dashboard

Nascenia FitTrack is a modern, responsive, glassmorphic dashboard tracking team weight loss, weekly weight loss winners, and individual trends.

---

## 📊 Google Sheets Dynamic Integration

The application supports pulling data dynamically from a public Google Sheet. This allows you to update weights directly from your spreadsheet without having to commit changes to GitHub or redeploy your Netlify site.

### 1. Spreadsheet Setup
1. Create a Google Spreadsheet.
2. Rename the first sheet to **`members`**.
3. Import/upload the `members.csv` generated in the root of this project (**File > Import > Upload** and choose "Replace current sheet").
4. Add a second tab/sheet and rename it to **`weights`**.
5. Import/upload the `weights.csv` generated in the root of this project (**File > Import > Upload** and choose "Replace current sheet").
6. Click **Share** (top-right) -> Under General Access, change "Restricted" to **"Anyone with the link"** (Viewer role is sufficient).

### 2. Add spreadsheet ID to Environment Variables
Copy the spreadsheet ID from the URL (the long alphanumeric code between `/d/` and `/edit` in your browser URL).

* **For Local Development:**
  Create a `.env` file in the root of this project:
  ```env
  VITE_SPREADSHEET_ID=your_spreadsheet_id_here
  ```

* **For Netlify Deployment:**
  1. Go to your site dashboard on Netlify.
  2. Go to **Site Configuration** > **Environment variables**.
  3. Add a new variable:
     - **Key:** `VITE_SPREADSHEET_ID`
     - **Value:** `your_spreadsheet_id_here`
  4. Trigger a new deploy.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (version 20+ recommended)

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🔄 Updating Data

To log new weights:
1. Open your Google Sheet.
2. Go to the **`weights`** sheet.
3. Add a new column with the date (format: `YYYY-MM-DD`, e.g., `2026-07-27`) in row 1.
4. Input the weights for each member in their corresponding row.
5. Refresh your FitTrack page! The changes will load instantly and the status indicator in the header will show **LIVE SYNC**.

*Note: If the network request fails, or `VITE_SPREADSHEET_ID` is not set, the app will automatically fall back to using the static data in `src/data/members.json` and `src/data/weights.json`.*

