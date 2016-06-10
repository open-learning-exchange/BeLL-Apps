$(function() {

    App.Views.CommunityDetailsView = Backbone.View.extend({

        className: "addNation-form",
        vars: {},

        events: {
            "click #acceptRegistration": 'acceptCommunityRegistration',
            "click #rejectRegistration": 'rejectCommunityRegistration'
        },

        template: $('#template-communityDetails').html(),

        render: function() {
            var that = this;
            var vars = this.model.toJSON();
            vars.authName = that.getLoggedInName();
            if(vars.superManagerID == '') {
                vars.superManagerID = 'testID';
            }
            if(vars.superManagerPassword == '') {
                vars.superManagerPassword = 'testPassword';
            }
            vars.authDate = new Date();
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
            this.model.set('isAccepted', "true")
            this.model.set('authName', this.getLoggedInName());
            this.model.set('authDate', new Date());
            this.model.save(null, {
                success: function (response) {
                    alert('Registered successfully');
                    Backbone.history.navigate('listCommnitiesRequest', {
                        trigger: true
                    })
                },
                async:false
            });
        },

        rejectCommunityRegistration: function() {
            this.model.set('isAccepted', "false");
            this.model.set('authName', this.getLoggedInName());
            this.model.set('authDate', new Date());
            this.model.save(null, {
                success: function (response) {
                    alert('Registration rejected');
                    Backbone.history.navigate('listCommnitiesRequest', {
                        trigger: true
                    })
                },
                async:false
            });
        }
    })

})