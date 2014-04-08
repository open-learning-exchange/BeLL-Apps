$(function () {

    // An row with an assignment which mostly consists of it's associated Resource
    App.Views.AssignmentRow = Backbone.View.extend({

        tagName: "tr",
        vars: {},
        events: {
            'click .open': function () {
                Backbone.history.navigate('resource/feedback/add/' + this.model.get('resourceId'), {
                    trigger: true
                })
            }
        },
        template: _.template($("#template-AssignmentRow").html()),

        render: function () {
            this.vars = this.model.toJSON()
            var that = this
            var resource = new App.Models.Resource({
                _id: this.model.get('resourceId')
            })
            resource.SetRid(this.model.get('resourceId'))
            resource.on('sync', function () {
                that.vars.resource = resource.toJSON()
                var newvars = that.vars.resource.rows[0].doc
                console.log(newvars)
                that.$el.html(that.template(newvars))
            }, this)
            resource.fetch()
        },


    })

})