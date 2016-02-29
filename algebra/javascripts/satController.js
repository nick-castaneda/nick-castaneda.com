////////////////////////////////////////////////////////////////////////
//                           SAT Controller                           //
////////////////////////////////////////////////////////////////////////

// Set an SAT controller that takes in the SAT factory
app.controller('satController', function(satFactory){
  var vm = this;

  // Run the 'all' function from the satFactory and set the response
  // to an array named problems
  satFactory.all().success(function(data){
    vm.problems = data;
    console.log(vm.problems[0].img) // fix image files and reseed
  })

})
