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
               
                var feedbackModel=that.model
                var member=new App.Models.Member()
                    member.set('_id', $.cookie('Member._id'))
                    member.fetch({success:function(upModel,upRev){
//                   			console.log(upModel)

                            that.logActivity(upModel,feedbackModel);
                    
                    }})
								var FeedBackDb=new PouchDB('feedback');
								FeedBackDb.post(that.model.toJSON(),function(err,info){
											if(!err){
												var Resources=new PouchDB('resources');
												var resId=that.model.get("resourceId")
												console.log(resId)
												Resources.get(resId,function(err,resdoc){
																	console.log(err)
																	console.log(resdoc)
																	if(!err){	
																										
																			var numRating=parseInt(resdoc.timesRated)
																				numRating++
																			var sumRating=parseInt(resdoc.sum)+parseInt(that.user_rating)
																			   Resources.put({
																					sum:sumRating,
																					timesRated: numRating
																				},resdoc._id,resdoc._rev,function(error,info){
																				console.log(error)
																				console.log(info)
													
																				})
																	}else{
																		Resources.post({
																			  _id: resId._id,
																			  sum:parseInt(that.user_rating),
																			  timesRated: 1
																		 },function(error,info){
																		 console.log(error)
																		 console.log(info)
																		 })
																	} 
																alert('Rating is successfully saved')	             
															})			
												console.log(info)
											}else{
												console.log(err)
											}
	
								})
						$('#externalDiv').hide()
						
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
            
            }

        },
logActivity:function(member,feedbackModel){
        
        var that=this
  		var logdb=new PouchDB('activitylogs')
      	var currentdate = new Date();
    	var logdate = this.getFormattedDate(currentdate);

        logdb.get(logdate, function(err, logModel) {
            if (!err) {
    //            console.log("logModel: ");
    //            console.log(logModel);
    //            alert("yeeyyyyyy");
                that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
            } else {
                that.createJsonlog(member, logdate, logdb, feedbackModel);
            }
        });

//        logdb.query({map:function(doc){
//					 if(doc.logDate){
//						emit(doc.logDate,doc)
//					 }
//				}
//   			},{key:logdate},function(err,res){
//
//				if(!err){
//				     if(res.total_rows!=0){
//				          logModel=res.rows[0].value
//				          that.UpdatejSONlog(member,logModel,logdb,feedbackModel)
//				     }else{
//				          that.createJsonlog(logdate,member,logdb,feedbackModel)
//
//				     }
//                }
//		   });
		   
    },
createJsonlog:function(member, logdate, logdb, feedbackModel){
        var that = this;
		var docJson = {
             logDate: logdate,
             resourcesIds:[],
             male_visits:0,
             female_visits:0,
             male_timesRated:[],
             female_timesRated:[],
             male_rating:[],
             community:App.configuration.get('code'),
             female_rating:[],
             resources_opened:[],
             male_opened:[],
             female_opened:[]
        };

        logdb.put(docJson, logdate, function(err, response) {
            if (!err) {
                console.log("FeedbackForm:: createJsonlog:: created activity log in pouchdb for today..");
                logdb.get(logdate, function(err, logModel) {
                    if (!err) {
                        that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                    } else {
                        console.log("FeedbackForm:: createJsonlog:: Error fetching activitylog doc from Pouch after creating it");
//                        alert("FeedbackForm:: createJsonlog:: Error fetching activitylog doc from Pouch after creating it");
                    }
                });
    //                    alert("FeedbackForm:: createJsonlog:: created activity log in pouchdb for today..");
            } else {
                console.log("FeedbackForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                console.log(err);
    //                    alert("error creating/pushing activity log doc in pouchdb..");
            }
        });

//			logdb.post(docJson, function (err, response) {
//			             logdb.get(response.id, function(err, doc) {
//			                that.UpdatejSONlog(member,doc,logdb,feedbackModel)
//			             });
// 		   });
			
},
UpdatejSONlog:function(member, logModel, logdb, feedbackModel, logdate){
			console.log(feedbackModel)
			memRating = parseInt(feedbackModel.get('rating'))
            var resId = feedbackModel.get('resourceId')
            var index = logModel.resourcesIds.indexOf(resId)
	        if(index == -1){
                logModel.resourcesIds.push(resId)
                if(member.get('Gender')=='Male') {
                      logModel.male_rating.push(memRating)
                      logModel.female_rating.push(0)
                      logModel.male_timesRated.push(1)
                      logModel.female_timesRated.push(0)
                }else{
                      logModel.male_rating.push(0)
                      logModel.female_rating.push(memRating)
                      logModel.male_timesRated.push(0)
                      logModel.female_timesRated.push(1)
                }
            }
            else{
                if(member.get('Gender')=='Male') {
                      logModel.male_rating[index]=parseInt(logModel.male_rating[index])+memRating
                      logModel.male_timesRated[index]=(parseInt(logModel.male_timesRated[index]))+1
                }else{
                      logModel.female_rating[index]=parseInt(logModel.female_rating[index])+memRating
                      logModel.female_timesRated[index]=(parseInt(logModel.female_timesRated[index]))+1
                }
            }

            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: UpdatejSONlog:: updated daily log from pouchdb for today..");
                } else {
                    console.log("FeedbackForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
//                    alert("err making update to record");
                }
            });

//			logdb.put(logModel,function(reponce){
//	     		console.log(reponce)
//		   })
//			console.log(logModel)
    },

getFormattedDate:function(date) {
  		   var year = date.getFullYear();
  		   var month = (1 + date.getMonth()).toString();
               month = month.length > 1 ? month : '0' + month;
  		   var day = date.getDate().toString();
  		       day = day.length > 1 ? day : '0' + day;
       return  month + '/' + day + '/' + year;
}

    })

})