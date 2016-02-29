////////////////////////////////////////////////////////////////////////
//                          User Controller                           //
////////////////////////////////////////////////////////////////////////

// Adds controller to the angular app that takes in the userFactory, and
// $http
app.controller('userController', function(userFactory, $http, $scope, $state){
  var vm = this;

  // Run the 'all' function from the userFactory and set the response
  // to an array named users
  userFactory.all().success(function(data){
    vm.users = data;
    for(i=0; i<vm.users.length; i++){
      vm.users[i].level = Math.floor( Math.log(vm.users[i].points.equation + vm.users[i].points.expression + vm.users[i].points.sat + 1) / Math.log(2) )
    }
  })

  ///// Should be in a factory, but can't make it work.
  // Set up a new user model.
  // When the register form is submited, the attributes are passed to
  // the backend api through the post method.
  ////// change success callback function
  vm.newUser = {username: "", password: "", url: ""}
  vm.register = function(username, pw, url){
      console.log("hi");
    $http({
      method: 'POST',
      url: "http://localhost:3000/users/create",
      data:{
        username: username,
        password: pw,
        picUrl: url
      }
    }).success(function(){
      vm.login(username, pw);
      userFactory.all().success(function(data){
        vm.users = data;
        for(i=0; i<vm.users.length; i++){
          vm.users[i].level = Math.floor( Math.log(vm.users[i].points.equation + vm.users[i].points.expression + vm.users[i].points.sat + 1) / Math.log(2) )
        }
      });
      $state.go('profile');
    })
  }

  // Login
  vm.signedIn = false;
  vm.currentUser = {username: ""}
  $scope.$watch("vm.currentUser")
  vm.login = function (username, pw) {
    $http({
      method: 'GET',
      url: "http://localhost:3000/users/" + username + "/" + pw + "/show"
    }).success(function(data){
      if(data){
        vm.currentUser = data;
        vm.currentUser.level = Math.floor( Math.log(vm.currentUser.points.equation + vm.currentUser.points.expression + vm.currentUser.points.sat + 1) / Math.log(2) )
        vm.showUserLinks = true;
        vm.signedIn = true;
        if(vm.currentUser.level) $state.go('profile');
      }
    })
  }

  $scope.$on('raise-exp-score', function(event, args) {
    if(vm.currentUser.username){

      var newScore = vm.currentUser.points.expression + 1
      $http({
        method: 'PUT',
        url: "http://localhost:3000/users/" + vm.currentUser.username + "/edit",
        data:{
          points: {
            expression: newScore,
            equation: vm.currentUser.points.equation
          }
        }
      }).success(function(data){

        userFactory.all().success(function(data){
          vm.users = data;
          for(i=0; i<vm.users.length; i++){
            vm.users[i].level = Math.floor( Math.log(vm.users[i].points.equation + vm.users[i].points.expression + vm.users[i].points.sat + 1) / Math.log(2) )
          }
        })
        vm.login(vm.currentUser.username, vm.currentUser.password);
      })
    }

  })

  $scope.$on('raise-eq-score', function(event, args) {
    if(vm.currentUser.username){

      var newScore = vm.currentUser.points.equation + 1
      $http({
        method: 'PUT',
        url: "http://localhost:3000/users/" + vm.currentUser.username + "/edit",
        data:{
          points: {
            equation: newScore,
            expression: vm.currentUser.points.expression
          }
        }
      }).success(function(data){
        console.log("success")
        userFactory.all().success(function(data){
          vm.users = data;
          for(i=0; i<vm.users.length; i++){
            vm.users[i].level = Math.floor( Math.log(vm.users[i].points.equation + vm.users[i].points.expression + vm.users[i].points.sat + 1) / Math.log(2) )
          }
        })
        vm.login(vm.currentUser.username, vm.currentUser.password);
      })
    }

  })


  vm.logout = function(){
    vm.currentUser = {username: ""};
    vm.signedIn = false;
    $state.go('home')
  }
})






