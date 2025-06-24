// دالة توليد رقم عشوائي حسب عدد الخانات
function generateRandomNumber(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// دالة توليد عملية رياضية عشوائية
function getRandomOperation() {
    const operations = ['+', '-', '*', '/'];
    return operations[Math.floor(Math.random() * operations.length)];
}

// دالة توليد سؤال رياضي حسب مستوى الصعوبة
function generateQuestion(difficulty) {
    let numOperands, digitLength;
    
    // تحديد المعايير حسب مستوى الصعوبة
    switch(difficulty) {
        case 1:
            numOperands = 2;
            digitLength = 1;
            break;
        case 2:
            numOperands = 3;
            digitLength = 2;
            break;
        case 3:
            numOperands = 4;
            digitLength = 3;
            break;
        case 4:
            numOperands = 5;
            digitLength = 4;
            break;
        default:
            numOperands = 2;
            digitLength = 1;
    }
    
    // توليد الأرقام والعمليات
    let question = '';
    let numbers = [];
    let operations = [];
    
    // توليد الأرقام
    for(let i = 0; i < numOperands; i++) {
        numbers.push(generateRandomNumber(digitLength));
    }
    
    // توليد العمليات
    for(let i = 0; i < numOperands - 1; i++) {
        operations.push(getRandomOperation());
    }
    
    // بناء السؤال
    question = numbers[0].toString();
    for(let i = 0; i < operations.length; i++) {
        question += ` ${operations[i]} ${numbers[i + 1]}`;
    }
    
    // حساب الإجابة الصحيحة
    const correctAnswer = eval(question);
    
    return {
        question: question,
        answer: Math.round(correctAnswer * 100) / 100 // تقريب لرقمين عشريين
    };
}

module.exports = {
    generateQuestion
};