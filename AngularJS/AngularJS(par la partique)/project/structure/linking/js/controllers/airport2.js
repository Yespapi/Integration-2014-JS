function Airport2Ctrl ($scope, $routeParams) {
	$scope.currentAirport = $scope.airports[$routeParams.airport2];
}