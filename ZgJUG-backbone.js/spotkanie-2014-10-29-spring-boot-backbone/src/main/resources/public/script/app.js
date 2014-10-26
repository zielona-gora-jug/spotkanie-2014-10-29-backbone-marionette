var AppView = Backbone.View.extend({
	el : '#app',

	initialize : function() {
		console.log("app init");
		this.render();
	},

	render : function() {
		var cars = new Cars();
		cars.fetch({
			success : function() {
				console.log("list fetched with size: " + cars.length);
			}
		});
	}
});

var Router = Backbone.Router.extend({
	routes : {
		"cars" : "carsList",
	},

	carsList : function() {
		console.log("cars list");
	},
});

var Car = Backbone.Model.extend({
	defaults : {
		name : 'No name',
		price : 0,
		productionYear : 0,
	}
});

var Cars = Backbone.Collection.extend({
	model : Car,
	url : '/cars'
});
