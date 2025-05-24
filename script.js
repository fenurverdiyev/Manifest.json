// Get references to the display element
const display = document.getElementById('display');

// Variable to store current input
let currentInput = '';
// Variable to track if the last input was an operator
let lastInputWasOperator = false;
// Variable to track if the display shows a result or an error
let showingResultOrError = false;

// Function to append value to display
function appendToDisplay(value) {
    if (showingResultOrError) {
        // If showing a result or error, new input should start fresh
        // unless it's an operator and there's a valid result to continue with
        if (isOperator(value) && currentInput !== "Error") {
            showingResultOrError = false; // Continue calculation with the result
        } else {
            currentInput = ''; // Start new calculation
            showingResultOrError = false;
        }
    }

    // Prevent multiple leading zeros
    if (currentInput === '0' && value === '0') {
        return;
    }
    // If currentInput is '0' and a non-zero digit is pressed, replace '0'
    if (currentInput === '0' && !isOperator(value) && value !== '.') {
        currentInput = '';
    }

    // Prevent consecutive operators
    if (isOperator(value)) {
        if (lastInputWasOperator) {
            // Replace the last operator with the new one
            currentInput = currentInput.slice(0, -1) + value;
            updateDisplay();
            return;
        }
        // Prevent starting with an operator (except minus for negative numbers, though eval handles this)
        if (currentInput === '' && value !== '-') { 
            return;
        }
        lastInputWasOperator = true;
    } else {
        lastInputWasOperator = false;
    }
    
    // Prevent multiple decimal points in a single number segment
    if (value === '.') {
        const segments = currentInput.split(/[\+\-\*\/]/);
        if (segments.pop().includes('.')) {
            return;
        }
    }


    currentInput += value;
    updateDisplay();
}

// Function to clear display
function clearDisplay() {
    currentInput = '';
    lastInputWasOperator = false;
    showingResultOrError = false;
    updateDisplay();
}

// Function to calculate result
function calculateResult() {
    if (currentInput === '' || currentInput === 'Error' || lastInputWasOperator) {
        // Do not calculate if input is empty, already an error, or ends with an operator
        return;
    }
    try {
        // Using eval() for simplicity. 
        // WARNING: eval() can be a security risk if used with untrusted input in a real application.
        // For production, consider using a dedicated math expression parser library or implementing a shunting-yard algorithm.
        let result = eval(currentInput);
        
        // Check for division by zero, which results in Infinity
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Optional: Round to a certain number of decimal places if needed
            // result = parseFloat(result.toFixed(10)); 
            currentInput = result.toString();
        }
    } catch (error) {
        currentInput = 'Error';
    }
    lastInputWasOperator = false;
    showingResultOrError = true;
    updateDisplay();
}

// Helper function to update the display element
function updateDisplay() {
    display.textContent = currentInput === '' ? '0' : currentInput;
}

// Helper function to check if a value is an operator
function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

// Initial display update
updateDisplay();

// It's better to add event listeners in JS rather than inline HTML attributes
// However, the current HTML uses inline onclick, so these functions are global.
// If we were to remove inline onclicks, we would do something like:
// document.querySelectorAll('.buttons button').forEach(button => {
//     button.addEventListener('click', () => {
//         const value = button.textContent;
//         if (value === 'C') {
//             clearDisplay();
//         } else if (value === '=') {
//             calculateResult();
//         } else if (['+', '-', '*', '/'].includes(value)) {
//             appendToDisplay(value);
//         } else { // Digit
//             appendToDisplay(value);
//         }
//     });
// });
// For now, the existing inline onclick attributes in index.html will call these functions.
