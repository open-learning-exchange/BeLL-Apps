/**
 * Created by saba.baig on 6/6/2016.
 */
$(function() {

    App.Views.AdminForm = Backbone.View.extend({

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function() {
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            App.configuration = config.first()

            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            var buttonText = "";
            this.$el.append(this.form.render().el)
            this.form.fields['status'].$el.hide()
            this.form.fields['yearsOfTeaching'].$el.hide()
            this.form.fields['teachingCredentials'].$el.hide()
            this.form.fields['subjectSpecialization'].$el.hide()
            this.form.fields['forGrades'].$el.hide()
            this.form.fields['visits'].$el.hide();
            this.form.fields['lastLoginDate'].$el.hide();
            this.form.fields['lastEditDate'].$el.hide();
            this.form.fields['community'].$el.hide();
            this.form.fields['nation'].$el.hide();
            this.form.fields['region'].$el.hide();

            this.form.setValue({
                community: App.configuration.get("name"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nationName")
            })

            $("input[name='community']").attr("disabled", true);
            $("input[name='region']").attr("disabled", true);
            $("input[name='nation']").attr("disabled", true);


            var $imgt = "<p id='imageText' style='margin-top: 15px;'></p>"
            buttonText = App.languageDict.attributes.Register;
            // give the form a submit button
            var $button = $('<div class="signup-submit"><a class="btn btn-success" id="formButton" style="margin-top: 10px;">' + buttonText+'</button></div>')
            var $upload = $('<form method="post" id="fileAttachment" ><input type="file" name="_attachments"  id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
            var $img = $('<div id="browseImage" >' + $imgt + '<img style="width:100px;height:100px;border-radius:50px" id="memberImage"></div>')
            this.$el.append($img)
            this.$el.append($upload)
            this.$el.append($button)
            if (this.model.id != undefined) {
                if (this.model.get("status") == "active") {
                    $(".signup-submit").append('<a class="btn btn-danger" id="deactive" href="#" style="margin-top: 10px;">'+App.languageDict.attributes.Resign+'</a>')
                } else {
                    $(".signup-submit").append('<a class="btn btn-success" id="active" style="margin-top: 10px;" href="#">'+App.languageDict.attributes.Reinstate+'</a>')
                }
            }
            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                document.getElementById("memberImage").src = attchmentURL
            }
            
        },

        validImageTypeCheck: function(img) {
            if (img.val() == "") {
                //alert("ERROR: No image selected \n\nPlease Select an Image File")
                return 1
            }
            var extension = img.val().split('.')
            console.log(extension[(extension.length - 1)])
            if (extension[(extension.length - 1)] == 'jpeg' || extension[(extension.length - 1)] == 'jpg' || extension[(extension.length - 1)] == 'png' || extension[(extension.length - 1)] == 'JPG') {
                return 1
            }
            alert(App.languageDict.attributes.Invalid_Image_File)
            return 0
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var that = this;
            var isValid=true;
            if(!this.validateMemberForm())
            {
                isValid=false;
            }
            if(!isValid){
                alert(App.languageDict.attributes.Update_Profile_Reminder);
                return;
            }

            // Put the form's input into the model in memory
            if (this.validImageTypeCheck($('input[type="file"]'))) {
                // assign community, region and nation attribs in member model values from configuration doc
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                });
                var config = new configurations();
                config.fetch({
                    async: false
                });
                console.log('---***********---');
                console.log(config);
                console.log(config.first().toJSON());
                var configsDoc = config.first().toJSON().rows[0].doc;

                this.form.setValue({
                    status: "active",
                    community: configsDoc.code,
                    region: configsDoc.region,
                    nation: configsDoc.nationName,
                    lastEditDate:new Date()
                });
                this.form.commit();
                // Send the updated model to the server
                if ($.inArray("lead", this.model.get("roles")) == -1) {
                    that.model.set("yearsOfTeaching", null)
                    that.model.set("teachingCredentials", null)
                    that.model.set("subjectSpecialization", null)
                    that.model.set("forGrades", null);
                    this.model.set("lastEditDate",new Date());
                    this.model.set("lastLoginDate",new Date());
                }
                this.removeSpaces();
                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("visits", 1);
                    if($.cookie('languageFromCookie')===null)
                    {
                        this.model.set("bellLanguage",App.configuration.attributes.currentLanguage);
                    }
                    else
                    {
                        this.model.set("bellLanguage", $.cookie('languageFromCookie'));
                    }
                }
                if (addMem) {
                    var memberModel = this.model;
                    this.model.save(null, {
                        success: function() {
                            ///////////Apni Chezen
                            var date = new Date()
                            $.cookie('Member.login', that.model.get('login'), {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member._id', that.model.get('id'), {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member.expTime', date, {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member.roles', that.model.get('roles'), {
                                path: "/apps/_design/bell"
                            })
                            ////////////////////////////////////
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                            } else {
                                if (that.model.attributes._rev == undefined) {
                                    // if true then its a new member signup
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                }
                            }
                            that.model.on('savedAttachment', function() {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
                                    // so capture this in activity logging
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                } else {
                                    Backbone.history.navigate('dashboard');
                                    window.location.reload();
                                }
                            }, that.model)
                        }
                    })
                }
            }
        },

        removeSpaces: function()
        {
            var firstName = this.model.get("firstName");
            var lastName = this.model.get("lastName");
            var middleName = this.model.get("middleNames");
            var loginName = this.model.get("login");
            this.model.set("firstName", $.trim(firstName));
            this.model.set("lastName", $.trim(lastName));
            this.model.set("middleNames", $.trim(middleName));
            this.model.set("login", $.trim(loginName));
        },

        validateMemberForm : function(){
            var isCorrect=true;
            if ($.trim($('.bbf-form .field-firstName .bbf-editor input').val()) =='' || $('.bbf-form .field-firstName .bbf-editor input').val() ==null || $('.bbf-form .field-firstName .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-firstName label').css('color','red');
            }
            else{

                $('.bbf-form .field-firstName label').css('color','black');
            }
            if ($.trim($('.bbf-form .field-lastName .bbf-editor input').val()) =='' || $('.bbf-form .field-lastName .bbf-editor input').val() ==null || $('.bbf-form .field-lastName .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-lastName label').css('color','red');
            }
            else
            {

                $('.bbf-form .field-lastName label').css('color','black');
            }
            if ($.trim($('.bbf-form .field-login .bbf-editor input').val()) =='' || $('.bbf-form .field-login .bbf-editor input').val() ==null || $('.bbf-form .field-login .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-login label').css('color','red');
            }
            else{

                $('.bbf-form .field-login label').css('color','black');
            }
            if ( $('.bbf-form .field-password .bbf-editor input').val() =='' || $('.bbf-form .field-password .bbf-editor input').val() ==null || $('.bbf-form .field-password .bbf-editor input').val() ==undefined)
            {
                isCorrect=false;
                $('.bbf-form .field-password label').css('color','red');
            }
            else{

                $('.bbf-form .field-password label').css('color','black');
            }

            if ( $('.bbf-form .field-Gender .bbf-editor select').val() =='' || $('.bbf-form .field-Gender .bbf-editor select').val() ==null || $('.bbf-form .field-Gender .bbf-editor select').val() ==undefined  ) {
                // $('.bbf-form .field-Gender label').html(App.languageDict.attributes.Gender + '[ '+App.languageDict.attributes.Required_Text + ']');
                isCorrect=false;
                $('.bbf-form .field-Gender label').css('color','red');   //shows that Gender is not correct.
            }
            else{

                $('.bbf-form .field-Gender label').css('color','black');
            }
            if($('.bbf-form .field-levels .bbf-editor select').val() =='' || $('.bbf-form .field-levels .bbf-editor select').val() ==null || $('.bbf-form .field-levels .bbf-editor select').val() ==undefined) {
                //$('.bbf-form .field-levels .bbf-error').html(App.languageDict.attributes.Required_Text);
                isCorrect=false;
                $('.bbf-form .field-levels label').css('color','red');
            }
            else{

                $('.bbf-form .field-levels label').css('color','black');
            }
            if( //validations for date
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==''
            || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==null ||
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() ==undefined ||
            //validations for month
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==''
            || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==null || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val()==undefined
            //validations for year
            ||$('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()=='' || $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()==null ||
            $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()==undefined ) {
                // $('.bbf-form .field-BirthDate .bbf-error').html(App.languageDict.attributes.Required_Text);
                isCorrect=false;
                $('.bbf-form .field-BirthDate label').css('color','red');
            }
            else{
                //Now, validate age range [5,100] (Inclusive)
                if(this.getAgeOfUser()<5 || this.getAgeOfUser()>100) {
                    alert(App.languageDict.attributes.Birthday_Range);
                    isCorrect = false;
                    $('.bbf-form .field-BirthDate label').css('color','red');
                }
                else{

                    $('.bbf-form .field-BirthDate label').css('color','black');
                }
            }
            return isCorrect;
        },

        getAgeOfUser: function()
        {
            var  birthDate=new Date($('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val(),
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val(),
                $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val());
            var todayDate = new Date();
            var age = todayDate.getFullYear() - birthDate.getFullYear();
            var m = todayDate.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdate, configsDoc, member, pouchActivityLogDb) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                female_new_signups: 0,
                male_new_signups: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: configsDoc.code,
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {
                docJson.male_new_signups = 1;
            } else {
                docJson.female_new_signups = 1;
            }
            pouchActivityLogDb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("created activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: createJsonlog: error creating activity log doc in pouchdb..");
                    console.log(err);
                }
                alert(App.languageDict.attributes.Successfully_Registered);
                /*Backbone.history.navigate('dash', {
                    trigger: true
                });*/
                window.location.href="#dashboard";
            });
        },

        UpdatejSONlog: function(logdate, pouchActivityLogRec, member, pouchActivityLogDb) {
            if (member.get('Gender') == 'Male') {
                pouchActivityLogRec.male_new_signups = parseInt(((pouchActivityLogRec.male_new_signups) ? pouchActivityLogRec.male_new_signups : 0)) + 1;
            } else {
                pouchActivityLogRec.female_new_signups = parseInt(((pouchActivityLogRec.female_new_signups) ? pouchActivityLogRec.female_new_signups : 0)) + 1;
            }
            pouchActivityLogDb.put(pouchActivityLogRec, logdate, pouchActivityLogRec._rev, function(err, response) {
                if (!err) {
                    console.log("updated activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: UpdatejSONlog: err making update to record");
                    console.log(err);
                }
                $.cookie("forcedUpdateProfile",'false');
                alert(App.languageDict.attributes.Successfully_Registered);
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        }
    })

})