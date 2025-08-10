// Main JavaScript for Quiz Game Application

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');

const playerNameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const reviewBtn = document.getElementById('review-btn');
const retakeBtn = document.getElementById('retake-btn');
const backToResultsBtn = document.getElementById('back-to-results-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const difficultyOptions = document.querySelectorAll('.difficulty-option');

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const timeRemainingSpan = document.getElementById('time-remaining');
const progressFill = document.querySelector('.progress-fill');
const hintBtn = document.getElementById('hint-btn');
const difficultyBadge = document.getElementById('difficulty-badge');

const resultNameSpan = document.getElementById('result-name');
const scoreSpan = document.getElementById('score');
const maxScoreSpan = document.getElementById('max-score');
const trophyImg = document.getElementById('trophy-img');
const reviewContainer = document.getElementById('review-container');
const confettiContainer = document.getElementById('confetti-container');

// Audio Elements
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const completeSound = document.getElementById('complete-sound');
const hintSound = new Audio('assets/audio/hint.mp3'); // Will use click sound if hint.mp3 doesn't exist

// Quiz State
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = '';
let userAnswers = [];
let timer;
let timeLeft;
let selectedDifficulty = 'mixed'; // Default difficulty
const timePerQuestion = 30; // seconds
const hintsUsed = []; // Track which questions had hints used

// Initialize the application
function init() {
    // Set event listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', goToNextQuestion);
    reviewBtn.addEventListener('click', showReviewScreen);
    retakeBtn.addEventListener('click', retakeQuiz);
    backToResultsBtn.addEventListener('click', showResultsScreen);
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Set up difficulty selection
    difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            difficultyOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to selected option
            option.classList.add('active');
            // Set selected difficulty
            selectedDifficulty = option.getAttribute('data-difficulty');
        });
    });
    
    // Disable next button initially
    nextBtn.disabled = true;
    
    // Set total questions count (will be updated based on difficulty)
    totalQuestionsSpan.textContent = quizQuestions.length;
    maxScoreSpan.textContent = quizQuestions.length;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('quizTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Only process shortcuts when quiz is active
    const isQuizActive = quizScreen.classList.contains('active');
    const isWelcomeActive = welcomeScreen.classList.contains('active');
    
    if (isWelcomeActive && event.key === 'Enter') {
        // Start quiz when Enter is pressed on welcome screen
        startQuiz();
    } else if (isQuizActive) {
        switch (event.key) {
            case 'F1': // Press F1 for hint (using function key instead of letter)
                if (!hintBtn.disabled) {
                    showHint(currentQuestions[currentQuestionIndex]);
                }
                break;
            case 'ArrowRight': // Press right arrow key for next question
                if (!nextBtn.disabled) {
                    goToNextQuestion();
                }
                break;
            case '1': case '2': case '3': case '4': // Number keys for options
                const currentQuestion = currentQuestions[currentQuestionIndex];
                if (currentQuestion.type === 'single' && currentQuestion.options.length >= parseInt(event.key)) {
                    const optionIndex = parseInt(event.key) - 1;
                    const optionElements = document.querySelectorAll('.option');
                    if (optionElements[optionIndex]) {
                        optionElements[optionIndex].click();
                    }
                }
                break;
        }
    }
}

// Start the quiz
function startQuiz() {
    // Validate player name
    if (!playerNameInput.value.trim()) {
        alert('Please enter your name to start the quiz!');
        return;
    }
    
    // Set player name
    playerName = playerNameInput.value.trim();
    
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    hintsUsed.length = 0;
    
    // Get questions based on selected difficulty
    if (selectedDifficulty === 'easy') {
        currentQuestions = getQuestionsByDifficulty('easy');
    } else if (selectedDifficulty === 'medium') {
        currentQuestions = getQuestionsByDifficulty('medium');
    } else if (selectedDifficulty === 'hard') {
        currentQuestions = getQuestionsByDifficulty('hard');
    } else {
        // Mixed difficulty - get a balanced distribution
        currentQuestions = getQuestionsByDistribution(3, 4, 3); // 3 easy, 4 medium, 3 hard
    }
    
    // Update total questions count
    totalQuestionsSpan.textContent = currentQuestions.length;
    maxScoreSpan.textContent = currentQuestions.length;
    
    // Hide welcome screen and show quiz screen
    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    // Load first question
    loadQuestion();
}

// Load current question
function loadQuestion() {
    // Clear previous question
    questionContainer.innerHTML = '';
    optionsContainer.innerHTML = '';
    
    // Get current question with shuffled options
    const currentQuestion = getQuestionWithShuffledOptions(currentQuestions[currentQuestionIndex]);
    
    // Store the shuffled question back in the array for review screen
    currentQuestions[currentQuestionIndex] = currentQuestion;
    
    // Update progress
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progressPercentage = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Update difficulty badge
    difficultyBadge.textContent = currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1);
    difficultyBadge.className = ''; // Clear previous classes
    difficultyBadge.classList.add(currentQuestion.difficulty);
    
    // Create question element
    const questionElement = document.createElement('div');
    questionElement.classList.add('question-text');
    questionElement.textContent = currentQuestion.question;
    questionContainer.appendChild(questionElement);
    
    // Add image if present
    if (currentQuestion.imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.src = currentQuestion.imageUrl;
        imageElement.alt = 'Question Image';
        imageElement.classList.add('question-image');
        questionContainer.appendChild(imageElement);
    }
    
    // Create options based on question type
    if (currentQuestion.type === 'single') {
        createSingleChoiceOptions(currentQuestion);
    } else if (currentQuestion.type === 'multi') {
        createMultiChoiceOptions(currentQuestion);
    } else if (currentQuestion.type === 'fill') {
        createFillBlankOption();
    }
    
    // Reset and start timer
    resetTimer();
    
    // Reset hint button
    hintBtn.disabled = hintsUsed.includes(currentQuestionIndex);
    hintBtn.title = hintsUsed.includes(currentQuestionIndex) ? 
        'Hint already used' : 'Get a hint (reduces points)';
    
    // Add hint button event listener
    hintBtn.onclick = () => showHint(currentQuestion);
    
    // Disable next button until an answer is selected
    nextBtn.disabled = true;
}

// Show hint for current question
function showHint(question) {
    // Mark hint as used for this question
    hintsUsed.push(currentQuestionIndex);
    
    // Play hint sound
    try {
        hintSound.play();
    } catch (error) {
        // Fallback if hint sound fails
        console.log('Hint sound failed to play');
    }
    
    // Disable hint button
    hintBtn.disabled = true;
    hintBtn.title = 'Hint already used';
    
    // Create hint element
    const hintElement = document.createElement('div');
    hintElement.classList.add('hint-box');
    hintElement.classList.add('fadeIn'); // Add animation class
    
    let hintText = '';
    
    // Generate hint based on question type
    if (question.type === 'single') {
        // Eliminate two wrong options
        const wrongOptions = [];
        for (let i = 0; i < question.options.length; i++) {
            if (i !== question.correctAnswer) {
                wrongOptions.push(i);
            }
        }
        
        // Randomly select two wrong options to eliminate
        const shuffledWrong = shuffleArray(wrongOptions);
        const eliminatedOptions = shuffledWrong.slice(0, Math.min(2, shuffledWrong.length));
        
        hintText = `Hint: The answer is NOT ${eliminatedOptions.map(idx => question.options[idx]).join(' or ')}.`;
        
        // Visually mark eliminated options
        eliminatedOptions.forEach(idx => {
            const optionElement = document.querySelectorAll('.option')[idx];
            if (optionElement) {
                optionElement.classList.add('eliminated');
                // Add animation
                optionElement.classList.add('shake');
                setTimeout(() => {
                    optionElement.classList.remove('shake');
                }, 500);
            }
        });
    } else if (question.type === 'multi') {
        // Reveal one correct option
        const correctIdx = question.correctAnswer[Math.floor(Math.random() * question.correctAnswer.length)];
        hintText = `Hint: ${question.options[correctIdx]} is one of the correct answers.`;
        
        // Add visual effect to the revealed option
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (idx === correctIdx) {
                opt.classList.add('hint-correct');
                opt.classList.add('pulse');
                setTimeout(() => {
                    opt.classList.remove('pulse');
                }, 1000);
            }
        });
    } else if (question.type === 'fill') {
        // Give first letter
        hintText = `Hint: The answer starts with "${question.correctAnswer.charAt(0)}".`;
        
        // Focus and highlight the input field
        const fillInput = document.querySelector('.fill-blank');
        if (fillInput) {
            fillInput.focus();
            fillInput.classList.add('highlight');
            setTimeout(() => {
                fillInput.classList.remove('highlight');
            }, 1000);
        }
    }
    
    hintElement.textContent = hintText;
    questionContainer.appendChild(hintElement);
}

// Create single choice options
function createSingleChoiceOptions(question) {
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `
            <input type="radio" id="option-${index}" name="quiz-option" class="option-radio">
            <label for="option-${index}">${option}</label>
        `;
        
        optionElement.addEventListener('click', () => {
            // Clear previous selections
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Mark as selected
            optionElement.classList.add('selected');
            
            // Enable next button
            nextBtn.disabled = false;
            
            // Save user's answer
            userAnswers[currentQuestionIndex] = {
                questionId: question.id,
                userAnswer: index,
                correct: index === question.correctAnswer
            };
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

// Create multi-choice options
function createMultiChoiceOptions(question) {
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `
            <input type="checkbox" id="option-${index}" name="quiz-option" class="option-checkbox">
            <label for="option-${index}">${option}</label>
        `;
        
        optionElement.addEventListener('click', () => {
            // Toggle selected class
            optionElement.classList.toggle('selected');
            
            // Check if at least one option is selected
            const anySelected = document.querySelectorAll('.option.selected').length > 0;
            nextBtn.disabled = !anySelected;
            
            // Get all selected options
            const selectedOptions = [];
            document.querySelectorAll('.option').forEach((opt, idx) => {
                if (opt.classList.contains('selected')) {
                    selectedOptions.push(idx);
                }
            });
            
            // Check if answer is correct (all correct options selected and no incorrect ones)
            const allCorrectSelected = question.correctAnswer.every(correctIdx => 
                selectedOptions.includes(correctIdx));
            const noIncorrectSelected = selectedOptions.every(selectedIdx => 
                question.correctAnswer.includes(selectedIdx));
            
            // Save user's answer
            userAnswers[currentQuestionIndex] = {
                questionId: question.id,
                userAnswer: selectedOptions,
                correct: allCorrectSelected && noIncorrectSelected
            };
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

// Create fill in the blank option
function createFillBlankOption() {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.classList.add('fill-blank');
    inputElement.placeholder = 'Type your answer here...';
    
    inputElement.addEventListener('input', () => {
        // Enable next button if there's text
        nextBtn.disabled = !inputElement.value.trim();
        
        // Get current question
        const currentQuestion = currentQuestions[currentQuestionIndex];
        
        // Check if answer is correct (case insensitive)
        const isCorrect = inputElement.value.trim().toLowerCase() === 
                         currentQuestion.correctAnswer.toLowerCase();
        
        // Save user's answer
        userAnswers[currentQuestionIndex] = {
            questionId: currentQuestion.id,
            userAnswer: inputElement.value.trim(),
            correct: isCorrect
        };
    });
    
    optionsContainer.appendChild(inputElement);
}

// Go to next question or finish quiz
function goToNextQuestion() {
    // Increment question index
    currentQuestionIndex++;
    
    // Check if quiz is finished
    if (currentQuestionIndex >= currentQuestions.length) {
        finishQuiz();
    } else {
        loadQuestion();
    }
}

// Finish the quiz and show results
function finishQuiz() {
    // Clear timer
    clearInterval(timer);
    
    // Calculate base score (correct answers)
    const correctAnswers = userAnswers.filter(answer => answer.correct).length;
    
    // Apply penalty for hints used (0.5 points per hint)
    const hintPenalty = hintsUsed.length * 0.5;
    score = Math.max(0, correctAnswers - hintPenalty);
    
    // Update results screen
    resultNameSpan.textContent = playerName;
    scoreSpan.textContent = score.toFixed(1); // Show score with one decimal place
    
    // Set trophy image and performance message based on score
    const scorePercentage = (score / currentQuestions.length) * 100;
    const performanceMessage = document.getElementById('performance-message');
    
    if (scorePercentage >= 80) {
        trophyImg.src = 'assets/images/trophy-gold.png.svg';
        performanceMessage.textContent = 'Outstanding performance';
        // Start confetti animation for high scores
        startConfetti();
    } else if (scorePercentage >= 60) {
        trophyImg.src = 'assets/images/trophy-silver.png.svg';
        performanceMessage.textContent = 'Good effort';
    } else {
        trophyImg.src = 'assets/images/trophy-bronze.png.svg';
        performanceMessage.textContent = 'Keep practicing';
    }
    
    // Add statistics to results screen
    const statsContainer = document.querySelector('.score-container');
    statsContainer.innerHTML = `
        <div class="score-text">Your Score:</div>
        <div class="score-value"><span id="score">${score.toFixed(1)}</span>/<span id="max-score">${currentQuestions.length}</span></div>
        <div class="stats-details">
            <div class="stat-item">
                <span class="stat-label">Correct Answers:</span>
                <span class="stat-value">${correctAnswers}/${currentQuestions.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Hints Used:</span>
                <span class="stat-value">${hintsUsed.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Difficulty:</span>
                <span class="stat-value">${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}</span>
            </div>
        </div>
    `;
    
    // Play completion sound
    completeSound.play();
    
    // Animate score counting
    animateScore();
    
    // Hide quiz screen and show results screen
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
}

// Animate score counting from 0 to final score
function animateScore() {
    let displayScore = 0;
    const duration = 1500; // ms
    const interval = 50; // ms
    const increment = score / (duration / interval);
    
    const scoreAnimation = setInterval(() => {
        displayScore += increment;
        if (displayScore >= score) {
            displayScore = score;
            clearInterval(scoreAnimation);
        }
        scoreSpan.textContent = Math.floor(displayScore);
    }, interval);
}

// Show review screen with all questions and answers
function showReviewScreen() {
    // Clear previous review content
    reviewContainer.innerHTML = '';
    
    // Create review items for each question
    currentQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item', 'card');
        
        // Question text
        const questionText = document.createElement('div');
        questionText.classList.add('review-question');
        questionText.textContent = `Question ${index + 1}: ${question.question}`;
        reviewItem.appendChild(questionText);
        
        // Add image if present
        if (question.imageUrl) {
            const imageElement = document.createElement('img');
            imageElement.src = question.imageUrl;
            imageElement.alt = 'Question Image';
            imageElement.classList.add('question-image');
            imageElement.style.maxWidth = '200px';
            reviewItem.appendChild(imageElement);
        }
        
        // User's answer
        const answerText = document.createElement('div');
        answerText.classList.add('review-answer');
        
        if (question.type === 'single') {
            // Check if userAnswer.userAnswer is a valid index
            if (userAnswer.userAnswer !== undefined && 
                userAnswer.userAnswer >= 0 && 
                userAnswer.userAnswer < question.options.length) {
                answerText.innerHTML = `Your answer: <span class="${userAnswer.correct ? 'review-correct' : 'review-incorrect'}">${question.options[userAnswer.userAnswer]}</span>`;
            } else {
                answerText.innerHTML = `Your answer: <span class="review-incorrect">No answer provided</span>`;
            }
        } else if (question.type === 'multi') {
            if (Array.isArray(userAnswer.userAnswer) && userAnswer.userAnswer.length > 0) {
                const selectedOptions = userAnswer.userAnswer
                    .filter(idx => idx >= 0 && idx < question.options.length) // Ensure valid indices
                    .map(idx => question.options[idx])
                    .join(', ');
                answerText.innerHTML = `Your answer: <span class="${userAnswer.correct ? 'review-correct' : 'review-incorrect'}">${selectedOptions || 'Invalid selection'}</span>`;
            } else {
                answerText.innerHTML = `Your answer: <span class="review-incorrect">No answer provided</span>`;
            }
        } else if (question.type === 'fill') {
            answerText.innerHTML = `Your answer: <span class="${userAnswer.correct ? 'review-correct' : 'review-incorrect'}">${userAnswer.userAnswer || 'No answer provided'}</span>`;
        }
        reviewItem.appendChild(answerText);
        
        // Correct answer (always show for clarity)
        const correctAnswerText = document.createElement('div');
        correctAnswerText.classList.add('review-answer');
        
        if (question.type === 'single') {
            // Check if correctAnswer is a valid index
            if (question.correctAnswer !== undefined && 
                question.correctAnswer >= 0 && 
                question.correctAnswer < question.options.length) {
                correctAnswerText.innerHTML = `Correct answer: <span class="review-correct">${question.options[question.correctAnswer]}</span>`;
            } else {
                correctAnswerText.innerHTML = `Correct answer: <span class="review-correct">Invalid answer in question data</span>`;
            }
        } else if (question.type === 'multi') {
            if (Array.isArray(question.correctAnswer) && question.correctAnswer.length > 0) {
                const correctOptions = question.correctAnswer
                    .filter(idx => idx >= 0 && idx < question.options.length) // Ensure valid indices
                    .map(idx => question.options[idx])
                    .join(', ');
                correctAnswerText.innerHTML = `Correct answer: <span class="review-correct">${correctOptions || 'Invalid answer in question data'}</span>`;
            } else {
                correctAnswerText.innerHTML = `Correct answer: <span class="review-correct">Invalid answer in question data</span>`;
            }
        } else if (question.type === 'fill') {
            correctAnswerText.innerHTML = `Correct answer: <span class="review-correct">${question.correctAnswer || 'Invalid answer in question data'}</span>`;
        }
        reviewItem.appendChild(correctAnswerText);
        
        // Explanation
        const explanationText = document.createElement('div');
        explanationText.classList.add('review-explanation');
        explanationText.textContent = question.explanation;
        reviewItem.appendChild(explanationText);
        
        reviewContainer.appendChild(reviewItem);
    });
    
    // Hide results screen and show review screen
    resultsScreen.classList.remove('active');
    reviewScreen.classList.add('active');
}

// Show results screen
function showResultsScreen() {
    reviewScreen.classList.remove('active');
    resultsScreen.classList.add('active');
}

// Retake the quiz
function retakeQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Get new shuffled questions
    currentQuestions = getShuffledQuestions();
    
    // Hide results screen and show quiz screen
    resultsScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    // Load first question
    loadQuestion();
}

// Toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save theme preference
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('quizTheme', isDarkMode ? 'dark' : 'light');
}

// Timer functions
function resetTimer() {
    // Clear existing timer
    clearInterval(timer);
    
    // Set time for current question
    timeLeft = timePerQuestion;
    timeRemainingSpan.textContent = timeLeft;
    
    // Start timer
    timer = setInterval(() => {
        timeLeft--;
        timeRemainingSpan.textContent = timeLeft;
        
        // Apply warning style when time is running low
        if (timeLeft <= 5) {
            timeRemainingSpan.style.color = '#f44336';
        } else {
            timeRemainingSpan.style.color = '';
        }
        
        // Auto-proceed when time runs out
        if (timeLeft <= 0) {
            clearInterval(timer);
            
            // If no answer selected, mark as incorrect
            if (!userAnswers[currentQuestionIndex]) {
                const currentQuestion = currentQuestions[currentQuestionIndex];
                userAnswers[currentQuestionIndex] = {
                    questionId: currentQuestion.id,
                    userAnswer: null,
                    correct: false
                };
            }
            
            // Go to next question
            goToNextQuestion();
        }
    }, 1000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);