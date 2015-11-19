$(function() {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",
        id: "itemsinnavbar",
        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        initialize: function(option) {

            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
            var temp = Backbone.history.location.href
            temp = temp.split('#')

            var version = '';
            var currentLanguage;
            var availableLanguages;
            var languageDictOfApp;

            if (!App.configuration) {
                var config = new App.Collections.Configurations()
                config.fetch({
                    async: false
                })
                 con = config.first()
                App.configuration = con
            }

            if (!App.languageDict) {
                var clanguage = App.configuration.get("currentLanguage");
                // fetch dict for the current/selected language from the languages db/table
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
               // var languageDicts = languages.first().toJSON();
             //   var languageDict = languageDicts[clanguage];
              //  App.languageDict = languageDicts[clanguage];
                //                $.ajax({
                //                    type: 'GET',
                //                    url: '/languages/_all_docs?include_docs=true',
                //                    dataType: 'json',
                //                    success: function (response) {
                //                        var languageDicts = response.rows[0].doc; // put json of all dictionaries in var
                //                        // now get the selected language dict from that var
                //                        App.languageDict = languageDicts[clanguage];
                //                    },
                //                    data: {},
                //                    async: false
                //                });
            }

            version = App.configuration.get('version');
            currentLanguage=App.configuration.get('currentLanguage');
            availableLanguages=App.configuration.get('availableLanguages');
            if(currentLanguage=="Urdu")
            {
                currentLanguage=availableLanguages[2];
            }
            else if(currentLanguage=="Arabic")
            {
                currentLanguage=availableLanguages[1];
            }
            else{
                currentLanguage=availableLanguages[0];
            }

            languageDictOfApp=App.languageDict;

            this.data = {
                uRL: temp[1],
                versionNO: version,
                currentLanguageOfApp:currentLanguage,
                availableLanguagesOfApp:availableLanguages,
                languageDict:languageDictOfApp


            }
            console.log(this.data);
            this.$el.append(this.template(this.data))
            if (!App.member && $.cookie('Member._id')) {
                var member = new App.Models.Member()
                member.set('_id', $.cookie('Member._id'))
                member.fetch({
                    async: false, // by default it is true
                    success: function(model, response) {
                        App.member = model;
                    },
                    error: function() {
                        App.Router.expireSession();
                        Backbone.history.stop();
                        App.start();
                    }
                });

            }
        },
        render: function() {}

    })

})