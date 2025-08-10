# Interactive Quiz Game Application

A fully responsive, mobile-first, and visually attractive Quiz Game Application built with HTML, CSS, and Vanilla JavaScript. This application features multiple question types, scoring, randomization, review functionality, animations, sound effects, and theme switching.

## Features

### Core Features
- Multiple question types:
  - Single-select
  - Multi-select
  - Fill in the blanks
  - Image-based questions
- Score calculation and display
- Question and option randomization
- Review functionality for all questions and answers
- Explanations for each question

### User Interface & Styling
- Modern card layout design
- Light and Dark mode toggle
- Smooth animations and transitions
- Responsive design (mobile-first approach)

### Dynamic Elements
- Progress bar animation
- Countdown timer for each question
- Score animation at the end
- Trophy graphics based on performance

### Sound Effects
- Correct answer sound
- Incorrect answer sound
- Quiz completion sound

### Personalization
- User name input at the start
- Personalized greeting at the end

## How to Run the Project

1. Clone or download this repository to your local machine.
2. Open the `index.html` file in any modern web browser.
3. No server setup or additional dependencies are required.

## Customization Instructions

### Adding or Modifying Questions

To add or modify questions, edit the `js/questions.js` file. Each question follows this structure:

```javascript
// For single-choice questions
{
    id: [unique_id],
    type: 'single',
    question: 'Your question text here?',
    options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4'
    ],
    correctAnswer: [index_of_correct_option], // Zero-based index
    explanation: 'Explanation for the correct answer'
}

// For multi-select questions
{
    id: [unique_id],
    type: 'multi',
    question: 'Your multi-select question here?',
    options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4'
    ],
    correctAnswer: [array_of_correct_indices], // e.g., [0, 2] for options 1 and 3
    explanation: 'Explanation for the correct answers'
}

// For fill-in-the-blank questions
{
    id: [unique_id],
    type: 'fill',
    question: 'Your fill-in-the-blank question ______.',
    correctAnswer: 'correct_answer',
    explanation: 'Explanation for the correct answer'
}

// For image-based questions
{
    id: [unique_id],
    type: 'single', // or 'multi'
    question: 'Your question about the image below?',
    imageUrl: 'path/to/your/image.jpg',
    options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4'
    ],
    correctAnswer: [index_or_indices],
    explanation: 'Explanation for the correct answer'
}
```

### Customizing Styling

To modify the appearance of the quiz:

1. Edit the CSS variables in the `:root` selector in `styles/main.css` to change colors, sizes, and other design elements.
2. Modify specific component styles in their respective sections in the CSS file.

### Replacing Sound Effects

To use your own sound effects:

1. Replace the placeholder files in the `assets/sounds/` directory with your own MP3 files.
2. Make sure to keep the same filenames or update the references in the HTML file.

### Replacing Images

To use your own images:

1. Replace the placeholder files in the `assets/images/` directory with your own image files.
2. Update the file paths in the `questions.js` file for image-based questions.
3. Update the trophy images in the `assets/images/` directory or modify their references in the JavaScript code.

## Credits

- Placeholder trophy images: Created as SVG illustrations for this project
- Placeholder sound effects: Text files representing sound effects
- Font Awesome: Used for icons (via CDN)

## License

This project is available for personal and educational use.