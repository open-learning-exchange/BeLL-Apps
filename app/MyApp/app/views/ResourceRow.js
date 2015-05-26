$(function () {

    App.Views.ResourceRow = Backbone.View.extend({

        tagName: "tr",
        id:null,
        admn: null,
        events: {
            "click .destroy": function (event) {
            	var that = this
                ////Deleting from the resource
                var shelfResources = new App.Collections.shelfResource()
                shelfResources.deleteResource = 1
                shelfResources.resourceId = this.model.get("_id")
                shelfResources.fetch({async : false})
                var model;
				while (model = shelfResources.first()) {
  					model.destroy();
				}
               	//////Deleting resources feedback
               	var resourcesFeedback = new App.Collections.ResourceFeedback()
               	resourcesFeedback.resourceId = this.model.get("_id")
               	resourcesFeedback.fetch({async:false})
               	while (model = resourcesFeedback.first()) {
  					model.destroy();
				}
               	//////Deleting resources from course setp
               	var courseSteps = new App.Collections.coursesteps()
               	courseSteps.getAll = 1
               	courseSteps.resourceId = this.model.get("_id")
               	courseSteps.fetch({async:false})
               	courseSteps.each(function(m){
               		
               		if(!m.get("resourceId"))
               		{
               			m.set("resourceId",[])
               		}
               		var index = m.get("resourceId").indexOf(that.model.get("_id").toString())
               		if(index!=-1)
               		{
               			m.get("resourceId").splice(index,1)
               			m.get("resourceTitles").splice(index,1)
               			m.save()
               		}
               		
               	})

               	this.model.destroy()
               	alert("Resource Successfully deleted.")
                event.preventDefault()
            },
            "click .removeFromCollection": function (event) {
            		
            		var tagId=window.location.href.split('#')[1].split('/')[1]
              		var resTags=this.model.get('Tag')
              		var	index=resTags.indexOf(tagId)
              			if(index > -1)
              			resTags.splice(index,1)
              		
              		var that=this
              		this.model.set('Tag',resTags)
              		
              	 	this.model.save(null,{success:function(response,revInfo){
              		    
              		    that.remove()
              		    alert('Removed Successfully From Collection')
              		
              		}})
   
            },
                        
            "click .hides": function (event) {
               	$(this.el).html("")
            	this.model.set({"hidden":true})
               	this.model.save()
               	App.startActivityIndicator()
               	 var shelfResources = new App.Collections.shelfResource()
                shelfResources.deleteResource = 1
                shelfResources.resourceId = this.model.get("_id")
                shelfResources.fetch({async : false})
                shelfResources.each(function(item) {
        			item.set({"hidden":true})
        			item.save()
    			});
               	App.stopActivityIndicator()
               	var newmodel=new App.Models.Resource({
                "_id":this.model.get('_id')
                })
                newmodel.fetch({async:false})
                this.model=newmodel
               	this.render()
            },
            "click .unhide": function (event) {
               	
               	$(this.el).html("")
               	this.model.set({"hidden":false})
               	this.model.save()
               	App.startActivityIndicator()
               	 var shelfResources = new App.Collections.shelfResource()
                shelfResources.deleteResource = 1
                shelfResources.resourceId = this.model.get("_id")
                shelfResources.fetch({async : false})
                shelfResources.each(function(item) {
        			item.set({"hidden":false})
        			item.save()
    			});
               	App.stopActivityIndicator()
				var newmodel=new App.Models.Resource({
                "_id":this.model.get('_id')
                })
                newmodel.fetch({async:false})
                this.model=newmodel
               	this.render()
               
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
            		freqmodel.set("reviewed",[0])
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
            		}
            		else
            		{
            			freqmodel.get("resourceID").push(this.model.get("_id"))
            			freqmodel.get("frequency").push(1)
            			if(!freqmodel.get("reviewed"))
            			{
            				freqmodel.set("reviewed",[0])
            			}
            			else
            			{
            				freqmodel.get("reviewed").push(0)
            			}
            			freqmodel.save()
            			return
            		}
            	}
            	
                $('ul.nav').html($('#template-nav-logged-in').html()).hide()
//                 var member = new App.Models.Member({
//                 	_id: $.cookie('Member._id')
//                 })
//                 member.fetch({
//                     async: false
//                 })
//                 var pending=[]
//                pending= member.get("pendingReviews")
//                pending.push(this.model.get("_id"))
//     		   	member.set("pendingReviews",pending)
//     		   	member.save()
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
				render: function ()
		{
			var vars = this.model.toJSON()
			//console.log(vars)
			var Details = ""

            if(vars.author != undefined && vars.author != ""){
                Details = Details+ "<b>Author </b>" + vars.author + ' , '
            }

            if(vars.Year != undefined && vars.Year != ""){
                Details = Details+ "<b>Year </b>" + vars.Year + ' , '
            }

            if (vars.openWith != undefined)
            {
                Details = Details + "<b>Media </b>"
                Details = Details + vars.openWith + ' , '

            }

            if (vars.language != undefined) {
                if (vars.language.length > 0) {
                    Details = Details + '<b>Language </b>' + vars.language + " , "
                }
            }

			if (vars.subject != undefined)
			{
				Details = Details + "<b>Subject(s) </b>"
				if ($.isArray(vars.subject))
				{
					for (var i = 0; i < vars.subject.length; i++)
					{
						Details = Details + vars.subject[i] + ' / '
					}

				}
				else
				{
					Details = Details + vars.subject + ' / '

				}
				Details = Details.substring(0, Details.length - 3)
				Details = Details + ' , '
			}

			if (vars.Level != undefined)
			{
				Details = Details + "<b>Level(s) </b>"
				if ($.isArray(vars.Level))
				{
					for (var i = 0; i < vars.Level.length; i++)
					{
						Details = Details + vars.Level[i] + ' / '
					}

				}
				else
				{
					Details = Details + vars.Level + ' / '

				}

				Details = Details.substring(0, Details.length - 3)
				Details = Details + ' , '

			}

            if(vars.Publisher != undefined && vars.Publisher != ""){
                Details = Details+ "<b>Publisher/Attribution </b>" + vars.Publisher + ' , '
            }

            if(vars.linkToLicense != undefined && vars.linkToLicense != ""){
                Details = Details+ "<b>Link To License </b>" + vars.linkToLicense + ' , '
            }

            if(vars.resourceFor != undefined && vars.resourceFor != "") {
                Details = Details + "<b> Resource For </b>" + vars.resourceFor + ' , '
            }

            if (vars.Tag != undefined)
            {
                //console.log(this.collections)
                if ($.isArray(vars.Tag))
                {
                    if(vars.Tag.length > 0)
                        Details = Details + "<b>Collection </b>"

                    for (var i = 0; i < vars.Tag.length; i++)
                    {
                        if (this.collections.get(vars.Tag[i])!=undefined)
                            Details = Details + this.collections.get(vars.Tag[i]).toJSON().CollectionName + " / "
                    }
                }
                else
                {
                    if (vars.Tag != 'Add New')
                        Details = Details+ "<b>Collection </b>" + vars.Tag + ' / '
                }
            }
            Details = Details.substring(0, Details.length - 3)
            Details = Details + ' , '

            Details = Details.substring(0, Details.length - 3)

            vars.Details = Details
			if (vars.hidden == undefined)
			{
				vars.hidden = false
			}

			if (this.model.get("sum") != 0)
			{
				vars.totalRatings = this.model.get("timesRated")
				vars.averageRating = (parseInt(this.model.get("sum")) / parseInt(vars.totalRatings))
			}
			else
			{
				vars.averageRating = "Sum not found"
				vars.totalRatings = 0
			}

			if (this.isManager > -1)
			{
				vars.Manager = 1
			}
			else
			{
				vars.Manager = 0
			}
			if(this.displayCollec_Resources==true){
			   vars.removeFormCollection=1
			}
			else{
			   vars.removeFormCollection=0
			}
			this.$el.append(this.template(vars))


		}


    })

})