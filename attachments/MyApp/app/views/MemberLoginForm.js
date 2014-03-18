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
            var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" style="margin-left: -4px;margin-top: -21px;" id="formButton">Sign In</button>')
            var $button2 = $('<div class="signup-div" ><a style="margin-left: -4px;margin-top: -21px;" class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">Become A Member</button></div>')
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
            var members = new App.Collections.Members()
            var member;
            members.login = credentials.get('login')
            members.fetch({success:function(){
                if (members.length>0) {
                	member = members.first()
                    if (member && member.get('password') == credentials.get('password')) {
                        if (member.get('status') == "active") {
                            //UPDATING MEMBER VISITIS
                            App.member = member
                            var vis = parseInt(member.get("visits"))
                            vis++
                            member.set("visits", vis)
                            member.once('sync', function () {
                                var date = new Date()
                                $.cookie('Member.login', member.get('login'), {
                                    path: "/apps/_design/bell"
                                })
                                $.cookie('Member._id', member.get('_id'), {
                                    path: "/apps/_design/bell"
                                })
                                $.cookie('Member.expTime', date, {
                                    path: "/apps/_design/bell"
                                })
                                memberLoginForm.trigger('success:login')
                            })
                            member.save()

                        } else {
                            alert("Your Account Is Deactivated")
                        }
                    } else {
                        alert('Login or Pass incorrect.')
                    }
                } else {
                    alert('Login or Pass incorrect.')
                }
            }});
        },


    })

})