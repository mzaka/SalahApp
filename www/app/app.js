// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('Items', ['$firebaseArray', function($firebaseArray){
  var itemRef = new Firebase('https://resplendent-heat-9068.firebaseio.com/')
  return $firebaseArray(itemRef);
    
  
}])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://fbzakalogin.firebaseio.com");
  return $firebaseAuth(usersRef);
})



.controller('ListCtrl', function($scope,$ionicListDelegate,$location, Items,Auth){

  $scope.items = Items;

  $scope.login = function() {
  Auth.$authWithOAuthRedirect("facebook")
  .catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
          $location.path('/app/settings').replace();
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
};



Auth.$onAuth(function(authData) {
  if (authData === null) {
    console.log("Not logged in yet");
  } else {
    console.log("Logged in as", authData.uid);
  }
  $scope.authData = authData; // This will display the user's name in our view

});

$scope.logout = function() {
  var usersRef = new Firebase("https://fbzakalogin.firebaseio.com");
    usersRef.unauth();
  };

  $scope.addItem = function(){
    var name = prompt("What do you need to buy ?")
    if(name){
      $scope.items.$add({
        'name':name
      });
    }
  };

  $scope.purchaseItem = function(item){
    var itemRef = new Firebase('https://resplendent-heat-9068.firebaseio.com/' + item.$id);
    console.log(item.$id);
    itemRef.child('status').set('purchased');
    $ionicListDelegate.closeOptionButtons();

  };
  
})

.controller('ContentController', function ($scope, $ionicSideMenuDelegate) {
    $scope.showMessage = function () {
        alert('Report');
    }
})
    



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      abstract: true,
      url: "/app",
      templateUrl: "app/layout/menu.html"
    })

    .state('app.main', {
      url: "/main",
      views: {
        'mainContent': {
          templateUrl: "app/mainview/mainview.html"
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'mainContent': {
          templateUrl: "app/login/login.html"
        }
      }
    })

    .state('app.dash', {
      url: "/dash",
      views: {
        'mainContent': {
          templateUrl: "app/dashboard/dashboard.html"
        }
      }
    })
    .state('app.settings', {
      url: "/settings",
      views: {
        'mainContent': {
          templateUrl: "app/settings/settings.html"
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});


