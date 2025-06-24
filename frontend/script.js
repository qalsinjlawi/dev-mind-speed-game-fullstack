// متغيرات اللعبة
let currentGameId = null;
let playerName = '';
let gameDifficulty = 1;

// عناصر DOM
const startPage = document.getElementById('startPage');
const gamePage = document.getElementById('gamePage');
const resultsPage = document.getElementById('resultsPage');

// Backend URL
const API_BASE_URL = 'http://localhost:3000';

// بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    // استمع لإرسال نموذج البداية
    document.getElementById('startForm').addEventListener('submit', startNewGame);
    
    // استمع لإرسال الإجابة
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
    
    // استمع لضغط Enter في مربع الإجابة
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
    
    // استمع لإنهاء اللعبة
    document.getElementById('endGame').addEventListener('click', endGame);
    
    // استمع للعب مرة أخرى
    document.getElementById('playAgain').addEventListener('click', playAgain);
});

// بدء لعبة جديدة
async function startNewGame(event) {
    event.preventDefault();
    
    // الحصول على بيانات النموذج
    playerName = document.getElementById('playerName').value;
    gameDifficulty = parseInt(document.getElementById('difficulty').value);
    
    if (!playerName || !gameDifficulty) {
        alert('يرجى ملء جميع الحقول!');
        return;
    }
    
    try {
        // إرسال طلب بدء اللعبة
        const response = await fetch(`${API_BASE_URL}/game/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playerName,
                difficulty: gameDifficulty
            })
        });
        
        if (!response.ok) {
            throw new Error('فشل في بدء اللعبة');
        }
        
        const data = await response.json();
        
        // حفظ معرف اللعبة
        currentGameId = extractGameId(data.submit_url);
        
        // تحديث واجهة صفحة اللعب
        document.getElementById('welcomeMessage').textContent = data.message;
        document.getElementById('gameLevel').textContent = gameDifficulty;
        document.getElementById('questionText').textContent = data.question + ' = ?';
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('answerInput').value = '';
        document.getElementById('result').textContent = '';
        document.getElementById('result').className = 'result';
        
        // الانتقال لصفحة اللعب
        showPage('gamePage');
        
        // التركيز على مربع الإجابة
        document.getElementById('answerInput').focus();
        
    } catch (error) {
        console.error('خطأ في بدء اللعبة:', error);
        alert('حدث خطأ في بدء اللعبة. تأكد من تشغيل الخادم!');
    }
}

// إرسال الإجابة
async function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const answer = parseFloat(answerInput.value);
    
    if (isNaN(answer)) {
        alert('يرجى إدخال رقم صحيح!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/game/${currentGameId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answer: answer
            })
        });
        
        if (!response.ok) {
            throw new Error('فشل في إرسال الإجابة');
        }
        
        const data = await response.json();
        
        // عرض النتيجة
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = data.result + ` (الوقت: ${data.time_taken} ثانية)`;
        
        if (data.result.includes('correct')) {
            resultDiv.className = 'result correct';
        } else {
            resultDiv.className = 'result incorrect';
        }
        
        // تحديث النقاط
        document.getElementById('currentScore').textContent = data.current_score;
        
        // عرض السؤال التالي
        if (data.next_question && data.next_question.question) {
            setTimeout(() => {
                document.getElementById('questionText').textContent = data.next_question.question + ' = ?';
                answerInput.value = '';
                resultDiv.textContent = '';
                resultDiv.className = 'result';
                answerInput.focus();
            }, 2000);
        }
        
    } catch (error) {
        console.error('خطأ في إرسال الإجابة:', error);
        alert('حدث خطأ في إرسال الإجابة!');
    }
}

// إنهاء اللعبة
async function endGame() {
    if (!currentGameId) {
        alert('لا توجد لعبة نشطة!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/game/${currentGameId}/end`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error('فشل في إنهاء اللعبة');
        }
        
        const data = await response.json();
        
        // عرض النتائج
        displayResults(data);
        
        // الانتقال لصفحة النتائج
        showPage('resultsPage');
        
    } catch (error) {
        console.error('خطأ في إنهاء اللعبة:', error);
        alert('حدث خطأ في إنهاء اللعبة!');
    }
}

// عرض النتائج
function displayResults(data) {
    document.getElementById('finalScore').textContent = data.current_score;
    document.getElementById('totalTime').textContent = data.total_time_spent + ' ثانية';
    
    if (data.best_score) {
        document.getElementById('bestTime').textContent = 
            `${data.best_score.question} = ${data.best_score.answer} (${data.best_score.time_taken}ث)`;
    } else {
        document.getElementById('bestTime').textContent = 'لا توجد إجابات صحيحة';
    }
    
    // عرض تاريخ الأسئلة
    const historyDiv = document.getElementById('gameHistory');
    historyDiv.innerHTML = '';
    
    if (data.history && data.history.length > 0) {
        data.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${item.is_correct ? 'correct' : 'incorrect'}`;
            
            historyItem.innerHTML = `
                <span>${index + 1}. ${item.question} = ${item.player_answer}</span>
                <span>${item.time_taken}ث ${item.is_correct ? '✅' : '❌'}</span>
            `;
            
            historyDiv.appendChild(historyItem);
        });
    } else {
        historyDiv.innerHTML = '<p style="text-align: center; color: #666;">لا توجد أسئلة في التاريخ</p>';
    }
}

// اللعب مرة أخرى
function playAgain() {
    currentGameId = null;
    showPage('startPage');
    
    // إعادة تعيين النموذج
    document.getElementById('startForm').reset();
    document.getElementById('playerName').focus();
}

// عرض صفحة معينة
function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // عرض الصفحة المطلوبة
    document.getElementById(pageId).classList.add('active');
}

// استخراج معرف اللعبة من الرابط
function extractGameId(submitUrl) {
    const matches = submitUrl.match(/\/game\/(\d+)\/submit/);
    return matches ? parseInt(matches[1]) : null;
}

// معالجة الأخطاء العامة
window.addEventListener('error', function(event) {
    console.error('خطأ في التطبيق:', event.error);
});