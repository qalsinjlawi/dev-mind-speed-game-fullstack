const mysql = require('mysql2');

// إعدادات الاتصال بقاعدة البيانات
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // فارغة مع XAMPP
    port: 3306,
    database: 'game_db' // إضافة اسم قاعدة البيانات
};

// إنشاء اتصال
const connection = mysql.createConnection(dbConfig);

// اختبار الاتصال
connection.connect((err) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err);
        return;
    }
    console.log('✅ تم الاتصال بـ MySQL بنجاح!');
    
    // إنشاء الجداول
    createTables();
});

// دالة إنشاء الجداول
function createTables() {
    // جدول الألعاب
    const gamesTable = `
        CREATE TABLE IF NOT EXISTS games (
            game_id INT AUTO_INCREMENT PRIMARY KEY,
            player_name VARCHAR(100) NOT NULL,
            difficulty INT NOT NULL,
            start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_time TIMESTAMP NULL,
            status ENUM('active', 'ended') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    connection.query(gamesTable, (err, result) => {
        if (err) {
            console.error('خطأ في إنشاء جدول games:', err);
            return;
        }
        console.log('✅ تم إنشاء جدول games بنجاح!');
        
        // إنشاء جدول الأسئلة
        createQuestionsTable();
    });
}

// دالة إنشاء جدول الأسئلة
function createQuestionsTable() {
    const questionsTable = `
        CREATE TABLE IF NOT EXISTS questions (
            question_id INT AUTO_INCREMENT PRIMARY KEY,
            game_id INT NOT NULL,
            question_text VARCHAR(255) NOT NULL,
            correct_answer DECIMAL(10,2) NOT NULL,
            player_answer DECIMAL(10,2) NULL,
            time_taken DECIMAL(5,2) NULL,
            is_correct BOOLEAN NULL,
            question_order INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
        )
    `;
    
    connection.query(questionsTable, (err, result) => {
        if (err) {
            console.error('خطأ في إنشاء جدول questions:', err);
            return;
        }
        console.log('✅ تم إنشاء جدول questions بنجاح!');
        console.log('🎉 تم إعداد قاعدة البيانات بالكامل!');
        
        // إغلاق الاتصال
        connection.end();
    });
}