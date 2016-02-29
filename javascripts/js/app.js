angular.module('NickCastaneda', ['ui.router'])
  .config(MainRouter)

function MainRouter($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/projects.html"
    })
    .state('about', {
      url: "/",
      templateUrl: "partials/about-me.html"
    })
    .state('projects', {
      url: "/",
      templateUrl: "partials/projects.html"
    })
    .state('contact', {
      url: "/",
      templateUrl: "partials/contact.html"
    })

  $urlRouterProvider.otherwise("/");
}
