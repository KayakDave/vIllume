function IndexCtrl($scope, $http) {
  $http.get('/users').
    success(function(data, status, headers, config) {
      $scope.users = data.users;
      // Get Portland 911 data
         
		var pdx911Url = "http://www.portlandonline.com/scripts/911incidents.cfm";
 	    $http.defaults.useXDomain = true;
		delete $http.defaults.headers.common['X-Requested-With'];
		$http.get(pdx911Url,{transformResponse:function(data) {
			// Convert to JSON
			var x2js = new X2JS();
			var json = x2js.xml_str2json(data);
			return json;
			}
		}
		).
		success(function(data,status,headers,config) {
			$scope.feed = {
				title: 'PDX 911',
				items: data.query.results.entry
			};
		}).
		error(function(data,status,headers,config) {
			console.error('Error fetching feed: ', data);
		})

    });
}
