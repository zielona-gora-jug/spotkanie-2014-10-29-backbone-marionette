var HeaderView = Backbone.View.extend({

	// notice missing $el, hence by default there is div

	initialize : function() {
		this.render();
	},
	
	render : function() {
		this.$el.html(Handlebars.compile(TemplateManager.get("template/header.html")));
		return this;
	},

	select : function(item) {
		this.$('.nav li').removeClass('active');
		this.$("#" + item).addClass('active');
	}

});

var Car = Backbone.Model.extend({
	
	urlRoot : '/cars',
	
	// notice defaults or there can be nothing
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

var Router = Backbone.Router.extend({

	routes : {
		"" : "home",
		"add" : "addCar",
		"edit/:id" : "editCar",
		"list" : "carsList"
	},

	initialize : function() {

		this.header = new HeaderView();
		$("#header").html(this.header.el); // notice global scope here to get header element :-(
		
	},

	home : function() {
		new HomeView();
		this.header.select("home");
	},

	addCar : function() {
		new AddOrEditView();
		this.header.select("add");
	},
	
	editCar : function(id) {
		new AddOrEditView({id : id});
		this.header.select("edit");
	},
	
	carsList : function() {
		new ListView();
		this.header.select("list");
	},
});


var HomeView = Backbone.View.extend({

	el : '#content',

	initialize : function() {
		this.template = Handlebars.compile(TemplateManager.get("template/home.html"));
		this.render();
	},

	render : function() {
		
		// notice binding JSON with template
		
		this.$el.html(this.template({
			"who" : "folks"
		}));
	}
});

var ListItemView = Backbone.View.extend({

	tagName : "tr",
	
	events : {
		"click #remove" : "removeItem",
		"click #edit" : "editItem"
	},
	
	initialize : function() {
		this.template = Handlebars.compile(TemplateManager.get("template/car_list_item.html"));
	},

	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	
	removeItem : function() {
		this.model.destroy();
	},

	editItem : function() {
		router.navigate("#edit/" + this.model.id, true);
	}

});

var ListView = Backbone.View.extend({

	el : "#content",
	
	initialize : function() {

		this.cars = new Cars();
		this.listenTo(this.cars, "reset remove", this.render, this);
		this.cars.fetch({reset : true}); // notice reset = true, silent merge if false, otherwise re-build whole collection
		return this;
	},

	render : function() {
		this.$el.html(Handlebars.compile(TemplateManager.get("template/car_list.html")));
		var rows = this.$("#rows");
		this.cars.each(function(car) {
			rows.append(new ListItemView({model : car}).render().el);
		});
	}
});


var AddOrEditView = Backbone.View.extend({

	el : "#content",

	// notice listening DOM events
	events : {
		"click #save" : "addOrEdit",
		"click #cancel" : "goToHome"
	},

	initialize : function(options) {
		this.template = Handlebars.compile(TemplateManager.get("template/add_edit_car_form.html"));
		this.isEditMode = options != undefined && options.id != undefined;
		if (this.isEditMode) {
			this.model = new Car({id : options.id});
			this.listenTo(this.model, "change", this.render, this);
			this.model.fetch();
		} else {
			this.model = new Car();
			this.render();
		}
	},

	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this; // notice return this
	},

	addOrEdit : function() {
		this.model.set(this.createNewAttributes());
		this.model.save(); // notice save as an abstracted AJAX call
		this.listenTo(this.model, "sync", this.goToList, this); // notice listening sync event on a collection
	},
	
	createNewAttributes : function() {
		return {
			name : this.$("#name").val(), 
			productionYear : this.$("#productionYear").val(), 
			price : this.$("#price").val()
		}
	},
	
	goToHome : function() {
		router.navigate("#", true);
	},
	
	goToList : function() {
		router.navigate("#list", true);
	}
});