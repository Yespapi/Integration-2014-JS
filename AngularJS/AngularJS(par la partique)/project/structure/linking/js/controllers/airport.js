function AirportCtrl ($scope, $routeParams) {
	$scope.currentAirport = $scope.airports[$routeParams.airportCode];
}