$(function () {

    App.Views.ResourceRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function (event) {
                alert("destroying")
                this.model.destroy()
                event.preventDefault()
            },
            "click .trigger-modal": function () {
                $('#myModal').modal({
                	
                    show: true
                })
            },
            "click .resFeedBack": function (event) {
            	
            	var resourcefreq = new App.Collections.ResourcesFrequency()
            	resourcefreq.memberID = $.cookie('Member._id')
            	resourcefreq.fetch({async:false})
            	
            	if(resourcefreq.length==0)
            	{
            		var freqmodel = new App.Models.ResourceFrequency()
            		freqmodel.set("memberID", $.cookie('Member._id'))
            		freqmodel.set("resourceID",[this.model.get("_id")])
            		freqmodel.set("frequency",[1])
            		freqmodel.save()
            		return
            	}
            	else
            	{
            		var freqmodel  = resourcefreq.first()
            		var index = freqmodel.get("resourceID").indexOf(this.model.get("_id").toString())
            		if(index!=-1)
            		{
            			var freq = freqmodel.get('frequency')
            			freq[index] = freq[index] + 1
            			freqmodel.save()
            			if(freq[index]%5!=0)
            			{
            				return
            			}
            		}
            		else
            		{
            			//freqmodel.set("resourceID",freqmodel.get("resourceID").push[this.model.get("_id")])
            			freqmodel.get("resourceID").push(this.model.get("_id"))
            			freqmodel.get("frequency").push(1)
            			//freqmodel.set("frequency",[1])
            			freqmodel.save()
            			return
            		}
            	}
            	
                $('ul.nav').html($('#template-nav-logged-in').html()).hide()
                 var member = new App.Models.Member({
                                _id: $.cookie('Member._id')
                            })
                            member.fetch({
                                async: false
                            })
                            var pending=[]
                           pending= member.get("pendingReviews")
                           pending.push(this.model.get("_id"))
                		   member.set("pendingReviews",pending)
                		   member.save()
                	console.log(member.get("pendingReviews"))
                Backbone.history.navigate('resource/feedback/add/' + this.model.get("_id") + '/' + this.model.get("title"), {
                    trigger: true
                })
            },
        },

        vars: {},

        template: _.template($("#template-ResourceRow").html()),

        initialize: function (e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function () {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()
            /*var resourceFeedback = new App.Collections.ResourceFeedback()
      resourceFeedback.resourceId = this.model.get("_id")
      resourceFeedback.fetch({async:false})
      var averageRating = 0
      var sum = 0
      var that = this
      vars.totalRatings = resourceFeedback.length
      resourceFeedback.each(function(m){
          sum = sum + parseInt(m.get("rating"))
      })
      averageRating = Math.round(sum/resourceFeedback.length)
      if(!isNaN(averageRating)){
        this.model.set("averageRating",parseInt(averageRating))
      }
      else{
        this.model.set("averageRating",0)
      }
      this.model.on('sync',function(){
          that.$el.append(that.template(vars))      
      }) 
      this.model.save()
      */
//      var flength = new App.Collections.ResourceFeedback()
//                flength.resourceId = this.model.get("_id")
//                flength.fetch({
//                    async: false
//               	})
//       var s = 0
//      flength.each(function(m){
//      	s = s + parseInt(m.get("rating"))
//      })
//      console.log('check : ' + s + ' ' + this.model.get("sum") + ' ' + flength.length +  ' ' + this.model.get("timesRated"))
//      this.model.set("sum",s.toString())
//      this.model.set("timesRated",flength.length.toString())
//      this.model.save()
//      if(s!=parseInt(this.model.get("sum")) && flength.length == parseInt(this.model.get("timesRated")) )
//      {
//      	this.model.set("sum",s.toString())
//      	this.model.save()
//      }
            if (this.model.get("sum") != 0) {
                vars.totalRatings = this.model.get("timesRated")
                vars.averageRating = (parseInt(this.model.get("sum")) / parseInt(vars.totalRatings))
            } else {
            	vars.averageRating="Sum not found"
                vars.totalRatings = 0
            }

            if (this.isadmin > -1) {
                vars.admn = 1
            } else {
                vars.admn = 0
            }
            this.$el.append(this.template(vars))


        },


    })

})