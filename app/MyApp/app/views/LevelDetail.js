$(function() {

    App.Views.LevelDetail = Backbone.View.extend({


        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click .remover": function(e) {
                var that = this
                var rid = e.currentTarget.value
                var rtitle = this.model.get("resourceTitles")
                var rids = this.model.get("resourceId")
                var index = rids.indexOf(rid)
                rids.splice(index, 1)
                rtitle.splice(index, 1)
                this.model.set("resourceId", rids)
                this.model.set("resourceTitles", rtitle)
                this.model.save(null, {
                    success: function(responseModel, responseRev) {
                        that.model.set("_rev", responseRev.rev)
                        $('#' + rid.replace("\.", "\\.")).remove();

                    }
                })
            },
            "click .removeAttachment": function(e) {
                var that = this
                var attachmentNo = e.currentTarget.value
                $.ajax({
                    url: '/coursestep/' + this.model.get('_id') + '/' + _.keys(this.model.get('_attachments'))[attachmentNo] + '?rev=' + this.model.get("_rev"),
                    type: 'DELETE',
                    success: function(response, status, jqXHR) {
                        alert(App.languageDict.attributes.Successfully_Deleted)
                        App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    }
                })

            },
            "click .levelResView": function(e) {
                var rid = e.currentTarget.attributes[0].value
                var levelId = this.model.get("_id")
                var revid = this.model.get("_rev")
                Backbone.history.navigate('resource/atlevel/feedback/' + rid + '/' + levelId + '/' + revid, {
                    trigger: true
                })

            },
            "click #addInstructions": function(e) {
                var value = $('#LevelDescription').val()
                this.model.set('instruction', value);
                this.model.save();
            },
            "change #_attachments": function(e) {
                var that = this
                var img = $('input[type="file"]')
                var extension = img.val().split('.')
                if (img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt' && extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' && extension[(extension.length - 1)] != 'png' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'mov' && extension[(extension.length - 1)] != 'mp3') {
                    alert(App.languageDict.attributes.Invalid_Attachment)
                    return
                }
                //this.model.unset('_attachments')
                if ($('input[type="file"]').val()) {
                    this.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                } else {
                    ////no attachment
                    alert(App.languageDict.attributes.No_Attachment)
                }
                this.model.on('savedAttachment', function() {
                    /////Attatchment successfully saved
                    alert(App.languageDict.attributes.Assignment_Submit_Success)
                    App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    //                	this.$el.html('')
                    //                	this.model.fetch({async:false})
                    //                	this.render()
                }, this.model)

            }
        },
        render: function() {
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
                    if (!(r.get("hidden"))) {
                        if (r.get("_attachments")) {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td><a class='levelResView btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/" + rid[i] + "/"+rtitle[i]+"'  target='_blank' value='" + rid[i] + "'><i class='icon-eye-open'></i>"+App.languageDict.attributes.View+"</a></td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        } else {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td>"+App.languageDict.attributes.No_Attachment+"</td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        }
                    }
                }
                stepResources = stepResources + '</table>'
                this.$el.append(stepResources)
                //this.$el.append('<br/><br/><B>'+App.languageDict.attributes.Instructions+'<TextArea id="LevelDescription" name ="description" rows="5" cols="100" style="width:98% ";>' + this.model.get("instruction") +'</TextArea>'+'</B>&nbsp;&nbsp;<a class="btn btn-success" id="addInstructions" style = "float:right;">'+App.languageDict.attributes.Add+'</a><br/><br/>')

            }
        }

    })

})