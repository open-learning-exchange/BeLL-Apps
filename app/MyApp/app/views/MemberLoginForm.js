$(function() {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({
        //This view is used to render "Login Page" and it uses "Credentials" model

        className: "form login-form",

        events: {
            "keypress .bbf-form": "listenToEnterForSubmit",
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup",
            "click #welcomeButton": "showWelcomeVideo",
            "click #formButton3": "sendPasswordResetEmail",
        },
        listenToEnterForSubmit: function(event) {
            if (event.keyCode == 13) {
                this.setForm();
            }
        },

        render: function() {
            var languageDictValue=getSpecificLanguage("English");  //To successfully append welcome button
            var context = this;
            var welcomeResources = new App.Collections.Resources();
            welcomeResources.setUrl(App.Server + '/resources/_design/bell/_view/welcomeVideo');
            welcomeResources.fetch({
                success: function() {
                    if (welcomeResources.length > 0) {
                        var welcomeResourceId = welcomeResources.models[0].attributes.id;
                        // display "watch welcome video" button
                       // update=App.languageDict.attributes.Update_Welcome_Video;
                       // alert(update);
                        var hrefWelcomeVid = "/apps/_design/bell/bell-resource-router/index.html#openres/" + welcomeResourceId;
                        // #99: margin-left:0px     var $buttonWelcome = $('<a id="welcomeButton" class="login-form-button btn btn-block btn-lg btn-success" href="hmmm" target="_blank" style="margin-left: -4px;margin-top: -21px; font-size:27px;">Welcome</button>');
                        var $buttonWelcome = $('<a id="welcomeButtonOnLogin" class="login-form-button btn btn-block btn-lg btn-success" target="_blank" href="hmmm" style="background-color:#2ecc71; margin-left: 0px;margin-top: -33px; font-size:27px;">'+languageDictValue.attributes.Welcome+'</button>'); //Issue#99
                        context.$el.append($buttonWelcome);
                        context.$el.find("#welcomeButtonOnLogin").attr("href", hrefWelcomeVid); // <a href="dummy.mp4" class="html5lightbox" data-width="880" data-height="640" title="OLE | Welcome Video">Welcome Video</a>
                    }
                    else {
                        context.$el.addClass('withoutWelcomeVideo');
                    }
                },
                error: function() {
                    console.log("Error in fetching welcome video doc from db");
                },
                async: false
            });
            this.form = new Backbone.Form({
                model: this.model
            })

            this.$el.append(this.form.render().el);
            if($.cookie('languageFromCookie')==null) 
            {
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                })
                var config = new configurations()
                config.fetch({
                    async: false
                })
                var con = config.first();
                var currentConfig = config.first().toJSON().rows[0].doc;
                var clanguage= currentConfig.currentLanguage;
                $.cookie('languageFromCookie',clanguage);
            }
            else
            {
                $.cookie('languageFromCookie',$('#onLoginLanguage :selected').val());
            }

            var value = $("input[name*='login']");
            // give the form a submit button
            // #99 margin-left:1px for "Sign In " and "Become a Member" buttons
            var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" style="background-color:#2ecc71; margin-left: 1px;margin-top: -21px; font-size:27px;" id="formButton">' + languageDictValue.attributes.Sign_In + '</button>')

            var $button2 = $('<div class="signup-div" ><a style="margin-left: 1px;margin-top: -21px; font-size:22px;" class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">' + languageDictValue.attributes.Become_a_member + '</button></div>')

            // Button3 for Forgot Password
            var $button3 = $('<div class="forgot-password-div"><a class="forgot-password-form-button" id="formButton3">' + languageDictValue.attributes.Forgot_Password + '</button></div>');
            this.$el.append($button);
            this.$el.append($button2);
            this.$el.append($button3);

        },
        updateLabels: function(languageDict){

            $('.field-login').find('label').html(languageDict.attributes.Login);
            $('.field-password').find('label').html(languageDict.attributes.Password);
            $('#welcomeButtonOnLogin').html(languageDict.attributes.Welcome)
            $('#formButton').html(languageDict.attributes.Sign_In);
            $('#formButton2').html(languageDict.attributes.Become_a_member);
            $('#formButton3').html(languageDict.attributes.Forgot_Password);
        },

        showWelcomeVideo: function() {

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        signup: function() {
            Backbone.history.navigate('member/add', {
                trigger: true
            })
        },
        setForm: function() {
            var memberLoginForm = this
            this.form.commit()
            var credentials = this.form.model;
            //alert("login + "+this.form.get('login'));
            var members = new App.Collections.Members()
            var member;
            members.login = credentials.get('login');
            var config = new App.Collections.Configurations();
            var bellCode;
            config.fetch({
                async: false,
                success: function(){
                    bellCode = config.first().attributes.code;
                }
            })
            members.fetch({
                success: function() {
                    var i;
                    if (members.length > 0) {
                        var go_ahead_with_login = 0;
                        for(i=0; i <members.length ; i++)
                        {
                            member = members.models[i];
                            go_ahead_with_login = 0;


                            if (!member || (member.get('login') != credentials.get('login'))){
                                continue;
                            }

                            obj_credentials = member.get('credentials');
                            if (obj_credentials){
                                hash_str = hash_login(member.get('login'), credentials.get('password'));
                                if( hash_str == obj_credentials.value) {
                                    go_ahead_with_login = 1;
                                }
                            }
                            else if (member.get('password') == credentials.get('password'))   {
                                go_ahead_with_login = 1;
                            }

                            if (go_ahead_with_login == 1) {
                                if (!member.get('credentials')) {
                                    member.set("credentials", generate_credentials(member.get('login'), member.get('password')));
                                    member.set("password","");
                                }

                                //updating Password Reset email if the user have requested password rest and at the same time if he remembered his password again and login
                                memberLoginForm.updateLoggedInPasswordResetEmail(member);

                                if(member.get('community') == bellCode){
                                    memberLoginForm.processMemberLogin(member);  //Does the functionality of after-login
                                    break;
                                }
                                else {
                                    if(member.get('community')==undefined) {
                                        if(member.get('visits')==0) {
                                            App.member=member;
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
                                            $.cookie('Member.roles', member.get('roles'), {
                                                path: "/apps/_design/bell"
                                            })
                                            Backbone.history.navigate('configuration/add', {
                                                trigger: true
                                            });
                                        }
                                        else {
                                            member.set('community',bellCode);
                                            member.save();
                                            i--;
                                            memberLoginForm.processMemberLogin(member);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if(i==members.length)
                        {
                            var flag = memberLoginForm.checkPasswordResetEmail(member);
                            if(flag == "Nothing"){
                                //Do nothing
                            }else if(flag == "PasswordReset"){
                                window.location.href = '#password-reset';
                            }else if(flag == "Pending"){
                                alert(App.languageDict.attributes.Msg_Pending_PasswordReset)
                            }else if(flag == "Rejected"){
                                alert(App.languageDict.attributes.Msg_Rejected_PasswordReset)
                            }else{
                                alert(App.languageDict.attributes.Invalid_Credentials)
                            }
                        }
                    }
                    else {
                        alert(App.languageDict.attributes.Invalid_Credentials)
                    }
                }
            });
        },
        processMemberLogin: function(member){
            var memberLoginForm = this;
            if (member.get('status') == "active") {
                //UPDATING MEMBER VISITS
                App.member = member;
                var vis = parseInt(member.get("visits"));
                vis++;
                if (!(member.get('roles').indexOf("Manager") > -1) && member.get("FirstName")!='Default' &&
                    member.get('LastName')!='Admin')
                {
                    member.set("lastLoginDate",new Date());
                }
                member.set("visits", vis);
                if(member.get('bellLanguage')===undefined || member.get('bellLanguage')==="" || member.get('bellLanguage')===null)
                {
                    member.set("bellLanguage", App.configuration.get("currentLanguage"));
                }
                member.once('sync', function() {})

                member.save(null, {
                    success: function(doc, rev) {}
                });

                memberLoginForm.logActivity(member);

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
                $.cookie('Member.roles', member.get('roles'), {
                    path: "/apps/_design/bell"
                })

                if (parseInt(member.get('visits')) == 1 && member.get('roles').indexOf('SuperManager') != -1) {
                    Backbone.history.navigate('configuration/add', {
                        trigger: true
                    });
                    return;
                }
                memberLoginForm.trigger('success:login');
                if(App.configuration.get('type')=='community' && member.get('roles').indexOf('SuperManager') != -1){
                    var configCollection = new App.Collections.Configurations();
                    configCollection.fetch({
                        async: false
                    });
                    var configDoc = configCollection.first().toJSON();
                    if(configDoc.name == undefined) {
                        window.location.href = '#configurationsForm'
                    }
                }

            } else {
                alert(App.languageDict.attributes.Account_DeActivated)
            }
        },
        logActivity: function(member) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);
            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    that.UpdatejSONlog(member, logModel, logdb, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb);
                }
            });
        },
        UpdatejSONlog: function(member, logModel, logdb, logdate) {

            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            if (member.get('Gender') == 'Male') {
                var visits = parseInt(logModel.male_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.male_visits = visits
            } else {
                var visits = parseInt(logModel.female_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.female_visits = visits
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    console.log("MemberLoginForm:: updated daily log from pouchdb for today..");
                } else {
                    console.log(err);
                }
            });
        },
        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },
        createJsonlog: function(member, logdate, logdb) {

            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [],
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {

                var visits = parseInt(docJson.male_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.male_visits = visits
            } else {

                var visits = parseInt(docJson.female_visits)
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.female_visits = visits
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                        console.log("MemberLoginForm:: created activity log in pouchdb for today..");
                    } else {
                        console.log(err);
                    }
                });
        },

        updateLoggedInPasswordResetEmail: function(member){
            if (member.get('status') == "active") {
                var login_ID = member.get('_id');
                var login_member = member.get('login');
                var mailCollections = new App.Collections.Mails({
                    senderId : login_ID,
                    type : "PasswordReset"
                });
                mailCollections.fetch({
                    async : false,
                    success: function(){
                        if(mailCollections.length > 0){
                            var currentdate = new Date();
                            var subject;
                            for(var i = 0; i < mailCollections.length; i++){
                                var mail_id = mailCollections.models[i].get('_id');
                                var mail_status = mailCollections.models[i].get('status');
                                var member_status = mailCollections.models[i].get('member_status');
                                var mail = new App.Models.Mail();
                                mail.id = mail_id;
                                mail.fetch({
                                    async: false
                                });
                                subject =  App.languageDict.attributes.Set_Password + ' | ' + login_member;
                                mail.set("subject", subject);
                                mail.set("status", "3");
                                mail.set("member_status", "1");
                                mail.set("sentDate", currentdate);
                                mail.save();
                            }
                        }
                    }
                });
            }
        },

        checkPasswordResetEmail: function(member){
            var flag = "" ;
            var self = this;
            if (member.get('status') == "active") {
                var login_ID = member.get('_id');
                var login_member = member.get('login');
                var mailCollections = new App.Collections.Mails({
                    senderId : login_ID,
                    type : "PasswordReset"
                });
                mailCollections.fetch({
                    async : false,
                    success: function(){
                        var mail_id;
                        var mail_status;
                        var member_status;
                        var mail_dateTime;
                        if(mailCollections.length > 0){
                            mail_id = mailCollections.models[0].get('_id');
                            mail_status = mailCollections.models[0].get('status');
                            member_status = mailCollections.models[0].get('member_status');
                            mail_dateTime = new Date(mailCollections.models[0].get('sentDate'));
                            var currentdate = new Date();
                            var duration = App,con
                            var diff = currentdate - mail_dateTime;
                            var diffSeconds = diff / 1000;
                            var hr = Math.floor(diffSeconds / 3600);
                            var passwordResetDuration = App.configuration.get("passwordResetDuration");
                            var duration; // Automatic Password Reset Duration
                            if(passwordResetDuration == undefined)
                                duration = 0;
                            else
                                duration = passwordResetDuration;
                            if(mail_status == 0){
                                if(hr > duration && duration > 0){
                                    // automatic password reset
                                    var check = self.automaticApprovedPasswordResetEmail(mailCollections);
                                    if(check == "Msg_AutomaticApproved_PasswordReset"){
                                        alert(App.languageDict.attributes.Msg_PasswordReset_AutomaticApproval);
                                        Backbone.history.navigate('password-reset', {
                                            trigger: true
                                        });
                                    }
                                }else{
                                    //still Pending
                                    flag = "Pending";
                                }
                            }else if(mail_status == 2){
                                //Rejected
                                flag = "Rejected";
                            }
                            if(mail_status == 1 && member_status == 1){
                                var check_confirm = confirm(App.languageDict.attributes.Msg_Re_ResetPassword);
                                if(check_confirm)
                                    flag = "PasswordReset";
                                else
                                    flag = "Nothing";
                            }if(mail_status == 1 && member_status == 0){
                                var check_confirm = confirm(App.languageDict.attributes.Msg_Success_ResetPassword_ChangePassword);
                                if(check_confirm)
                                    flag = "PasswordReset";
                                else
                                    flag = "Nothing";
                            }
                        }
                    }
                });
            }
            return flag;
        },

        updatePasswordResetEmail: function(mailCollections){
            var flag = "";
            if(mailCollections.length > 0){
                var currentdate = new Date();
                for(var i = 0; i < mailCollections.length; i++){
                    var mail_id = mailCollections.models[i].get('_id');
                    var mail = new App.Models.Mail();
                    mail.id = mail_id;
                    mail.fetch({
                        async: false
                    });
                    mail.set("status", "0");
                    mail.set("member_status", "0");
                    mail.set("sentDate", currentdate);
                    if(mail.save()){
                        flag = "Msg_Request_PasswordReset";
                    }
                }
            }
            return flag;
        },

        automaticApprovedPasswordResetEmail: function(mailCollections){
            var flag = "";
            if(mailCollections.length > 0){
                var currentdate = new Date();
                for(var i = 0; i < mailCollections.length; i++){
                    var mail_id = mailCollections.models[i].get('_id');
                    var mail = new App.Models.Mail();
                    mail.id = mail_id;
                    mail.fetch({
                        async: false
                    });
                    var subject =  "Automatic Approval";
                    mail.set('status',1);
                    mail.set('member_status',0);
                    mail.set('subject',subject);
                    mail.set("sentDate", currentdate);
                    if(mail.save()){
                        flag = "Msg_AutomaticApproved_PasswordReset";
                    }
                }
            }
            return flag;
        },

        sendPasswordResetEmail: function(member){
            //check the login input
            var self = this;
            this.form.commit()
            var credentials = this.form.model;
            var members = new App.Collections.Members();
            var login_member;
            members.login = credentials.get('login');
            if(members.login != ""){
                members.fetch({
                    success: function() {
                        if (members.length > 0) {
                            login_member = members.models[0].get('login');
                            var login_ID = members.models[0].get('_id');
                            // send email to Manager
                            var isManager = new App.Collections.Members();
                            isManager.manager = "Manager";
                            isManager.fetch({
                                async: false,
                                success: function(){
                                    if(isManager.length > 0){
                                        var admin_ID = [];
                                        var mail = new App.Models.Mail();
                                        var currentdate = new Date();
                                        var subject = "";
                                        var mailBody = "";
                                        var flag = "";
                                        //check whether the user already requested or not.
                                        var mailCollections = new App.Collections.Mails({
                                            senderId : login_ID,
                                            type : "PasswordReset"
                                        });
                                        mailCollections.fetch({
                                            async : false,
                                            success: function(){
                                                var mail_status;
                                                var member_status;
                                                var mail_id;
                                                var passwordResetDuration = App.configuration.get("passwordResetDuration");
                                                var duration; // Automatic Password Reset Duration
                                                var mail_dateTime;
                                                if(passwordResetDuration == undefined)
                                                    duration = 0;
                                                else
                                                    duration = passwordResetDuration;
                                                /**
                                                mail_status
                                                0: Pending
                                                1: Approved
                                                2: Rejected
                                                **/
                                                if(mailCollections.length > 0){
                                                    mail_status = mailCollections.models[0].get('status');
                                                    member_status = mailCollections.models[0].get('member_status');
                                                    mail_id = mailCollections.models[0].get('_id');
                                                    mail_dateTime = new Date(mailCollections.models[0].get('sentDate'));
                                                }
                                                var diff = currentdate - mail_dateTime;
                                                var diffSeconds = diff / 1000;
                                                var hr = Math.floor(diffSeconds / 3600);
                                                if(mail_status){
                                                    if(mail_status == 0){
                                                        if(hr > duration && duration > 0){
                                                            // automatic password reset
                                                            var check = self.automaticApprovedPasswordResetEmail(mailCollections);
                                                            if(check == "Msg_AutomaticApproved_PasswordReset"){
                                                                alert(App.languageDict.attributes.Msg_PasswordReset_AutomaticApproval);
                                                                Backbone.history.navigate('password-reset', {
                                                                    trigger: true
                                                                });
                                                            }
                                                        }else{
                                                            //still Pending
                                                            flag = "Msg_Pending_PasswordReset";
                                                        }
                                                    }else if(mail_status == 1){
                                                        //Approved
                                                        if(member_status == 0){
                                                            flag = "Msg_Success_ResetPassword_ChangePassword";
                                                            Backbone.history.navigate('password-reset', {
                                                                trigger: true
                                                            });
                                                        }else{
                                                            //update to the same email id
                                                            var check_confirm = confirm(App.languageDict.attributes.Msg_Confirm_ResetPassword_ChangePassword);
                                                            if(check_confirm){
                                                                Backbone.history.navigate('password-reset', {
                                                                    trigger: true
                                                                });
                                                            }else{
                                                                flag = self.updatePasswordResetEmail(mailCollections);
                                                            }
                                                        }
                                                    }else if(mail_status == 2){
                                                        //Rejected
                                                        flag = "Msg_Rejected_PasswordReset";
                                                    }else{
                                                        //update to the same email id
                                                        flag = self.updatePasswordResetEmail(mailCollections);
                                                    }
                                                }else{
                                                    for( var i = 0; i < isManager.length; i++){
                                                        if(isManager.models[i].get('_id') != login_ID){
                                                            admin_ID = isManager.models[i].get('_id');
                                                            //send email to all the manager
                                                            subject =  App.languageDict.attributes.Email_PasswordReset_Subject + ' | ' + login_member;
                                                            mailBody = "Request for password reset";
                                                            mail.set("senderId", login_ID);
                                                            mail.set("receiverId", admin_ID);
                                                            mail.set("subject", subject);
                                                            mail.set("body", mailBody);
                                                            mail.set("status", "0");
                                                            mail.set("member_status", "0");
                                                            mail.set("type", "PasswordReset");
                                                            mail.set("sentDate", currentdate);
                                                            if(mail.save()){
                                                                flag = "Msg_Request_PasswordReset";
                                                            }
                                                        }
                                                    }
                                                }
                                                if(flag == "Msg_Request_PasswordReset"){
                                                    alert(App.languageDict.attributes.Msg_Request_PasswordReset);
                                                }else if(flag == "Msg_Pending_PasswordReset"){
                                                    alert(App.languageDict.attributes.Msg_Pending_PasswordReset);
                                                }else if(flag == "Msg_Success_ResetPassword_ChangePassword"){
                                                    alert(App.languageDict.attributes.Msg_Success_ResetPassword_ChangePassword);
                                                }else if(flag == "Msg_Request_PasswordReset"){
                                                    alert(App.languageDict.attributes.Msg_Request_PasswordReset);
                                                }else if(flag == "Msg_Rejected_PasswordReset"){
                                                    alert(App.languageDict.attributes.Msg_Rejected_PasswordReset);
                                                }
                                            }
                                        });
                                        return false;
                                    }
                                }
                            });
                        }else{
                            alert(App.languageDict.attributes.Msg_NotFound_Login);
                        }
                    }
                });
            }else{
                alert(App.languageDict.attributes.Validation_Required_Login);
            }
        }
    })
})
