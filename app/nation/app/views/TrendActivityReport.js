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
            context.vars.languageDict=App.languageDictValue;
            context.vars.startDate = context.startDate
            context.vars.endDate = context.endDate
            context.vars.CommunityName = context.CommunityName
            context.vars.lastActivitySyncDate = context.lastActivitySyncDate  //issue#50:Add Last Activities Sync Date to Activity Report On Nation For Individual Communities
            //Issue#80:Add Report button on the Communities page at nation
            context.$el.html(_.template(context.template, context.vars));
        }
    })

})