function Airport1Ctrl ($scope, $routeParams) {
	$scope.currentAirport = $scope.airports[$routeParams.airport1];
}