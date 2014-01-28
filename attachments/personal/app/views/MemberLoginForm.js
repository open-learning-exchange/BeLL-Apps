$(function () {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({

        className: "form login-form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup"
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            // give the form a submit button
            var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" id="formButton">Sign In</button>')
            var $button2 = $('<div class="signup-div"><a class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">Become A Member</button></div>')
            this.$el.append($button)
            this.$el.append($button2)
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        signup: function () {
            Backbone.history.navigate('member/add', {
                trigger: true
            })
        },

        setForm: function () {
            var memberLoginForm = this
            this.form.commit()
            var credentials = this.form.model
            $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + credentials.get('login') + '"', function (response) {
                if (response.rows[0]) {
                    if (response.total_rows > 0 && response.rows[0].doc.password == credentials.get('password')) {
                        if (response.rows[0].doc.status == "active") {
                            //UPDATING MEMBER VISITIS
                            var memvisits = new App.Models.Member({
                                _id: response.rows[0].doc._id
                            })
                            memvisits.fetch({
                                async: false
                            })
                            memvisits.set("visits", parseInt(memvisits.get("visits")) + 1)
                            memvisits.once('sync', function () {
                                var date = new Date()
                                $.cookie('Member.login', response.rows[0].doc.login, {
                                    path: "/apps/_design/bell"
                                })
                                $.cookie('Member._id', response.rows[0].doc._id, {
                                    path: "/apps/_design/bell"
                                })
                                $.cookie('Member.expTime', date, {
                                    path: "/apps/_design/bell"
                                })

                                $.ajax({
                                    type: 'GET',
                                    url: '/shelf/_design/bell/_view/DuplicateDetection?include_docs=true&key="' + $.cookie('Member._id') + '"',
                                    dataType: 'json',
                                    success: function (response) {
                                        for (var i = 0; i < response.rows.length; i++) {
                                            App.ShelfItems[response.rows[i].doc.resourceId] = [response.rows[i].doc.resourceTitle + "+" + response.rows[i].doc._id + "+" + response.rows[i].doc._rev]
                                        }
                                    },
                                    data: {},
                                    async: false
                                });
                                memberLoginForm.trigger('success:login')
                            })
                            memvisits.save()

                        } else {
                            alert("Your Account Is Deactivated")
                        }
                    } else {
                        alert('Login or Pass incorrect.')
                    }
                } else {
                    alert('Login or Pass incorrect.')
                }
            });
        },


    })

})