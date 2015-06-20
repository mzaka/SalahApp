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
  var itemRef = new Firebase('https://radiant-inferno-52.firebaseio.com/')
  return $firebaseArray(itemRef);
    
  
}])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://radiant-inferno-52.firebaseio.com/");
  return $firebaseAuth(usersRef);
})



.controller('ListCtrl', function($scope,$ionicListDelegate, Items,Auth){

  $scope.items = Items;

  $scope.login = function() {
  Auth.$authWithOAuthRedirect("facebook")
  .catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
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
    
.controller('DashboardCtrl', function($scope, TrackItems) {

    $scope.items = TrackItems;

    //ion-list options setting    
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function(position) {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            console.log("Latitude: " + $scope.lat + " | Longitude: " + $scope.lng); 

            prayTimes.setMethod('ISNA');
            $scope.prayTimesToday = prayTimes.getTimes(new Date(), [$scope.lat, $scope.lng], +4);
            console.log($scope.prayTimesToday);

            $scope.$digest();
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    $scope.markSalah = function(date, prayer_name, performed_as) {

      //check if entry already available

      //1st if the user data for the day is available


      //2nd if yes, modify if no, add new
      $scope.addNewItem = function() {
        var _userId = '123456';//$rootScope.authData.uid;
        var _date = date;
        var _data = {};
        _data[prayer_name] = {
              "performed_as": performed_as,
              "prayed_sunnah": "true"
        };

        $scope.items.$add({
          "userId": _userId,
          "date": _date,
          "data": _data
        });

      };

      $scope.addNewItem();
    }
})

.factory("TrackItems", function($firebaseArray) {
  var trackItemsRef = new Firebase("https://radiant-inferno-52.firebaseio.com/track");
  return $firebaseArray(trackItemsRef);
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
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});


