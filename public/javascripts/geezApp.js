const app = angular.module("geezApp", ["ngRoute", "ngResource"]);

// ROUTING - CONFIG
app.config(function ($routeProvider) {
  $routeProvider
    //the timeline display
    .when("/", {
      templateUrl: "main.html",
      controller: "mainController",
    })
    //the login display
    .when("/login", {
      templateUrl: "login.html",
      controller: "authController",
    })
    //the signup display
    .when("/register", {
      templateUrl: "register.html",
      controller: "authController",
    });
});

// SERVICES
app.factory("postService", function ($resource) {
  return $resource("/api/posts/:id");
});

// MAIN CONTROLLER
app.controller("mainController", function ($scope, $rootScope, postService) {
  $scope.posts = postService.query();
  $scope.newPost = {
    created_by: "",
    created_at: "",
    content: "",
  };

  // SEND & SAVE new post
  $scope.post = function () {
    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function () {
      $scope.posts = postService.query();
      $scope.newPost = { created_by: "", content: "", created_at: "" };
    });
  };

  // DELETE new post
  $scope.delete = function (post) {
    postService.delete({ id: post._id });
    $scope.posts = postService.query();
  };
});

// AUTHENTIFICATION CONTROLLER
// prettier-ignore
app.controller("authController", function ($scope, $rootScope, $http, $location) {
  $scope.user = { username: "", password: "" };
  $scope.error_message = "";

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    })
  };
});

// LAUNCH APP
app.run(function ($rootScope, $http) {
  $rootScope.authenticated = false;
  $rootScope.current_user = "Guest";

  $rootScope.logout = function () {
    $http.get("/auth/signout");
    $rootScope.authenticated = false;
    $rootScope.current_user = "Guest";
  };
});
