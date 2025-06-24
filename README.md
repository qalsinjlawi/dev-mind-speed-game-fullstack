# Dev Mind Speed Game API

A backend-based math speed game where players solve math equations by calling APIs. Built with Node.js, Express.js, and MySQL for the Circa Backend Developer Task.

## 📋 Overview

This API allows players to:
- Start a new math game with different difficulty levels
- Submit answers to math questions
- Track their performance and timing
- End the game and view comprehensive statistics

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL (via XAMPP)
- **Libraries**: mysql2, cors, dotenv, nodemon

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- XAMPP with MySQL running
- Postman (for testing)

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/qalsinjlawi/dev-mind-speed-game-api.git
   cd dev-mind-speed-game-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   Add the following content to `.env`:
   ```
   PORT=3000
   ```

4. **Start XAMPP and MySQL**
   - Open XAMPP Control Panel
   - Start MySQL service (must be running on port 3306)

5. **Setup Database**
   ```bash
   node database.js
   ```
   You should see:
   ```
   ✅ تم الاتصال بـ MySQL بنجاح!
   ✅ تم إنشاء قاعدة البيانات game_db بنجاح!
   ✅ تم إنشاء جدول games بنجاح!
   ✅ تم إنشاء جدول questions بنجاح!
   🎉 تم إعداد قاعدة البيانات بالكامل!
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   You should see:
   ```
   🚀 Dev Mind Speed Game API is running on port 3000
   📝 Test the API: http://localhost:3000
   ```

7. **Verify installation**
   Open your browser and go to: `http://localhost:3000`
   You should see the API welcome message.

## 📡 API Endpoints

### 1. Start New Game
**POST** `/game/start`

**Request Body:**
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

**Request Body:**
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

## 🎮 Difficulty Levels

| Level | Operands | Number Length | Operations |
|-------|----------|---------------|------------|
| 1     | 2        | 1 digit       | +, -, *, / |
| 2     | 3        | 2 digit       | +, -, *, / |
| 3     | 4        | 3 digit       | +, -, *, / |
| 4     | 5        | 4 digit       | +, -, *, / |

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

## 🧪 Testing with Postman

Import the provided Postman collection: `Dev Mind Speed Game API.postman_collection.json`

Or test manually:
1. **Start a new game**: POST `/game/start` with player name and difficulty
2. **Submit answers**: POST `/game/{id}/submit` with your answer
3. **End the game**: GET `/game/{id}/end` to view final results

### Sample Game Flow:
```bash
# 1. Start game
POST http://localhost:3000/game/start
Body: {"name": "John", "difficulty": 1}

# 2. Submit answer (use game_id from step 1)
POST http://localhost:3000/game/1/submit
Body: {"answer": 8}

# 3. Continue answering questions...

# 4. End game
GET http://localhost:3000/game/1/end
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Error connecting to database"**
   - Ensure XAMPP MySQL is running
   - Check if MySQL is running on port 3306

2. **"Port 3000 already in use"**
   - Change PORT in `.env` file to another port (e.g., 3001)
   - Or stop other applications using port 3000

3. **"node_modules not found"**
   - Run `npm install` in the project directory

4. **Database tables not created**
   - Run `node database.js` to create tables
   - Check XAMPP phpMyAdmin to verify database exists

## 📁 Project Structure

```
dev-mind-speed-game-api/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── database.js                   # Database setup script
├── db.js                         # Database connection
├── gameLogic.js                  # Math question generation
├── package.json                  # Project dependencies
├── README.md                     # This file
├── server.js                     # Main server file
└── Dev Mind Speed Game API.postman_collection.json
```

## 📝 Notes

- The game is designed to be played entirely through API calls
- No frontend/UI is provided intentionally
- Each question is generated dynamically based on difficulty
- Timing is calculated automatically between questions
- Game state is persistent in MySQL database
- Environment variables are used for configuration

## 👨‍💻 Author

Built for Circa Backend Developer Task

**Contact**: For questions about this implementation, please refer to the task requirements or test the API using the provided Postman collection.