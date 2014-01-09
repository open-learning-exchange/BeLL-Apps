$(function () {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function (event) {
                alert("destroying")
                this.model.destroy()
                event.preventDefault()
            },
            "click .trigger-modal": function () {
                $('#myModal').modal({
                    show: true
                })
            },
            "click #commentButton": function (e) {
                console.log(e)
                console.log(e.target.attributes[0].nodeValue)
                var coll = new App.Collections.CommunityReportComments()
                coll.CommunityReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                console.log(coll.toJSON())
                var viw = new App.Views.CommunityReportCommentView({
                    collection: coll,
                    CommunityReportId: e.target.attributes[0].nodeValue
                })
                viw.render()
                $('#debug').append(viw.el)
            }

        },

        vars: {},

        template: _.template($("#template-ReportRow").html()),

        initialize: function (e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function () {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()


            if (this.isadmin > -1) {
                vars.admn = 1
            } else {
                vars.admn = 0
            }

            this.$el.append(this.template(vars))


        },


    })

})