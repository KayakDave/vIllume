function IndexCtrl($scope, $http) {
  $http.get('/users').
    success(function(data, status, headers, config) {
      $scope.users = data.users;
    });
   $http.get('/api/pdx911').
     success(function(data,status,headers,config) {
     	$scope.pdx911 = data.pdx911;
     	handoffPdx911(data.pdx911);
     })
}
