////////////////////////////////////////////////////////////////////////
//                       Equation Solver Logic                        //
////////////////////////////////////////////////////////////////////////

angular.module('equationSolverLogic', []).factory("solverFunctions", function(){

  // Equation data structure
  // Equation Level: [expression, equality or inequality, expression]
  // Expression Level: [term 1] or [term 1, plus or minus, term 2]
  // Term Level: [Bool for sign, [int, divisor], Bool for var, [var?, var] ]
  // Example below: 5x + -3 = -18
  var exampleEquation = [ [ [true, [7, 1], [true, "x"] ], "+", [false, [3, 1], [false] ] ], "=", [ [false, [18, 1], [false] ], "+", [true, [2, 1], [true, "x"] ] ] ]

  return {

////////////////////////////////////////////////////////////////////////
//                      Convert to Data Structure                     //
////////////////////////////////////////////////////////////////////////

  // Takes a string equation and converts it to our data structure.
  // If the equation doesn't have two sides, return an error. Otherwise,
  // run the splitExpression function on each side and push them and an
  // equal sign to the formattedEquation array and return it
  convertStringToDataStructure: function(str){
    var formattedEquation;
    if(str.split('=').length != 2) return "error!, add an equal sign and stick to two expressions";
    else {
      formattedEquation = [
        this.splitExpression( str.split('=')[0] ),
        "=",
        this.splitExpression( str.split('=')[1] )
      ]
    }
    return formattedEquation;
  },

  // Takes an expression and converts it to an array of its terms
  // Split the expression at all the spaces and declare an termArray.
  // Run each term in the splitTerm funcion and push it to the termArray
  splitExpression: function(expression){
    var expressionArray = expression.split(' ');
    var expressionTermArray = []
    for(i = 0; i<expressionArray.length; i++){
      if (expressionArray[i].length  !== 0){
        expressionTermArray.push( this.splitTerm( expressionArray[i] ) );
      }
    }
    return expressionTermArray
  },

  ///// Make sure it's smart about fractions
  // Takes a term and converts it to an array of its attributes
  splitTerm: function(term){
    // First trim the whitespace and start with the termArr template
    // If the input is an operator, return it, instead of a term
    term = term.trim()
    var termArr = [true, [0, 1], [false] ];
    if (term == '+' || term == '-') return term;
    // If the first character of the input is "-", trim it from the
    // input and make the positive attribute of termArr false.
    if(term[0] == '-'){
      termArr[0] = false;
      term = term.substr(1);
    }
    // If there's a variable, edit the termArr appropriately and cut the
    // var from the input
    if (/[a-zA-Z]/.test( term[term.length - 1] ) ){
      termArr[2][0] = true;
      termArr[2].push(term[term.length - 1]);
      term = term.substring(0, term.length - 1);
      if(term.length == 0) termArr[1][0] = 1;
    }
    // All that's left in the string is the number, so make it a js
    // number and edit the termArr template appropriately
    if(term.length > 0) termArr[1][0] = Number(term);
    return termArr;
  },

////////////////////////////////////////////////////////////////////////
//                           Print Equation                           //
////////////////////////////////////////////////////////////////////////

  // Takes an equation data structure and converts it to an array of
  // term strings
  printEquation: function(equation){
    var printArray = ['','','','=','','',''];
    // If the side of the equation has only one term, push a "plus" and
    // a zero to the side
    if(equation[0].length == 1){
      equation[0].push("+");
      equation[0].push([true, [0, 1], [false] ]);
    }
    // If both terms are zero, put a zero in the third collumn
    if(equation[0][0][1][0] == 0 && equation[0][2][1][0] == 0) {
      printArray[2] = "0";
    }
    // If only the second term is zero, print the first term to the
    // third collumn
    else if(equation[0][2][1][0] == 0) printArray[2] = this.printTerm(equation[0][0]);
    // Otherwise print the second term in the first collumn. If the
    // first term is not zero, print the first in the first collumn and
    // the operation in the second collumn.
    else{
      printArray[2] = this.printTerm(equation[0][2]);
      if( equation[0][0][1][0] !== 0 ){
        printArray[0] = this.printTerm(equation[0][0]);
        printArray[1] = equation[0][1]
      }
    }
    // Do the same for the second side. Maybe can refactor, but fuck it
    if(equation[2].length == 1){
      equation[2].push("+");
      equation[2].push([true, [0, 1], [false] ]);
    }
    if(equation[2][0][1][0] == 0 && equation[2][2][1][0] == 0) {
      printArray[4] = "0";
    }
    else if(equation[2][0][1][0] == 0) printArray[4] = this.printTerm(equation[2][2]);
    else{
      printArray[4] = this.printTerm(equation[2][0]);
      if( equation[2][2][1][0] !== 0 ){
        printArray[6] = this.printTerm(equation[2][2]);
        printArray[5] = equation[2][1];
      }
    }
    return printArray
  },

  // Takes a termArray and converts it to a string
  // If the term is negative, add "-" to the string.
  // If theres a variable, add it to the string with its coefficient.
  // Otherwise, just add the number to the string
  printTerm: function(term){
    var termString = ""
    if ( !term[0] ) termString += "-";
    if ( term[2][0] ) {
      if (term[1][0] / term[1][1] !== 1) termString += (term[1][0] / term[1][1]);
      termString += term[2][1];
    } else termString += (term[1][0] / term[1][1])
    return termString
  },

////////////////////////////////////////////////////////////////////////
//                         Solving Equations                          //
////////////////////////////////////////////////////////////////////////

  // This function allows you to add, subtract, divide, and multiply a
  // constant to both sides of a equation
  // HitBothSides takes, in an equation, an operator, and a operand.
  // Loop through the terms in each side of the equation
  hitBothSides: function(equation, operator, operand){
    if( !/[a-zA-Z]/.test(operand) ) operand = Number(operand)
    for(i=0; i<equation.length; i+=2){
      for(j=0; j<equation[i].length; j+=2) {
        // If both the operand and the terms are constants or if both
        // the operand and the operator have variables, first change the
        // operand to just the coefficient, and then ...
        // FIX for "x" as operand
        if( (!equation[i][j][2][0] && !/[a-zA-Z]/.test(operand) && equation[i][j][1][0] !== 0) || (equation[i][j][2][0] && /[a-zA-Z]/.test(operand) && equation[i][j][1][0] !== 0)) {
          var formatedOperand = /[a-zA-Z]/.test(operand) ? Number(operand.substring(0, operand.length - 1)) : formatedOperand = operand;
          // NEED TO BE FIXED and then commented
          if (operator == "+" && equation[i][j][0]) equation[i][j][1][0] = equation[i][j][1][0] + formatedOperand;
          else if (operator == "-" && equation[i][j][0]) equation[i][j][1][0] = equation[i][j][1][0] - formatedOperand;
          else if (operator == "+" && !equation[i][j][0]){
            equation[i][j][1][0] = (equation[i][j][1][0] * -1) + formatedOperand;
            equation[i][j][0] = true;
          } else if (operator == "-" && !equation[i][j][0]){
            equation[i][j][1][0] = (equation[i][j][1][0] * -1) - formatedOperand;
            equation[i][j][0] = true;
          }
        }
        // NEED TO BE FIXED doesn't wor
        else if (!/[a-zA-Z]/.test(operand) && equation[i][0][1][0] == 0 && equation[i][0][1][0] == 0){
          if(i == 0) equation[i][2] = [true, [Number(operand), 1] [false] ];
          if(i == 2) equation[i][0] = [true, [Number(operand), 1] [false] ];
        }
        // If you're multiplying or dividing both sides, multiply or
        // divide each term by the operand.
        // Error if you divide by zero
        if( !/[a-zA-Z]/.test(operand) ){
          if(operator == "*") equation[i][j][1][0] *= operand;
          if(operator == "/"){
            if (operand == 0) return equation; // flash an error eventually
            else equation[i][j][1][0] /= operand;
          }
        } else if ( /[a-zA-Z]/.test(operand) && ( operator == "*" || operator == "/" ) ){
          return equation; // flash an error eventually
        }
      }
    }
    return equation;
  },

////////////////////////////////////////////////////////////////////////
//                              Check It                              //
////////////////////////////////////////////////////////////////////////

  check: function(equation){
    var leftZeroCount = 0;
    var rightZeroCount = 0;
    var isolateVarCount = 0;
    var constantCount = 0;

    if(equation[0][0][1][0] == 0) leftZeroCount += 1;
    if(equation[0][2][1][0] == 0) leftZeroCount += 1;
    if(equation[2][0][1][0] == 0) rightZeroCount += 1;
    if(equation[2][2][1][0] == 0) rightZeroCount += 1;

    if(equation[0][0][1][0] == 1 && equation[0][0][2][0]) isolateVarCount += 1;
    if(equation[0][2][1][0] == 1 && equation[0][2][2][0]) isolateVarCount += 1;
    if(equation[2][0][1][0] == 1 && equation[2][0][2][0]) isolateVarCount += 1;
    if(equation[2][2][1][0] == 1 && equation[2][2][2][0]) isolateVarCount += 1;

    if(equation[0][0][1][0] !== 0 && !equation[0][0][2][0]) constantCount += 1;
    if(equation[0][2][1][0] !== 0 && !equation[0][2][2][0]) constantCount += 1;
    if(equation[2][0][1][0] !== 0 && !equation[2][0][2][0]) constantCount += 1;
    if(equation[2][2][1][0] !== 0 && !equation[2][2][2][0]) constantCount += 1;

    if(leftZeroCount == 1 && rightZeroCount == 1 && isolateVarCount == 1 && constantCount == 1) return true;
    else return false;
  }

  }
})

////////////////////////////////////////////////////////////////////////
//                          Tests and Notes                           //
////////////////////////////////////////////////////////////////////////

// console.log(printEquation(exampleEquation));
// console.log("Subtracting 2x from both sides");
// exampleEquation = hitBothSides(exampleEquation, "-", "2x");
// console.log(printEquation(exampleEquation));
// console.log("Adding 5 to both sides");
// exampleEquation = hitBothSides(exampleEquation, "+", 5)
// console.log(printEquation(exampleEquation));
// console.log("Subtracting 2 from both sides");
// exampleEquation = hitBothSides(exampleEquation, "-", 2)
// console.log(printEquation(exampleEquation));
// console.log("Multiplying both sides by 2");
// exampleEquation = hitBothSides(exampleEquation, "*", 2)
// console.log(printEquation(exampleEquation));
// console.log("Dividing both sides by 10");
// exampleEquation = hitBothSides(exampleEquation, "/", 10)
// console.log(printEquation(exampleEquation));

// Need to deal with fractions and decimals
// Some Issues with negatives
// What about no solution?
