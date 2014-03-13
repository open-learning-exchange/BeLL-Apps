$(function () {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",
        id: "itemsinnavbar",
        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        initialize: function (option) {
            
            console.log('nav initialize')
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
            var temp = Backbone.history.location.href
            temp = temp.split('#')
            
    	    var version=''
    	 
            var config = new App.Collections.Configurations()
             config.fetch({
             	async: false
             })
             var configuration = config.first()
             
             var clanguage = configuration.get("currentLanguage")
             var languageDict = configuration.get(clanguage)
    	     version=configuration.get('version')
    	     
             this.data = {
                uRL: temp[1],
                versionNO:version,
                languageDict:languageDict
             } 
            
             this.$el.append(this.template(this.data))
        },

        render: function () {}

    })

})