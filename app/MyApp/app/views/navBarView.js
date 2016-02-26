$(function() {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",
        id: "itemsinnavbar",
        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        initialize: function(option) {
            console.log('NavBar is called..');
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
            var temp = Backbone.history.location.href
            temp = temp.split('#')

            var version = '';
            var currentLanguage;
            var currentLanguageValue;
            var languageDictOfApp;

            if (!App.configuration) {
                var config = new App.Collections.Configurations()
                config.fetch({
                    async: false
                })
                 con = config.first()
                App.configuration = con
            }

         //   if (!App.languageDict) {
                var clanguage;
              //  }
                if($.cookie('isChange')=="true")
                {
                    clanguage= $.cookie('test');
                    console.log('value from cookie in navBar '+clanguage)
                }
                else{
                    clanguage = App.configuration.get("currentLanguage");
                    console.log('else in navBar '+clanguage);
                }
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
           // }

            version = App.configuration.get('version');
           // currentLanguage=clanguage;
            console.log('current Language from navBar '+clanguage);
            languageDictOfApp=App.languageDict;
            currentLanguageValue = App.languageDict.get(clanguage);
            console.log('current Language value '+currentLanguageValue);
            this.data = {
                uRL: temp[1],
                versionNO: version,
                currentLanguageOfApp:clanguage,
                availableLanguagesOfApp:getAvailableLanguages(),
                languageDict:languageDictOfApp,
                currentLanguageValueOfApp:currentLanguageValue

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