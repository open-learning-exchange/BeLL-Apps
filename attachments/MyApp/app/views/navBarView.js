$(function () {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",
        id: "itemsinnavbar",
        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        initialize: function (option) {
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
            var temp = Backbone.history.location.href
            temp = temp.split('#')
            
    		var version=''
    	 
    	 	if(!App.configuration)
    	 	{
        		var config = new App.Collections.Configurations()
    	    	config.fetch({async:false})
    	    	var con=config.first()
            	App.configuration = config.first()
    	 	}
            var clanguage = App.configuration.get("currentLanguage")
            var languageDict = App.configuration.get(clanguage)
            version=App.configuration.get('version')
        	this.data = {
                uRL: temp[1],
                versionNO:version,
                languageDict:languageDict
            } 
            this.$el.append(this.template(this.data))
            if(!App.member && $.cookie('Member._id'))
            {
            	 var member = new App.Models.Member()
            	 member.set('_id', $.cookie('Member._id'))
            	 member.fetch({
                	async: false
                })
                App.member = member
            }
        },

        render: function () {}

    })

})