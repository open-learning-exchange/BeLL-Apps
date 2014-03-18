$(function () {

    App.Views.GroupMembers = Backbone.View.extend({

        // tagName: "table",
        // className: "news-table",
        // authorName: null,
        vars: {},
        //template: $('#template-sendMail-CourseMember').html(),
        initialize: function () {},
        events: {
         "click  #selectAllMembers": "selectAllMembers",
         "click  #removeMember":"removeMember"
        },
        selectAllMembers:function(){
        	if($("#selectAllMembers").text()=='Select All')
         	{
      			$("input[name='courseMember']").each( function () {
						$(this).prop('checked', true);
      			})
      			$("#selectAllMembers").text('Uncheck')
      		}
      		else{
      		 $("input[name='courseMember']").each( function () {
						$(this).prop('checked', false);
      			})
      		   $("#selectAllMembers").text('Select All')
      		
      		}

        
        },
        removeMember:function(e){
        
           var memberId=$('#removeMember').val()
           var that=this
           
           var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
             		success:function(result){
                            members=result.get('members')
                            members.splice(members.indexOf(memberId),1)
                            result.set('members',members)
                            
                            result.save()
                            memberCoursePro=new App.Collections.membercourseprogresses()
                            memberCoursePro.memberId=memberId
                            memberCoursePro.courseId=that.courseId
                            
                            memberCoursePro.fetch({async:false})
                            while (model = memberCoursePro.first()) {
  							    model.destroy();
			                }
                            that.render()
                            alert('Member is Removed From Course')
             		}
            })
            
          
        },
        render: function () {
            var courseModel = new App.Models.Group({
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
            var na = currentConfig.rows[0].doc.nationName.substring(3,5)

            this.$el.append('<h3 style="margin-left:5%">Course Members | ' + courseModel.get('name') + '</h3>')
            var viewtext = '<table class="btable btable-striped"><th>Photo</th><th colspan=3>Name</th>'

            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })
                var mail = mem.get('login') + '.' + code +na+ '@olebell.org'

                var src = "img/default.jpg"
                var attchmentURL = '/members/' + mem.id + '/'
                if (typeof mem.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(mem.get('_attachments'))[0]
                    src = attchmentURL
                }
                viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mem.get('firstName') + ' ' + mem.get('lastName') + '</td><td><input type="checkbox" name="courseMember" value="' + mail + '">Send mail</td>'
    
                
                if($.cookie('Member._id')==courseModel.get('courseLeader'))
                {
                   viewtext+='<td><button class="btn btn-danger" id="removeMember" value="' + mem.get('_id') + '">Remove</button></td>'
                }
                
                viewtext+='</tr>'

            }
            viewtext += '<tr><td></td><td></td><td><button class="btn"  id="selectAllMembers">Select All</button><button style="margin-left:10px" class="btn" onclick=showComposePopupMultiple("' + mail + '") id="sendMailButton">Send Mail</button></td></tr>'
            viewtext += '</table>'
            this.$el.append(viewtext)

        }

    })

})