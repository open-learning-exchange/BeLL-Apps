$(function() {

    App.Views.CommunityDetailsView = Backbone.View.extend({

        className: "addNation-form",
        vars: {},
        status: '',
        events: {
            "click #acceptRegistration": 'acceptCommunityRegistration',
            "click #rejectRegistration": 'rejectCommunityRegistration'
        },

        template: $('#template-communityDetails').html(),

        render: function() {
            var that = this;
            var vars;
            if(that.status == 'registered') {
                vars = this.model.toJSON();
            } else {
                vars = this.model;
                vars.authDate = new Date();
            }
            vars.authName = that.getLoggedInName();
            vars.superManagerID = 'testID';
            vars.superManagerPassword = 'testPassword';
            this.$el.append(_.template(that.template, vars));
        },

        getLoggedInName: function () {
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            });
            var config = new configurations();
            config.fetch({
                async: false
            });
            var jsonConfig = config.first().toJSON().rows[0].doc;
            var members = new App.Collections.Members()
            var member, loggedInName;
            members.login = $.cookie('Member.login');
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        for(var i = 0; i < members.length; i++) {
                            if(members.models[i].get("community") == jsonConfig.code) {
                                member = members.models[i];
                            }
                        }
                    }
                },
                async:false
            });
            loggedInName = member.get('firstName') + ' ' + member.get('lastName');
            return loggedInName;
        },

        acceptCommunityRegistration: function() {
            this.processRegistration('accepted');
        },

        rejectCommunityRegistration: function() {
            this.processRegistration('rejected');
        },

        processRegistration: function (status) {
            var doc = this.model;
            var docID = [];
            docID.push(doc._id);
            doc.registrationRequest= status;
            doc.authName= this.getLoggedInName();
            doc.authDate= new Date();
            // Update the registrationRequest attribute from pending to registered in that nation's pending request database.
            $.couch.db("pendingrequests").saveDoc(doc, {
                success: function(data) {
                    // Replicate the updated document on that nation's registeredcommunities database.
                    if(status == 'accepted') {
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            type: 'POST',
                            url: '/_replicate',
                            dataType: 'json',
                            data: JSON.stringify({
                                "source": "pendingrequests",
                                "target": 'registeredcommunities',
                                'doc_ids': docID
                            }),
                            async: false,
                            success: function (response) {
                                console.log('Successfully replicated to registeredcommunities database')
                            },
                            error: function(status) {
                                console.log("Error for local replication");
                            }
                        });
                    }
                    //Now, also replicate that community's document in registeredcommunities database of nbs.ole.org
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": "pendingrequests",
                            "target": 'http://nbs:oleoleole@nbs.ole.org:5997/registeredcommunities',
                            'doc_ids': docID
                        }),
                        async: false,
                        success: function (response) {
                            console.log('Successfully replicated pending request to central db')
                            // Lastly, remove the document from that nation's pendingrequests database.
                            $.couch.db("pendingrequests").removeDoc(doc, {
                                success: function(data) {
                                    Backbone.history.navigate('listCommunitiesRequest', {
                                        trigger: true
                                    })
                                },
                                error: function(status) {
                                    console.log(status)
                                }
                            });
                        },
                        error: function(status) {
                            console.log("Error for remote replication");
                        }
                    });
                },
                error: function(status) {
                    console.log(status);
                }
            });
        }
    })

})