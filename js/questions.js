// Quiz Questions Data

const quizQuestions = [
    // Single Choice Questions
    {
        id: 1,
        type: 'single',
        question: 'What is the capital of France?',
        options: [
            'London',
            'Berlin',
            'Paris',
            'Madrid'
        ],
        correctAnswer: 2, // Index of correct answer (Paris)
        explanation: 'Paris is the capital and most populous city of France.'
    },
    {
        id: 2,
        type: 'single',
        question: 'Which planet is known as the Red Planet?',
        options: [
            'Venus',
            'Mars',
            'Jupiter',
            'Saturn'
        ],
        correctAnswer: 1, // Index of correct answer (Mars)
        explanation: 'Mars is often called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.'
    },
    {
        id: 3,
        type: 'single',
        question: 'Who painted the Mona Lisa?',
        options: [
            'Vincent van Gogh',
            'Pablo Picasso',
            'Leonardo da Vinci',
            'Michelangelo'
        ],
        correctAnswer: 2, // Index of correct answer (Leonardo da Vinci)
        explanation: 'The Mona Lisa was painted by Leonardo da Vinci between 1503 and 1519.'
    },
    
    // Multi-select Question
    {
        id: 4,
        type: 'multi',
        question: 'Which of the following are primary colors?',
        options: [
            'Red',
            'Green',
            'Blue',
            'Yellow'
        ],
        correctAnswer: [0, 2, 3], // Indices of correct answers (Red, Blue, Yellow)
        explanation: 'The primary colors are Red, Blue, and Yellow. Green is a secondary color created by mixing Blue and Yellow.'
    },
    
    // Fill in the blank Question
    {
        id: 5,
        type: 'fill',
        question: 'The largest ocean on Earth is the _______ Ocean.',
        correctAnswer: 'Pacific',
        explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth\'s surface.'
    },
    
    // Image-based Question
    {
        id: 6,
        type: 'single',
        question: 'Which famous landmark is shown in the image below?',
        imageUrl:'assets/images/eiffel-tower.jpg', // Placeholder image path
        options: [
            'Statue of Liberty',
            'Eiffel Tower',
            'Taj Mahal',
            'Great Wall of China'
        ],
        correctAnswer: 1, // Index of correct answer (Eiffel Tower)
        explanation: 'The Eiffel Tower is a wrought-iron lattice tower located in Paris, France. It was named after engineer Gustave Eiffel, whose company designed and built the tower.'
    },
    
    // Additional questions to enhance the quiz
    {
        id: 7,
        type: 'single',
        question: 'Which element has the chemical symbol "O"?',
        options: [
            'Gold',
            'Oxygen',
            'Osmium',
            'Oganesson'
        ],
        correctAnswer: 1, // Index of correct answer (Oxygen)
        explanation: 'Oxygen has the chemical symbol "O" and is essential for human respiration.'
    },
    {
        id: 8,
        type: 'multi',
        question: 'Which of the following are mammals?',
        options: [
            'Dolphin',
            'Shark',
            'Bat',
            'Penguin'
        ],
        correctAnswer: [0, 2], // Indices of correct answers (Dolphin, Bat)
        explanation: 'Dolphins and bats are mammals. Sharks are fish, and penguins are birds.'
    },
    {
        id: 9,
        type: 'fill',
        question: 'The currency of Japan is called the _______.',
        correctAnswer: 'Yen',
        explanation: 'The Japanese Yen (¥) is the official currency of Japan.'
    },
    {
        id: 10,
        type: 'single',
        question: 'Which programming language is this quiz built with?',
        options: [
            'Python',
            'Java',
            'JavaScript',
            'C++'
        ],
        correctAnswer: 2, // Index of correct answer (JavaScript)
        explanation: 'This quiz application is built using HTML, CSS, and JavaScript.'
    }
];

// Function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Add difficulty level to each question
quizQuestions.forEach(question => {
    // Assign difficulty based on question type and complexity
    if (question.type === 'fill') {
        question.difficulty = 'hard';
    } else if (question.type === 'multi') {
        question.difficulty = 'medium';
    } else {
        // For single choice, assign difficulty based on question ID
        if (question.id <= 3) {
            question.difficulty = 'easy';
        } else if (question.id <= 6) {
            question.difficulty = 'medium';
        } else {
            question.difficulty = 'hard';
        }
    }
});

// Function to get shuffled questions
function getShuffledQuestions() {
    return shuffleArray(quizQuestions);
}

// Function to get questions by difficulty
function getQuestionsByDifficulty(difficulty) {
    return quizQuestions.filter(q => q.difficulty === difficulty);
}

// Function to get a mix of questions with specified difficulty distribution
function getQuestionsByDistribution(easyCount, mediumCount, hardCount) {
    const easy = shuffleArray(getQuestionsByDifficulty('easy')).slice(0, easyCount);
    const medium = shuffleArray(getQuestionsByDifficulty('medium')).slice(0, mediumCount);
    const hard = shuffleArray(getQuestionsByDifficulty('hard')).slice(0, hardCount);
    
    return shuffleArray([...easy, ...medium, ...hard]);
}

// Function to shuffle options for a question
function getQuestionWithShuffledOptions(question) {
    const q = {...question};
    
    // Only shuffle options for single and multi-choice questions
    if (q.type === 'single' || q.type === 'multi') {
        // Create a mapping to track original indices
        const originalIndices = q.options.map((_, index) => index);
        
        // Create pairs of [option, originalIndex]
        const optionPairs = q.options.map((option, index) => [option, originalIndices[index]]);
        
        // Shuffle the pairs
        const shuffledPairs = shuffleArray(optionPairs);
        
        // Update options and correct answer(s)
        q.options = shuffledPairs.map(pair => pair[0]);
        
        // Update correct answer for single choice
        if (q.type === 'single') {
            // Find the new index of the original correct answer
            q.correctAnswer = shuffledPairs.findIndex(pair => pair[1] === q.correctAnswer);
        } 
        // Update correct answers for multi-choice
        else if (q.type === 'multi') {
            q.correctAnswer = q.correctAnswer.map(originalCorrectIndex => {
                return shuffledPairs.findIndex(pair => pair[1] === originalCorrectIndex);
            });
        }
    }
    
    return q;
}