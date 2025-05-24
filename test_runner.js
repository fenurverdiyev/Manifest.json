document.addEventListener('DOMContentLoaded', () => {
    const testResultsContainer = document.getElementById('test-results');
    let testId = 0;

    function runTest(testName, testFunction) {
        testId++;
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('test-case');
        let status = '<span class="fail">FAIL</span>';
        let message = '';

        try {
            // Reset calculator state before each test
            clearDisplay(); // Assumes clearDisplay() is globally available from script.js
            
            testFunction(); // Execute the actual test logic

            // If no error is thrown by testFunction, it implies a pass for many tests,
            // but specific assertions within testFunction are better.
            // For simplicity here, if testFunction completes, we'll assume it passed
            // and any failures are asserted within testFunction.
            status = '<span class="pass">PASS</span>';
        } catch (e) {
            message = ` - Error: ${e.message} (Line: ${e.lineNumber})`;
            console.error(`Test ${testId} (${testName}) Failed:`, e);
        }
        
        resultDiv.innerHTML = `<span class="test-name">Test ${testId}: ${testName}</span> - ${status}${message}`;
        testResultsContainer.appendChild(resultDiv);
    }

    // Helper function for asserting equality
    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message || 'Assertion Failed:'} Expected "${expected}", but got "${actual}".`);
        }
    }

    // --- Define Test Cases ---

    runTest("Addition: 2+3", () => {
        appendToDisplay('2');
        appendToDisplay('+');
        appendToDisplay('3');
        calculateResult();
        assertEquals(display.textContent, "5", "2+3 should be 5");
    });

    runTest("Subtraction: 5-3", () => {
        appendToDisplay('5');
        appendToDisplay('-');
        appendToDisplay('3');
        calculateResult();
        assertEquals(display.textContent, "2", "5-3 should be 2");
    });

    runTest("Multiplication: 2*3", () => {
        appendToDisplay('2');
        appendToDisplay('*');
        appendToDisplay('3');
        calculateResult();
        assertEquals(display.textContent, "6", "2*3 should be 6");
    });

    runTest("Division: 6/3", () => {
        appendToDisplay('6');
        appendToDisplay('/');
        appendToDisplay('3');
        calculateResult();
        assertEquals(display.textContent, "2", "6/3 should be 2");
    });

    runTest("Order of Operations: 2+3*2", () => {
        appendToDisplay('2');
        appendToDisplay('+');
        appendToDisplay('3');
        appendToDisplay('*');
        appendToDisplay('2');
        calculateResult();
        assertEquals(display.textContent, "8", "2+3*2 should be 8");
    });
    
    runTest("Order of Operations (Alternative): 3*2+2", () => {
        appendToDisplay('3');
        appendToDisplay('*');
        appendToDisplay('2');
        appendToDisplay('+');
        appendToDisplay('2');
        calculateResult();
        assertEquals(display.textContent, "8", "3*2+2 should be 8");
    });

    runTest("Clear Button Functionality", () => {
        appendToDisplay('1');
        appendToDisplay('2');
        appendToDisplay('+');
        appendToDisplay('3');
        clearDisplay();
        assertEquals(display.textContent, "0", "Display should be 0 after clear");
        assertEquals(currentInput, "", "currentInput should be empty after clear");
    });

    runTest("Division by Zero: 5/0", () => {
        appendToDisplay('5');
        appendToDisplay('/');
        appendToDisplay('0');
        calculateResult();
        assertEquals(display.textContent, "Error", "5/0 should result in Error");
    });

    runTest("Invalid Expression (Consecutive Operators): 2++3", () => {
        // appendToDisplay should handle/prevent this
        appendToDisplay('2');
        appendToDisplay('+');
        appendToDisplay('+'); // Second '+' should replace the first or be ignored
        appendToDisplay('3');
        // Depending on the implementation in script.js, currentInput might be "2+3"
        // Let's check the final result of the (corrected) expression.
        calculateResult(); 
        assertEquals(display.textContent, "5", "2++3 should evaluate as 2+3=5 due to input correction");
    });
    
    runTest("Invalid Expression (Ends with Operator): 5+", () => {
        appendToDisplay('5');
        appendToDisplay('+');
        calculateResult(); // Should not change the display or result in error
        assertEquals(display.textContent, "5+", "5+ should remain 5+ and not calculate");
    });


    runTest("Decimal Numbers: 1.5+2.5", () => {
        appendToDisplay('1');
        appendToDisplay('.');
        appendToDisplay('5');
        appendToDisplay('+');
        appendToDisplay('2');
        appendToDisplay('.');
        appendToDisplay('5');
        calculateResult();
        assertEquals(display.textContent, "4", "1.5+2.5 should be 4");
    });

    runTest("Multiple Operations: 10+5-3*2", () => {
        // 10 + 5 - (3 * 2) = 10 + 5 - 6 = 15 - 6 = 9
        appendToDisplay('1');
        appendToDisplay('0');
        appendToDisplay('+');
        appendToDisplay('5');
        appendToDisplay('-');
        appendToDisplay('3');
        appendToDisplay('*');
        appendToDisplay('2');
        calculateResult();
        assertEquals(display.textContent, "9", "10+5-3*2 should be 9");
    });
    
    runTest("Starting with Zero then a digit: 07", () => {
        appendToDisplay('0');
        appendToDisplay('7');
        assertEquals(display.textContent, "7", "Inputting 0 then 7 should display 7");
    });

    runTest("Multiple Zeros: 000", () => {
        appendToDisplay('0');
        appendToDisplay('0');
        appendToDisplay('0');
        assertEquals(display.textContent, "0", "Inputting 000 should display 0");
    });

    runTest("Multiple Decimal Points in one number: 1.2.3", () => {
        appendToDisplay('1');
        appendToDisplay('.');
        appendToDisplay('2');
        appendToDisplay('.'); // This should be ignored by appendToDisplay
        appendToDisplay('3');
        assertEquals(display.textContent, "1.23", "1.2.3 should become 1.23");
    });
    
    runTest("Calculation then new number: 5*5=25, then 7", () => {
        appendToDisplay('5');
        appendToDisplay('*');
        appendToDisplay('5');
        calculateResult(); // Display shows "25"
        assertEquals(display.textContent, "25", "5*5 = 25");
        appendToDisplay('7'); // Start new calculation
        assertEquals(display.textContent, "7", "After result, pressing 7 should display 7");
    });

    runTest("Calculation then operator: 5*5=25, then +", () => {
        appendToDisplay('5');
        appendToDisplay('*');
        appendToDisplay('5');
        calculateResult(); // Display shows "25"
        assertEquals(display.textContent, "25", "5*5 = 25");
        appendToDisplay('+'); // Continue with previous result
        assertEquals(display.textContent, "25+", "After result, pressing + should be 25+");
        appendToDisplay('5');
        calculateResult();
        assertEquals(display.textContent, "30", "25+5 should be 30");
    });

    runTest("Error then new number: 5/0=Error, then 7", () => {
        appendToDisplay('5');
        appendToDisplay('/');
        appendToDisplay('0');
        calculateResult(); // Display shows "Error"
        assertEquals(display.textContent, "Error", "5/0 = Error");
        appendToDisplay('7'); // Start new calculation
        assertEquals(display.textContent, "7", "After Error, pressing 7 should display 7");
    });
    
    runTest("Error then operator: 5/0=Error, then +", () => {
        appendToDisplay('5');
        appendToDisplay('/');
        appendToDisplay('0');
        calculateResult(); // Display shows "Error"
        assertEquals(display.textContent, "Error", "5/0 = Error");
        appendToDisplay('+'); // Should clear error and start with "+" or "0+" or just ignore
        // Based on current script.js, it will clear the error and start fresh.
        // If we press an operator after error, it should ideally not allow it or start a new expression.
        // Current appendToDisplay: if (showingResultOrError) { if (isOperator(value) && currentInput !== "Error") { ... } else { currentInput = ''; }}
        // So, if currentInput is "Error", it will set currentInput = '' before appending operator.
        // This means it might try to process just "+" which is an invalid start.
        // Let's trace: currentInput = "Error", showingResultOrError = true. appendToDisplay('+')
        // currentInput becomes "". lastInputWasOperator = false.
        // isOperator('+') is true. currentInput is "". It returns (prevents starting with operator)
        assertEquals(display.textContent, "Error", "After Error, pressing + should ideally not change from Error or clear to 0. Current logic might clear and prevent operator.");
        // Let's refine this test based on actual behavior of script.js:
        // After "Error", if we press "+", currentInput becomes "", then appendToDisplay('+') is called.
        // Inside appendToDisplay: if (currentInput === '' && value !== '-') { return; }
        // So the display remains "Error" because currentInput is not updated.
        // This is an acceptable behavior.
    });

});
