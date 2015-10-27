$(function() {

    App.Views.MeetUpRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {},

        template: $("#template-MeetUpRow").html(),

        initialize: function(e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function() {

            var vars = this.model.toJSON()
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var con = config.first();
            var currentConfig = config.first().toJSON().rows[0].doc;
            var clanguage= currentConfig.currentLanguage;
            var languages = new App.Collections.Languages();
            languages.fetch({
                async: false
            });
            var languageDict;
            for(var i=0;i<languages.length;i++)
            {
                if(languages.models[i].attributes.hasOwnProperty("nameOfLanguage"))
                {
                    if(languages.models[i].attributes.nameOfLanguage==clanguage)
                    {
                        languageDict=languages.models[i];
                    }
                }
            }
            App.languageDict = languageDict;

            if (this.roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1;
                vars.languageDict=App.languageDict;

            } else {
                vars.isAdmin = 0;
                vars.languageDict=App.languageDict;
            }


            if (vars.creator && vars.creator == $.cookie('Member._id')) {
                vars.creator = 1
                vars.languageDict=App.languageDict;
            } else {
                vars.creator = 0
                vars.languageDict=App.languageDict;
            }

            if (vars._id != '_design/bell')
                this.$el.append(_.template(this.template, vars))
        }

    })

})