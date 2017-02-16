$(function() {

    App.Views.MemberForm = Backbone.View.extend({

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formManagarRequest" : "sendMail",
            "click #formButtonCancel": function() {
                //Check whether form is being called for Edit purpose or Add..
                if(this.form.model.get('_id') ){
                    var isValid=true;
                    if($.cookie("forcedUpdateProfile")=='true'){
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                        $('#nav').css('pointer-events','none');
                        $('#formButtonCancel').css('pointer-events','none');
                        return;
                    }
                    else{
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                    }
                   // this.model.set("lastEditDate",new Date());
                    this.model.save({
                        lastEditDate: new Date()
                    }, {
                        success: function() {
                            Backbone.history.navigate('dashboard');
                            window.location.reload();
                        }
                    });

                }
                else{
                    window.history.back();
                }
            },
            "click #deactive": function(e) {
                e.preventDefault()
                var that = this;
                this.model.on('sync', function() {
                   // location.reload();
                })
                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {
                        if ($.cookie('Member.login') != that.model.get('login') )
                        {
                            Backbone.history.navigate('dashboard', {
                                trigger: true
                            });
                        }
                        else
                        {
                            //Going to log-out from the system...
                            that.expireSession();
                            Backbone.history.navigate('login', {
                                trigger: true
                            });
                        }

                    }
                });
            },

            "click #ptManager": function(e) {


            },
            "click #active": function(e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function() { /*this.model.fetch({async:false})*/ }
                });
            }
        },
        expireSession: function() {

            $.removeCookie('Member.login', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member._id', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member.roles', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member.expTime', {
                path: "/apps/_design/bell"
            });
            $.removeCookie('forcedUpdateProfile');
        },
        getRoles: function(userId) {
            var user = (userId) ? new App.Models.Member({
                "_id": userId
            }) : new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            user.fetch({
                async: false
            })
            var roles = user.get("roles")
            return roles
        },

        sendMail: function() {
            var memberList = new App.Collections.Members()
            memberList.manager = true
            memberList.fetch({
                async: false
            })            
            var temp
            var that = this
            var currentdate = new Date();
            memberList.each(function (m) {
                var languageDictValue;
                var lang = getLanguage(m.get("_id"))
                languageDict = getSpecificLanguage(lang);
                var mailBody = languageDict.attributes.Hi + '&nbsp;' + '<b>'+ m.get("login")+  '</b>' + ',<br>' + '<br>' + languageDict.attributes.Member + ' <b>' + $.cookie('Member.login') + '</b> ' + languageDict.attributes.Has_Requested_Promote
                + '<br/><br/><button class="btn btn-primary" id="promote-accept" value="' + $.cookie('Member._id') + '" >'+languageDict.attributes.Accept+'</button>&nbsp;&nbsp;<button class="btn btn-danger" id="promote-reject" value="' + $.cookie('Member._id') + '" >'+languageDict.attributes.Reject+'</button>';
                    temp = new App.Models.Mail()
                    temp.set("senderId", $.cookie('Member._id'))
                    temp.set("receiverId", m.get("_id"));
                    temp.set("status", "0")
                    temp.set("subject", languageDict.attributes.Manager_Request + " | " + $.cookie('Member.login'))
                    temp.set("type", "manager-request")
                    temp.set("body", mailBody)
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", $.cookie('Member._id'))
                    temp.save()
            })
            alert(App.languageDict.attributes.Request_Sent_Success)
        },
        
        render: function() {
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

            this.form.setValue({
                community: App.configuration.get("name"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nationName"),
                firstName: App.configuration.get("firstName"),
                middleNames: App.configuration.get("middleNames"),
                lastName: App.configuration.get("lastName"),
                password: App.configuration.get("password"),
                phone: App.configuration.get("phone"),
                email: App.configuration.get("email"),
                language: App.configuration.get("language"),
                community: App.configuration.get("community"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nation"),
                date: App.configuration.get("date"),
                month: App.configuration.get("month"),
                year: App.configuration.get("year"),
                Gender: App.configuration.get("Gender"),
                levels: App.configuration.get("levels"),
                login: App.configuration.get("levels"),
            })
            var url_page = $.url().data.attr.fragment.split('/');

            if(url_page[1]=="view") {
                $("input[name='firstName']").attr("disabled", true);
                $("input[name='middleNames']").attr("disabled", true);
                $("input[name='lastName']").attr("disabled", true);
                $("input[name='password']").attr("disabled", true);
                $("input[name='phone']").attr("disabled", true);
                $("input[name='email']").attr("disabled", true);
                $("input[name='language']").attr("disabled", true);
                $("input[name='community']").attr("disabled", true);
                $("input[name='region']").attr("disabled", true);
                $("input[name='nation']").attr("disabled", true);
                $("input[name='login']").attr("disabled", true);
                $("select[data-type='date']").attr("disabled", true);
                $("select[data-type='month']").attr("disabled", true);
                $("select[data-type='year']").attr("disabled", true);
                $("select[name='Gender']").attr("disabled", true);
                $("select[name='levels']").attr("disabled", true);
            }
            else {
                $("input[name='community']").attr("disabled", true);
                $("input[name='region']").attr("disabled", true);
                $("input[name='nation']").attr("disabled", true);
            }
            if(url_page[1] != "view") {
                var $imgt = "<p id='imageText' style='margin-top: 15px;'></p>"
                if (this.model.id != undefined) {
                    buttonText = App.languageDict.attributes.Update
                    $("input[name='login']").attr("disabled", true);
                } else {
                    buttonText = App.languageDict.attributes.Register
                }
                if(this.model.id != undefined && this.model.id == $.cookie('Member._id') && this.model.get('roles').indexOf('Manager') < 0) {
                    promoteBtn = '<a class="btn btn-success" id="formManagarRequest" style="margin-top: 10px;">'+App.languageDict.attributes.Manager_Request+'</a>';
                } else {
                    promoteBtn = '';
                }
                var $upload = $('<form method="post" id="fileAttachment" ><input type="file" name="_attachments"  id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
                var $img = $('<div id="browseImage" >' + $imgt + '<img style="width:100px;height:100px;border-radius:50px" id="memberImage"></div>')
                this.$el.append($img)
                this.$el.append($upload)
                var $button = $('<div class="signup-submit">'+promoteBtn+'<a class="btn btn-success" id="formButton" style="margin-top: 10px;">' + buttonText + '</a><a class="btn btn-danger" id="formButtonCancel" style="margin-top: 10px;">'+App.languageDict.attributes.Cancel+'</a></div>')
            } else {
                var $button = $('<a class="btn btn-danger" id="formButtonCancel" style="margin-top: 10px;">' + App.languageDict.attributes.Cancel + '</a></div>')
            }
            // give the form a submit button
            this.$el.append($button)
            if(url_page[1] != "view"){
                if (this.model.id != undefined) {
                    if (this.model.get("status") == "active") {
                        $(".signup-submit").append('<a class="btn btn-danger" id="deactive" href="#" style="margin-top: 10px;">'+App.languageDict.attributes.Resign+'</a>')
                    } else {
                        $(".signup-submit").append('<a class="btn btn-success" id="active" style="margin-top: 10px;" href="#">'+App.languageDict.attributes.Reinstate+'</a>')
                    }
                    var logUserroles = this.getRoles(false)
                    if (logUserroles.indexOf("SuperManager") > -1) {
                        var thisUser = this.getRoles(this.model.id)
                        $('#memberform').append('<div id="PromoteToManager"><input id="ptManager" type="checkbox" ><label for="ptManager">'+App.languageDict.attributes.Promote_To_Manager+'</label></div>')
                        if (thisUser.indexOf("Manager") > -1) {
                            $('#ptManager').prop('checked', true);
                        }
                    }
                }            
   
                var attchmentURL = '/members/' + this.model.id + '/'
                if (typeof this.model.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                    document.getElementById("memberImage").src = attchmentURL
                }
                if(this.form.model.get('_id')){
                    //Check whether form is being called for Edit purpose or Add..
                    var isValid=true;
                    if($.cookie("forcedUpdateProfile")=='true'){
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                        $('#nav').css('pointer-events','none');   //buggy on page refresh
                        $('#formButtonCancel').css('pointer-events','none');
                        return;
                    }
                    else{
                        if(!this.validateMemberForm())
                        {
                            isValid=false;
                        }
                        if(!isValid){
                            alert(App.languageDict.attributes.Update_Profile_Reminder);
                        }
                    }
            }


           }
        },

        validImageTypeCheck: function(img) {
            if (img.val() == "") {
                //alert("ERROR: No image selected \n\nPlease Select an Image File")
                return 1
            }
            var extension = img.val().split('.')
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
            $('#formButtonCancel').css('pointer-events','auto');
            $('#nav').css('pointer-events','auto');
            if ($('#ptManager').attr('checked')) { // if promote to manager checkbox is ticked
                // then add the 'Manager' role to his/her roles array only if this person is not a manager already. following check added
                // by Omer Yousaf on 16 Jan, 2015.
                var index = this.model.toJSON().roles.indexOf('Manager');
                if (index < 0) { // 'Manager' does not exist in his/her roles array
                    this.model.toJSON().roles.push("Manager");
                }
            } else {
                var index = this.model.toJSON().roles.indexOf('Manager')
                if (index > -1) {
                    this.model.toJSON().roles.splice(index, 1)
                }
            }
            var that = this;
            var isValid=true;
            if($.cookie("forcedUpdateProfile")=='true'){
                if(!this.validateMemberForm())
                {
                    isValid=false;
                }
                if(!isValid){
                 alert(App.languageDict.attributes.Update_Profile_Reminder);
                $('#nav').css('pointer-events','none');
                $('#formButtonCancel').css('pointer-events','none');
                return;
                }
                else{
                    $('#nav').css('pointer-events','auto');
                    $('#formButtonCancel').css('pointer-events','auto');
                }

            }
            else{
                if(!this.validateMemberForm())
                {
                    isValid=false;
                }
                if(!isValid){
                    alert(App.languageDict.attributes.Update_Profile_Reminder);
                    return;
                }
                else
                {
                    $('#nav').css('pointer-events','auto');
                    $('#formButtonCancel').css('pointer-events','auto');
                }
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
                }

                if (this.model.get("password") != undefined && this.model.get("password") != '' && this.model.get("password") != null) { // HT: password optional not to regenerate on empty
                    credentials = generate_credentials(this.model.get("login"), this.model.get("password")); 
                    this.model.set("credentials", credentials);
                }

                this.removeSpaces();
                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("roles", ["Learner"])
                    this.model.set("visits", 0);

                    credentials = generate_credentials(this.model.get("login"), this.model.get("password")); 
                    this.model.set("credentials", credentials);
                    this.model.set("password", "");

                    if($.cookie('languageFromCookie')===null)
                    {
                        this.model.set("bellLanguage",App.configuration.attributes.currentLanguage);
                    }
                    else
                    {
                        this.model.set("bellLanguage", $.cookie('languageFromCookie'));
                    }

                    var existing = new App.Collections.Members()

                    existing.login = that.model.get("login")
                    existing.fetch({
                        async: false,
                        success: function() {
                            existing = existing.first()
                            if (existing != undefined) {
                                if (existing.toJSON().login != undefined) {
                                    alert(App.languageDict.attributes.Duplicate_login)
                                    addMem = false
                                }
                            }
                        }

                    });

                }
                if (addMem) {
                    var memberModel = this.model;
                    this.model.set("password", "");
                    this.model.save(null, {
                        success: function() {
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
                                } else {

                                    alert(App.languageDict.attributes.Updated_Successfully);
                                    $.cookie("forcedUpdateProfile",'false');
                                    Backbone.history.navigate('dashboard'
                                    );
                                    window.location.reload();
                                }
                            }
                            that.model.on('savedAttachment', function() {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
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

                                    $.cookie("forcedUpdateProfile",'false');
                                    alert(App.languageDict.attributes.Updated_Successfully);
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
         var date=new Date($('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val(), $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val(), $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val(), 00, 00, 00);
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
            if ((this.model.get('_id') == undefined) && ($('.bbf-form .field-password .bbf-editor input').val() =='' || $('.bbf-form .field-password .bbf-editor input').val() ==null || $('.bbf-form .field-password .bbf-editor input').val() ==undefined)) // HT: password optional in case of edit 
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
            //validating the Date-format for specified Date
            if(date.getDate() != $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(0).val() || date.getMonth() != $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(1).val() || date.getFullYear() != $('.bbf-form .field-BirthDate .bbf-editor').find('select').eq(2).val()){
                isCorrect = false;
                $('.bbf-form .field-BirthDate label').css('color','red');
                }
            else
            	{
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
                    console.log(response);
                } else {
                    console.log(err);
                }
                $.cookie("forcedUpdateProfile",'false');
                alert(App.languageDict.attributes.Successfully_Registered);
                Backbone.history.navigate('members', {
                    trigger: true
                });
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
                    console.log(response);
                } else {
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
