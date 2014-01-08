$(function () {

    App.Views.MailView = Backbone.View.extend({

        vars: {},
        recordsPerPage: null,
        modelNo: null,
        nextButton: null,
        unopen: null,
        searchText: null,
        resultArray: null,
        inViewModel: null,
        showNextButton: null,
        template: _.template($("#template-mail").html()),
        templateMailView: _.template($("#template-view-mail").html()),

        events: {
            "click #nextButton": function (e) {
                this.modelNo = 0
                this.resultArray = []
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #all-mails": function (e) {
                this.modelNo = 0
                skip = 0
                this.resultArray = []
                this.unopen = false
                this.fetchRecords()
                $("#nextButton").show()
                $("#previousButton").hide()
            },

            "click #unread-mails": function (e) {
                this.modelNo = 0
                skip = 0
                this.resultArray = []
                this.unopen = true
                this.fetchRecords()
                $("#nextButton").show()
                $("#previousButton").hide()
            },
            "click #previousButton": function (e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.modelNo = 0
                    this.showNextButton = 1
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }

            },
            "click #invite-accept": function (e) {
                var body = inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>You have accepted this invitation.</div>"

                var model = new App.Models.Mail()
                model.id = inViewModel.get("id")
                model.fetch({
                    async: false
                })

                model.set('body', body)
                model.save()
                $('#mail-body').html('<br/>' + body)
                var gmodel = new App.Models.Group({
                    _id: e.currentTarget.value
                })
                gmodel.fetch({
                    async: false
                })
        
                var that = this
                if (gmodel.get("_id")) {
                    var memberlist = []
                    if (gmodel.get("members") != null) {
                        memberlist = gmodel.get("members")
                    }
                    

                    if (memberlist.indexOf($.cookie('Member._id')) == -1) {
                        memberlist.push($.cookie('Member._id'))
                        gmodel.set("members", memberlist)
                       
                        gmodel.save({}, {
                            success: function () {
                                var memprogress = new App.Models.membercourseprogress()
                                var csteps = new App.Collections.coursesteps();
                                var stepsids = new Array()
                                var stepsres = new Array()
                                var stepsstatus = new Array()
                                csteps.courseId = gmodel.get("_id")
                                csteps.fetch({
                                    success: function () {
                                        csteps.each(function (m) {
                                            stepsids.push(m.get("_id"))
                                            stepsres.push("0")
                                            stepsstatus.push("0")
                                        })
                                        memprogress.set("stepsIds", stepsids)
                                        memprogress.set("memberId", $.cookie("Member._id"))
                                        memprogress.set("stepsResult", stepsres)
                                        memprogress.set("stepsStatus", stepsstatus)
                                        memprogress.set("courseId", csteps.courseId)
                                        memprogress.save({
                                            success: function () {}
                                        })

                                    }
                                })
                                alert("Course added to your dashboard")
                                Backbone.history.navigate('dashboard', {
                                    trigger: true
                                })
                            }
                        })

                    } else {
                        alert("Course already added to your dashboard")
                        Backbone.history.navigate('dashboard', {
                            trigger: true
                        })
                    }
                }
            },


            "click #invite-reject": function (e) {
                var body = inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>You have rejected this invitation.</div>"

                var model = new App.Models.Mail()
                model.id = inViewModel.get("id")
                model.fetch({
                    async: false
                })

                model.set('body', body)
                model.save()
                $('#mail-body').html('<br/>' + body)
            },
            "click #search-mail": function (e) {
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.searchText = $("#search-text").val()
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.fetchRecords()
            },
            "click #back": function (e) {
                //	this.viewButton(e)
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.render()
                this.fetchRecords()
            },
            "click .deleteBtn": function (e) {

                //	this.deleteButton(e)
                var modelNo = e.currentTarget.value
                var selectedModel = this.collection.at(modelNo)
                var model = new App.Models.Mail()
                model.id = selectedModel.get("id")
                model.fetch({
                    async: false
                })
                model.destroy()
                window.location.reload()

            },
            "click .viewBtn": function (e) {
                //	this.viewButton(e)
                var modelNo = e.currentTarget.value
                var model = this.collection.at(modelNo)
                inViewModel = model;
                model.set("status", "1")
                model.save()
                this.vars = model.toJSON()
                var member = new App.Models.Member()
                member.id = model.get('senderId')
                member.fetch({
                    async: false
                })
                this.vars.firstName = member.get('firstName')
                this.vars.lastName = member.get('lastName')
                this.vars.modelNo = modelNo
                this.$el.html(this.templateMailView(this.vars))
                //window.location.reload()
            }
        },
        viewButton: function (e) {

            var modelNo = e.currentTarget.value
            var model = mailView.collection.at(modelNo)
            model.set("status", "1")
            model.save()
            mailView.vars = model.toJSON()
            console.log(mailView.vars)
            var member = new App.Models.Member()
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            mailView.vars.firstName = member.get('firstName')
            mailView.vars.lastName = member.get('lastName')
            mailView.vars.modelNo = modelNo
            mailView.vars.login = member.get('login')
            mailView.$el.html('')
            mailView.$el.append(mailView.templateMailView(mailView.vars))
        },
        deleteButton: function (e) {
            var modelNo = e.currentTarget.value
            var selectedModel = mailView.collection.at(modelNo)
            var model = new App.Models.Mail()
            model.id = selectedModel.get("id")
            model.fetch({
                async: false
            })
            model.destroy()
            window.location.reload()
        },
        initialize: function () {
            this.modelNo = 0
            this.skip = 0
            this.unopen = false
            this.recordsPerPage = 5
            this.nextButton = 1
            this.searchText = ""
            this.delegateEvents()
            this.resultArray = []
            this.showNextButton = 0
        },
        addOne: function (model) {
            vars = model.toJSON()
            var member = new App.Models.Member()
            member.set("id", model.get('senderId'))
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            if (member.id == undefined) {
                var name = "Error!!"
            } else {
                var name = member.get('firstName') + ' ' + member.get('lastName')
            }
            if (vars.subject) {
                var row = ""
                if (vars.status == 0) {

                    row = '<tr bgcolor="B4D3EC" style="color:black">'
                } else {
                    row = '<tr bgcolor="E7E7E7" style="color:#2D2D34">'
                }
                var deleteId = "delete" + this.modelNo
                var viewId = "view" + this.modelNo

                row = row + '<td>' + vars.subject + '</td><td align="center">' + name + '</td><td align="right"><button value="' + this.modelNo + '" id ="' + deleteId + '" class="btn deleteBtn btn-danger">Delete</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" id="' + viewId + '" class="btn viewBtn btn-primary" >View</button></td></tr>'
                $('#inbox_mails').append(row)
                this.modelNo++
                $("#" + deleteId).click(this.viewButton)
                $("#" + viewId).click(this.viewButton)
                mailView = this
            }
        },

        addAll: function () {

            $('#inbox_mails').html('')
            if (skipStack.length <= 1) {
                $('#previousButton').hide()
            } else {
                $('#previousButton').show()
            }
            this.collection.forEach(this.addOne, this)
        },
        render: function () {
            this.$el.html(this.template(this.vars))
            this.$el.append('<div class="mail-table"><span style="float:right; margin-left:10px;"><button id="nextButton" class="btn btn-primary fui-arrow-right"></button></span> <span style="float:left;"><button class="btn btn-info" onclick="showComposePopup()">Compose</button></span> <span style="float:right;"><button id="previousButton" class="btn btn-primary fui-arrow-left"></button></span></div>')
            //$('#mailActions').html(this.template)


        },

        fetchRecords: function () {
            var obj = this
            var newCollection = new App.Collections.Mails({
                receiverId: $.cookie('Member._id'),
                unread: obj.unopen
            })
            newCollection.fetch({
                success: function () {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(newCollection.models, obj.searchText))
                    if (obj.resultArray.length != limitofRecords && newCollection.models.length == limitofRecords) {
                        obj.fetchRecords()

                        return;
                    } else if (obj.resultArray.length == 0 && skipStack.length > 1) {
                        $("#nextButton").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        if (searchText != "") {
                            alert('No result found')
                        }
                    }

                    var ResultCollection = new App.Collections.Mails()
                    //if(obj.resultArray.length > 0)
                    {
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.addAll()
                        if (obj.showNextButton == 1) {
                            $("#nextButton").show()
                            obj.showNextButton = 0
                        }
                    }
                }
            })

        },
        searchInArray: function (resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            {
                _.each(resourceArray, function (result) {
                    if (result.get("subject") != null && result.get("body") != null) {
                        skip++
                        if (result.get("subject").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 || result.get("body").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {

                            if (resultArray.length < limitofRecords) {
                                resultArray.push(result)
                            } else {
                                console.log('first')
                                skip--
                            }
                        } else if (resultArray.length >= limitofRecords) {
                            console.log('second')
                            skip--
                        }
                    }
                })

            }
            return resultArray
        }

    })


})
