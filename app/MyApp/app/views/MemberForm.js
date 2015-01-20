$(function () {

    App.Views.MemberForm = Backbone.View.extend({

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButtonCancel": function () {
                window.history.back()
            },
            "click #deactive": function (e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function () {
                    location.reload();
                })
                this.model.save({
                    status: "deactive"
                }, {
                    success: function () {}
                });
            },
            "click #ptManager": function (e) {
            
               
            },
            "click #active": function (e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function () {
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function () { /*this.model.fetch({async:false})*/ }
                });
            },
        },
		getRoles:function(userId){
        
            var user = (userId) ? new App.Models.Member({
                "_id": userId
            }): new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            user.fetch({
                async: false
            })
            var roles = user.get("roles")
            
            return roles
        },


        render: function () {
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
            this.form.fields['visits'].$el.hide()
            var $imgt = "<p id='imageText' style='margin-left: -100px;margin-top: 37px;'>Add Photo</p>"
            if (this.model.id != undefined) {
                buttonText = "Update"
                
                $("input[name='login']").attr("disabled", true);
                $imgt = "<p id='imageText'>Edit Photo</p>"
            } else {
                buttonText = "Register"
            }
            // give the form a submit button
            var $button = $('<div class="signup-submit"><a class="btn btn-success" id="formButton">' + buttonText + '</button><a class="btn btn-danger" id="formButtonCancel">Cancel</button></div>')
            //this.$el.append($button)
            var $upload = $('<form method="post" id="fileAttachment" style="margin: 60px 0px 0px 150px;"><input type="file" name="_attachments" style=" margin-top: 28px;" id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
            var $img = $('<div id="browseImage" >' + $imgt + '<img style="width:100px;height:100px;border-radius:50px" id="memberImage"></div>')
            this.$el.append($img)
            this.$el.append($upload)
             this.$el.append($button)
            if (this.model.id != undefined) {
                if (this.model.get("status") == "active") {
                    $(".signup-submit").append('<a class="btn btn-danger" id="deactive" href="#">Resign</a>')
                } else {
 					$(".signup-submit").append('<a class="btn btn-success" id="active" style="margin-left:212px; margin-top:-75px;" href="#">Reinstate</a>')
                }
                var logUserroles = this.getRoles(false)
            	 if (logUserroles.indexOf("SuperManager") > -1) {
            	 		var thisUser=this.getRoles(this.model.id)
            	 		 $('#memberform').append('<div style="margin-left: 510px;margin-top: -145px;"><input id="ptManager" type="checkbox" ><label for="ptManager">Promote To Manager</label></div>')
            	 		if(thisUser.indexOf("Manager")>-1)
                       		{
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

        validImageTypeCheck: function (img) {
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

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {
        if($('#ptManager').attr('checked')) { // if promote to manager checkbox is ticked
            // then add the 'Manager' role to his/her roles array only if this person is not a manager already. following check added
            // by Omer Yousaf on 16 Jan, 2015.
            var index = this.model.toJSON().roles.indexOf('Manager');
            if(index < 0) { // 'Manager' does not exist in his/her roles array
                this.model.toJSON().roles.push("Manager");
            }
        }
        else
        {
        	var index=this.model.toJSON().roles.indexOf('Manager')
        	if(index>-1)
        	{
        		 this.model.toJSON().roles.splice(index,1)
        	}
        }
        var that = this
            if (this.form.validate() != null) {
                return
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
                    nation: configsDoc.nationName
                });
                this.form.commit();
                // Send the updated model to the server
                if ($.inArray("lead", this.model.get("roles")) == -1) {
                    that.model.set("yearsOfTeaching", null)
                    that.model.set("teachingCredentials", null)
                    that.model.set("subjectSpecialization", null)
                    that.model.set("forGrades", null)
                }

                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("roles", ["Learner"])
                    this.model.set("visits", 0)
                    var existing = new App.Collections.Members()
                    existing.login=that.model.get("login")
                    existing.fetch({
                        async: false
                    })
                    existing=existing.first()
                    if(existing!=undefined) {
                        if (existing.toJSON().login != undefined) {
                            alert("Login already exist")
                            addMem = false
                        }
                    }
                }
                if (addMem) {
                    this.model.save(null, {
                        success: function () {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                            } else {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
                                    // so capture this in activity logging

                                    alert("Successfully Registered!!!");
                                } else {
                                    alert("Successfully Updated!!!");
                                }
                                Backbone.history.navigate('members', {
                                    trigger: true
                                })
                            }
                            that.model.on('savedAttachment', function () {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
                                    // so capture this in activity logging

                                    alert("Successfully Registered!!!");
                                    Backbone.history.navigate('members', {
                                        trigger: true
                                    })
                                } else {
                                    alert("Successfully Updated!!!");
                                    Backbone.history.navigate('members', {
                                        trigger: true
                                    })
                                }
                                $('#progressImage').hide();
                                Backbone.history.navigate('members', {
                                    trigger: true
                                })
                            }, that.model)
                        }
                    })
                }
            }
        },
    })

})