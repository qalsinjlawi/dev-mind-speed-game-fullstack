// Game variables
let currentGameId = null;
let playerName = '';
let gameDifficulty = 1;

// DOM elements
const startPage = document.getElementById('startPage');
const gamePage = document.getElementById('gamePage');
const resultsPage = document.getElementById('resultsPage');

// Backend URL
const API_BASE_URL = 'http://localhost:3000';

// Start the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form listeners
    document.getElementById('startForm').addEventListener('submit', startNewGame);
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
    document.getElementById('endGame').addEventListener('click', endGame);
    document.getElementById('playAgain').addEventListener('click', playAgain);
});

// Start a new game
async function startNewGame(event) {
    event.preventDefault();
    
    // Get form data
    playerName = document.getElementById('playerName').value.trim();
    gameDifficulty = parseInt(document.getElementById('difficulty').value);
    
    if (!playerName || !gameDifficulty) {
        showError('Please fill in all fields!', 'startPage');
        return;
    }
    
    try {
        // Disable start button during request
        const startButton = document.querySelector('#startForm button');
        startButton.disabled = true;
        startButton.textContent = 'Starting...';

        // Send start game request
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
            throw new Error(`Failed to start game: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Save game ID
        currentGameId = extractGameId(data.submit_url);
        
        // Update game page interface
        document.getElementById('welcomeMessage').textContent = `Welcome, ${playerName}!`;
        document.getElementById('gameLevel').textContent = gameDifficulty;
        document.getElementById('questionText').textContent = data.question + ' = ?';
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('answerInput').value = '';
        document.getElementById('result').textContent = '';
        document.getElementById('result').className = 'result';
        
        // Switch to game page with animation
        showPage('gamePage');
        
        // Focus on answer input
        document.getElementById('answerInput').focus();
        
    } catch (error) {
        console.error('Error starting game:', error);
        showError('Failed to start the game. Please ensure the server is running!', 'startPage');
    } finally {
        // Re-enable start button
        const startButton = document.querySelector('#startForm button');
        startButton.disabled = false;
        startButton.textContent = '🚀 Start Challenge';
    }
}

// Submit answer
async function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const answer = parseFloat(answerInput.value);
    
    if (isNaN(answer)) {
        showError('Please enter a valid number!', 'gamePage');
        return;
    }
    
    try {
        // Disable submit button during request
        const submitButton = document.getElementById('submitAnswer');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

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
            throw new Error(`Failed to submit answer: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Display result
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = `${data.result} (Time: ${data.time_taken}s)`;
        
        if (data.result.includes('correct')) {
            resultDiv.className = 'result correct';
        } else {
            resultDiv.className = 'result incorrect';
        }
        
        // Update score
        document.getElementById('currentScore').textContent = data.current_score.toFixed(2);
        
        // Display next question with a smooth transition
        if (data.next_question && data.next_question.question) {
            setTimeout(() => {
                document.getElementById('questionText').classList.add('fade-out');
                setTimeout(() => {
                    document.getElementById('questionText').textContent = data.next_question.question + ' = ?';
                    document.getElementById('questionText').classList.remove('fade-out');
                    document.getElementById('questionText').classList.add('fade-in');
                    answerInput.value = '';
                    resultDiv.textContent = '';
                    resultDiv.className = 'result';
                    answerInput.focus();
                }, 500);
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        showError('Failed to submit the answer!', 'gamePage');
    } finally {
        // Re-enable submit button
        const submitButton = document.getElementById('submitAnswer');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Answer';
    }
}

// End game
async function endGame() {
    if (!currentGameId) {
        showError('No active game!', 'gamePage');
        return;
    }
    
    try {
        // Disable end button during request
        const endButton = document.getElementById('endGame');
        endButton.disabled = true;
        endButton.textContent = 'Ending...';

        const response = await fetch(`${API_BASE_URL}/game/${currentGameId}/end`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to end game: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Display results
        displayResults(data);
        
        // Switch to results page
        showPage('resultsPage');
        
    } catch (error) {
        console.error('Error ending game:', error);
        showError('Failed to end the game!', 'gamePage');
    } finally {
        // Re-enable end button
        const endButton = document.getElementById('endGame');
        endButton.disabled = false;
        endButton.textContent = 'End Game';
    }
}

// Display results
function displayResults(data) {
    document.getElementById('finalScore').textContent = data.current_score;
    document.getElementById('totalTime').textContent = data.total_time_spent + ' seconds';
    
    if (data.best_score) {
        document.getElementById('bestTime').textContent = 
            `${data.best_score.question} = ${data.best_score.answer} (${data.best_score.time_taken}s)`;
    } else {
        document.getElementById('bestTime').textContent = 'No correct answers';
    }
    
    // Display question history
    const historyDiv = document.getElementById('gameHistory');
    historyDiv.innerHTML = '';
    
    if (data.history && data.history.length > 0) {
        data.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${item.is_correct ? 'correct' : 'incorrect'}`;
            
            historyItem.innerHTML = `
                <span>${index + 1}. ${item.question} = ${item.player_answer}</span>
                <span>${item.time_taken}s ${item.is_correct ? '✅' : '❌'}</span>
            `;
            
            historyDiv.appendChild(historyItem);
        });
    } else {
        historyDiv.innerHTML = '<p style="text-align: center; color: #666;">No questions in history</p>';
    }
}

// Play again
function playAgain() {
    currentGameId = null;
    showPage('startPage');
    
    // Reset form
    document.getElementById('startForm').reset();
    document.getElementById('playerName').focus();
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    document.getElementById(pageId).classList.add('active');
}

// Extract game ID from URL
function extractGameId(submitUrl) {
    const matches = submitUrl.match(/\/game\/(\d+)\/submit/);
    return matches ? parseInt(matches[1]) : null;
}

// Show error message
function showError(message, pageId) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector(`#${pageId} .container`);
    container.prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => errorDiv.remove(), 500);
    }, 3000);
}

// General error handling
window.addEventListener('error', function(event) {
    console.error('Circa Dev Mind Speed Game - Application error:', event.error);
});