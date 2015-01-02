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
            // the view refereneced by url above will return all publication-distribution docs whose "viewed" attrib is set to false
            // and whose "communityName" attrib value matches value of 'currentBellName' above.
            console.log(DbUrl);
            // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
            // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
            $.ajax({
				url: DbUrl,
				type: 'GET',
				dataType: 'jsonp',
				success: function (json) {
                    var publicationDistribDocsFromNation = [], tempKeys = [];
                    _.each(json.rows,function(row){
                        publicationDistribDocsFromNation.push(row.doc);
                        tempKeys.push(row.doc.publicationId);
                    });
                    // fetch all publications from local/community server to see how many of the publications from nation are new ones
                    var newPublicationsCount = 0;
                    var publicationCollection = new App.Collections.Publication();
//                    publicationCollection.setKeys(tempKeys);
                    var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
                    publicationCollection.setUrl(tempUrl);
                    publicationCollection.fetch({
                        success: function () {
                            var alreadySyncedPublications = publicationCollection.models;
                            for (var i in publicationDistribDocsFromNation){
                                // if this publication doc exists in the list of docs fetched from nation then ignore it from new publications
                                // count
                                var index = alreadySyncedPublications.map(function(element) {
//                                    console.log("hmm");
                                    return element.get('_id');
                                }).indexOf(publicationDistribDocsFromNation[i].publicationId);
                                if (index > -1) {
                                    // don't increment newPublicationsCount cuz this publicationId already exists in the already synced publications at
                                    // local server
                                } else {
                                    newPublicationsCount++;
                                }
                            }
                            htmlreferance.append('<a class="btn systemUpdate" id="newPublication" href="#publications/for-'+currentBellName+'">Publications (new '+newPublicationsCount+')</a>')
                        }
                    });

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
//			   var config = new App.Collections.Configurations()
//			   config.fetch({
//				   async: false
//			   })
//			   var configuration = config.first()
//			   var configView = new App.Views.ConfigurationView()
//			   configView.model = configuration
//			   configView.render()

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