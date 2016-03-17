/**
 * Created by omer.yousaf on 1/27/2015.
 */
$(function() {

    App.Views.TrendActivityReport = Backbone.View.extend({
        vars: {},
        events: {
            /* Sync moved to nation
             "click #syncReport" : function(e){
             App.Router.syncLogActivitiy()
             }*/
        },
        template: $('#template-TrendActivityReport').html(),

        initialize: function() {

        },
        render: function() {
            var context = this;
            context.vars = context.data
            context.vars.startDate = context.startDate
            context.vars.endDate = context.endDate
            context.vars.CommunityName = context.CommunityName;
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
            context.vars.languageDict = languageDictValue;
            context.$el.html(_.template(context.template, context.vars));
        }
    })

})