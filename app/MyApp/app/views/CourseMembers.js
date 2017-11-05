$(function () {

    App.Views.CourseMembers = Backbone.View.extend({
        vars: {},
        initialize: function () {},
        removeMember:function(e){
            var memberId = e.currentTarget.value
            var that = this
            var courseModel = new App.Models.Course({
                _id: this.courseId
            })
            courseModel.fetch({
                success:function(result){
                    var members = result.get('members')
                    members.splice(members.indexOf(memberId),1)
                    result.set('members',members)
                    result.save()
                    memberCoursePro = new App.Collections.membercourseprogresses()
                    memberCoursePro.memberId = memberId
                    memberCoursePro.courseId = that.courseId 
                    memberCoursePro.fetch({
                        async:false
                    })
                    while (model = memberCoursePro.first()) {
                        model.destroy();
                    }
                    that.render()
                    alert(App.languageDict.attributes.Member_Removed_From_Course)
                }
            })  
        },

        render: function () {
            //MCP courseId fetch
            var courseModel = new App.Models.Course({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            })
            var memberProgress = new App.Collections.membercourseprogresses()
            memberProgress.courseId = this.courseId
            memberProgress.fetch({
                async: false,
                success: function(res){
                    member_list = []
                    if(res.length > 0){
                        for(var i = 0; i < res.length; i++){
                            member_list.push(res.models[i].attributes.memberId)
                        }
                        if(member_list.length > 0){
                            var configurations = Backbone.Collection.extend({
                                url: App.Server + '/configurations/_all_docs?include_docs=true'
                            })
                            var config = new configurations()
                            config.fetch({
                                async: false
                            })
                            var currentConfig = config.first().toJSON()
                            var code = currentConfig.rows[0].doc.code
                            var na = currentConfig.rows[0].doc.nationName.substring(3,5);
                            $('.courseEditStep').empty();
                            $('.courseEditStep').append('<h3>'+App.languageDict.attributes.Course_Members+ ' | ' + courseModel.get('name') + '</h3>')
                            var viewtext = '<table id = "Table1" class="btable btable-striped"><th>'+App.languageDict.attributes.Photo+'</th><th>'+App.languageDict.attributes.Name+'</th><th>'+App.languageDict.attributes.Roles+'</th><th>'+App.languageDict.attributes.Community+'</th><th colspan="2">'+App.languageDict.attributes.Actions+'</th>'
                            for (var i = 0; i < member_list.length; i++) {
                                var mems = new App.Models.Member({
                                    _id: member_list[i]
                                })
                                mems.fetch({
                                    async: false,
                                })
                                var roleOfMem;
                                if(courseModel.get('courseLeader').indexOf(mems.get('_id')) > -1) {
                                    roleOfMem=App.languageDict.attributes.Leader
                                } else {
                                    roleOfMem=App.languageDict.attributes.Learner
                                }
                                var mail = mems.get('login') + '.' + code +na+ '@olebell.org'
                                var src = "img/default.jpg"
                                var attchmentURL = '/members/' + mems.id + '/'
                                if (typeof mems.get('_attachments') !== 'undefined') {
                                    attchmentURL = attchmentURL + _.keys(mems.get('_attachments'))[0]
                                    src = attchmentURL
                                }
                                viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mems.get('firstName') + ' ' + mems.get('lastName') + '</td><td>'+roleOfMem+'</td><td>'+ mems.get('community') +'</td>';
                                if(mems.get("community")==config.models[0].attributes.rows[0].doc.code)
                                    viewtext += '<td><input type="checkbox" name="courseMember" value="' + mail + '">'+App.languageDict.attributes.Send_Email+'</td><td></td>';
                                else
                                    viewtext += '<td></td><td></td>';
                                var loggedIn = new App.Models.Member({
                                    "_id": $.cookie('Member._id')
                                })
                                loggedIn.fetch({
                                    async: false
                                })
                                var roles = loggedIn.get("roles")
                                if( courseModel.get('courseLeader') && courseModel.get('courseLeader').indexOf($.cookie('Member._id'))>-1 || roles.indexOf('Manager')>-1) {
                                    var memId=mems.get('_id')+','+res.models[i].attributes.courseId;
                                    viewtext+='<td><button class="btn btn-danger removeMember" value="' + mems.get('_id') + '" onclick=removeMemberFromCourse(\"' +  memId + '")>'+App.languageDict.attributes.Remove+'</button></td>'
                                }
                                viewtext+='</tr>'
                            }
                            viewtext += '<tr><td></td><td></td><td>' +
                                '<button class="btn"  id="selectAllMembersOnMembers" onclick=selectAllMembers()>' +
                                App.languageDict.attributes.Select_All+'</button>' +
                                '<button style="" class="btn" ' +
                                'onclick=showComposePopupMultiple("' + mail + '") id="sendMailButton">'
                                +App.languageDict.attributes.Send_Email+'</button>' +
                                '<button class="btn"   id="retrunBack" onclick=retrunBack()>'
                                +App.languageDict.attributes.Back+'</button></td><td></td><td></td><td></td></tr>';
                            viewtext += '</table>';
                            $('.courseEditStep').append(viewtext)
                        }
                    }
                },
                error: function(status){
                    console.log("error :" + status)
                }
            })
        },
        randerTable: function(selectedvalue){
            $('#Table1').remove()
            var courseModel = new App.Models.Course({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            })
            var memberProgress = new App.Collections.membercourseprogresses()
            memberProgress.courseId = this.courseId
            memberProgress.fetch({
                async: false,
                success: function(res){
                    member_list = []
                    if(res.length > 0){
                        for(var i = 0; i < res.length; i++){
                            member_list.push(res.models[i].attributes.memberId)
                        }
                        if(member_list.length > 0){
                            var configurations = Backbone.Collection.extend({
                                url: App.Server + '/configurations/_all_docs?include_docs=true'
                            })
                            var config = new configurations()
                            config.fetch({
                                async: false
                            })
                            var currentConfig = config.first().toJSON()
                            var code = currentConfig.rows[0].doc.code
                            var na = currentConfig.rows[0].doc.nationName.substring(3,5);
                            $('.courseEditStep').empty();
                            $('.courseEditStep').append('<h3>'+App.languageDict.attributes.Course_Members+ ' | ' + courseModel.get('name') + '</h3>')
                            var viewtext = '<table id = "Table1" class="btable btable-striped"><th>'+App.languageDict.attributes.Photo+'</th><th>'+App.languageDict.attributes.Name+'</th><th>'+App.languageDict.attributes.Roles+'</th><th colspan=2>'+App.languageDict.attributes.Actions+'</th>'
                            var newMember_list = []
                            for (var i = 0; i < member_list.length; i++) {
                                var mems = new App.Models.Member({
                                    _id: member_list[i]
                                })
                                mems.fetch({
                                    async: false,
                                })
                                if(mems.attributes.community == selectedvalue){
                                    newMember_list.push(member_list[i])
                                }
                            }
                            if(newMember_list.length > 0){
                                for (var i = 0; i < newMember_list.length; i++){
                                    var mems = new App.Models.Member({
                                        _id:newMember_list[i]
                                    })
                                    mems.fetch({
                                        async: false
                                    })
                                    var roleOfMem;
                                    if(courseModel.get('courseLeader').indexOf(mems.get('_id')) > -1) {
                                        roleOfMem=App.languageDict.attributes.Leader
                                    } else {
                                        roleOfMem=App.languageDict.attributes.Learner
                                    }
                                    var mail = mems.get('login') + '.' + code +na+ '@olebell.org'
                                    var src = "img/default.jpg"
                                    var attchmentURL = '/members/' + mems.id + '/'
                                    if (typeof mems.get('_attachments') !== 'undefined') {
                                        attchmentURL = attchmentURL + _.keys(mems.get('_attachments'))[0]
                                        src = attchmentURL
                                    }
                                    if(config.models[0].attributes.rows[0].doc.code == mems.get("community")){
                                        viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mems.get('firstName') + ' ' + mems.get('lastName') + '</td><td>'+roleOfMem+'</td><td><input type="checkbox" name="courseMember" value="' + mail + '">'+App.languageDict.attributes.Send_Email+'</td>'
                                    } else{
                                        viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mems.get('firstName') + ' ' + mems.get('lastName') + '</td><td>'+roleOfMem+'</td><td></td>'
                                    }
                                    var loggedIn = new App.Models.Member({
                                        "_id": $.cookie('Member._id')
                                    })
                                    loggedIn.fetch({
                                        async: false
                                    })
                                    var roles = loggedIn.get("roles")
                                    if( courseModel.get('courseLeader') && courseModel.get('courseLeader').indexOf($.cookie('Member._id'))>-1 || roles.indexOf('Manager')>-1) {
                                        var memId=mems.get('_id')+','+this.courseId;
                                        viewtext+='<td><button class="btn btn-danger removeMember" value="' + mems.get('_id') + '" onclick=removeMemberFromCourse(\"' +  memId + '")>'+App.languageDict.attributes.Remove+'</button></td>'
                                    }
                                    viewtext+='</tr>'
                                }
                                viewtext += '<tr><td></td><td></td><td>' +
                                    '<button class="btn"  id="selectAllMembersOnMembers" onclick=selectAllMembers()>' +
                                    App.languageDict.attributes.Select_All+'</button>' +
                                    '<button style="" class="btn" ' +
                                    'onclick=showComposePopupMultiple("' + mail + '") id="sendMailButton">'
                                    +App.languageDict.attributes.Send_Email+'</button>' +
                                    '<button class="btn"   id="retrunBack" onclick=retrunBack()>'
                                    +App.languageDict.attributes.Back+'</button></td><td></td><td></td></tr>';
                                viewtext += '</table>';
                                $('.courseEditStep').append(viewtext)
                            } else {
                                viewtext += '<tr><td></td><td></td><td></td><td></td></tr>';
                                $('.courseEditStep').append(viewtext)
                            }
                        }
                    }
                },
                error: function(status){
                    console.log("error :" + status)
                }
            })
        }
    })
})
