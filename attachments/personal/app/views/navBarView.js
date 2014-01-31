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
            
             var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	var version=''
    		
        if(temp[1]=='login')
        {
            var config=new configurations()
    	     config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
        
    	    
    	    version=cofigINJSON.rows[0].doc.version
        }
        
        this.data = {
                uRL: temp[1],
                versionNO:version
                
            } 
            
            this.$el.append(this.template(this.data))
        },

        render: function () {}

    })

})