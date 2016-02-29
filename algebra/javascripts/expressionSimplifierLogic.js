////////////////////////////////////////////////////////////////////////
//                     Simplify Expression Logic                      //
////////////////////////////////////////////////////////////////////////

angular.module('expressionSimplifierLogic', []).factory("simplifyFunctions", function(){
  // Each expression is an array of terms
  // Term Structure: [add?, pos?, [num, den], [var?, var, exp]]
  var exampleExpression = [
    [true, true, [4, 1], [true, "x", 2] ],
    [false, true, [8, 1], [false] ],
    [true, false, [1, 1], [true, "x", 2] ],
    [false, false, [2, 1], [false] ],
    [true, false, [10, 1], [true, "x", 3] ]
  ];
  var exampleString = "4x^2 - 8 + -x^2 - -2 - y";

  return {

////////////////////////////////////////////////////////////////////////
//                        Printing Expressions                        //
////////////////////////////////////////////////////////////////////////

  // PringExpression takes in an expression in array format and converts
  // it to array of strings. The function loops through the expression
  // array, runs each term through the printTerm function and pushes it
  // to an array, as long as the term isn't 0.
  printExpression: function(expArr){
    var strArr = [];
    for(i=0; i<expArr.length; i++){
      if(expArr[i][2][0] !== 0) strArr.push( this.printTerm( expArr[i] ) );
    }

    // Flatten the array to 1 dimension ??? not sure how this works
    // Remove the first operation and return the string array.
    strArr = strArr.reduce(function(a, b) {
        return a.concat(b);
      }, []);
    strArr.splice(0, 1);
    return strArr;
  },

  // PrintTerm takes in an expression and returns an array of two
  // strings, the term's leading operation and the term. First set the
  // array's first string to an operation based on the first bolean. If
  // the second boolean is false, push a neg sign to the second boolean.
  printTerm: function(termArr){
    var termStrs = ["operation", ""];
    termStrs[0] = termArr[0] ?  "+" : "-";
    if( !termArr[1] ) termStrs[1] += "-";

    // Find the term's constant by dividing its numerator by its
    // denominator. As long the term isn't an isolated variable, convert
    // the number to a string and push it to the second string.
    var constant = termArr[2][0] / termArr[2][1];
    if( constant !== 1 || !termArr[3][0] ) termStrs[1] += String(constant);

    // If the term has a variable, push the variable to the string.
    // Combine html superscript tags with the value of the exponent and
    // push them to the string if the exponent is not 1
    if(termArr[3][0]){
      termStrs[1] += termArr[3][1];
      var exponent = "<sup>" + String(termArr[3][2]) + "</sup>"
      if(termArr[3][2] !== 1) termStrs[1] += exponent;
    }
    return termStrs
  },

////////////////////////////////////////////////////////////////////////
//                  Convert String to Data Structure                  //
////////////////////////////////////////////////////////////////////////

  //
  convertToDataStructure: function(expStr){
    var termArr = expStr.split(' ');
    var finalArr = [];
    for(i=termArr.length - 1; i>=0; i--){
      if(termArr[i] !== "+" && termArr[i] !== "-"){
        if(termArr[i][0] !== "-") termArr[i] = "+" + termArr[i];
      } else termArr[i + 1] = termArr[i] + termArr[i + 1];
    }
    for(i=0; i<termArr.length; i+=2){
      if(i[3] == "0") console.log("0");
      else if(i == 0) finalArr.push( this.convertToTermStructure("+" + termArr[i]) );
      else finalArr.push( this.convertToTermStructure(termArr[i]) );
    }
    return finalArr;
  },

  convertToTermStructure: function(term){
    var termArr = [true, true, [1, 1], [false, "", 1] ];
    if(term[0] == "-") termArr[0] = false;
    if(term[1] == "-") termArr[1] = false;
    term = term.substring(2).split('^');

    if(term.length == 2) termArr[3][2] = Number(term[1]);

    if( /[a-zA-Z]/.test(term[0]) ){
      termArr[3][0] = true;
      termArr[3][1] = term[0][term[0].length - 1];
      term[0] = term[0].slice(0, term[0].length - 1);
      if(term[0].length > 0) termArr[2][0] = Number(term[0]);
    } else termArr[2][0] = Number(term[0])

    return termArr;
  },

////////////////////////////////////////////////////////////////////////
//                         Combine Like Terms                         //
////////////////////////////////////////////////////////////////////////

  combineLikeTerms: function(expression, likeTermArr){
    // Eventually cut out all the zeros first

    var newExpresssion = expression;
    if(likeTermArr.length < 1) return newExpresssion;

    var constant = 0;
    if(expression[ likeTermArr[0] ][3][0]){
      // console.log("hi")
      // console.log(newExpresssion)
      var variable = expression[likeTermArr[0]][3][1];
      var exponent = expression[likeTermArr[0]][3][2];
      for(i=likeTermArr.length - 1; i >= 0; i--){
        if(!expression[likeTermArr[i]][3][0]) return newExpresssion;
        if(expression[likeTermArr[i]][3][1] !== variable || expression[likeTermArr[i]][3][2] !== exponent) return newExpresssion;
        else{
          if( (expression[likeTermArr[i]][0] && expression[likeTermArr[i]][1]) || (!expression[likeTermArr[i]][0] && !expression[likeTermArr[i]][1]) ){
            constant += expression[likeTermArr[i]][2][0]; // Doesn't work for fractions
          } else constant -= expression[likeTermArr[i]][2][0];
        }
      }
      if (constant > 0) newExpresssion.push([true, true, [constant, 1], [true, variable, exponent] ]);
      else if (constant < 0) newExpresssion.push([false, true, [constant * -1, 1], [true, variable, exponent] ]);
    }
    else {
      for(i=0; i<likeTermArr.length; i++){
        if(expression[likeTermArr[i]][3][0]) return newExpresssion;
        if( (expression[likeTermArr[i]][0] && expression[likeTermArr[i]][1]) || (!expression[likeTermArr[i]][0] && !expression[likeTermArr[i]][1]) ){
          constant += expression[likeTermArr[i]][2][0]; // Doesn't work for fractions
        } else constant -= expression[likeTermArr[i]][2][0];
      }
      if (constant > 0) newExpresssion.push([true, true, [constant, 1], [false, "", 1] ]);
      else if (constant < 0) newExpresssion.push([false, true, [constant * -1, 1], [false, "", 1] ]);
    }
    for(i=likeTermArr.length - 1; i >= 0; i--){
      newExpresssion.splice(likeTermArr[i], 1);
    }
    return newExpresssion;
  },

////////////////////////////////////////////////////////////////////////
//                              Check It                              //
////////////////////////////////////////////////////////////////////////

  check: function(expression){
    var combined = [  ];

    if(expression[0][3][0]) combined.push( [ expression[0][3][1], expression[0][3][2] ] );
    else combined.push( ["const", 1 ] );

    for(i=1; i<expression.length; i++){
      for(j=0; j<combined.length; j++){
        if( expression[i][3][1] == combined[j][0] && expression[i][3][2] == combined[j][1] ) return false;
      }
      if(expression[i][3][0]) combined.push( [ expression[i][3][1], expression[i][3][2] ] );
      else combined.push( ["const", 1 ] );
    }
    return true;
  }

  }

})


////////////////////////////////////////////////////////////////////////
//                          Tests and Notes                           //
////////////////////////////////////////////////////////////////////////

// console.log(printExpression(exampleExpression));
// console.log(convertToDataStructure(exampleString));
// console.log(combineLikeTerms(exampleExpression, [0,4]))
// console.log(combineLikeTerms(exampleExpression, [1,3]))
// console.log(combineLikeTerms(exampleExpression, [0,2]))


























