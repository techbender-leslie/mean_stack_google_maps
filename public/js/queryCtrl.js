//create the queryCtrl Module and Controller. Users geolocation and gservice
var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

	// initialize variables. This controller relies on $scope to pull all of the form data from the active queryForm.html file.
	$scope.formData = {};
	var queryBody = {};

	// get users' actual coordinated based on HTML5 at window load
	geolocation.getLocation().then(function(data){
		coords = {lat:data.coords.latitude, long:data.coords.longitude};

		// set those HTML5 coordinates as latitude and longitude
		$scope.formData.longitude = parseFloat(coords.long).toFixed(3);
		$scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
	});

	//Get coordinates based on when mouse is clicked.
	$rootScope.$on("clicked", function(){

		// Run the gservice functions associated with identifying coordinates
		$scope.$apply(function(){
			$scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
			$scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
		});
	}); 

	// Take query paramewters and put into a JSON queryBody
	$scope.queryUsers = function(){

		// Assemble Query Body
		queryBody = {
			longitude: parseFloat($scope.formData.longitude),
			latitude: parseFloat($scope.formData.latitude),
			distance: parseFloat($scope.formData.distance),
			male: $scope.formData.male,
			female: $scope.formData.female,
			other: $scope.formData.other,
			minAge: $scope.formData.minage,
			maxAge: $scope.formData.maxage,
			favLang: $scope.formData.favLang,
			reqVerified: $scope.formData.verified
	};

	$http.post('/query', queryBody)

		.success(function(queryResults){

			// console.log("QueryBody");
			// console.log(queryBody);
			// console.log("QueryResults");
			// console.log(queryResults);
			gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

			$scope.queryCount = queryResults.length;
			})
			.error(function(queryResults){
				console.log('Error ' + queryResults);
			});

		};
	});