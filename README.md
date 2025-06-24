# Dev Mind Speed Game - Full-Stack

A complete full-stack math speed game where players solve math equations through a beautiful web interface or direct API calls. Built with Node.js, Express.js, MySQL backend and vanilla HTML/CSS/JavaScript frontend.

## 📋 Overview

This full-stack application allows players to:
- Play through an intuitive web interface
- Start math games with different difficulty levels (1-4)
- Submit answers and get real-time feedback
- Track performance, timing, and statistics
- View comprehensive game results and history
- Alternative API-only gameplay via Postman

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MySQL (via XAMPP)
- **Libraries**: mysql2, cors, dotenv, nodemon

### Frontend
- **UI**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Responsive design with CSS Grid/Flexbox
- **API Communication**: Fetch API
- **Features**: Real-time game interface, animated transitions

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- XAMPP with MySQL running
- Modern web browser
- Postman (optional, for API testing)

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/qalsinjlawi/dev-mind-speed-game-fullstack.git
   cd dev-mind-speed-game-fullstack
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   Create `backend/.env`:
   ```bash
   PORT=3000
   ```

4. **Start XAMPP and MySQL**
   - Open XAMPP Control Panel
   - Start MySQL service (port 3306)

5. **Setup Database**
   ```bash
   # In backend directory
   node database.js
   ```
   Expected output:
   ```
   ✅ تم الاتصال بـ MySQL بنجاح!
   ✅ تم إنشاء قاعدة البيانات game_db بنجاح!
   ✅ تم إنشاء جدول games بنجاح!
   ✅ تم إنشاء جدول questions بنجاح!
   🎉 تم إعداد قاعدة البيانات بالكامل!
   ```

6. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Expected output:
   ```
   🚀 Dev Mind Speed Game API is running on port 3000
   📝 Test the API: http://localhost:3000
   ```

7. **Launch Frontend**
   - Open `frontend/index.html` in your web browser
   - Or serve it with a local server for better experience

## 🎮 How to Play

### Web Interface (Recommended)
1. Open `frontend/index.html` in your browser
2. Enter your name and select difficulty level (1-4)
3. Click "ابدأ اللعبة" (Start Game)
4. Solve math questions as fast as you can
5. Click "إنهاء اللعبة" (End Game) when ready
6. View your comprehensive results and statistics

### API Interface (Advanced)
Use Postman or any API client to interact directly with the backend APIs.

## 🎯 Difficulty Levels

| Level | Operands | Number Length | Operations | Example |
|-------|----------|---------------|------------|---------|
| 1     | 2        | 1 digit       | +, -, *, / | `5 + 3` |
| 2     | 3        | 2 digit       | +, -, *, / | `23 + 45 - 12` |
| 3     | 4        | 3 digit       | +, -, *, / | `234 + 567 * 123 / 89` |
| 4     | 5        | 4 digit       | +, -, *, / | `1234 + 5678 - 2341 * 987 / 456` |

## 📡 API Endpoints

### 1. Start New Game
**POST** `/game/start`

**Request:**
```json
{
    "name": "Player Name",
    "difficulty": 1
}
```

**Response:**
```json
{
    "message": "Hello Player Name, find your submit API URL below",
    "submit_url": "http://localhost:3000/game/1/submit",
    "question": "5 + 3",
    "time_started": "2025-06-24T18:02:13.256Z"
}
```

### 2. Submit Answer
**POST** `/game/{game_id}/submit`

**Request:**
```json
{
    "answer": 8
}
```

**Response:**
```json
{
    "result": "Good job Player Name, your answer is correct!",
    "time_taken": 15.23,
    "next_question": {
        "submit_url": "http://localhost:3000/game/1/submit",
        "question": "6 * 2"
    },
    "current_score": 1.0
}
```

### 3. End Game
**GET** `/game/{game_id}/end`

**Response:**
```json
{
    "name": "Player Name",
    "difficulty": 1,
    "current_score": "5/7",
    "total_time_spent": 145.67,
    "best_score": {
        "question": "5 + 3",
        "answer": 8,
        "time_taken": 12.34
    },
    "history": [...]
}
```

## 🗄️ Database Schema

### Games Table
- `game_id` (Primary Key)
- `player_name` (VARCHAR)
- `difficulty` (INT)
- `start_time` (TIMESTAMP)
- `end_time` (TIMESTAMP)
- `status` (ENUM: active/ended)

### Questions Table
- `question_id` (Primary Key)
- `game_id` (Foreign Key)
- `question_text` (VARCHAR)
- `correct_answer` (DECIMAL)
- `player_answer` (DECIMAL)
- `time_taken` (DECIMAL)
- `is_correct` (BOOLEAN)
- `question_order` (INT)

## 📁 Project Structure

```
dev-mind-speed-game-fullstack/
├── README.md                     # This file
├── .gitignore                    # Git ignore rules
├── backend/                      # Backend API
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server file
│   ├── database.js               # Database setup script
│   ├── db.js                     # Database connection
│   ├── gameLogic.js              # Math question generation
│   ├── package.json              # Backend dependencies                # Backend-specific docs
│   └── Dev Mind Speed Game API.postman_collection.json
└── frontend/                     # Frontend Web App
    ├── index.html                # Main HTML file
    ├── style.css                 # Styling and responsive design
    └── script.js                 # Frontend logic and API communication
```

## 🧪 Testing

### Frontend Testing
1. Open `frontend/index.html` in your browser
2. Test the complete game flow through the web interface
3. Verify responsive design on different screen sizes

### API Testing with Postman
Import `backend/Dev Mind Speed Game API.postman_collection.json` and test:

1. **Start a new game**: POST `/game/start`
2. **Submit answers**: POST `/game/{id}/submit`
3. **End the game**: GET `/game/{id}/end`

### Sample API Game Flow:
```bash
# 1. Start game
POST http://localhost:3000/game/start
Body: {"name": "John", "difficulty": 1}

# 2. Submit answer
POST http://localhost:3000/game/1/submit
Body: {"answer": 8}

# 3. End game
GET http://localhost:3000/game/1/end
```

## 🔧 Troubleshooting

### Backend Issues:
1. **Database connection errors**
   - Ensure XAMPP MySQL is running on port 3306
   - Verify database credentials in backend code

2. **Port conflicts**
   - Change PORT in `backend/.env` if port 3000 is occupied
   - Update frontend API_BASE_URL in `script.js` accordingly

3. **Missing dependencies**
   - Run `npm install` in the backend directory

### Frontend Issues:
1. **CORS errors**
   - Ensure backend CORS is properly configured
   - Access frontend via `file://` or local server

2. **API connection failures**
   - Verify backend is running on correct port
   - Check browser console for detailed error messages

## 💡 Features

### Web Interface Features:
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Instant response to answers
- **Beautiful UI**: Modern gradient design with smooth animations
- **Arabic/English Support**: RTL layout with bilingual interface
- **Game Statistics**: Comprehensive results and history tracking
- **Keyboard Support**: Enter key for quick answer submission

### Backend Features:
- **RESTful API**: Clean, documented API endpoints
- **Real-time Scoring**: Dynamic score calculation
- **Performance Tracking**: Time measurement for each question
- **Data Persistence**: MySQL database storage
- **Error Handling**: Comprehensive error responses
- **Input Validation**: Secure parameter validation

## 🚀 Deployment Options

### Local Development:
- Backend: `npm run dev` in backend directory
- Frontend: Open `index.html` in browser

### Production Deployment:
- Backend: Deploy to services like Heroku, DigitalOcean
- Frontend: Deploy to GitHub Pages, Netlify, or Vercel
- Database: Use managed MySQL services like PlanetScale

## 📝 Original Task Compliance

This project fulfills the original Circa Backend Developer Task requirements:
- ✅ Backend API with all required endpoints
- ✅ MySQL database integration
- ✅ Math equation generation by difficulty
- ✅ Game session and performance tracking
- ✅ Postman collection included
- ✅ Comprehensive documentation

**Additional Enhancement**: Added a beautiful web frontend for enhanced user experience while maintaining full API compatibility.

## 👨‍💻 Author

**Full-Stack Development**: Built for Circa Backend Developer Task with additional frontend enhancement

**Backend**: Node.js + Express.js + MySQL  
**Frontend**: HTML5 + CSS3 + Vanilla JavaScript  
**APIs**: RESTful design with comprehensive documentation