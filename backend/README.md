# Third Eye Backend - Bolpatra Syncer

The core logic for fetching, processing, and storing government tender data.

## 🛠 Tech Stack
- **Node.js & Express**
- **MongoDB Atlas** with Mongoose
- **Node-Cron** for automated hourly synchronization
- **Axios** for high-reliability API requests

## ⚙️ Configuration
Create a `.env` file with:
```env
MONGODB_URI=your_mongodb_atlas_uri
BOLPATRA_API_BASE_URL=https://admin.bolpatranepal.com/api/v1/tender_notice
PORT=5000
```

## 🚥 API Endpoints
- `GET /api/tenders?page=1&limit=20`: Get paginated tenders.
- `GET /debug-db`: Check database connectivity and item count.

## 🏃 Run
```bash
npm install
npm run dev
```
