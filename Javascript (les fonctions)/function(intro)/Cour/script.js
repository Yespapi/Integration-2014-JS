var  calc  = {
	status:'Awe some',
	plus: function(a,b) {
		return (
			console.log(this),
			console.log(a+b),
			console.log(arguments),
			console.log(this.status)
		)
	}
}
calc.plus(2,2);