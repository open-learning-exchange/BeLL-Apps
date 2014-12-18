$(function () {

    App.Views.Configurations = Backbone.View.extend({
    
        initialize: function () {
            this.$el.html('<h3>Set Configurations<h3>')
        },
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el);
            this.form.fields['nationName'].$el.hide();
            this.form.fields['nationUrl'].$el.hide();
            this.$el.append('<a style="margin-left:2px" class="btn btn-success" id="formButton">Submit Configurations </a>');
        },
        setForm:function(){
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config=this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({async:false});
            var con=config.first();
            con.set('name',Config.get('name'));
            con.set('nationName',Config.get('nationName'));
            con.set('nationUrl',Config.get('nationUrl'));
            con.set('code',Config.get('code'));
            con.set('type',Config.get('type'));
            con.set('notes',Config.get('notes'));
//            con.set('currentLanguage',Config.get('availableLanguages'));
            con.save(null,{ success: function(doc,rev){
                alert('Configurations are Successfully Added');
                Backbone.history.navigate('dashboard', {trigger: true});
//                var member = new App.Models.Member({"_id": $.cookie('Member._id')});
//                member.fetch({async: false,
//                    success: function () {
//                        if ((member.get('login') === "admin") && (member.get('password') === 'password')) {
//                            alert("Please change the password for this admin account for better security of the account and the application.");
//                            Backbone.history.navigate('member/edit/' + member.get('_id'), {trigger: true});
//                        } else {
//                            Backbone.history.navigate('dashboard', {trigger: true});
//                            location.reload();
//                        }
//                    },
//                    error: function() {
//                        Backbone.history.navigate('dashboard', {trigger: true});
//                        location.reload();
//                    }
//                });
            }});
    	    	

        
        }

    })

})