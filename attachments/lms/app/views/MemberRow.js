$(function () {

    App.Views.MemberRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroy": function (e) {
                e.preventDefault()
                this.model.destroy()
                this.remove()
            },
            "click #deactive": function (e) {

                e.preventDefault()

                var that = this
                this.model.on('sync', function () {
                    // rerender this view

                    //that.render()
                    location.reload();
                })

                this.model.save({
                    status: "deactive"
                }, {
                    success: function () {}
                });

                //  this.model.fetch({async:false})
            },
            "click #active": function (e) {

                e.preventDefault()
                var that = this
                this.model.on('sync', function () {
                    // rerender this view

                    //that.render()
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function () { /*this.model.fetch({async:false})*/ }
                });

            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-MemberRow").html(),

        initialize: function () {
            //this.model.on('destroy', this.remove, this)
        },

        render: function () {
            var vars = this.model.toJSON()
			vars.community_code=this.community_code
            if ((this.model.get("_id") == $.cookie('Member._id')) && !this.isadmin) {
                vars.showdelete = false
                vars.showedit = true
            } else if (!this.isadmin) {
                vars.showdelete = false
                vars.showedit = false
            } else {
                vars.showdelete = true
                vars.showedit = true
            }
            console.log(vars)
            vars.src="img/default.jpg"
            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                vars.src = attchmentURL
            }
            this.$el.html(_.template(this.template, vars))
        }


    })

})