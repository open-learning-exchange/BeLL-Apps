$(function() {

    App.Views.RequestsTable = Backbone.View.extend({

        tagName: "table",
        className: "table table-striped",

        initialize: function() {

        },
        addOne: function(model) {
            var requestRowView = new App.Views.RequestRow({
                model: model
            })
            requestRowView.render()
            this.$el.append(requestRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Location</th><th>Request-Type</th><th>Request</th><th>From</th><th>Date(MM/DD/YY)</th><th>Response</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})