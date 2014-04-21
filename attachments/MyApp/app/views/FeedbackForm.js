$(function () {

    App.Views.FeedbackForm = Backbone.View.extend({

        tagName: "form",
        user_rating: 'null',
        events: {
            "click #formButton": "setForm",
            //"click #addtoshelf": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function () {
            this.user_rating = 0
            console.log(this.model)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['rating'].$el.hide()
            this.form.fields['memberId'].$el.hide()
            this.form.fields['resourceId'].$el.hide()


            var $button = $('<a class="btn btn-success" style="margin-left:10px" id="formButton">Save</a>')
            $btnAddToshelf = $('<button class="btn btn-success" id="addtoshelf" onclick=addToshelf("' + this.model.get('resourceId') + '","' + escape(this.rtitle) + '") style="margin-left:10px">Add To My Library</button>')


            this.$el.append($button)
            this.$el.append($btnAddToshelf)
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setUserRating: function (ur) {
            this.user_rating = ur
        },
        setForm: function () {
            // Put the form's input into the model in memory
            if (this.user_rating == 0) {
                alert("Please rate the resource first")
            } else {
                // Put the form's input into the model in memory
                if (this.form.getValue('comment').length == 0) {
                    this.form.setValue('comment', 'No Comment')
                }
                this.form.setValue('rating', this.user_rating)
                this.form.commit()
                 var that = this
                
                
								var FeedBackDb=new PouchDB('feedback');
								FeedBackDb.post(that.model.toJSON(),function(err,info){
											if(!err){
												var Resources=new PouchDB('resources');
												var resId=that.model.get("resourceId")
										
												Resources.get(resId,function(err,resdoc){
									
																	if(!err){										
																			var numRating=parseInt(resdoc.timesRated)
																				numRating++
																			var sumRating=parseInt(resdoc.sum)+parseInt(that.user_rating)
																			   Resources.put({
																					sum:sumRating,
																					timesRated: numRating
																				},resdoc._id,resdoc._rev,function(error,info){
													
																				})
																	}else{
																		Resources.post({
																			  _id: resId._id,
																			  sum:parseInt(that.user_rating),
																			  timesRated: 1
																		 })
																	} 
																alert('Rating is successfully saved')	             
															})			
				 
				 
												console.log(info)
											}else{
												console.log(err)
											}
	
								})
 //Send the updated model to the server
                 
//                 var ResourceFrequencyDB=new PouchDB('resourcefrequency');
//                 ResourceFrequencyDB.allDocs({include_docs: true}, function(err, response) {
//                 		console.log(response.rows[0].doc.reviewed)
//                 		if(response.rows[0].doc.reviewed){
//                 		   
//                 		
// 								
// 						var freqmodel = response.rows[0].doc
// 						var index = freqmodel.resourceID.indexOf(that.model.get('resourceId').toString())
// 						if (index != -1) {
// 								var freq = freqmodel.reviewed
// 								freq[index] = freq[index] + 1
// 								freqmodel.reviewed=freq[index]
// 								console.log(freqmodel)
// 					            ResourceFrequencyDB.put(freqmodel,function(error,info){
// 					                 console.log(error)
// 					                 console.log(info)
// 					                 alert('after the setting the frequency table')
// 					                  
// 					                
// 					            
// 					            })
//                			 }
// 								
//                 		}
//                  });
// 
                // var that = this
//                 var FeedBackDb=new PouchDB('feedback');
//                 FeedBackDb.post(this.model.toJSON(),function(err,info){
// 							if(!err){
// 								var Resources=new PouchDB('resources');
// 								var resId=that.model.get("resourceId")
// 										
// 								Resources.get(resId,function(err,resdoc){
// 									
// 													if(!err){										
// 															var numRating=parseInt(resdoc.timesRated)
// 																numRating++
// 															var sumRating=parseInt(resdoc.sum)+parseInt(that.user_rating)
// 															   Resources.put({
// 																	sum:sumRating,
// 																	timesRated: numRating
// 																},resdoc._id,resdoc._rev,function(error,info){
// 													
// 																})
// 													}else{
// 														Resources.post({
// 															  _id: resId._id,
// 															  sum:parseInt(that.user_rating),
// 															  timesRated: 1
// 														 })
// 													} 
// 												alert('Rating is successfully saved')	             
// 											})			
// 				 
// 				 
// 								console.log(info)
// 							}else{
// 								console.log(err)
// 							}
// 	
//                 })
// 
// 				console.log(this.model.toJSON())
// 			     
//                 this.model.on('sync', function () {
//                
//                     var rmodel = new App.Models.Resource({
//                         "_id": that.model.get("resourceId")
//                     })
//                     rmodel.fetch({
//                         success: function () {
//                             var avgr = rmodel.get("sum")
//                             if(avgr==null)
//                             {
//                             	avgr = parseInt(that.user_rating)       
//                             }
//                             else{
//                             	avgr = parseInt(avgr) + parseInt(that.user_rating)
//                             }
//                             rmodel.set("sum", parseInt(avgr))
//                             rmodel.set("timesRated", lengthoffeedbacks + 1)
//                             rmodel.save()
//                         }
//                     })
//                })
//  this.model.save()
//   var ResourceFrequencyDB=new PouchDB('resourcefrequency');
//                 var resourcefreq = new App.Collections.ResourcesFrequency()
//                 resourcefreq.memberID = $.cookie('Member._id')
//                 resourcefreq.fetch({
//                     async: false
//                 })
//                 var freqmodel = resourcefreq.first()
//                 console.log(freqmodel.toJSON())
//                 var index = freqmodel.get("resourceID").indexOf(that.model.get("resourceId").toString())
//                 console.log(index)
//                 if (index != -1) {
//                     var freq = freqmodel.get('reviewed')
//                     freq[index] = freq[index] + 1
//                     freqmodel.set('reviewed',freq[index])
//                     freqmodel.save()
//                     
//                 }
                //				var member = new App.Models.Member({
                //                     _id: $.cookie('Member._id')
                //                 })
                //                 member.fetch({
                //                     async: false
                //                })            
                //                var pending=[]
                //                pending=member.get("pendingReviews")
                //                var index=pending.indexOf(that.model.get("resourceId"))
                //                if(index>-1){
                //                	pending.splice(index,1)
                //                	member.set("pendingReviews",pending)
                //                	member.save()
            
                    $('#externalDiv').hide()
            }

        },


    })

})