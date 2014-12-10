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
//        var processJsonp = function (data) {
//            alert();
//        },
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
            
            var DbUrl='http://'+nName+':'+pass+'@'+nUrl+'/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["'+currentBellName+'",'+false+']'
            console.log(DbUrl);

            var processJsonp = function (data) {
                alert("zzzZZZZZZ");
                dataAsJson = $.parseJSON(data);
                console.log(dataAsJson);
            };
            // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
            // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
            $.ajax({
				url: DbUrl,
				type: 'GET',
				dataType: 'jsonp',
                jsonpCallback : 'processJsonp',
				success: function (json) {
				    publications=new Array()
				    _.each(json.rows,function(row){
				      publications.push(row.doc.publicationId)

				    })
				   htmlreferance.append('<a class="btn systemUpdate" id="newPublication" href="#publications/'+publications+'">Publications ('+json.rows.length+')</a>')
				},
                error: function(jqXHR, status, errorThrown){
                    console.log(jqXHR);
                    console.log(status);
                    console.log(errorThrown);
                }
			});
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
			   var config = new App.Collections.Configurations()
			   config.fetch({
				   async: false
			   })
			   var configuration = config.first()
			   var configView = new App.Views.ConfigurationView()
			   configView.model = configuration
			   configView.render()
			   this.$el.html(configView.el)
       },

    })

})