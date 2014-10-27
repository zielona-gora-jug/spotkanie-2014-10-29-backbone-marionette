var HeaderView = Backbone.View.extend({

	// div by default, cuz no $el specified here

	initialize : function() {
		this.template = Handlebars.compile(TemplateManager.get("template/header.html"));
	},

	render : function() {
		this.$el.html(this.template);
		return this;
	},

	select : function(item) {
		this.$('.nav li').removeClass('active');
		this.$("#" + item).addClass('active');
	}

});

var HomeView = Backbone.View.extend({

	el : '#content',

	initialize : function() {
		console.log("home init");
		this.template = Handlebars.compile(TemplateManager.get("template/home.html"));
		this.render();
	},

	render : function() {
		this.$el.html(this.template({
			"who" : "folks"
		}));
	}
});

var Router = Backbone.Router.extend({

	routes : {
		"" : "home",
		"add" : "addCar",
		"list" : "carsList"
	},

	initialize : function() {
		this.header = new HeaderView();
		// global scope here to get header :-( ...
		$("#header").html(this.header.render().el);
	},

	home : function() {
		console.log("go to home");
		new HomeView().render();
		this.header.select("home");
	},
	addCar : function() {
		console.log("go to add form");
		new AddCarView().render();
		this.header.select("add");
	},
	carsList : function() {
		console.log("go to cars list");
		new CarsListView().render();
		this.header.select("list");
	},
});

var Car = Backbone.Model.extend({
	
	url : "/cars",
	
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

var AddCarView = Backbone.View.extend({

	el : "#content",

	events : {
		"click #save" : "save",
		"click #cancel" : "goToHome"
	},

	initialize : function() {
		this.template = Handlebars.compile(TemplateManager.get("template/add_car_form.html"));
	},

	render : function() {
		this.$el.html(this.template);
		return this;
	},

	goToHome : function() {
		router.navigate("#", true);
	},
	
	save : function() {
		var newCar = new Car(this.createNewCar());
		newCar.save();
		// notice that we are listen here sync event
		this.listenTo(newCar, "sync", this.redirectToList);
	},
	
	createNewCar : function() {
		return {
			name : this.$("#name").val(), 
			productionYear : this.$("#productionYear").val(), 
			price : this.$("#price").val()
		}
	},
	
	redirectToList : function() {
		router.navigate("#list", true);
	}
});

var CarsListItemView = Backbone.View.extend({

	initialize : function() {

	},

	render : function() {

	}
});

var CarsListView = Backbone.View.extend({

	initialize : function() {
		this.template = Handlebars.compile(TemplateManager.get("template/car_list.html"));
		this.cars = new Cars();
		this.listenTo(this.cars, "reset", this.render);
		this.cars.fetch();
	},

	render : function() {
		console.log(this.cars.models);
		this.cars.each(function(car) {
			console.log(car.toJSON());
		});
	}
});
