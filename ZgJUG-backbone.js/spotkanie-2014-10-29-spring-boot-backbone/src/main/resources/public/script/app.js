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
	url : '/cars',

	// notice logic around cars data
	
	byName: function(name) {
		var pattern = new RegExp(name,"gi");
	    filtered = this.filter(function(car) {
	    	return pattern.test(car.get("name"));
	      });
	    return new Cars(filtered);
	 }
});

var Router = Backbone.Router.extend({

	routes : {
		"" : "home",
		"add" : "addCar",
		"edit/:id" : "editCar",
		"list" : "carsList",
	},

	initialize : function() {
		// notice global scope here to get header element :-(
		this.header = new HeaderView();
		$("#header").append(this.header.el); 
		this.content = $("#content");
	},

	home : function() {
		var homeView = new HomeView();
		this.content.empty();
		this.content.append(homeView.el);
		this.header.select("home");
	},

	addCar : function() {
		var addView = new AddView();
		this.content.empty();
		this.content.append(addView.el);
		this.header.select("add");
	},
	
	editCar : function(id) {
		var editView = new EditView({id : id});
		this.content.empty();
		this.content.append(editView.el);
		this.header.select("edit");
	},
	
	carsList : function() {
		var listView = new ListView();
		this.content.empty();
		this.content.append(listView.el);
		this.header.select("list");
	},
	
	emptyContent : function() {
		this.content.empty();
	}
});


var HomeView = Backbone.View.extend({

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
		this.template = Handlebars.compile(TemplateManager.get("template/list_item.html"));
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

	className : "table-responsive",
	
	events : {
		"keyup #filter" : "filterByName" 
	},	
	
	initialize : function() {

		this.cars = new Cars();
		this.listenTo(this.cars, "reset remove", this.render, this);
		this.cars.fetch({reset : true}); // notice reset = true, silent merge if false, otherwise re-build whole collection

		return this;
	},

	render : function() {
		this.$el.html(Handlebars.compile(TemplateManager.get("template/list.html")));
		this.renderList(this.cars);
	},
	
	filterByName : function() {
		var name = this.$("#filter").val();
		if(name == "") {
			this.renderList(this.cars);
			return;
		}
		this.renderList(this.cars.byName(name));
	},
	
	renderList : function(list) {
		var rows = this.$("#rows");
		rows.empty();
		list.byName(name).each(function(car) {
			rows.append(new ListItemView({model : car}).render().el);
		});
	}
});


var AddOrEditView = Backbone.View.extend({

	tagName : "form",
	
	// notice listening DOM events
	events : {
		"click #save" : "save",
		"click #cancel" : "goToHome"
	},

	initialize : function(options) {
		console.log("base add or edit init");
		this.template = Handlebars.compile(TemplateManager.get("template/add_edit_form.html"));
	},

	render : function() {
		console.log("base add or edit render");
		return this;
	},
	
	save : function() {
		this.model.set(this.createNewAttributes());
		this.model.save(); // notice save as an abstracted AJAX call
		this.listenTo(this.model, "sync", this.goToList, this); // notice listening sync event on a collection
	},
	
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this; // notice return this
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
		this.remove();
	},
	
	goToList : function() {
		router.navigate("#list", true);
		this.remove();
	}
});

var AddView = AddOrEditView.extend({

	initialize : function(options) {
		AddOrEditView.prototype.initialize.apply(this, arguments);
		console.log("add init");
		this.model = new Car();
		this.render();
	},
});

var EditView = AddOrEditView.extend({

	initialize : function(options) {
		AddOrEditView.prototype.initialize.apply(this, arguments);
		console.log("edit init");
		this.model = new Car({id : options.id});
		this.listenTo(this.model, "change", this.render, this);
		this.model.fetch();
	},
});
