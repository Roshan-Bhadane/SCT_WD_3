# Interactive Quiz Game Application

> A modern, feature-rich quiz web application with multiple question types, scoring, theme switching, and review functionality.

## Demo

[View Live Demo](`https://roshan-bhadane.github.io/Task3/`)

This quiz application is fully responsive and follows a mobile-first design approach, ensuring optimal viewing experience across all devices from smartphones to desktop monitors.

## Features

- **Multiple Question Types** - Single-choice, multi-choice, fill-in-the-blank, and image-based questions
- **Dynamic Scoring** - Real-time score calculation with hint penalties
- **Question Randomization** - Different question order each time
- **Review Screen** - Detailed review of all questions, answers, and explanations
- **Dark/Light Theme** - Toggle between dark and light modes with persistent preferences
- **Countdown Timer** - Time limit for each question
- **Keyboard Shortcuts** - Quick access to all functions (Enter, →, F1, 1-4)
- **Difficulty Levels** - Easy, Medium, Hard, and Mixed options
- **Responsive Design** - Adapts seamlessly to all screen sizes
- **Sound Effects** - Audio feedback for correct/incorrect answers and quiz completion

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - With CSS variables for theming
- **Vanilla JavaScript** - No dependencies or frameworks

## Color Palette

The application uses a carefully selected color palette that adapts between light and dark themes:

### Light Theme
- **Background**: Light gray background
- **Container**: White container background
- **Text**: Dark gray for general text

### Dark Theme
- **Background**: Deep blue-black background
- **Container**: Dark blue container background
- **Text**: Light gray for general text

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine:

```bash
# Clone the repository
git clone https://github.com/Roshan-Bhadane/Task3.git

# Navigate to the project directory
cd Task3

# Open index.html in your browser
```

## Folder Structure

```
├── assets/
│   ├── images/             # Trophy and question images
│   └── sounds/             # Sound effect files
├── js/
│   ├── app.js              # Main application logic
│   ├── confetti.js         # Confetti animation for celebration
│   └── questions.js        # Quiz questions database
├── styles/
│   └── main.css            # CSS styles with theming
├── index.html              # Main HTML file
└── README.md               # Project documentation
```

## Usage

### Basic Operation
1. Enter your name and select difficulty level
2. Press **Start Quiz** to begin
3. Select your answer for each question
4. Use the **Hint** button if needed (reduces points)
5. Press **Next Question** to proceed
6. View your final score and performance message
7. Review all questions and answers

### Keyboard Shortcuts
- **Enter** - Start quiz / Submit answer
- **→** (Right Arrow) - Next question
- **F1** - Use hint
- **1-4** - Select option (single choice questions)

## Customization

### Adding or Modifying Questions
Edit the `js/questions.js` file to add or modify questions following the existing structure for different question types.

### Customizing Styling
Modify the CSS variables in the `:root` selector in `styles/main.css` to change colors, sizes, and other design elements.

### Replacing Sound Effects and Images
Replace files in the `assets/sounds/` and `assets/images/` directories with your own files, maintaining the same filenames or updating references in the code.

## Contributing

Contributions are welcome and greatly appreciated! If you'd like to contribute to this project, please fork the repository and create a pull request with your changes. Feel free to open issues for any bugs found or enhancements you'd like to suggest.

## License

This project is available for personal and educational use.

## Author

[Roshan Bhadane](https://github.com/Roshan-Bhadane)
        