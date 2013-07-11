function IndexCtrl($scope, $http) {
  $http.get('/users').
    success(function(data, status, headers, config) {
      $scope.users = data.users;
    });
}
