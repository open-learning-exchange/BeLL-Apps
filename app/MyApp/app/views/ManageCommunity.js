$(function () {

    App.Views.ManageCommunity = Backbone.View.extend({
    
        events: {
            "click .SyncDbSelect": 'SyncDbSelect',
            "click #configuration": 'Configuration',
            "click .back":function(e){
               alert('back')
            },
            
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>Meetup Detail</h6></th>')
            
        },
        
        processJsonp: function(){
                    alert();
        },
        render: function () {
        
           // here we willn check the any new updated 
            this.$el.html('')
            nName=App.configuration.get('nationName')
            pass=App.password
            nUrl=App.configuration.get('nationUrl')
            currentBellName=App.configuration.get('name')
            var htmlreferance=this.$el
            
            this.$el.append('<a id="configuration"><button class="btn btn-primary" id="configbutton">Configurations</button></a>')
            this.$el.append('<button class="SyncDbSelect btn btn-primary" id="sync">Sync With Nation</button>')
        },
        syncDbs:function(e){  
            alert('this is sync db function in community manage')
        },
        SyncDbSelect: function() {
			$('#invitationdiv').fadeIn(1000)
			var inviteForm = new App.Views.listSyncDbView()

			inviteForm.render()
			$('#invitationdiv').html('&nbsp')
			$('#invitationdiv').append(inviteForm.el)
        },
        Configuration: function() {
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
			    async: false
		    });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
               model: configModel
            })
           configForm.render();

		   this.$el.html(configForm.el);
       },

    })

})