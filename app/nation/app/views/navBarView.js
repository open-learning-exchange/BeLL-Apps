$(function() {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",

        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        template2: _.template($('#template-nav-logged-in-cummunity').html()),

        initialize: function(option) {
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
              //  this.template = this.template1
               // if (option.type == 'community') {
                    this.template = this.template2
              //  }
            }

            var temp = Backbone.history.location.href
            temp = temp.split('#');
            var loginOfMem = $.cookie('Member.login');
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'json',
                async:false,
                success: function (surResult) {
                    console.log(surResult);
                    var id = surResult.rows[0].id;
                    $.ajax({
                        url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                        type: 'GET',
                        dataType: 'json',
                        async:false,
                        success: function (resultByDoc) {
                            console.log(resultByDoc);
                            lang=resultByDoc.rows[0].value.bellLanguage;
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                },
                error:function(err){
                    console.log(err);
                }
            });
            var languageDictOfApp=App.Router.loadLanguageDocs(lang);
            this.data = {
                uRL: temp[1],
                languageDict:languageDictOfApp
            }
            this.$el.append(this.template(this.data))

        },

        render: function() {}

    })

})