////////////////////////////////////////////////////////////////////////
//                       Expression Controller                        //
////////////////////////////////////////////////////////////////////////

// Set an Equation controller that takes in the solver functions factory
app.controller('expressionController', function(simplifyFunctions, $scope){
  var vm = this;

  vm.currentExp = [];
  vm.expressionStringArray = []
  vm.lineCount = 0;


  vm.post = function(){
    var expressionString = $('#exp-input-box').val();

    vm.currentExp = vm.currentExp.length > 0 ? vm.currentExp : simplifyFunctions.convertToDataStructure(expressionString);
    $('#expression-form').css("display", "none");
    $('#expression-holder').css("display", "block");
    $('#combine-holder').css("display", "block");

    vm.expressionStringArray = simplifyFunctions.printExpression(vm.currentExp);
    vm.print();
  }

  vm.print = function(){
    for(i=0; i<vm.expressionStringArray.length; i++){
      $("#expression-holder").append('<div class="term" id="term-' + vm.lineCount + "-" + i + '"/>')
      var id = '#term-' + vm.lineCount + "-" + i;
      $(id).append('<p class="term-text">' + vm.expressionStringArray[i] + '</p>')
      if(i % 2 == 0){
        $(id).click(function(){
          vm.termArr.push( Number(this.id[this.id.length - 1]) / 2)
        })
      }
    }
    vm.lineCount += 1;
  }

  vm.termArr = [];

  vm.combine = function(){

    $("#expression-holder").append("<hr>");
    vm.currentExp = simplifyFunctions.combineLikeTerms(vm.currentExp, vm.termArr);
    vm.termArr = [];

    vm.expressionStringArray = simplifyFunctions.printExpression(vm.currentExp);
    vm.print();

    if(simplifyFunctions.check(vm.currentExp)){
      alert("Great Job ... Expression Simplified");
      $scope.$emit('raise-exp-score')
    }


  }


})
