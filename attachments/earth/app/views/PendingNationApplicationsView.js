/**
 * Created by omer.yousaf on 9/24/2014.
 */
$(function() {

    App.Views.PendingNationApplicationsView = Backbone.View.extend({

        vars: {},
        events: {
            "click #formButton": "setForm"
        },
        render: function() {
            var nationApplications = new App.Collections['NationApplicationsCollection']();
            nationApplications.fetch({
                async: false
            });
            var nationApplicationTable = new App.Views.NationApplicationsTable({
                collection: nationApplications
            })
            nationApplicationTable.render()
            this.$el.append(nationApplicationTable.el);
        }

    })
})