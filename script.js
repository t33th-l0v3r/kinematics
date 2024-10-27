// Equations and the ignored variables
const equations = [
    { equation: "\\( v = v_{i} + at \\)", ignored: "delta_x" },
    { equation: "\\( \\Delta x = v_{i}t + \\frac{1}{2}at^{2} \\)", ignored: "v" },
    { equation: "\\( v^{2} = v_{i}^{2} + 2a\\Delta x \\)", ignored: "t" },
    { equation: "\\( \\Delta x = \\frac{(v_{i} + v)}{2} \\times t \\)", ignored: "a" }
];

const ignoredVariables = [
    { id: "delta_x", display: "\\Delta x" },
    { id: "v", display: "v" },
    { id: "t", display: "t" },
    { id: "a", display: "a" }
];

let correctGuesses = 0; // Track correct guesses
let totalTries = 0; // Track total tries
let selectedEquation = null;
let selectedIgnoredVariable = null;

// HTML Elements
const equationsList = document.getElementById('equations-list');
const variablesList = document.getElementById('variables-list');
const resultText = document.getElementById('result');

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to load equations and variables
function loadGame() {
    // Shuffle equations and ignored variables
    shuffle(equations);
    shuffle(ignoredVariables);

    // Clear and load equations
    equationsList.innerHTML = "";
    equations.forEach((item) => {
        const button = document.createElement('button');
        button.className = 'equation-option';
        button.innerHTML = `${item.equation}`;
        button.dataset.ignored = item.ignored; // Set the ignored variable id
        button.onclick = selectEquation;
        equationsList.appendChild(button);
    });
    
    // Clear and load ignored variables
    variablesList.innerHTML = "";
    ignoredVariables.forEach(variable => {
        const button = document.createElement('button');
        button.className = 'variable-option';
        button.innerHTML = `\\(${variable.display}\\)`; // Wrap variable with MathJax delimiters
        button.dataset.id = variable.id; // Set the id
        button.onclick = selectIgnoredVariable;
        variablesList.appendChild(button);
    });

    // Reset score and result display
    correctGuesses = 0; // Reset correct guesses
    totalTries = 0; // Reset total tries
    resultText.innerText = ""; // Clear the result text

    // Load MathJax equations
    MathJax.typeset();
}

// Function to reset selections to original color
function resetSelections() {
    const options = document.querySelectorAll('.equation-option, .variable-option');
    options.forEach(option => option.classList.remove('selected'));
}

// Function to handle play again button click
document.getElementById('play-again').onclick = () => {
    resetSelections(); // Reset any selections
    loadGame(); // Load a new game
};

// Function to select an equation
function selectEquation(event) {
    selectedEquation = event.target; // Get the clicked equation button
    highlightSelection(event.target, 'equation-option');
    checkMatch();
}

// Function to select an ignored variable
function selectIgnoredVariable(event) {
    selectedIgnoredVariable = event.target.dataset.id; // Get the id of the ignored variable
    highlightSelection(event.target, 'variable-option');
    checkMatch();
}

// Function to highlight the selected option
function highlightSelection(target, className) {
    // Clear previous selections
    const options = document.querySelectorAll(`.${className}`);
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to the chosen option
    target.classList.add('selected');
}

// Function to check if the selected equation and variable match
function checkMatch() {
    if (selectedEquation && selectedIgnoredVariable) {
        totalTries++; // Increment total tries
        const ignoredId = selectedEquation.dataset.ignored; // Get ignored id from the equation
        if (ignoredId === selectedIgnoredVariable) {
            correctGuesses++; // Increment correct guesses
            resultText.innerText = `Correct! Your score is ${correctGuesses} / ${totalTries}.`;
            resultText.style.color = "green";
            
            // Disable the matched buttons
            selectedEquation.disabled = true;
            selectedIgnoredVariableButton = [...document.querySelectorAll('.variable-option')]
                .find(option => option.dataset.id === selectedIgnoredVariable);
            selectedIgnoredVariableButton.disabled = true;

            // Change styles for matched buttons
            selectedEquation.style.backgroundColor = "#28a745"; // Green background for matched equation
            selectedIgnoredVariableButton.style.backgroundColor = "#28a745"; // Green background for matched variable
        } else {
            resultText.innerText = `Wrong! Try again. Your score is ${correctGuesses} / ${totalTries}.`;
            resultText.style.color = "#df2935";
        }
        
        // Reset selections after a short delay
        setTimeout(() => {
            resetSelections();
            selectedEquation = null; // Clear selected equation
            selectedIgnoredVariable = null; // Clear selected variable
        }, 1000); // Adjust delay as needed
    }
}

// Load the game initially
loadGame();
