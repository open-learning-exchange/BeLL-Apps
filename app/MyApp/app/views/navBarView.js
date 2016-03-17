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

            //if (!App.configuration) {
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            con = config.first()
            App.configuration = con
            //}

            //   if (!App.languageDict) {
            var clanguage;
            var members = new App.Collections.Members();
            var member;
            members.login = $.cookie('Member.login');
            //  }
            if($.cookie('isChange')=="true" && !($.cookie('Member._id')))
            {
                console.log('member has not logged in')
                if(checkIfExistsInLangDb($.cookie('languageFromCookie')))
                {
                    console.log('going to check whether cookie is valid and its correct')
                    clanguage= $.cookie('languageFromCookie');

                }
                else {
                    console.log('cookie is false')
                    //$.cookie('languageFromCookie',App.configuration.get("currentLanguage"));
                    clanguage = App.configuration.get("currentLanguage");
                }
                console.log('value from cookie in navBar '+clanguage)
            }
            else if($.cookie('Member._id')){
                //member has logged in
                var languageDictValue;

                members.fetch({
                    success: function () {
                        if (members.length > 0) {
                            member = members.first();
                            clanguage=member.get('bellLanguage')
                        }
                    },
                    async:false
                });
                console.log('member has logged in '+clanguage)
            }
            else{
                clanguage = App.configuration.get("currentLanguage");
                console.log('else in navBar '+clanguage);
            }

            // fetch dict for the current/selected language from the languages db/table

            App.languageDict = getSpecificLanguage(clanguage);
            // }

            version = App.configuration.get('version');
            console.log('current Language from navBar '+clanguage);
            languageDictOfApp=App.languageDict;
            currentLanguageValue = App.languageDict.get('nameInNativeLang');
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