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
            var currentLanguageValue;
            var languageDictOfApp;
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            con = config.first()
            App.configuration = con
            var clanguage;
            if($.cookie('isChange')=="true" && !($.cookie('Member._id')))
            {
                if(checkIfExistsInLangDb($.cookie('languageFromCookie')))
                {
                    clanguage= $.cookie('languageFromCookie');

                }
                else {
                    clanguage = App.configuration.get("currentLanguage");
                }
            }
            else if($.cookie('Member._id')){
                clanguage = getLanguage($.cookie('Member._id'));
            }
            else{
                clanguage = App.configuration.get("currentLanguage");
            }

            // fetch dict for the current/selected language from the languages db/table

            App.languageDict = getSpecificLanguage(clanguage);
            version = App.configuration.get('version');
            languageDictOfApp=App.languageDict;
            currentLanguageValue = App.languageDict.get('nameInNativeLang');
            this.data = {
                uRL: temp[1],
                versionNO: version,
                currentLanguageOfApp:clanguage,
                availableLanguagesOfApp:getAvailableLanguages(),
                languageDict:languageDictOfApp,
                currentLanguageValueOfApp:currentLanguageValue

            }
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