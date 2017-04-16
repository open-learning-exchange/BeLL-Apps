$(function() {
    App.Views.ActivityReport = Backbone.View.extend({
        vars: {},
        events: {},
        template: $('#template-ActivityReport').html(),
        initialize: function() {},
        render: function() {
            var context = this;
            $.ajax({
                url: '/members/_design/bell/_view/MaleCount?course=false',
                type: 'GET',
                dataType: "json",
                success: function(json) {
                    context.vars = context.data
                    if (json.rows[0]) {
                        context.vars.MaleMembers = json.rows[0].value
                    } else {
                        context.vars.MaleMembers = 0;
                    }
                    $.ajax({
                        url: '/members/_design/bell/_view/FemaleCount?course=false',
                        type: 'GET',
                        dataType: "json",
                        success: function(json) {
                            if (json.rows[0]) {
                                context.vars.FemaleMembers = json.rows[0].value
                            } else {
                                context.vars.FemaleMembers = 0;
                            }
                            context.vars.startDate = context.startDate
                            context.vars.endDate = context.endDate
                            context.vars.CommunityName = context.CommunityName
                            context.$el.html(_.template(context.template, context.vars));
                        }
                    })
                }
            })
        }
    })
})