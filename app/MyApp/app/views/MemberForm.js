$(function() {

    App.Views.MemberForm = Backbone.View.extend({

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButtonCancel": function() {
                window.history.back()
            },
            "click #deactive": function(e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    location.reload();
                })
                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {}
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
            },
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


        render: function() {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            var buttonText = ""
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
                nation: App.configuration.get("nationName")
            })

            $("input[name='community']").attr("disabled", true);
            $("input[name='region']").attr("disabled", true);
            $("input[name='nation']").attr("disabled", true);


            var $imgt = "<p id='imageText' style='margin-top: 15px;'></p>"
            if (this.model.id != undefined) {
                buttonText = App.languageDict.attributes.Update

                $("input[name='login']").attr("disabled", true);
            } else {
                buttonText = App.languageDict.attributes.Register
            }
            // give the form a submit button
            var $button = $('<div class="signup-submit"><a class="btn btn-success" id="formButton" style="margin-top: 10px;">' + buttonText + '</button><a class="btn btn-danger" id="formButtonCancel" style="margin-top: 10px;">'+App.languageDict.attributes.Cancel+'</button></div>')
            //this.$el.append($button)
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
            alert("ERROR: Not a valid image file \n\n Valid Extensions are  [.jpg, .jpeg ]")
            return 0
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
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
            this.model.set("lastEditDate",new Date());
            var that = this;
            var isValid=true;
            if (this.form.validate() != null  ){
               isValid=false;
            }
            if(!this.validateMemberForm())
            {
                isValid=false;
            }
            if(!isValid){
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
                 //   this.model.set("lastLoginDate",null);
                }

                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("roles", ["Learner"])
                    this.model.set("visits", 0)
                    var existing = new App.Collections.Members()

                    existing.login = that.model.get("login")
                    existing.fetch({
                        async: false,
                        success: function() {
                            existing = existing.first()
                            if (existing != undefined) {
                                if (existing.toJSON().login != undefined) {
                                    alert("Login already exist")
                                    addMem = false
                                }
                            }
                        }

                    });

                }
                if (addMem) {
                    var memberModel = this.model;
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
                                    alert("Successfully Updated!!!");
                                    Backbone.history.navigate('members', {
                                        trigger: true
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
                                    alert("Successfully Updated!!!");
                                    Backbone.history.navigate('members', {
                                        trigger: true
                                    })
                                }
                            }, that.model)
                        }
                    })
                }
            }
        },

        validateMemberForm : function(){
            var isCorrect=true;
        if ( $('.bbf-form .field-Gender .bbf-editor select').val() =='' || $('.bbf-form .field-Gender .bbf-editor select').val() ==null || $('.bbf-form .field-Gender .bbf-editor select').val() ==undefined  ) {
            $('.bbf-form .field-Gender .bbf-error').html(App.languageDict.attributes.Required_Text);
            isCorrect=false;
        }
            if($('.bbf-form .field-levels .bbf-editor select').val() =='' || $('.bbf-form .field-levels .bbf-editor select').val() ==null || $('.bbf-form .field-levels .bbf-editor select').val() ==undefined) {
                $('.bbf-form .field-levels .bbf-error').html(App.languageDict.attributes.Required_Text);
                isCorrect=false;
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
                    $('.bbf-form .field-BirthDate .bbf-error').html(App.languageDict.attributes.Required_Text);
                    isCorrect=false;
                }
            else{
                    //Now, validate age range [5,100] (Inclusive)
                  if(this.getAgeOfUser()<5 || this.getAgeOfUser()>100) {
                      alert('Valid age range lies from 5 to 100 only. (Inclusive)');
                      isCorrect = false;
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
                alert("Successfully Registered!!!");
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
                    console.log("updated activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: UpdatejSONlog: err making update to record");
                    console.log(err);
                }
                alert("Successfully Registered!!!");
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        }
    })

})