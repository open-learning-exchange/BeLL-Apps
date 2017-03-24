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
            var courseModel = new App.Models.Course({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            })
            var memberList = courseModel.get('members')
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
            var viewtext = '<table class="btable btable-striped"><th>'+App.languageDict.attributes.Photo+'</th><th>'+App.languageDict.attributes.Name+'</th><th>'+App.languageDict.attributes.Roles+'</th><th colspan=2>'+App.languageDict.attributes.Actions+'</th>'
            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })
                var roleOfMem;
                if(courseModel.get('courseLeader').indexOf(mem.get('_id')) > -1) {
                    roleOfMem=App.languageDict.attributes.Leader
                } else {
                    roleOfMem=App.languageDict.attributes.Learner
                }
                var mail = mem.get('login') + '.' + code +na+ '@olebell.org'
                var src = "img/default.jpg"
                var attchmentURL = '/members/' + mem.id + '/'
                if (typeof mem.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(mem.get('_attachments'))[0]
                    src = attchmentURL
                }
                viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mem.get('firstName') + ' ' + mem.get('lastName') + '</td><td>'+roleOfMem+'</td><td><input type="checkbox" name="courseMember" value="' + mail + '">'+App.languageDict.attributes.Send_Email+'</td>'
                var loggedIn = new App.Models.Member({
                    "_id": $.cookie('Member._id')
                })
                loggedIn.fetch({
                    async: false
                })
                var roles = loggedIn.get("roles")
                if( courseModel.get('courseLeader') && courseModel.get('courseLeader').indexOf($.cookie('Member._id'))>-1 || roles.indexOf('Manager')>-1) {
                    var memId=mem.get('_id')+','+this.courseId;
                    viewtext+='<td><button class="btn btn-danger removeMember" value="' + mem.get('_id') + '" onclick=removeMemberFromCourse(\"' +  memId + '")>'+App.languageDict.attributes.Remove+'</button></td>'
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
                +App.languageDict.attributes.Back+'</button></td></tr>';
            viewtext += '</table>';
            $('.courseEditStep').append(viewtext)
        }
    })
})