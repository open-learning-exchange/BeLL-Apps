$(function() {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({

        className: "form login-form",

        events: {
            "keypress .bbf-form": "listenToEnterForSubmit",
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup",
            "click #welcomeButton": "showWelcomeVideo"
        },
        listenToEnterForSubmit: function(event) {
            if (event.keyCode == 13) {
                this.setForm();
            }
        },

        render: function() {
            console.log('from render of memberLogin form..');
            var languageDictValue=getSpecificLanguage("English");  //To successfully append welcome button
            var context = this;
            var welcomeResources = new App.Collections.Resources();
            welcomeResources.setUrl(App.Server + '/resources/_design/bell/_view/welcomeVideo');
            //var update;
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
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })

            this.$el.append(this.form.render().el);
            languageDictValue=getSpecificLanguage($('#onLoginLanguage :selected').val());
            //Checking here that if the value of cookie is unset due to any reason then set its value
            if($.cookie('languageFromCookie')==null)
            {
                //Cookie did not exist before
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
                //Update the value of cookie
                $.cookie('languageFromCookie',$('#onLoginLanguage :selected').val());
            }

            var value = $("input[name*='login']");
            // give the form a submit button
            // #99 margin-left:1px for "Sign In " and "Become a Member" buttons
            var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" style="background-color:#2ecc71; margin-left: 1px;margin-top: -21px; font-size:27px;" id="formButton">' + languageDictValue.attributes.Sign_In + '</button>')

            var $button2 = $('<div class="signup-div" ><a style="margin-left: 1px;margin-top: -21px; font-size:22px;" class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">' + languageDictValue.attributes.Become_a_member + '</button></div>')
            this.$el.append($button);
            this.$el.append($button2);

        },
        updateLabels: function(languageDict){

            $('.field-login').find('label').html(languageDict.attributes.Login);
            $('.field-password').find('label').html(languageDict.attributes.Password);
            $('#welcomeButtonOnLogin').html(languageDict.attributes.Welcome)
            $('#formButton').html(languageDict.attributes.Sign_In);
            $('#formButton2').html(languageDict.attributes.Become_a_member);
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
            members.login = credentials.get('login')
            members.fetch({
                success: function() {
                    if (members.length > 0) {
                        member = members.first();
                        if (member && member.get('password') == credentials.get('password') &&member.get('login') == credentials.get('login') ) {
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
                                    //$('#nav').hide()
                                    Backbone.history.navigate('configuration/add', {
                                        trigger: true
                                    });
                                    return;
                                }
                                // warn the admin user if they have not changed default password after installation
                                //                            if ((member.get('login') === "admin") && (member.get('password') === 'password')) {
                                //                                    alert("Please change the password for this admin account for better security of the account and the application.");
                                ////                                    var fragment = 'member/edit/' +
                                //                                    Backbone.history.navigate('member/edit/' + member.get('_id'), {trigger: true});
                                //
                                //                            }
                                //
                                //                            else {
                                memberLoginForm.trigger('success:login');
                                // }
                                //							console.log(member.toJSON())
                            } else {
                                alert(App.languageDict.attributes.Account_DeActivated)
                            }
                        } else {
                            alert(App.languageDict.attributes.Invalid_Credentials)
                        }
                    } else {
                        alert(App.languageDict.attributes.Invalid_Credentials)
                    }
                }
            });
        },
        logActivity: function(member) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);
            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    //            console.log("logModel: ");
                    //            console.log(logModel);
                    //            alert("yeeyyyyyy");
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
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.male_visits = visits
            } else {
                var visits = parseInt(logModel.female_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.female_visits = visits
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    console.log("MemberLoginForm:: updated daily log from pouchdb for today..");
                } else {
                    console.log("MemberLoginForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                    //                    alert("err making update to record");
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
            // alert(superMgrIndex);
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
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {

                var visits = parseInt(docJson.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.male_visits = visits
            } else {

                var visits = parseInt(docJson.female_visits)
                //    if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
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
                        console.log("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                        console.log(err);
                        //                    alert("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    }
                });
        }
    })
})