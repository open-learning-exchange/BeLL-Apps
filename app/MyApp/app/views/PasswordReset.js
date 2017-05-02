$(function () {
    var member_id = "";
    App.Views.PasswordReset = Backbone.View.extend({
        vars:{},
        template: $('#template-password-reset').html(),

        events: {
            "click #btnPasswordReset": "password_reset"
        },

        render: function() {
            this.$el.html(_.template(this.template))
        },

        password_reset: function(){
            var login_name = this.options.name;
            var pwd = $('#pwd').val();
            var re_pwd = $('#re_pwd').val();
            if(pwd == ""){
                alert(App.languageDict.attributes.Validation_Required_Password);
            }else if(re_pwd == ""){
                alert(App.languageDict.attributes.Validation_Required_ReTypePassword);
            }else if(pwd != "" && re_pwd != ""){
                if(pwd == re_pwd){
                    var loginCollection = new App.Collections.Members();
                    loginCollection.login = login_name;
                    loginCollection.fetch({
                        async: false
                    })
                    var existLogin = false;

                    loginCollection.each(function(m) {
                        if (m.get("login") == login_name) {
                            member_id = m.get("_id");
                            existLogin = true;
                        }
                    });
                    if(existLogin){
                        var member_details = new App.Models.Member({
                            _id: member_id
                        });
                        member_details.fetch({
                            async: false
                        })
                        credentials = generate_credentials(login_name, re_pwd);
                        member_details.set("credentials", credentials);
                        member_details.set("password", "");
                        if(member_details.save()){
                            alert(App.languageDict.attributes.Msg_Success_PasswordReset);
                            var mailCollections = new App.Collections.Mails({
                                senderId : member_id,
                                type : "PasswordReset",
                                skip: 0
                            });
                            mailCollections.fetch({
                                async : false,
                                success: function(){
                                    if(mailCollections.length > 0)
                                        mail_id = mailCollections.models[0].get('_id');
                                    if(mail_id){
                                        var model = new App.Models.Mail()
                                        model.id = mail_id
                                        model.fetch({
                                            async: false
                                        })
                                        model.set('member_status', 1);
                                        if(model.save())
                                            Backbone.history.navigate('login', {
                                                trigger: true
                                            });
                                    }
                                }
                            });
                        }
                    }
                }else{
                    alert(App.languageDict.attributes.Msg_Validation_NotMatch_Password);
                }
            }
        }
    });
    
})