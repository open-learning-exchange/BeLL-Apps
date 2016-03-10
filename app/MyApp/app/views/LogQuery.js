$(function() {

    App.Views.LogQuery = Backbone.View.extend({

        events: {
            "click #report_button": function(e) {
                var communityName = "Open BeLL"
                if ($("#community-select").val()) {
                    communityName = $("#community-select").val()
                }
                if ($("#start-date").val() && $("#end-date").val()) {
                    console.log("community: " + $("#community-select").val() + "\t" +
                        "Start-Date: " + $("#start-date").val() + "    " +
                        "End-Date: " + $("#end-date").val());
                    App.Router.LogActivity(communityName, $("#start-date").val(), $("#end-date").val())
                } else {
                    console.log("At least one of the criteria for report is missing");
                }
            }
        },
        template: $('#template-LogQuery').html(),
        vars: {},
        initialize: function() {

        },
        render: function() {
            var members = new App.Collections.Members()
            var member;
            var languageDictValue;
            members.login = $.cookie('Member.login');
            var clanguage = '';
            members.fetch({
                success: function () {
                    if (members.length > 0) {
                        member = members.first();
                        clanguage = member.get('bellLanguage');
                        languageDictValue = getSpecificLanguage(clanguage);
                    }
                },
                async:false
            });
            App.languageDict = languageDictValue;
            var directionOfLang = App.languageDict.get('directionOfLang');
            this.vars.languageDict = App.languageDict;
            this.$el.html(_.template(this.template, this.vars))
           // this.$el.html(_.template(this.template));

        }
    })

})