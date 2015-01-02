$(function() {
    App.Router = new(Backbone.Router.extend({

        routes: {
            'addCommunity': 'CommunityForm',
            'addCommunity/:CommunityId': 'CommunityForm',
            'login': 'MemberLogin',
            'logout': 'MemberLogout',
            'listCommunity': 'ListCommunity',
            'siteFeedback': 'viewAllFeedback',
            'dashboard': 'Dashboard',
            'request': 'commRequest',
            'earthrequest': 'earthRequest',
            'reports': 'Reports',
            'reports/edit/:resportId': 'ReportForm',
            'reports/add': 'ReportForm',
            'publication': 'Publication',
            'publication/add': 'PublicationForm',
            'configuration': 'Configuration',
            'publication/add/:publicationId': 'PublicationForm',
            'publicationdetail/:publicationId': 'PublicationDetails',
            'courses/:publicationId': "addCourses"
        },

        initialize: function() {
            this.bind("all", this.checkLoggedIn)
            this.bind("all", this.routeStartupTasks)
            this.bind("all", this.renderNav)

        },
        routeStartupTasks: function() {
            $('#invitationdiv').hide()
            $('#debug').hide()

        },
        Configuration: function() {
//            var config = new App.Collections.Configurations()
//            config.fetch({
//                async: false
//            })
//            var configuration = config.first()
//            var configView = new App.Views.ConfigurationView()
//            configView.model = configuration
//            configView.render()

            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
                model: configModel
            })
            configForm.render();

            App.$el.children('.body').html(configForm.el)

        },
        renderNav: function() {
            var con = this.getConfigurations()
            if ($.cookie('Member._id')) {
                var na = new App.Views.navBarView({
                    isLoggedIn: '1',
                    type: con.get('type')
                })
            } else {
                var na = new App.Views.navBarView({
                    isLoggedIn: '0'
                })
            }
            $('div.navbar-collapse').html(na.el)
                // App.badge()
        },
        checkLoggedIn: function() {
            if (!$.cookie('Member._id')) {

                if ($.url().attr('fragment') != 'login' && $.url().attr('fragment') != '' && $.url().attr('fragment') != 'landingPage' && $.url().attr('fragment') != 'becomemember') {
                    Backbone.history.stop()
                    App.start()
                }
            } else {
                var expTime = $.cookie('Member.expTime')
                var d = new Date(Date.parse(expTime))
                var diff = Math.abs(new Date() - d)
                    //alert(diff)
                var expirationTime = 7200000
                if (diff < expirationTime) {
                    var date = new Date()
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                    $.cookie('Member.expTime', date, {
                        path: "/apps/_design/bell"
                    })
                } else {
                    this.expireSession()
                    Backbone.history.stop()
                    App.start()

                }
            }
        },
        getConfigurations: function() {
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var configuration = config.first()
            return configuration
        },
        addCourses: function(publicationId) {
            var seachForm = new App.Views.courseSeach()
            seachForm.publicationId=publicationId
            seachForm.render()  
            App.$el.children('.body').html(seachForm.el)

        },
        Dashboard: function() {
            var con = this.getConfigurations()
            if (con.get('type') == 'community') {
                this.cummunityManage()
                return
            }
            var dashboard = new App.Views.Dashboard()
            App.$el.children('.body').html(dashboard.el)
            dashboard.render()

            var Communities = new App.Collections.Community({
                limit: 3
            })
            Communities.fetch({
                async: false
            })
            console.log(Communities)
            Communities.each(function(m) {
                $('#communities tbody').append('<tr class="success"><td>' + m.toJSON().Name + '</td></tr>');
            })
            $('#communities').append('<tr ><td><a class="btn btn-default" href="#listCommunity" id="clickmore">Click for more</a></td></tr>');

            var Publications = new App.Collections.Publication()
            Publications.getlast = true
            Publications.fetch({
                success: function(collection, response) {
                    _.each(response.results, function(model) {
                        if (model.doc.IssueNo != undefined) {
                            $('#publications tbody').append('<tr class="info"><td>Issue :' + model.doc.IssueNo + '</td></tr>');
                        } else {
                            $('#publications tbody').append('<tr class="info"><td>Issue Deleted</td></tr>');
                        }
                    })

                },
                async: false
            })
            $('#publications').append('<tr ><td><a class="btn btn-default" href="#publication" id="clickmore">Click for more</a></td></tr>');


        },
        cummunityManage: function() {

            App.$el.children('.body').html('')
            App.$el.children('.body').append('<a href="#configuration"><button class="btn btn-hg btn-primary" id="configbutton">Configurations</button></a>')
            App.$el.children('.body').append('<button class="btn btn-hg btn-primary" onclick=SyncDbSelect() id="sync">Sync With Nation</button>')
        },
        CommunityForm: function(CommunityId) {

            this.modelForm('Community', CommunityId, 'login')
        },
        viewAllFeedback: function() {
            var fed = new App.Collections.siteFeedbacks()
            fed.fetch({
                async: false
            })

            feedul = new App.Views.siteFeedbackPage({
                collection: fed
            })
            feedul.render()
            $('#see-all', feedul.$el).trigger("click");
            App.$el.children('.body').html('&nbsp')
            App.$el.children('.body').append(feedul.el)
            $("#previousButton").hide()
            $("#progress_img").hide()
        },
        modelForm: function(className, modelId, reroute) {

            // Set up
            var model = new App.Models[className]()
            var modelForm = new App.Views['CommunityForm']({
                model: model
            })


            App.$el.children('.body').html('')
                // Bind form to the DOM 


            App.$el.children('.body').append(modelForm.el)

            //	.append($button) 
            // modelForm.render()
            // Bind form events for when Group is ready

            model.once('Model:ready', function() {


                modelForm.on(className + 'Form:done', function() {
                        Backbone.history.navigate(reroute, {
                            trigger: true
                        })
                    })
                    // Set up the form
                modelForm.render()
            })

            // Set up the model for the form
            if (modelId) {
                model.id = modelId
                model.once('sync', function() {
                    model.trigger('Model:ready')
                })
                model.fetch({
                    async: false
                })
            } else {
                model.trigger('Model:ready')
            }
        },
        MemberLogin: function() {
            // Prevent this Route from completing if Member is logged in.
            if ($.cookie('Member._id')) {
                Backbone.history.navigate('listCommunity', {
                    trigger: true
                })
                return
            }
            var credentials = new App.Models.Credentials()
            var memberLoginForm = new App.Views.MemberLoginForm({
                model: credentials
            })
            memberLoginForm.once('success:login', function() {
                window.location.href = "../MyApp/index.html#dashboard";
                //Backbone.history.navigate('listCommunity', {trigger: true})
            })
            memberLoginForm.render()
            App.$el.children('.body').html(memberLoginForm.el)
            $('ul.nav').html($('#template-nav-log-in').html()).hide()
        },
        MemberLogout: function() {

            this.expireSession()

            Backbone.history.navigate('login', {
                trigger: true
            })
        },
        expireSession: function() {

            $.removeCookie('Member.login', {
                path: "/apps/_design/bell"
            })
            $.removeCookie('Member._id', {
                path: "/apps/_design/bell"
            })

            $.removeCookie('Member.expTime', {
                path: "/apps/_design/bell"
            })


        },
        ListCommunity: function() {
            App.startActivityIndicator()
            var Communities = new App.Collections.Community()
            Communities.fetch({
                success: function() {
                    CommunityTable = new App.Views.CommunitiesTable({
                        collection: Communities
                    })
                    CommunityTable.render()
                    var listCommunity = "<h3> Communities  |  <a  class='btn btn-success' id='addComm' href='#addCommunity'>Add Community</a>  </h3>"

                    listCommunity += "<div id='list-of-Communities'></div>"

                    App.$el.children('.body').html(listCommunity)
                    $('#list-of-Communities', App.$el).append(CommunityTable.el)

                }
            })

            App.stopActivityIndicator()

        },
        earthRequest: function() {
            var listReq = "<div id='listRequest-head'> <p class='heading'> <a href='#' style='color:#1ABC9C'>Earth Request</a>  |   <a href='#request'>Communities Request</a> </p> </div>"

            listReq += "<div style='width:940px;margin:0 auto' id='listReq'></div>"

            App.$el.children('.body').html(listReq)
        },
        commRequest: function() {



            var listReq = "<div id='listRequest-head'> <p class='heading'> <a href='#earthrequest' >Earth Request</a>  |   <a href='#request' style='color:#1ABC9C'>Communities Request</a> </p> </div>"

            listReq += "<div style='width:940px;margin:0 auto' id='listReq'></div>"

            App.$el.children('.body').html(listReq)

            App.startActivityIndicator()

            var request = new App.Collections.CourseRequest()
            request.fetch({
                async: false
            })
            var requestResource = new App.Collections.ResourceRequest()
            requestResource.fetch({
                async: false
            })
            request.add(requestResource.toJSON(), {
                silent: true
            });
            var requestTableView = new App.Views.RequestsTable({
                collection: request
            })
            requestTableView.render()
            App.$el.children('.body').append(requestTableView.el)
            App.stopActivityIndicator()

        },
        Reports: function(database) {
            App.startActivityIndicator()
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            $('ul.nav').html($("#template-nav-logged-in").html()).show()
            $('#itemsinnavbar').html($("#template-nav-logged-in").html())
            var reports = new App.Collections.Reports()
            reports.fetch({
                async: false
            })
            var resourcesTableView = new App.Views.ReportsTable({
                collection: reports
            })
            resourcesTableView.isManager = roles.indexOf("Manager")
            resourcesTableView.render()
            App.$el.children('.body').html('')
            if (roles.indexOf("Manager") > -1) {
                App.$el.children('.body').append('<p><a class="btn btn-success" href="#reports/add">Add a new Report</a></p>')
            }
            var temp = $.url().attr("host").split(".")
            temp = temp[0].substring(3)
            if (temp.length == 0) {
                temp = temp + "Nation"
            }
            App.$el.children('.body').append('<h4><span style="color:gray;">' + temp + '</span> | Reports</h4>')
            App.$el.children('.body').append(resourcesTableView.el)
            App.stopActivityIndicator()

        },
        ReportForm: function(reportId) {
            var report = (reportId) ? new App.Models.NationReport({
                _id: reportId
            }) : new App.Models.NationReport()
            report.on('processed', function() {
                Backbone.history.navigate('report', {
                    trigger: true
                })
            })
            var reportFormView = new App.Views.ReportForm({
                model: report
            })
            App.$el.children('.body').html(reportFormView.el)

            if (report.id) {
                App.listenToOnce(report, 'sync', function() {
                    reportFormView.render()
                })
                report.fetch()
            } else {
                reportFormView.render()

            }
        },
        Publication: function() {
            App.startActivityIndicator()
            var publicationCollection = new App.Collections.Publication()
            publicationCollection.fetch({
                async: false
            })
            var publication = new App.Views.Publication()
            publication.render()
            App.$el.children('.body').html(publication.el)
            var publicationtable = new App.Views.PublicationTable({
                collection: publicationCollection
            })
            publicationtable.render()
            App.$el.children('.body').append(publicationtable.el)

            App.stopActivityIndicator()

        },
        PublicationDetails: function(publicationId) {
        
				var publicationObject = new App.Models.Publication({
					_id: publicationId
				})
				publicationObject.fetch({
					async: false
				})
                var resources = publicationObject.get('resources')
                var courses = publicationObject.get('courses')
                            
                App.$el.children('.body').html('<div style="margin-top:10px"><h6 style="float:left;">Issue No.' + publicationObject.get('IssueNo') + '</h6> <a class="btn btn-success" style="margin-left:20px" href="#courses/'+publicationId+'">Add Course</a> <a class="btn btn-success" href = "../MyApp/index.html#search-bell/' + publicationId + '" style="float:left;margin-left:20px;margin-bottom:10px;">Add Resource</a><button class="btn btn-info" style="float:left;margin-left:20px" onclick=SelectCommunity("' + publicationId + '")>Send Publication</button></div>')
                
                var resIdes=''
                 _.each(resources, function(item) {
                    resIdes +='"' + item + '",'
                 })
                 if(resIdes!='')
                  resIdes = resIdes.substring(0, resIdes.length - 1);
                  
            var resourcesColl = new App.Collections.Resources()
                resourcesColl.keys= encodeURI(resIdes)
                resourcesColl.fetch({async:false });
                var publicationresTable = new App.Views.PublicationResourceTable({
                    collection: resourcesColl
                })
                publicationresTable.Id = publicationId
                publicationresTable.render()
                App.$el.children('.body').append(publicationresTable.el)
                
                 var coursesIdes=''
                 _.each(courses, function(item) {
                    coursesIdes +='"' + item['courseID'] + '",'
                 })
                 if(coursesIdes!='')
                  coursesIdes = coursesIdes.substring(0, coursesIdes.length - 1);
                  
           var coursesColl = new App.Collections.Courses()
                coursesColl.keys= encodeURI(coursesIdes)
                coursesColl.fetch({
                 async:false
                });
                var publicationcourseTable = new App.Views.PublicationCoursesTable({
                    collection: coursesColl
                })
                publicationcourseTable.Id = publicationId
                publicationcourseTable.render()
                App.$el.children('.body').append(publicationcourseTable.el)

        },

        PublicationForm: function(publicationId) {
            var publication = (publicationId) ? new App.Models.Publication({
                _id: publicationId
            }) : new App.Models.Publication()
            publication.on('processed', function() {
                Backbone.history.navigate('publication', {
                    trigger: true
                })
            })
            var publicationFormView = new App.Views.PublicationForm({
                model: publication
            })
            App.$el.children('.body').html(publicationFormView.el)

            if (publication.id) {
                publication.fetch({
                    success: function(response) {
                        if (publication.get('kind') == 'CoursePublication') {
                            publicationFormView.rlength = publication.get('courses').length
                        } else {
                            if (publication.get('resources') != null)
                                publicationFormView.rlength = publication.get('resources').length

                        }

                    },
                    async: false
                })
                publicationFormView.render()

            } else {
                publicationFormView.rlength = 0
                publicationFormView.render()


            }
            $('.bbf-form .field-Date input').attr("disabled", true)
            if (!publication.id) {
                $('.bbf-form .field-IssueNo input').val('')
            }
            var currentDate = new Date();
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });
            $('.bbf-form .field-Date input', this.el).datepicker("setDate", currentDate);
            $('.bbf-form .field-Date input').datepicker({
                todayHighlight: true
            });




        },
        SelectCommunities: function(pId) {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listCommunityView()
            inviteForm.pId = pId
            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
            var Communities = new App.Collections.Community()
            Communities.fetch({
                async: false
            })
            Communities.each(
                function(log) {
                    $('#comselect').append("<option value='" + log.get('Url') + "'>" + log.get('Name') + "</option>")
                })

        },
        SyncDbSelect: function() {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listSyncDbView()

            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
        }
    }))

})