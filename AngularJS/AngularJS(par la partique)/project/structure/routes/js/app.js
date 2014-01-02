angular.module('airline', [])
	.config(airlineRouter);

function airlineRouter ($routeProvider) {
	$routeProvider
		.when('/', {templateUrl: 'partials/destinations.html'})
		.when('/flights', {template: '<h3>Flights</h3>'})
		.when('/reservations', {template: '<h3>Your Reservations</h3>'});
}