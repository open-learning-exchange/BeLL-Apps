$(function() {

    App.Views.Configurations = Backbone.View.extend({

        initialize: function() {
            this.$el.html('<h3>Set Configurations<h3>')
        },
        events: {
            "click #formButton": "setForm"
        },
        render: function() {
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el);
            this.$el.append('<a style="margin-left:31px" class="btn btn-success" id="formButton">Submit Configurations </a>');
        },
        updateDropDownValue : function(){
            //alert($('.field-selectLanguage').find('.bbf-editor').find('select').val());

            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var currentConfig = configModel.toJSON();
            var clanguage= currentConfig.currentLanguage;
            $('.field-selectLanguage').find('.bbf-editor').find('select').val(clanguage);
        },
        setForm: function() {
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config = this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({
                async: false
            });
            var con = config.first();
            con.set('name', Config.get('name'));
            con.set('nationName', Config.get('nationName'));
            con.set('nationUrl', Config.get('nationUrl'));
            con.set('code', Config.get('code'));
            con.set('type', Config.get('type'));
            con.set('notes', Config.get('notes'));
            con.set('version', Config.get('version'));
            con.set('subType', 'dummyy');
            con.set('flagDoubleUpdate' , 'raw'); //flag Double update
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            con.save(null, {
                success: function(doc, rev) {
                    App.configuration = con;
                    console.log(App.configuration.get('name'))
                    alert('Configurations are Successfully Added');
                    Backbone.history.navigate('dashboard', {
                        trigger: true
                    });
                }
            });
        }
    })
})