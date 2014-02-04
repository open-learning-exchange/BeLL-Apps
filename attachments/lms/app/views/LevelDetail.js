$(function () {

    App.Views.LevelDetail = Backbone.View.extend({

        
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click .remover": function (e) {
                var rid = e.currentTarget.value
                var rtitle = this.model.get("resourceTitles")
                var rids = this.model.get("resourceId")
                var index = rids.indexOf(rid)
                rids.splice(index, 1)
                rtitle.splice(index, 1)
                this.model.set("resourceId", rids)
                this.model.set("resourceTitles", rtitle)
                this.model.save()
                var that = this
                this.model.on('sync', function () {
                    console.log(that.model.get('rev'))
                    document.location.href = '#course/manage/' + that.model.get("courseId")

                })
            },
            "click .removeAttachment" : function (e) {
            	var that = this
            	var attachmentNo = e.currentTarget.value
            	$.ajax({
              		url: '/coursestep/' + this.model.get('_id') + '/' + _.keys(this.model.get('_attachments'))[attachmentNo] + '?rev=' + this.model.get("_rev"),
              		type: 'DELETE',
              		success: function(response, status, jqXHR) {
                          alert('Successfully deleted.')
                          App.Router.ViewLevel(that.model.get('_id'),that.model.get("_rev"))
              		}
            	})

            },
            "click .levelResView": function (e) {
                var rid = e.currentTarget.attributes[0].value
                var levelId = this.model.get("_id")
                var revid = this.model.get("_rev")
                Backbone.history.navigate('resource/atlevel/feedback/' + rid + '/' + levelId + '/' + revid, {
                    trigger: true
                })

            },
            "click #addInstructions" : function (e) {
            	var fileinput = document.forms["fileAttachment"]["_attachments"]
    			fileinput.click();
            },
            "change #_attachments" : function (e) {
            	var that = this
            	var img = $('input[type="file"]')
				var extension = img.val().split('.')
				if(img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt'
					&& extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' 
					&& extension[(extension.length - 1)] != 'png' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'mov' && extension[(extension.length - 1)] != 'mp3')
				{
					alert("Invalid attatchment.")
					return 
				}
				//this.model.unset('_attachments')
                if ($('input[type="file"]').val()) {
                	this.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
               	} 
               	else {
               		////no attachment
               		 alert('no attachment')
                }
               this.model.on('savedAttachment', function () {
                	/////Attatchment successfully saved
                	alert("Assignement successfully submitted.")
                	App.Router.ViewLevel(that.model.get('_id'),that.model.get("_rev"))
//                	this.$el.html('')
//                	this.model.fetch({async:false})
//                	this.render()
                }, this.model)

            },
        },
        render: function () {
        	var i = 0
            var rtitle = this.model.get("resourceTitles")
            var rid = this.model.get("resourceId")
            var stepResources = '</BR><table class="table table-striped">'
            if (this.model.get("resourceTitles")) {
                for (i = 0; i < this.model.get("resourceTitles").length; i++) {
                    var r = new App.Models.Resource({
                        "_id": rid[i]
                    })
                    r.fetch({
                        async: false
                    })
                    if (r.get("_attachments")) {
                        stepResources = stepResources + ("<tr><td>" + rtitle[i] + "</td><td><a class='levelResView btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/" + rid[i] + "'  target='_blank' value='" + rid[i] + "'><i class='icon-eye-open'></i>View</a></td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>Remove </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                    } else {
                        stepResources = stepResources + ("<tr><td>" + rtitle[i] + "</td><td>No Attachment</td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>Remove </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                    }
                }
                stepResources = stepResources + '</table>'
                this.$el.append(stepResources)
                this.$el.append('<br/><br/><B>Instructions</B>&nbsp;&nbsp;<a class="btn btn-success"  style="" target="_blank" id="addInstructions">Add</a><br/><br/>')
                var uploadString = '<form method="post" id="fileAttachment">'
	                uploadString = uploadString + '<input type="file" name="_attachments" id="_attachments" multiple="multiple" style="display: none" /> '
	                uploadString = uploadString + '<input class="rev" type="hidden" name="_rev"></form>'
	            this.$el.append(uploadString)
	            if(!this.model.get('_attachments'))
            	{
            		return
            	}
	            var tableString = '<table class="table table-striped">'
	            for (i = 0; i < _.keys(this.model.get('_attachments')).length; i++) {
	            	
	            	var attachmentURL = '/coursestep/' + this.model.get('_id') + '/'
	            	var attachmentName = ''
                	if (typeof this.model.get('_attachments') !== 'undefined') {
                   		attachmentURL = attachmentURL + _.keys(this.model.get('_attachments'))[i]
                    	attachmentName = _.keys(this.model.get('_attachments'))[i]
                	}
	            	
	           		tableString = tableString +("<tr><td>" + attachmentName + "</td><td><a class='btn btn-info' href='"+ attachmentURL + "'  target='_blank' ><i class='icon-eye-open'></i>View</a></td><td><button class='removeAttachment btn btn-danger' value='" + i + "'>Remove </button><input type='hidden'/>")
	            }
	            tableString = tableString+ '</table>'
	            this.$el.append(tableString)
                
            }
        }

    })

})