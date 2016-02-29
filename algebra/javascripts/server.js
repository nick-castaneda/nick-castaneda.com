////////////////////////////////////////////////////////////////////////
//                             server.js                              //
////////////////////////////////////////////////////////////////////////

// Sets up an angular module called 'algebra' and inserts the ui-router,
// the user and sat services, and the equation logic.
var app = angular.module('algebra', ['ui.router', 'userService', 'satService', 'equationSolverLogic', 'expressionSimplifierLogic'])
  .config(MainRouter)

// Routing for the entire application. Each route is set to the root url
// and is linked to a partial of the same name as the state.
function MainRouter($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/home.html"
    })
    .state('equation-solver', {
      url: "/",
      templateUrl: "partials/equation-solver.html"
    })
    .state('expression-simplifier', {
      url: "/",
      templateUrl: "partials/expression-simplifier.html"
    })
    .state('sat-problems', {
      url: "/",
      templateUrl: "partials/sat-problems.html"
    })
    .state('notes', {
      url: "/",
      templateUrl: "partials/notes.html"
    })
    .state('profile', {
      url: "/",
      templateUrl: "partials/profile.html"
    })

  $urlRouterProvider.otherwise("/");
}


// app.filter('sup', function () {
//     return function (text, length) {
//         if (text.length > length) {
//             return text.substr(0, length) + "<a href='#'>...</a>";
//         }
//         return text;
//     }
// })





