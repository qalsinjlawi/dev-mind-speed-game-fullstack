const mysql = require('mysql2');

// إعدادات الاتصال
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // فارغة مع XAMPP
    port: 3306,
    database: 'game_db'
};

// إنشاء pool للاتصالات (أفضل من connection واحد)
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// تصدير pool للاستخدام في الملفات الأخرى
module.exports = pool.promise();