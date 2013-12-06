$(function() {

  App.Views.GroupSpan = Backbone.View.extend({

    tagName: "td",

    className: 'course-box',

    template : $("#template-GroupSpan").html(),

    render: function () {
    	var vars = this.model.toJSON()
		var res = new App.Collections.membercourseprogresses()
		res.courseId=vars._id
		res.memberId=$.cookie('Member._id')
		res.fetch({async:false})
		var modl=""
		var PassedSteps=0
		var totalSteps=0
		if(res.length!=0){
			modl=res.first().toJSON()
			PassedSteps=0
			totalSteps=modl.stepsStatus.length
			while(PassedSteps<totalSteps&&modl.stepsStatus[PassedSteps]!='0'){
				PassedSteps++
			}
		}
		console.log(totalSteps)
		console.log(PassedSteps)
		if(totalSteps!=0){
		vars.yes='<br>('+PassedSteps+'/'+totalSteps+')'
		}
		else{
		vars.yes="<br>(error!!!)"
		}
      this.$el.append(_.template(this.template, vars))
    }

  })

})
