////////////////////////////////////////////////////////////////////////
//                        Equation Controller                         //
////////////////////////////////////////////////////////////////////////

// Set an Equation controller that takes in the solver functions factory
app.controller('equationController', function(solverFunctions, $scope){
  var vm = this;

  // When the user submits the post-equation form, if there is no
  // current equation, the post function grabs the value in the input
  // box, converts it to an array, and sets it as the current equation.
  vm.currentEq = []
  vm.post = function(){
    var equationString = $('#input-box').val();
    vm.currentEq = vm.currentEq.length > 0 ? vm.currentEq : solverFunctions.convertStringToDataStructure(equationString);

    // Run the current equation through the printEquation function from
    // the factory. Put each string term into one of the collumns
    var equationStringArr = solverFunctions.printEquation(vm.currentEq);
    $('#firstTerm').append( "<p class='eqPart'>" + equationStringArr[0] + "</p>" )
    $('#firstOperator').append( "<p class='eqPart'>" + equationStringArr[1] + "</p>" )
    $('#secondTerm').append( "<p class='eqPart'>" + equationStringArr[2] + "</p>" )
    $('#equalSign').append( "<p class='eqPart'>" + equationStringArr[3] + "</p>" )
    $('#thirdTerm').append( "<p class='eqPart'>" + equationStringArr[4] + "</p>" )
    $('#secondOperator').append( "<p class='eqPart'>" + equationStringArr[5] + "</p>" )
    $('#fourthTerm').append( "<p class='eqPart'>" + equationStringArr[6] + "</p>" )

    // Hide the equation form and show the operate form
    $("#equation-form").css('display', 'none');
    $("#operate-form").css('display', 'block');
  }

  // When the operate form is submited, grab the value of the operation
  // input and the value of the operand input.
  // Run the current equation, the operator, and the operand through the
  // hitBothSides function from the factory. Set the result as the
  // current equation and run the post function.
  vm.operate = function(){
    var Operation = $("input:radio[name ='operation']:checked").val()
    var Operand = $('#operand-input-box').val()
    var Equation = vm.currentEq;

    vm.currentEq = solverFunctions.hitBothSides(Equation, Operation, Operand);
    vm.post()

    if(solverFunctions.check(vm.currentEq)){
      alert("Great Job ... Equation Solved");
      $scope.$emit('raise-eq-score');
    } else{console.log(vm.currentEq)}


  }

})
