$(function() {
    App.Views.CommunitiesTable = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",


        vars: {},

        addOne: function(model) {
            if (model.get('_id') !== '_design/bell') { // only render if its NOT a design doc
                var CommunityRow = new App.Views.CommunityRow({
                    model: model
                })
                CommunityRow.render()
                this.$el.append(CommunityRow.el)
            }
        },

        addAll: function() {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
        },

        render: function() {

            this.$el.append('<tr><th>Community</th><th>Last App <br>Update</th><th>Version No.</th><th>Last Publications <br>Sync</th><th>Last Activities <br>Sync</th><th>Total Member <br>Visits</th><th>Total Resource <br>Views</th></th><th colspan="2">Actions</th></tr>')
            this.addAll()
        }

    })

});$(function() {

    App.Views.CommunityForm = Backbone.View.extend({

        className: "addNation-form",
        vars: {},

        events: {
            "click #formButton": function() {
                document.getElementById("addCommunity").submit();
            },
            "submit form": "setForm",
        },
        template: $('#template-addCommunity').html(),


        render: function() {

            var Nation = this.model
            this.$el.append(_.template(this.template, this.vars))
            if (this.model.id != undefined) {
                buttonText = "Update"

                $('#nation-name').val(Nation.get('Name'))
                $('#community-code').val(Nation.get('Code'))
                $('#nation-url').val(Nation.get('Url'))
                $('#org-name').val(Nation.get('SponserName'))
                $('#org-sponseraddress').val(Nation.get('SponserAddress'))
                $('#org-firstname').val(Nation.get('ContactFirstname'))

                $('#org-middlename').val(Nation.get('ContactMiddlename'))
                $('#org-lastname').val(Nation.get('ContactLastname'))

                $('#org-phone').val(Nation.get('ContactPhone'))
                $('#org-email').val(Nation.get('ContactEmail'))
                $('#leader-firstname').val(Nation.get('LeaderFirstname'))
                $('#leader-middlename').val(Nation.get('LeaderMiddlename'))
                $('#leader-lastname').val(Nation.get('LeaderLastname'))
                $('#leader-phone').val(Nation.get('LeaderPhone'))
                $('#leader-email').val(Nation.get('LeaderEmail'))
                $('#leader-ID').val(Nation.get('LeaderId'))
                $('#leader-password').val(Nation.get('LeaderPassword'))
                $('#urg-name').val(Nation.get('UrgentName'))
                $('#urg-phone').val(Nation.get('UrgentPhone'))
                $('#auth-name').val(Nation.get('AuthName'))
                $('#auth-date').val(Nation.get('AuthDate'))
            }
            var that = this


        },
        setForm: function() {
            this.model.set({
                Name: $('#nation-name').val(),
                Code: $('#community-code').val(),
                Url: $('#nation-url').val(),
                SponserName: $('#org-name').val(),
                SponserAddress: $('#org-sponseraddress').val(),
                ContactFirstname: $('#org-firstname').val(),
                ContactMiddlename: $('#org-middlename').val(),
                ContactLastname: $('#org-lastname').val(),
                ContactPhone: $('#org-phone').val(),
                ContactEmail: $('#org-email').val(),
                LeaderFirstname: $('#leader-firstname').val(),
                LeaderMiddlename: $('#leader-middlename').val(),
                LeaderLastname: $('#leader-lastname').val(),
                LeaderPhone: $('#leader-phone').val(),
                LeaderEmail: $('#leader-email').val(),
                LeaderId: $('#leader-ID').val(),
                LeaderPassword: $('#leader-password').val(),
                UrgentName: $('#urg-name').val(),
                UrgentPhone: $('#urg-phone').val(),
                AuthName: $('#auth-name').val(),
                AuthDate: $('#auth-date').val()
            });

            var context = this;
            $.ajax({
                url: '/community/_design/bell/_view/isDuplicateName?include_docs=true&key="' + context.model.get('Name') + '"',
                type: 'GET',
                dataType: "json",
                async: false,
                success: function(result) {
                    // assumption: if control falls to the success function result.rows will never be undefined. it will value of an array
                    if (result.rows.length > 1) { // if more than one community records with same 'Name' i-e duplicate community Name found in DB
                        alert("Community has duplicates in the database. Please delete other copies and retry.");
                        return;
                    } else if (result.rows.length === 0) { // if no duplicates found in DB
                        context.model.save();
                        alert("Successfully Saved");
                        App.startActivityIndicator();
                        Backbone.history.navigate('listCommunity', {
                            trigger: true
                        });
                        App.stopActivityIndicator();
                    } else { // result.rows.length = 1. one duplicate has been found in db but we need to check sth more, this is not enough
                        // the key, community 'Name' passed into the view did find a matching community and returned it
                        // but we must ensure that the community in DB is not the same i-e both of these do not belong to same community record/document
                        var duplicateCommunityInDB = result.rows[0].doc;
                        if ((context.model.id) && (context.model.id === duplicateCommunityInDB._id)) {
                            // its the same community with some edit(s). not a new one which is has same name as another existing community
                            //                            alert("Same community edit");
                            context.model.save();
                            alert("Successfully Saved");
                            App.startActivityIndicator();
                            Backbone.history.navigate('listCommunity', {
                                trigger: true
                            });
                            App.stopActivityIndicator();
                        } else {
                            alert("Community 'Name' you entered is a duplicate. Please try again with a different name.");
                        }
                    }
                },
                error: function() {
                    alert("There was an error in getting a response from the server. Please try again.");
                }
            });

            //            context.model.save()
            //            alert("Successfully Saved")
            //            App.startActivityIndicator()
            //            Backbone.history.navigate('listCommunity',{trigger:true});
            //            App.stopActivityIndicator()
            /*    $.ajax({
             headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json; charset=utf-8'
             },
             type: 'POST',
             url: '/_replicate',
             dataType: 'jsonp',
             data: JSON.stringify({
             "source": "community_code",
             "target": "http://10.10.2.79:5984/community_code"
             }),
             success: function (response) {
             console.log(response)
             },
             async: false
             });


             var myDonut = this.model.toJSON()
             var m = JSON.stringify(myDonut)
             alert(m)
             $.ajax({
             url : 'http://10.10.2.69:5984/community',
             type : 'POST',
             dataType : "jsonp",
             data : m ,
             success : function(json) {
             console.log(json)
             alert('ddkkkkddd')
             }
             })
             // $.ajax({
             //                         headers: {
             //                             'Accept': 'application/json',
             //                             'Content-Type': 'application/json; charset=utf-8'
             //                         },
             //                         type: 'POST',
             //                         url: 'http://10.10.2.79:5984/community_code',
             //                         dataType: 'jsonp',
             //                         data: JSON.stringify(myDonut),
             //                         success: function (response) {
             //
             //                         	console.log(data)
             //                             console.log(response)
             //                         },
             //                         async: false
             //                     });
             //$.post('community_code',)  */



            //}
            // else{
            //        		alert('not validate');
            //
            //        		}
        }

    })

});$(function() {

    App.Views.CommunityRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroy": function(e) {

                if (confirm('Are you sure you want to delete this Community?')) {
                    e.preventDefault()
                    this.model.destroy()
                    this.remove()
                } else {
                    e.preventDefault()

                    App.startActivityIndicator();
                    Backbone.history.navigate('listCommunity', {
                        trigger: true
                    });
                    App.stopActivityIndicator();
                }
            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        //template : $("#template-GroupRow").html(),

        initialize: function() {

        },

        render: function() {
            var that = this;
            var community = this.model;
            var communityData = '';
            var communityCode = community.attributes.Code;
            var communityName = community.get('Name'); //Issue#80:Add Report button ( Generate Report ) on the Communities page at nation
            var communityDate = community.get('lastActivitiesSyncDate'); //issue#50:Add Last Activities Sync Date to Activity Report On Nation For Individual Communities
            var communitySyncdate = communityDate.split("/").join("-");
            communityData = communityCode + "." + communityName;
            //alert(communitySyncdate);
            var temp = $.url().data.attr.host.split(".")
            var nationName = temp[0];
            var nationUrl = $.url().data.attr.authority;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var startDate = that.changeDateFormat(that.turnDateToYYYYMMDDFormat(firstDay));
            var endDate = that.changeDateFormat(that.turnDateToYYYYMMDDFormat(lastDay));
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/activitylog/_design/bell/_view/getDocByCommunityCodeWithValue?_include_docs=true&&startkey=["' + communityCode + '","' + startDate + '"]&endkey=["' +
                communityCode + '","' + endDate + '"]',
                type: 'GET',
                dataType: 'jsonp',
                success: function(result) {
                    var memberVisits = 0;
                    var resourceViews = 0;
                    var activitylogModels;
                    activitylogModels = result.rows;
                    if (activitylogModels.length > 0) {
                        memberVisits = 0;
                        resourceViews = 0;
                        for (var i = 0; i < activitylogModels.length; i++) {
                            var femaleVisits = activitylogModels[i].value.female_visits;
                            var maleVisits = activitylogModels[i].value.male_visits;
                            console.log(femaleVisits + " " + maleVisits);
                            memberVisits = memberVisits + femaleVisits + maleVisits;
                            console.log("Female Visits: " + femaleVisits + " " + "Male Visits: " + maleVisits + " " + "Total: " + femaleVisits + maleVisits);
                            var female_opened = activitylogModels[i].value.female_opened;
                            var male_opened = activitylogModels[i].value.male_opened;
                            var female_opened_count = 0;
                            var male_opened_count = 0;
                            for (var j = 0; j < female_opened.length; j++) {
                                female_opened_count = female_opened_count + female_opened[j];
                            }
                            for (var k = 0; k < male_opened.length; k++) {
                                male_opened_count = male_opened_count + male_opened[k];
                            }
                            resourceViews = resourceViews + female_opened_count + male_opened_count;
                            console.log("resource views: " + resourceViews);
                        }
                    }
                    // //Issue#80:Add Report button ( Generate Report ) on the Communities page at nation
                    var row = "<td>" + community.get('Name') + "</td><td>" + community.get('lastAppUpdateDate') + "</td><td>" + community.get('version') + "</td><td>" + community.get('lastPublicationsSyncDate') + "</td><td>" + community.get('lastActivitiesSyncDate') + "</td><td>" + memberVisits + "</td><td>" + resourceViews + "</td>" +
                        "<td><a  class='btn btn-success' id='submit' href='#communityreport/" + communitySyncdate + "/" + community.get("Name") + "/" + community.get('Code') + "'>Generate Report</a>&nbsp&nbsp&nbsp<a role='button' class='btn btn-info' href='#addCommunity/" +
                        community.get('_id') + "'> <i class='icon-pencil icon-white'></i>Edit</a>&nbsp&nbsp&nbsp<a role='button' class='btn btn-danger destroy' href='#addCommunity/" +
                        community.get('_id') + "'> <i class='icon-remove icon-white'></i>Delete</a></td>";
                    that.$el.append(row);
                },
                error: function() {
                    console.log("Unable to get communities list.");
                }
            });
        },
        turnDateToYYYYMMDDFormat: function(date) {
            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            // CONVERT mm AND dd INTO chars
            var mmChars = mm.split('');
            var ddChars = dd.split('');
            // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
            var dateString = yyyy + '/' + (mmChars.length === 2 ? mm : "0" + mmChars[0]) + '/' + (ddChars.length === 2 ? dd : "0" + ddChars[0]);
            return dateString;
        },
        changeDateFormat: function(date) {
            var datePart = date.match(/\d+/g),
                year = datePart[0],
                month = datePart[1],
                day = datePart[2];
            return year + '/' + month + '/' + day;
        }

    })

});$(function() {

    App.Views.ConfigurationView = Backbone.View.extend({

        template: $('#template-Configuration').html(),
        template: _.template($("#template-Configuration").html()),
        vars: {},
        events: {
            "click #saveLanguage": function(e) {
                var isChanged = false
                var selectedVal = $("#languageSelection").val()
                if (selectedVal != "") {
                    this.model.set('currentLanguage', selectedVal)
                    isChanged = true
                }
                if ($('#appversion').val() != "") {
                    this.model.set('version', $('#appversion').val())
                    isChanged = true
                }
                if ($('#notes').val() != "") {
                    this.model.set('notes', $('#notes').val())
                    isChanged = true
                }
                if (isChanged) {
                    var that = this
                    console.log(this.model.toJSON())
                    this.model.save(null, {
                        success: function(response, model) {
                            that.model.set("_rev", response.get("rev"))
                        }
                    })
                    alert('Configuration saved.')
                } else {
                    alert("You have not changed any thing.")
                }
            }
        },
        render: function() {
            this.vars = this.model.toJSON()
            this.$el.html(this.template(this.vars))
            this.$el.append('<br>&nbsp;&nbsp;<button class="btn btn-success" id="saveLanguage" >Save</button>')
        }

    })

});$(function() {

    App.Views.Configurations = Backbone.View.extend({

        initialize: function() {
            this.$el.html('<h3>Set Configurations<h3>')
        },
        events: {
            "click #formButton": "setForm"
        },
        render: function() {
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el);
            this.$el.append('<a style="margin-left:31px" class="btn btn-success" id="formButton">Submit Configurations </a>');
        },
        setForm: function() {
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config = this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({
                async: false
            });
            var con = config.first();
            con.set('name', Config.get('name'));
            con.set('nationName', Config.get('nationName'));
            con.set('nationUrl', Config.get('nationUrl'));
            con.set('code', Config.get('code'));
            con.set('type', Config.get('type'));
            con.set('notes', Config.get('notes'));
            con.set('version', Config.get('version'));
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            con.save(null, {
                success: function(doc, rev) {
                    App.configuration = con;
                    console.log(App.configuration.get('name'))
                    alert('Configurations are Successfully Added');
                    Backbone.history.navigate('dashboard', {
                        trigger: true
                    });
                }
            });
        }
    })
});$(function() {

    App.Views.Dashboard = Backbone.View.extend({

        template: $('#template-Dashboard').html(),

        vars: {},
        render: function() {

            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var configuration = config.first()

            var dashboard = this
            this.vars.imgURL = "img/header_slice.png"
            var a = new App.Collections.MailUnopened({
                receiverId: $.cookie('Member._id')
            })
            a.fetch({
                async: false
            })
            this.vars.type = configuration.get("type")
            this.vars.mails = a.length

            this.$el.html(_.template(this.template, this.vars))
            $('.now').html(moment().format('dddd | DD MMMM, YYYY'))
            // Member Name
            var member = new App.Models.Member()
            member.id = $.cookie('Member._id')

            member.on('sync', function() {
                var attchmentURL = '/members/' + member.id + '/'
                if (typeof member.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
                    document.getElementById("imgurl").src = attchmentURL
                }
              //////////////////////////////////////////Code Changes for Issue No.73///////////////////////////////////
                var configuration;
                var config = new App.Collections.Configurations()
                config.fetch({
                    async: false,
                    success: function(){
                        configuration = config.first().attributes.name;
                    }
                })
                configuration=configuration.charAt(0).toUpperCase() + configuration.slice(1);
                var typeofBell=config.first().attributes.type;
                if (typeofBell === "nation") {
                    configuration = configuration + " Nation Bell"
                } else {
                    configuration = configuration + " Community Bell"
                }
                $('.bellLocation').html(configuration);
             
                //////////////////////////////////////////////////////////////////////////////////////////////////////
              /*  var temp = $.url().data.attr.host.split(".")
                temp = temp[0];
                if (temp.substring(0,3) == "127") {
                    temp = "local"
                }
                temp = temp.charAt(0).toUpperCase() + temp.slice(1) + " Nation Bell"*/
               // $('.bellLocation').html(bell_Name);
                if (!member.get('visits')) {
                    member.set('visits', 1)
                    member.save()
                }
                if (parseInt(member.get('visits')) == 0) {
                    temp = "Error!!"
                } else {
                    temp = member.get('visits') + " visits"
                }
                var roles = "&nbsp;-&nbsp;"
                var temp1 = 0
                if (member.get("roles").indexOf("Learner") != -1) {
                    roles = roles + "Learner"
                    temp1 = 1
                }
                if (member.get("roles").indexOf("Leader") != -1) {
                    if (temp1 == 1) {
                        roles = roles + ",&nbsp;"
                    }
                    roles = roles + "Leader"
                    temp1 = 1
                }
                if (member.get("roles").indexOf("Manager") != -1) {
                    if (temp1 == 1) {
                        roles = roles + ",&nbsp;"
                    }
                    roles = roles + "Manager"
                }
                $('.visits').html(temp)
                $('.name').html(member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '</span>' + '&nbsp;<a href="../MyApp/index.html#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>')
            })
            member.fetch()

        }

    })

});$(function() {

    App.Views.GroupRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {
            "click .addtoPublication": "addtoPublication",
            "click .browse": function(e) {

            }
        },

        template: $("#template-GroupRow").html(),

        initialize: function(e) {
            this.roles = e.roles
        },

        render: function() {

            var vars = this.model.toJSON()

            if (vars._id == '_design/bell')
                return

            this.$el.append(_.template(this.template, vars))


        },
        addtoPublication: function(e) {
            var courseId = e.currentTarget.name
            var publication = new App.Models.Publication({
                _id: this.publicationId
            })
            publication.fetch({
                success: function(response) {
                    courses = response.get('courses');
                    if (courses == undefined) {
                        courses = []
                    }
                    for (var j in courses) {
                        if (courses[j]['courseID'] === courseId) { // if courseId matches with id of an already added course's id, return
                            alert("This Course Already Exists In This Publication");
                            return;
                        }
                    }
                    //                         if(courses.indexOf(courseId)!=-1){
                    //                            alert("This Course Already Exists In This Publication")
                    //                            return
                    //                         }
                    // add the courseId, the course-step-Ids, and the resourceIds of resources referenced in those course-steps
                    // courseId: we already have. so fetch course-tep-Ids now
                    var fullCourseRef = {};
                    fullCourseRef['courseID'] = courseId;
                    fullCourseRef['stepIDs'] = [];
                    var courseSteps = new App.Collections.CourseLevels();
                    courseSteps.groupId = courseId;
                    courseSteps.fetch({
                        success: function(resp, responseInfo) {
                            courseSteps.each(function(courseStep) { // is array.each a javascript construct?
                                var courseStepSingle = {
                                    'stepID': courseStep.get('_id')
                                };
                                courseStepSingle['resourceIDs'] = ((courseStep.get('resourceId').length > 0) ? courseStep.get('resourceId') : []); // courseSteps[i].resourceId refers to an array of resourceIds
                                fullCourseRef['stepIDs'].push(courseStepSingle);
                            });
                            courses.push(fullCourseRef);
                            response.set({
                                "courses": courses
                            });
                            response.save(null, { // should this save call happen inside or outside coursesteps.fetch()?
                                success: function() {
                                    alert("Added Successfully");
                                }
                            });
                        },
                        error: function(err) {
                            console.log(err);
                            alert("Failed to add the course to the publication");
                        }
                    });
                    //					 courses.push(courseId)
                    //					 response.set({"courses":courses})
                    //					 response.save(null,{success:function(){
                    //					        alert("Added Successfully")
                    //						 }})
                }
            });
        }
    })
});$(function() {
    App.Views.GroupView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,
        events: {
            "click #admissionButton": function(e) {
                alert('asdfasdf')
            }
        },
        render: function() {
            console.log(this.model)
            this.addCourseDetails()
        },
        addCourseDetails: function() {
            var that = this
            var courseInfo = this.model.toJSON()

            var leaderInfo = this.courseLeader.toJSON()
            console.log(courseInfo)
            console.log(leaderInfo)
            this.$el.append('<tr><td><b>Name</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>Subject Level </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Grade Level </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Description</b></td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td><b>LeaderName </b></td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Email </b></td><td>' + courseInfo.leaderEmail + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Phone Number </b></td><td>' + courseInfo.leaderPhone + '</td></tr>')

            this.$el.append('<tr><td><b>schedule</b></td><td>Date :  ' + courseInfo.startDate + '-' + courseInfo.endDate + '<br>Time :  ' + courseInfo.startTime + '- ' + courseInfo.endTime + '</td></tr>')

            this.$el.append('<tr><td><b>Location </b></td><td>' + courseInfo.location + '</td></tr>')

            $(document).on('Notification:submitButtonClicked', function(e) {
                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", that.model.get('courseLeader'));
                mail.set("subject", "Course Admission Request | " + that.model.get('name'));
                mail.set("body", 'Admission request received from user \"' + $.cookie('Member.login') + '\" in ' + that.model.get('name') + ' <br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.get('_id') + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.get('id') + '" >Reject</button>');
                mail.set("status", "0");
                mail.set("type", "admissionRequest");
                mail.set("sentDate", currentdate);
                mail.save()
                alert("Admission request successfully sent to this course leader.")


            });

        }
    })

});$(function() {

    App.Views.GroupsTable = Backbone.View.extend({

        tagName: "table",
        className: "table table-striped",
        roles: null,

        addOne: function(model) {
            var groupRow = new App.Views.GroupRow({
                model: model,
                roles: this.roles
            })
            groupRow.publicationId = this.publicationId
            groupRow.render()
            this.$el.append(groupRow.el)
        },

        addAll: function() {

            this.$el.html("<tr><th>Title</th><th colspan='0'>Actions</th></tr>")
            var manager = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            manager.fetch({
                async: false
            })
            this.roles = manager.get("roles")
            this.collection.each(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

    App.Views.MemberLoginForm = Backbone.View.extend({
        template: $('#template-login').html(),
        vars: {},
        className: "form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function() {
            // create the form
            this.$el.html(_.template(this.template, this.vars))
            // this.form = new Backbone.Form({model:this.model})
            //$('#Login-form',this.$el).append(this.form.render().el)
            // give the form a submit button
            var $button = $('<button class="btn btn-success" style="background-color:#34495e" id="formButton">Sign In</button>')
            $('#submit-button', this.$el).append($button)
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var memberLoginForm = this
            var username = $('#username').val()
            var password = $('#password').val()
            $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + username + '"', function(response) {
                if (response.rows[0]) {
                    if (response.total_rows > 0 && response.rows[0].doc.password == password) {
                        if (response.rows[0].doc.status == "active") {
                            var date = new Date();
                            //cookies are stored for /apps/_design/bell (same url for personal and lms)

                            $.cookie('Member.login', response.rows[0].doc.login, {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member._id', response.rows[0].doc._id, {
                                path: "/apps/_design/bell"
                            })
                            $.cookie('Member.expTime', date, {
                                path: "/apps/_design/bell"
                            })
                            if ($.inArray('student', response.rows[0].doc.roles) != -1) {
                                if (response.rows[0].doc.roles.length < 2) {
                                    alert("You are not authorized to sign in")
                                } else {
                                    memberLoginForm.trigger('success:login')
                                }
                            } else {
                                memberLoginForm.trigger('success:login')
                            }
                        } else {
                            alert("Your account is deactivated")
                        }
                    } else {
                        alert('Login or Password Incorrect')
                    }
                } else {
                    alert('Login or Password Incorrect')
                }
            });
        },


    })
});$(function() {

    App.Views.NationReportCommentView = Backbone.View.extend({

        tagName: "div",
        id: "comment-feedback",
        cId: null,
        initialize: function(e) {
            console.log(e)
            this.cId = e.NationReportId
            this.model = new App.Models.NationReportComment

        },

        events: {
            'click #submitFormButton': 'submit',
            'click #cancelFormButton': 'cancel'
        },
        cancel: function() {
            $('#debug').hide()
            this.remove()
        },
        submit: function() {
            if (this.form.getValue("comment").length != 0) {
                var now = new Date();
                now.getDate()
                this.form.setValue({
                    NationReportId: this.cId
                })
                this.form.setValue({
                    commentNumber: (this.collection.length + 1)
                })
                this.form.setValue({
                    memberLogin: $.cookie('Member.login')
                })
                this.form.setValue({
                    time: now.toString()
                })
                this.form.commit()
                this.model.save()
                this.form.setValue({
                    comment: ""
                })
                this.collection.fetch({
                    async: false
                })
                this.model.set({
                    "comment": ""
                })
                this.render()
            }
        },

        addOne: function(modl) {
            $('#comments').append('<div id=tile><b>Login:</b>' + modl.toJSON().memberLogin + '<br/><b>Time:</b>' + modl.toJSON().time + '<br/><b>Comment:</b>' + modl.toJSON().comment + '</div>')
            console.log(modl.toJSON())
        },

        render: function() {
            $('#debug').show()
            this.$el.html('&nbsp;')
            $('#comments').html('&nbsp;')
            this.collection.forEach(this.addOne, this)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['NationReportId'].$el.hide()
            this.form.fields['commentNumber'].$el.hide()
            this.form.fields['memberLogin'].$el.hide()
            this.form.fields['time'].$el.hide()
            var $button = $('<div id="r-formButton"><button class="btn btn-primary" id="submitFormButton">Add Comment</button><button class="btn btn-info" id="cancelFormButton">Close</button></div>')
            this.$el.append($button)
            // $("#comments").animate({ scrollTop: $('#comments')[0].scrollHeight}, 3000);
        }

    })

});$(function() {

    App.Views.Publication = Backbone.View.extend({

        template: $('#template-Publication').html(),
        render: function() {
            this.$el.html(_.template(this.template))

        }

    })

});$(function() {

    App.Views.PublicationCourseRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var publicationObject = new App.Models.Publication({
                    _id: this.Id
                })
                publicationObject.fetch({
                    async: false
                })
                var courses = publicationObject.get('courses');

                for (var j in courses) {
                    if (courses[j]['courseID'] === this.model.get('_id')) { // if courseId matches with id of an already added course's id, return
                        courses.splice(j, 1);
                        break;
                    }
                }


                //			var index=courses.indexOf(this.model.get('_id'))
                //			if (index > -1) {
                // 			   courses.splice(index, 1);
                //			}
                this.$el.hide()

                publicationObject.set({
                    'courses': courses
                })
                publicationObject.save()
            }

        },

        vars: {},

        template: _.template($("#template-publication-CourseRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(this.template(vars))
        },


    })

});$(function() {

    App.Views.PublicationCoursesTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {

        },
        addOne: function(model) {
            var publicationCourseRowView = new App.Views.PublicationCourseRow({
                model: model
            })
            publicationCourseRowView.Id = this.Id
            publicationCourseRowView.render()
            this.$el.append(publicationCourseRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Course Title</th><th colspan="2">Actions</th></tr>')
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2"> No Course in this publication <td></tr>')

            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

    App.Views.PublicationForm = Backbone.View.extend({

        className: "form",
        events: {
            "click .save": "saveForm",
            "click #AddResPublication": "searchres",
            "click #AddCoursePublication": "listCourses",
            "click #cancel": function() {
                window.location.href = '#publication'
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function() {

            var vars = {}

            if (_.has(this.model, 'id')) {
                vars.header = 'Publication Issue : "' + this.model.get('IssueNo') + '"'
            } else {
                vars.header = 'New Publication Issue'
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            vars.form = ""
            vars.rlength = this.rlength
            this.form.render()
            this.$el.html(this.template(vars))

            $('.fields').html(this.form.el)
            $('.form .field-resources').hide();
            $('#progressImage').hide();

            return this
        },

        saveForm: function() {
            var isEdit = this.model.get("_id")
            var addtoDb = true
            this.form.commit()
            if (this.model.get("IssueNo") == undefined) {
                alert("Publication Issue is missing")
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Publication()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function(m) {
                        if (that.model.get("IssueNo") == m.get("IssueNo")) {
                            alert("IssueNo already exist")
                            addtoDb = false
                        }
                    })
                }

                if (addtoDb) {
                    this.form.commit()
                    this.model.save(null, {
                        success: function(e) {
                            alert("Issue Saved!")
                            window.location.href = '#publicationdetail/' + e.toJSON().id;
                        }
                    })
                }
            }

        },
        searchres: function() {
            var showsearch = true
            var isEdit = this.model.get("_id")
            this.form.commit()
            if (this.model.get("IssueNo") == undefined) {
                alert("Publication Issue is missing")
                showsearch = false
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.issue = this.model.get("IssueNo")
                    allpub.fetch({
                        async: false
                    })
                    allpub = allpub.first()
                    if (allpub != undefined)
                        if (allpub.toJSON().IssueNo != undefined) {
                            alert("IssueNo already exist")
                            showsearch = false
                        }

                }
            }
            if (showsearch) {
                this.model.save(null, {
                    success: function(e) {
                        window.location.href = '../MyApp/index.html#search-bell/' + e.toJSON().id;
                    }
                })


            }
        },
        listCourses: function() {
            var showcourse = true
            var myCourses = new Array()
            var isEdit = this.model.get("_id")
            this.form.commit()
            // this.model.unset("resources", { silent: true });
            this.model.set({
                "courses": myCourses
            })
            if (this.model.get("IssueNo") == undefined) {
                alert("Publication Issue is missing")
                showcourse = false
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.issue = this.model.get('IssueNo')
                    allpub.fetch({
                        async: false
                    })
                    allpub = allpub.first()
                    if (allpub != undefined)
                        if (allpub.toJSON().IssueNo != undefined) {
                            alert("IssueNo already exist")
                            showcourse = false
                        }

                }
            }
            if (showcourse) {
                this.model.save(null, {
                    success: function(e) {
                        window.location.href = '#courses/' + e.toJSON().id;
                    }
                })


            }
        },
        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

});$(function() {

    App.Views.PublicationResourceRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var publicationObject = new App.Models.Publication({
                    _id: this.Id
                })
                publicationObject.fetch({
                    async: false
                })
                var resources = publicationObject.get('resources')
                var index = resources.indexOf(this.model.get('_id'))
                if (index > -1) {
                    resources.splice(index, 1);
                }
                this.$el.hide()

                publicationObject.set({
                    'resources': resources
                })
                publicationObject.save()
            }

        },

        vars: {},

        template: _.template($("#template-ResourceRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(this.template(vars))
        },


    })

});$(function() {

    App.Views.PublicationResourceTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var publicationResourceRowView = new App.Views.PublicationResourceRow({
                model: model
            })
            publicationResourceRowView.Id = this.Id
            publicationResourceRowView.render()
            this.$el.append(publicationResourceRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Resource Title</th><th colspan="2">Actions</th></tr>')
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2"> No Resource in this publication <td></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

    App.Views.PublicationRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                alert("deleting")
                this.model.destroy()
                event.preventDefault()
            },
            "click #a": function(id) {
                alert(id)
            }
        },

        vars: {},

        template: _.template($("#template-PublicationRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()

            this.$el.append(this.template(vars))


        },


    })

});$(function() {

    App.Views.PublicationTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",
        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var publicationRowView = new App.Views.PublicationRow({
                model: model
            })
            publicationRowView.render()
            this.$el.append(publicationRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Date Issue</th><th>Issue No.</th><th>Editor Name</th><th>Editor Email</th><th>Editor Phone</th><th colspan="2">Actions</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        },
    })

});$(function() {

    App.Views.ReportForm = Backbone.View.extend({

        className: "form",
        hide: false,
        events: {
            "click .save": "saveForm",
            "click #cancel": function() {
                window.history.back()
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function() {
            var vars = {}

            // prepare the header

            if (_.has(this.model, 'id')) {

                vars.header = 'Title "' + this.model.get('title') + '"'
                vars.hidesave = true
            } else {
                vars.header = 'New Nation Report'
                vars.hidesave = false
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            //this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                alert("here")
                //this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            //this.form.fields['addedBy'].$el.attr("disabled",true)
            //this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                //if(this.model.get("Level") == "All"){
                // that.form.fields['toLevel'].$el.hide();
                //that.form.fields['fromLevel'].$el.hide();
                //that.hide = true
            }


            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()

            // render the template
            console.log(vars)
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working

            return this
        },

        saveForm: function() {
            // @todo validate
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory
            var addtoDb = true
            var previousTitle = this.model.get("title")
            var newTitle
            var isEdit = this.model.get("_id")
            console.log(isEdit)
            this.form.commit()
            // Send the updated model to the server
            newTitle = this.model.get("title")
            var that = this
            var savemodel = false
            if (this.model.get("title").length == 0) {
                alert("Resource Title is missing")
            } else if ((this.model.get("Tag") == "News") && !this.model.get("author")) {
                alert("Please Specify Author For This News Resource")
            } else {
                $('#gressImage').show();
                this.model.set(' uploadDate', new Date().getTime())
                if (this.model.get("Level") == "All") {
                    this.model.set('toLevel', 0)
                    this.model.set('fromLevel', 0)
                } else {
                    if (parseInt(this.model.get("fromLevel")) > parseInt(this.model.get("toLevel"))) {
                        alert("Invalid range specified ")
                        addtoDb = false
                    }
                }
                if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Reports()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function(m) {
                        if (that.model.get("title") == m.get("title")) {
                            alert("Title already exist")
                            addtoDb = false
                        }
                    })
                }
                if (addtoDb) {
                    if (isEdit == undefined) {
                        this.model.set("sum", 0)
                    } else {
                        this.model.set("title", previousTitle)
                    }
                    this.model.save(null, {
                        success: function() {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                if (isEdit != undefined) {
                                    if (previousTitle != newTitle) {
                                        var titleMatch = false
                                        var allres = new App.Collections.Resources()
                                        allres.fetch({
                                            async: false
                                        })
                                        allres.each(function(m) {
                                            if (newTitle == m.get("title")) {
                                                titleMatch = true
                                            }
                                        })
                                        if (!titleMatch) {
                                            var new_res = new App.Models.Resource()
                                            new_res.set("title", newTitle)
                                            new_res.set("description", that.model.get("description"))
                                            new_res.set("articleDate", that.model.get("articleDate"))
                                            new_res.set("addedBy", that.model.get("addedBy"))
                                            new_res.set("openWith", that.model.get("openWith"))
                                            new_res.set("subject", that.model.get("subject"))
                                            new_res.set("Level", that.model.get("Level"))
                                            new_res.set("fromLevel", that.model.get("fromLevel"))
                                            new_res.set("toLevel", that.model.get("toLevel"))
                                            new_res.set("Tag", that.model.get("Tag"))
                                            new_res.set("author", that.model.get("author"))
                                            new_res.set("openWhichFile", that.model.get("openWhichFile"))
                                            new_res.set("uploadDate", that.model.get("uploadDate"))
                                            new_res.set("openUrl", that.model.get("openUrl"))
                                            new_res.set("averageRating", that.model.get("averageRating"))
                                            new_res.set("sum", 0)
                                            new_res.set("timesRated", 0)
                                            new_res.save()
                                            console.log("MODEL UPDATION")
                                            new_res.on('sync', function() {
                                                new_res.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                                new_res.on('savedAttachment', function() {
                                                    alert("Resource Updated Successfully")
                                                    Backbone.history.navigate("#resources", {
                                                        trigger: true
                                                    })
                                                    that.trigger('processed')
                                                    $('#progressImage').hide();
                                                }, new_res)
                                            })
                                        } else {
                                            alert("Resource title Already exist")
                                        }
                                    } else {
                                        alert("Cannot update model due to identical title")
                                    }
                                } else {
                                    that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                }
                            } else {
                                that.model.trigger('processed')
                            }

                            that.model.on('savedAttachment', function() {
                                this.trigger('processed')
                                $('#progressImage').hide();
                            }, that.model)
                        }
                    })
                }
            }

        },

        statusLoading: function() {
            alert("asdf")
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

});$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                alert("deleting")
                this.model.destroy()
                event.preventDefault()
            },
            "click #open": function(event) {
                if (this.model.get("views") == undefined) {
                    this.model.set('views', 1)
                    this.model.save()
                } else {
                    this.model.set('views', this.model.get("views") + 1)
                    this.model.save()
                }

            },
            "click #commentButton": function(e) {
                console.log(e)
                console.log(e.target.attributes[0].nodeValue)
                var coll = new App.Collections.NationReportComments()
                coll.NationReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                console.log(coll.toJSON())
                var viw = new App.Views.NationReportCommentView({
                    collection: coll,
                    NationReportId: e.target.attributes[0].nodeValue
                })
                viw.render()
                $('#debug').append(viw.el)
            }

        },

        vars: {},

        template: _.template($("#template-ReportRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()

            if (vars.views == undefined) {
                vars.views = 0
            }

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()

            this.$el.append(this.template(vars))


        },


    })

});$(function() {

    App.Views.ReportsTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var reportRowView = new App.Views.ReportsRow({
                model: model
            })
            reportRowView.isManager = this.isManager
            reportRowView.render()
            this.$el.append(reportRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Time</th><th>Request</th><th>Author</th><th>Views</th><th colspan="5">Actions</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

    App.Views.RequestRow = Backbone.View.extend({

        tagName: "tr",

        template: _.template($("#template-RequestRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            var sender = new App.Models.Member({
                "_id": vars.senderId
            })
            sender.fetch({
                async: false
            })
            vars.login = sender.toJSON().login
            if (vars.date == undefined) {
                vars.date = "Not available"
            }

            if (vars.sendFromName == undefined) {
                vars.sendFromName = "Not available"
            }

            vars.from = ""
            this.$el.append(this.template(vars))


        },


    })

});$(function() {

    App.Views.RequestsTable = Backbone.View.extend({

        tagName: "table",
        className: "table table-striped",

        initialize: function() {

        },
        addOne: function(model) {
            var requestRowView = new App.Views.RequestRow({
                model: model
            })
            requestRowView.render()
            this.$el.append(requestRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Location</th><th>Request-Type</th><th>Request</th><th>From</th><th>Date(MM/DD/YY)</th><th>Response</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});/**
 * Created by omer.yousaf on 1/27/2015.
 */
$(function() {

    App.Views.TrendActivityReport = Backbone.View.extend({
        vars: {},
        events: {
            /* Sync moved to nation
             "click #syncReport" : function(e){
             App.Router.syncLogActivitiy()
             }*/
        },
        template: $('#template-TrendActivityReport').html(),

        initialize: function() {

        },
        render: function() {

            var context = this;
            context.vars = context.data
            context.vars.startDate = context.startDate
            context.vars.endDate = context.endDate
            context.vars.CommunityName = context.CommunityName
            context.vars.lastActivitySyncDate = context.lastActivitySyncDate  //issue#50:Add Last Activities Sync Date to Activity Report On Nation For Individual Communities
            //Issue#80:Add Report button on the Communities page at nation
            context.$el.html(_.template(context.template, context.vars));
        }
    })

});$(function() {

    App.Views.courseSeach = Backbone.View.extend({

        className: "form",
        events: {
            "click #seachCourse": "seachCourse",
            "click #back": 'publicationdetails'
        },
        publicationdetails: function() {
            window.location.href = '#publicationdetail/' + this.publicationId
        },

        render: function() {
            var that = this
            this.$el.append('<p><h3>Courses</h3><a id="back" class="btn btn-success"> Done </a><h6 style="margin-top:-52px;float:right"><input placeholder="Key Word" style="margin-right:20px;height:30px;width:170px" type="text" id="SeachCourseText" ><a  style="margin-top: -11px; width: 60px;" class="btn btn-info" id="seachCourse" > Search </a> </h6></p>')
            this.$el.append('<div id="courseList"></div>')
            var coll = new App.Collections.Courses()
            coll.fetch({
                success: function(response) {
                    var groupsTable = new App.Views.GroupsTable({
                        collection: response
                    })
                    groupsTable.publicationId = that.publicationId
                    groupsTable.render()
                    $('#courseList').html(groupsTable.el)

                }
            })
        },
        seachCourse: function(e) {
            var that = this
            var coll = new App.Collections.Courses()
            if ($('#SeachCourseText').val() != '')
                coll.seachText = '["' + $('#SeachCourseText').val() + '"]'

            coll.fetch({
                success: function(response) {
                    var groupsTable = new App.Views.GroupsTable({
                        collection: response
                    })
                    groupsTable.publicationId = that.publicationId
                    groupsTable.render()
                    $('#courseList').html(groupsTable.el)

                }
            })


        },

    })

});$(function() {

    App.Views.listCommunityView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton": "syncData"
        },
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)

            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
        },
        render: function() {

            var $button = $('<h6>Select Community(\'ies)</h6><select multiple id="comselect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        },
        syncData: function() {
            var selectedValues = $('#comselect').val();
            if (!selectedValues) {
                alert('Please select Community first')
                return
            }
            App.startActivityIndicator()
            var sendPub = new Array()

            if (selectedValues.length > 0) {
                for (var i = 0; i < selectedValues.length; i++) {
                    var cUrl = selectedValues[i]
                    var cName = $("#comselect option[value='" + selectedValues[i] + "']").text()
                    sendPub.push({
                        communityUrl: cUrl,
                        communityName: cName,
                        publicationId: this.pId,
                        Viewed: false
                    })
                }
                $.couch.db("publicationdistribution").bulkSave({
                    "docs": sendPub
                }, {
                    success: function(data) {
                        console.log(data);
                    },
                    error: function(status) {
                        console.log(status);
                    }
                });
            }

            $("#list option[value='2']").text()
            $('#invitationdiv').fadeOut(1000)
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
            App.stopActivityIndicator()

        },
        synchResCommunityWithURL: function(communityurl, communityname, res) {

            console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/pubresources')
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "resources",
                    "target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/pubresources',
                    "doc_ids": res
                }),
                success: function(response) {
                    console.log(response)
                },
                async: false
            })
        },
        synchPubCommunityWithURL: function(communityurl, communityname, pId) {


            console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/recpublication')
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "publications",
                    "target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/recpublication',
                    "doc_ids": pId
                }),
                success: function(response) {
                    console.log(response)
                },
                async: false
            })
        },
        /*

         Replicate: function () {

         App.startActivityIndicator()

         var that = this
         var temp = $.url().attr("host").split(".")
         var currentHost=$.url().attr("host")

         var nationURL=''
         var nationName=''
         var type=''

         var configurations=Backbone.Collection.extend({

         url: App.Server + '/configurations/_all_docs?include_docs=true'
         })
         var config=new configurations()
         config.fetch({async:false})
         var currentConfig=config.first()
         var cofigINJSON=currentConfig.toJSON()


         type=cofigINJSON.rows[0].doc.type

         //    	      if(type=='nation')
         //    	       {
         //    	       	   nationURL= App.Server
         //    	       	   nationName=cofigINJSON.rows[0].doc.name
         //    	       }
         //    	        else{
         //    	     	   	nationURL=cofigINJSON.rows[0].doc.nationUrl
         //    	        	nationName=cofigINJSON.rows[0].doc.nationName
         //    	       }

         nationURL=cofigINJSON.rows[0].doc.nationUrl
         nationName=cofigINJSON.rows[0].doc.nationName
         App.$el.children('.body').html('Please Wait…')
         var waitMsg = ''
         var msg = ''

         $.ajax({
         url : 'http://'+ nationName +':oleoleole@'+nationURL+':5984/communities/_all_docs?include_docs=true',
         type : 'GET',
         dataType : "jsonp",
         success : function(json) {
         for(var i=0 ; i<json.rows.length ; i++)
         {
         var community = json.rows[i]
         var communityurl = community.doc.url
         var communityname = community.doc.name
         msg = waitMsg
         waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
         App.$el.children('.body').html(waitMsg)
         that.synchCommunityWithURL(communityurl,communityname)
         waitMsg = msg
         waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
         App.$el.children('.body').html(waitMsg)
         }
         if(type!="nation")
         {
         msg = waitMsg
         waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
         that.synchCommunityWithURL(nationURL,nationName)
         waitMsg = msg
         waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'
         }
         }
         })
         App.stopActivityIndicator()
         },
         synchCommunityWithURL : function(communityurl,communityname)
         {
         console.log('http://'+ communityname +':oleoleole@'+ communityurl + ':5984/resources')
         $.ajax({
         headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json; charset=utf-8'
         },
         type: 'POST',
         url: '/_replicate',
         dataType: 'json',
         data: JSON.stringify({
         "source": "resources",
         "target": 'http://'+ communityname +':oleoleole@'+ communityurl + ':5984/resources'
         }),
         success: function (response) {

         },
         async: false
         })
         },
         */

    })

});$(function() {

    App.Views.listSyncDbView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton": "syncData",
            "click #selectAll": "selectAll"
        },
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)

            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
        },
        render: function() {

            var $button = $('<h6>Select Item(\'s) To Sync</h6><br><br><input type="checkbox" value="Resources" name="syncData">Resources<br><input type="checkbox" value="ActivityReports" name="syncData">Log Activity Reports<br><input type="checkbox" value="Reports" name="syncData">Reports<br><input type="checkbox" value="Application" name="syncData" >Application<br><br><br>')

            this.$el.append($button)
            this.$el.append('<button class="btn btn-info" id="selectAll" style="width:110px">Select All</button><button style="margin-left:10px; width:110px" class="btn btn-success" id="formButton" style="width:110px">Send</button>')
            this.$el.append('<button class="btn btn-warning" id="cancelButton" style="width:110px;margin-left:10px">Cancel</button>')
        },
        selectAll: function() {
            if ($("#selectAll").text() == 'Select All') {
                $("input[name='syncData']").each(function() {
                    $(this).prop('checked', true);
                })
                $("#selectAll").text('Unselect All')
            } else {
                $("input[name='syncData']").each(function() {
                    $(this).prop('checked', false);
                })
                $("#selectAll").text('Select All')

            }
        },
        syncData: function() {
            var context = this
            App.startActivityIndicator()
            $("input[name='syncData']").each(function() {
                if ($(this).is(":checked")) {
                    if ($(this).val() == 'Resources') {
                        context.ReplicateResource()
                    } else if ($(this).val() == 'ActivityReports') {
                        context.syncLogActivitiy()
                    } else if ($(this).val() == 'Reports') {
                        context.syncReports()
                    }
                    if ($(this).val() == 'Application') {
                        context.checkAvailableUpdates()
                    }
                }
            })
            $('#invitationdiv').fadeOut(1000)
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
            App.stopActivityIndicator()

        },
        ReplicateResource: function() {

            App.startActivityIndicator()

            var that = this
            var temp = $.url().attr("host").split(".")
            var currentHost = $.url().attr("host")

            var nationURL = ''
            var nationName = ''
            var type = ''

            var configurations = Backbone.Collection.extend({

                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()

            type = cofigINJSON.rows[0].doc.type
            nationURL = cofigINJSON.rows[0].doc.nationUrl
            nationName = cofigINJSON.rows[0].doc.nationName
            App.$el.children('.body').html('Please Wait…')
            var waitMsg = ''
            var msg = ''
            $.ajax({
                url: 'http://' + nationName + ':' + App.password + '@' + nationURL + ':5984/communities/_all_docs?include_docs=true',
                type: 'GET',
                dataType: "jsonp",
                success: function(json) {
                    for (var i = 0; i < json.rows.length; i++) {
                        var community = json.rows[i]
                        var communityurl = community.doc.url
                        var communityname = community.doc.name
                        msg = waitMsg
                        waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
                        App.$el.children('.body').html(waitMsg)
                        that.synchCommunityWithURL(communityurl, communityname)
                        waitMsg = msg
                        waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
                        App.$el.children('.body').html(waitMsg)
                    }
                    if (type != "nation") {
                        msg = waitMsg
                        waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
                        that.synchCommunityWithURL(nationURL, nationName)
                        waitMsg = msg
                        waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'
                    }
                }
            })
            App.stopActivityIndicator()
        },
        synchCommunityWithURL: function(communityurl, communityname) {
            console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources')
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": "resources",
                    "target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources'
                }),
                success: function(response) {

                },
                async: false
            })
        },
        syncReports: function() {

            App.startActivityIndicator()
            var configurationModel = new App.Collections.Configurations()
            configurationModel.fetch({
                success: function(res) {

                    var conf = res.first()
                    console.log(conf)
                    var nationName = conf.get('nationName')
                    var nationURL = conf.get('nationUrl')
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": "communityreports",
                            "target": 'http://' + nationName + ':' + App.password + '@' + nationURL + ':5984/communityreports'
                        }),
                        success: function(response) {
                            App.stopActivityIndicator()
                            alert('sync successfully ')
                            Backbone.history.navigate('reports', {
                                trigger: true
                            })
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            App.stopActivityIndicator()
                            alert("Status: " + textStatus);
                            alert("Error: " + errorThrown);
                            Backbone.history.navigate('reports', {
                                trigger: true
                            })
                        },
                        async: false
                    })

                }
            })


        },
        syncLogActivitiy: function() {
            var configurationModel = new App.Collections.Configurations()
            configurationModel.fetch({
                success: function(res) {

                    var conf = res.first()
                    console.log(conf)
                    var nationName = conf.get('nationName')
                    var nationURL = conf.get('nationUrl')
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": "activitylog",
                            "target": 'http://' + nationName + ':' + App.password + '@' + nationURL + '/activitylog'
                        }),
                        success: function(response) {
                            alert("Successfully Replicated Reports")
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("Error (Try Later)")
                        },
                        async: false
                    })

                }
            })


        },
        //following function compare version numbers.
        /*<li>0 if the versions are equal</li>
         A negative integer iff v1 < v2
         A positive integer iff v1 > v2
         NaN if either version string is in the wrong format*/

        versionCompare: function(v1, v2, options) {
            var lexicographical = options && options.lexicographical;
            zeroExtend = options && options.zeroExtend;
            v1parts = v1.split('.');
            v2parts = v2.split('.');

            function isValidPart(x) {
                return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
            }

            if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
                return NaN;
            }

            if (zeroExtend) {
                while (v1parts.length < v2parts.length) v1parts.push("0");
                while (v2parts.length < v1parts.length) v2parts.push("0");
            }

            if (!lexicographical) {
                v1parts = v1parts.map(Number);
                v2parts = v2parts.map(Number);
            }

            for (var i = 0; i < v1parts.length; ++i) {
                if (v2parts.length == i) {
                    return 1;
                }

                if (v1parts[i] == v2parts[i]) {
                    continue;
                } else if (v1parts[i] > v2parts[i]) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (v1parts.length != v2parts.length) {
                return -1;
            }

            return 0;
        },
        checkAvailableUpdates: function() {
            var context = this;
            var configuration;
            var configurationModel = new App.Collections.Configurations()
            configurationModel.fetch({
                success: function(res) {
                    configuration = res.first()

                },
                async: false
            })
            var nationName = configuration.get("nationName")
            var nationURL = configuration.get("nationUrl")
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true'

            // console.log(nationConfig)
            // alert('check')
            //alert('http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true')
            $.ajax({
                url: nationConfigURL,
                type: 'GET',
                dataType: "jsonp",
                success: function(json) {
                    var nationConfig = json.rows[0].doc
                    nationConfigJson = nationConfig
                    if (typeof nationConfig.version === 'undefined') {
                        /////No version found in nation
                    } else if (nationConfig.version == configuration.get('version')) {
                        ///No updatea availabe
                    } else {
                        if (context.versionCompare(nationConfig.version, configuration.get('version')) < 0) {
                            console.log("Nation is at low level")
                        } else if (context.versionCompare(nationConfig.version, configuration.get('version')) > 0) {
                            context.updateApp()
                        } else {
                            console.log("Nation is uptodate")
                        }
                    }
                }
            })
            return;
        },
        updateApp: function() {

            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON().rows[0].doc
            currentConfig.version = this.latestVersion
            var nationName = currentConfig.nationName
            var nationURL = currentConfig.nationUrl
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                    "source": 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/apps',
                    "target": "apps"
                }),
                success: function(response) {
                    console.log(response)
                },
                async: false
            })

            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                type: 'PUT',
                url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
                dataType: 'json',
                data: JSON.stringify(currentConfig),
                success: function(response) {
                    console.log(response)
                    alert("Successfully updated to latest version.")
                },
                async: false
            })

        },
    })

});$(function() {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",

        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        template2: _.template($('#template-nav-logged-in-cummunity').html()),

        initialize: function(option) {
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
                if (option.type == 'community') {
                    this.template = this.template2
                }
            }

            var temp = Backbone.history.location.href
            temp = temp.split('#')
            this.data = {
                uRL: temp[1]
            }
            this.$el.append(this.template(this.data))

        },

        render: function() {},

    })

});$(function() {

    App.Views.siteFeedback = Backbone.View.extend({

        tagName: "div",
        id: "site-feedback",
        authorName: null,

        initialize: function() {

        },

        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            var temp = Backbone.history.location.href
            temp = temp.split('#')
            var temp2 = temp[1].split('/')
            var ul = "LMS:" + temp2[0]
            for (var i = 1; i < temp2.length; i++) {
                if (temp2[i].length != 32) {
                    ul = ul + "/" + temp2[i]
                } else {
                    i = temp.length
                }
            }
            url = ul
            Backbone.history.navigate('siteFeedback', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-feedback').animate({
                height: 'toggle'
            })
            this.unsetForm()
        },
        setForm: function() {
            if ($('#comment').val().length != 0 && $('input[name="category"]:checked').val()) {
                var temp = Backbone.history.location.href
                var now = new Date();
                now.getDate()
                temp = temp.split('#')
                var peri = '';
                if ($("#priority").is(':checked')) {
                    peri = 'urgent'
                }
                this.model.set({
                    comment: $('#comment').val(),
                    category: $('input[name="category"]:checked').val(),
                    priority: peri,
                    PageUrl: "Nation:" + temp[1],
                    Resolved: '0',
                    memberLogin: $.cookie('Member.login'),
                    time: now.toString()
                })
                this.model.save()
                alert("Feedback Successfully Sent")
                this.unsetForm()
            }
            $('#site-feedback').animate({
                height: 'toggle'
            })
        },
        unsetForm: function() {
            $('#comment', this.$el).val("")
            $('input[name="category"]').attr('checked', false)
            $("#priority").attr('checked', false)
        },
        render: function() {
            this.$el.append('<br/><br/><div class="form-field" ><input name="PageUrl" id="PageUrl" type="text"></div>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><input name="priority" value="urgent" id="priority" type="checkbox"><label for="priority">urgent</label></div>')
            this.$el.append('<div class="form-field" style="margin-top: -28px;margin-left: 115px;"> <input type="radio" name="category" value="Bug">&nbsp Bug &nbsp&nbsp&nbsp<input type="radio" name="category" value="Question">&nbsp Question &nbsp&nbsp&nbsp<input type="radio" name="category" value="Suggestion">&nbsp Suggestion &nbsp&nbsp&nbsp</div><br/><br/>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><textarea �rows="7" type="text" name="comment" id="comment"></textarea></div>')
            this.$el.append('<div class="form-field"><input name="Resolved" id="Resolved" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="memberLogin" id="memberLogin" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="time" id="time" type="text"></div>')
            $('#PageUrl', this.$el).hide()
            $('#Resolved', this.$el).hide()
            $('#memberLogin', this.$el).hide()
            $('#time', this.$el).hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
            this.$el.append($button)
        }
    })
});$(function() {

    App.Views.siteFeedbackPage = Backbone.View.extend({

        tagName: "table",
        className: " table-feedback notification-table table-striped",
        authorName: null,
        searchText: null,
        Resolved: null,
        stack: null,
        category: null,
        urgent: null,
        applyFilters: null,
        resultArray: null,
        events: {
            //"change #select_category" : function(e){
            //console.log(e)
            //console.log(e.currentTarget.value)
            //},
            "click #see-all": function(e) {
                this.applyFilters = "0"
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #switch": function(e) {
                this.applyFilters = "1"
                this.category = $('#select_category').val()
                this.urgent = $('#select_urgent').val()
                if ($('#select_status').val() == "Resolved") {
                    this.Resolved = "1"
                } else {
                    this.Resolved = "0"
                }
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #search_feedback": function(e) {
                this.applyFilters = "0"
                searchText = $("#searchText").val()
                if (searchText != "") {
                    while (skipStack.length > 0) {
                        skipStack.pop();
                    }
                    this.resultArray = []
                    skip = 0
                    skipStack.push(skip)
                    this.fetchRecords()
                }
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }
            },
            "click #next_button": function(e) {

                skipStack.push(skip)
                this.resultArray = []
                this.fetchRecords()
            },
        },

        initialize: function() {
            this.resultArray = []
            this.category = "Bug"
            this.Resolved = "1"
            this.applyFilters = "0"
            this.searchText = ""
            if (url == "unknown") {
                url = "siteFeedback"
            }
            if ($("#comments") == null) {
                alert($("#comments"))
                $('#debug').append('<div id="comments"></div>')
            }
        },

        addAll: function() {
            this.$el.html('<h4>Keyword:&nbsp;<input class="form-control" type="text" placeholder="Search in comment" value="" size="30" id="searchText" style="height:24px;margin-top:1%;"></input>&nbsp;<span><button class="btn btn-info" id="search_feedback">Search</button>&nbsp;<button class="btn btn-info" id="see-all">See All</button></span>&nbsp;<img id="progress_img" src="vendor/progress.gif" width="3%"></h4><br/>')
            this.$el.append('<Select id="select_category"><option>Bug</option><option>Question</option><option>Suggestion</option></select>&nbsp;&nbsp<select id="select_status"><option>Unresolve</option><option>Resolved</option></select>&nbsp;&nbsp<select id="select_urgent"><option>Normal</option><option>Urgent</option></select>&nbsp;&nbsp<button class="btn btn-info" id="switch">Apply Filters</button><br/><br/>')
            this.$el.append('<th ><h4>Feedback</h4></th><th ><h4>Status</h4></th>')
            $("#progress_img").hide()
            console.log(this.collection.toJSON())
            this.collection.forEach(this.addOne, this)
            this.$el.append('<br/><br/><input type="button" class="btn btn-hg btn-primary" id="previousButton" value="< Previous"> &nbsp;&nbsp;&nbsp;<button class="btn btn-hg btn-primary" id="next_button" >Next  ></button>')
        },

        addOne: function(model) {
            if (!model.get("category")) {
                model.set("category", "Bug")
            }
            if (!model.get("priority")) {

                model.set("priority", [])
            }
            var revRow = new App.Views.siteFeedbackPageRow({
                model: model
            })
            revRow.render()
            this.$el.append(revRow.el)

        },
        render: function() {
            this.addAll()
            //alert('in render')
            if (skipStack.length <= 1) {
                $("#previousButton").hide()
            }
            if (this.collection.length < 5) {
                $("#next_button").hide()
            }
            $("#progress_img").hide()
        },
        fetchRecords: function() {
            //$("#progress_img").show()
            var obj = this
            this.collection.fetch({
                success: function() {
                    //alert(obj.resultArray.length + ' skip : ' + skip)
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.collection.models, searchText))
                    //alert(obj.resultArray.length + ' skip : ' + skip)

                    if (obj.resultArray.length != limitofRecords && obj.collection.models.length == limitofRecords) {
                        obj.fetchRecords()
                        return;
                    } else if (obj.resultArray.length == 0 && obj.collection.models.length == 0 && skipStack.length > 1) {

                        $("#next_button").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        if (searchText != "") {
                            alert('No result found')
                        }
                        //obj.render()
                        // $('#not-found').html("No Such Record Exist");
                        //  $("#selectAllButton").hide()
                    }
                    var ResultCollection = new App.Collections.siteFeedbacks()
                    if (obj.resultArray.length > 0) {
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.$el.html('')
                        obj.render()
                    }
                }
            })

        },

        filterResult: function(model) {

            var temp = model.get("PageUrl")
            if (!temp) {
                temp = ''
            }
            var temp2 = temp.split('/')
            // alert('test')
            var ul = temp2[0]
            for (var i = 1; i < temp2.length; i++) {
                if (temp2[i].length != 32) {
                    ul = ul + "/" + temp2[i]
                } else {
                    i = temp.length
                }
            }
            if (ul == url) {
                return true
            } else {
                console.log(url)
                return false
            }
        },

        checkFilters: function(result) {
            console.log(result)
            if (this.filterResult(result)) {
                if (this.applyFilters == "0") {
                    return true
                } else if (this.Resolved == result.get("Resolved") && this.category == result.get("category")) {
                    if (this.urgent == "Normal" && result.get("priority").length == 0) {
                        return true
                    } else if (this.urgent == "Urgent" && result.get("priority").length > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount
            _.each(resourceArray, function(result) {
                if (result.get("comment") != null) {
                    skip++

                    //alert(that.Resolved+' '+result.get("Resolved") + ' ' + that.category + ' ' +  result.get("category"))
                    if (!result.get("category")) {
                        result.set("category", "Bug")
                    }
                    //   alert(result.get("urgent").length)
                    if (!result.get("priority")) {
                        result.set("priority", [])
                    }
                    //    console.log(result)
                    //    alert(result.get("urgent").length)
                    if (result.get("comment").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 && that.checkFilters(result)) {
                        if (resultArray.length < limitofRecords) {
                            resultArray.push(result)
                        } else {
                            enablenext = 1
                            skip--
                        }
                    } else if (resultArray.length >= limitofRecords) {
                        skip--
                    }


                }
            })

            return resultArray
        }

    })

});$(function() {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function(e) {
            console.log(e.target.attributes[0].nodeValue)
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function(e) {
            console.log(e)
            e.preventDefault()
            this.model.on('sync', function() {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function() {}
            });
        },

        initialize: function() {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function() {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            console.log(vars)
            this.$el.html(_.template(this.template, vars))
        }

    })

})