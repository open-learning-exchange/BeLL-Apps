$(function () {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function (e) {
            console.log(e.target.attributes[0].nodeValue)
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function (e) {
            console.log(e)
            e.preventDefault()
            this.model.on('sync', function () {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function () {}
            });
        },

        initialize: function () {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function () {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            console.log(vars)
            this.$el.html(_.template(this.template, vars))
        }

    })

})

$(function () {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function (e) {
            console.log(e.target.attributes[0].nodeValue)
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function (e) {
            console.log(e)
            e.preventDefault()
            this.model.on('sync', function () {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function () {}
            });
        },

        initialize: function () {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function () {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            console.log(vars)
            this.$el.html(_.template(this.template, vars))
        }

    })

})