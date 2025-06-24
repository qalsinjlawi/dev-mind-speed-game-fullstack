const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// استيراد الملفات المطلوبة
const db = require('./db');
const { generateQuestion } = require('./gameLogic');

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Dev Mind Speed Game API',
        version: '1.0.0',
        endpoints: [
            'POST /game/start - Start a new game',
            'POST /game/:id/submit - Submit an answer', 
            'GET /game/:id/end - End the game and get results'
        ],
        author: 'Built for Circa Task',
        description: 'A math speed game API where players solve equations through API calls'
    });
});

// API بدء لعبة جديدة
app.post('/game/start', async (req, res) => {
    try {
        const { name, difficulty } = req.body;
        
        // التحقق من صحة البيانات
        if (!name || !difficulty) {
            return res.status(400).json({
                error: 'Name and difficulty are required'
            });
        }
        
        if (difficulty < 1 || difficulty > 4) {
            return res.status(400).json({
                error: 'Difficulty must be between 1 and 4'
            });
        }
        
        // إنشاء لعبة جديدة في قاعدة البيانات
        const insertGameQuery = `
            INSERT INTO games (player_name, difficulty, status) 
            VALUES (?, ?, 'active')
        `;
        
        const [result] = await db.execute(insertGameQuery, [name, difficulty]);
        const gameId = result.insertId;
        
        // توليد السؤال الأول
        const firstQuestion = generateQuestion(difficulty);
        
        // حفظ السؤال الأول في قاعدة البيانات
        const insertQuestionQuery = `
            INSERT INTO questions (game_id, question_text, correct_answer, question_order) 
            VALUES (?, ?, ?, 1)
        `;
        
        await db.execute(insertQuestionQuery, [
            gameId, 
            firstQuestion.question, 
            firstQuestion.answer
        ]);
        
        // إرجاع الاستجابة
        res.json({
            message: `Hello ${name}, find your submit API URL below`,
            submit_url: `http://localhost:3000/game/${gameId}/submit`,
            question: firstQuestion.question,
            time_started: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error starting game:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// API إرسال إجابة
app.post('/game/:id/submit', async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const { answer } = req.body;
        
        // التحقق من صحة البيانات
        if (answer === undefined || answer === null) {
            return res.status(400).json({
                error: 'Answer is required'
            });
        }
        
        // التحقق من وجود اللعبة وحالتها
        const gameQuery = `
            SELECT * FROM games WHERE game_id = ? AND status = 'active'
        `;
        const [games] = await db.execute(gameQuery, [gameId]);
        
        if (games.length === 0) {
            return res.status(404).json({
                error: 'Game not found or already ended'
            });
        }
        
        const game = games[0];
        
        // الحصول على آخر سؤال بدون إجابة
        const questionQuery = `
            SELECT * FROM questions 
            WHERE game_id = ? AND player_answer IS NULL 
            ORDER BY question_order DESC 
            LIMIT 1
        `;
        const [questions] = await db.execute(questionQuery, [gameId]);
        
        if (questions.length === 0) {
            return res.status(400).json({
                error: 'No pending question found'
            });
        }
        
        const currentQuestion = questions[0];
        
        // حساب الوقت المستغرق
        const timeTaken = (new Date() - new Date(currentQuestion.created_at)) / 1000;
        
        // التحقق من صحة الإجابة
        const isCorrect = Math.abs(parseFloat(answer) - currentQuestion.correct_answer) < 0.01;
        
        // تحديث السؤال بالإجابة
        const updateQuestionQuery = `
            UPDATE questions 
            SET player_answer = ?, time_taken = ?, is_correct = ? 
            WHERE question_id = ?
        `;
        await db.execute(updateQuestionQuery, [
            parseFloat(answer), 
            timeTaken, 
            isCorrect, 
            currentQuestion.question_id
        ]);
        
        // توليد السؤال التالي
        const nextQuestion = generateQuestion(game.difficulty);
        const nextQuestionOrder = currentQuestion.question_order + 1;
        
        // حفظ السؤال التالي
        const insertNextQuestionQuery = `
            INSERT INTO questions (game_id, question_text, correct_answer, question_order) 
            VALUES (?, ?, ?, ?)
        `;
        await db.execute(insertNextQuestionQuery, [
            gameId, 
            nextQuestion.question, 
            nextQuestion.answer, 
            nextQuestionOrder
        ]);
        
        // حساب النقاط الحالية
        const scoreQuery = `
            SELECT 
                COUNT(*) as total_questions,
                SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers
            FROM questions 
            WHERE game_id = ? AND player_answer IS NOT NULL
        `;
        const [scoreResult] = await db.execute(scoreQuery, [gameId]);
        const currentScore = scoreResult[0].correct_answers / scoreResult[0].total_questions;
        
        // إرجاع الاستجابة
        res.json({
            result: isCorrect ? 
                `Good job ${game.player_name}, your answer is correct!` : 
                `Sorry ${game.player_name}, your answer is incorrect.`,
            time_taken: parseFloat(timeTaken.toFixed(2)),
            next_question: {
                submit_url: `http://localhost:3000/game/${gameId}/submit`,
                question: nextQuestion.question
            },
            current_score: parseFloat(currentScore.toFixed(2))
        });
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// API إنهاء اللعبة
app.get('/game/:id/end', async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        
        // الحصول على معلومات اللعبة
        const gameQuery = `SELECT * FROM games WHERE game_id = ?`;
        const [games] = await db.execute(gameQuery, [gameId]);
        
        if (games.length === 0) {
            return res.status(404).json({
                error: 'Game not found'
            });
        }
        
        const game = games[0];
        
        // تحديث حالة اللعبة إلى منتهية
        const updateGameQuery = `UPDATE games SET status = 'ended', end_time = NOW() WHERE game_id = ?`;
        await db.execute(updateGameQuery, [gameId]);
        
        // الحصول على جميع الأسئلة المُجابة
        const questionsQuery = `
            SELECT 
                question_text, 
                correct_answer, 
                player_answer, 
                time_taken, 
                is_correct,
                question_order
            FROM questions 
            WHERE game_id = ? AND player_answer IS NOT NULL
            ORDER BY question_order ASC
        `;
        const [questions] = await db.execute(questionsQuery, [gameId]);
        
        // حساب الإحصائيات
        const totalQuestions = questions.length;
        const correctAnswers = questions.filter(q => q.is_correct === 1).length;
        
        // حساب الوقت الإجمالي بحذر
        let totalTime = 0;
        questions.forEach(q => {
            if (q.time_taken && !isNaN(q.time_taken)) {
                totalTime += parseFloat(q.time_taken);
            }
        });
        
        // العثور على أسرع إجابة صحيحة
        const correctQuestions = questions.filter(q => q.is_correct === 1);
        let bestQuestion = null;
        
        if (correctQuestions.length > 0) {
            bestQuestion = correctQuestions.reduce((best, current) => {
                const currentTime = parseFloat(current.time_taken) || 0;
                const bestTime = parseFloat(best.time_taken) || 0;
                return currentTime < bestTime ? current : best;
            });
        }
        
        // إرجاع الاستجابة
        res.json({
            name: game.player_name,
            difficulty: game.difficulty,
            current_score: `${correctAnswers}/${totalQuestions}`,
            total_time_spent: parseFloat(totalTime.toFixed(2)),
            best_score: bestQuestion ? {
                question: bestQuestion.question_text,
                answer: parseFloat(bestQuestion.correct_answer),
                time_taken: parseFloat(bestQuestion.time_taken || 0)
            } : null,
            history: questions.map(q => ({
                question: q.question_text,
                correct_answer: parseFloat(q.correct_answer || 0),
                player_answer: parseFloat(q.player_answer || 0),
                time_taken: parseFloat(q.time_taken || 0),
                is_correct: Boolean(q.is_correct)
            }))
        });
        
    } catch (error) {
        console.error('Error ending game:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Dev Mind Speed Game API is running on port ${PORT}`);
    console.log(`📝 Test the API: http://localhost:${PORT}`);
});