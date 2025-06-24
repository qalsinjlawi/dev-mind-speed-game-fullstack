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
   cd game-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start XAMPP and MySQL**
   - Open XAMPP Control Panel
   - Start MySQL service

4. **Setup Database**
   ```bash
   node database.js
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

6. **Server will run on**: `http://localhost:3000`

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

## 🧪 Testing

Use Postman to test the APIs:
1. Start a new game with POST /game/start
2. Submit answers with POST /game/{id}/submit
3. End the game with GET /game/{id}/end

## 📝 Notes

- The game is designed to be played entirely through API calls
- No frontend/UI is provided intentionally
- Each question is generated dynamically based on difficulty
- Timing is calculated automatically between questions
- Game state is persistent in MySQL database

## 👨‍💻 Author

Built for Circa Backend Developer Task