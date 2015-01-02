$(function () {

	App.Views.ResourceForm = Backbone.View.extend({

		className: "form",
		id: 'resourceform',
		hide: false,
		events: {
			"click .save": "saveForm",
			"click #cancel": function () {
				window.history.back()
			},
			"click #add_newCoellection": function () {
				App.Router.AddNewSelect('Add New')
			},
            "click #saveUpdatedWelcomeVideoForm": "saveUpdatedWelcomeVideoForm"
		},

		template: _.template($('#template-form-file').html()),

		render: function () {
			var vars = {}
			if (_.has(this.model, 'id')) {
				vars.header = 'Details "' + this.model.get('title') + '"';
				var tempAttachments = this.model.get('_attachments');
				var fields = _.map(
					_.pairs(tempAttachments),
					function (pair) {
						return {
							key: pair[0],
							value: pair[1]
						};
					}
				);
				vars.resourceAttachments = fields;
				vars.resourceTitle = this.model.get('title');
				vars.resourceUrl = this.model.get('url');


			}
			else {
				vars.header = 'New Resource';
				vars.resourceAttachments = "No File Selected.";
				vars.resourceUrl = "";
			}

			// prepare the form
			this.form = new Backbone.Form({
				model: this.model
			})
			this.form.render()
			this.form.fields['uploadDate'].$el.hide()
			if (this.edit == false) {
				this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
			}
			this.form.fields['addedBy'].$el.attr("disabled", true)
			this.form.fields['averageRating'].$el.hide()
			var that = this
			if (_.has(this.model, 'id')) {
				if (this.model.get("Level") == "All") {
					that.hide = true
				}
			}
			// @todo Why won't this work?
			vars.form = "" //$(this.form.el).html()
			this.$el.html(this.template(vars))
				// @todo this is hackey, should be the following line or assigned to vars.form
			$('.fields').html(this.form.el)
			this.$el.append('<button class="btn btn-success" id="add_newCoellection" >Add New</button>')
			$('#progressImage').hide();
			//$this.$el.children('.fields').html(this.form.el) // also not working

			return this
		},
        saveUpdatedWelcomeVideoForm: function() {
            // mark this resource with welcome-video flag
            if(this.model.get("isWelcomeVideo") === undefined){
                this.model.set("isWelcomeVideo", true);
            }
            this.form.commit();
            this.model.set("Level", null);
            this.model.set("subject", null);
            var formContext = this;
            // id a new video file has been linked/uploaded, change the "addedBy" field to have the name of the current user
            // if no new file has been linked/uploaded, don't take any action
            var uploadedFileName = $('input[type="file"]').val();
            this.model.save(null, {
                success: function (res) {
                    if (uploadedFileName) {
                        formContext.model.unset('_attachments');
                        App.startActivityIndicator();
                        // set the handler for successful response on processing the video update form
                        formContext.model.on('savedAttachment', function () {
                            App.stopActivityIndicator();
                            this.trigger('processed');
                        }, formContext.model);
                        formContext.model.saveAttachment("#fileAttachment", "#_attachments", "#fileAttachment .rev");
                        formContext.form.fields['addedBy'].setValue($.cookie('Member.login'));
                    }
                    else {
                        return;
                    }
                }
            });
        },
        renderAddOrUploadWelcomeVideoForm: function() {
            var formHeader = $('<h3> Edit Welcome Video Form </h3><br><br><br><br>');
            this.$el.append(formHeader);
            this.form = new Backbone.Form({
                model: this.model
            });
            this.$el.append(this.form.render().el);
            // hide the 'decision' and 'submitted by' subschemas from rendering when form has not been submitted
            for(var field in this.form.fields) {
                this.form.fields[field].$el.hide();
            }
            this.form.fields['addedBy'].$el.show();
            this.form.fields['addedBy'].editor.el.disabled = true;
            this.form.fields['uploadDate'].$el.show();
            this.form.fields['openWith'].$el.show();
//            this.$el.append('<label for="_attachments">Upload Welcome Video</label>');
//            this.$el.append('<input type="file" name="_attachments" id="_attachments" style="line-height: 28px;" />');
            // get attachments of welcome video doc
            var tempAttachments = this.model.get('_attachments');
            var fields = _.map(
                _.pairs(tempAttachments),
                function (pair) {
                    return {
                        key: pair[0],
                        value: pair[1]
                    };
                }
            );
            for(var field in fields) { // field is index and fields is the array being traversed
                var label = $("<label>").text(fields[field].key); // fields[field].value has info like {content_type: "video/mp4", length: 16501239, etc}
                this.$el.append(label);
            }
            this.$el.append('<br><br>');
            // add a label followed by input box/button for allowing uploading of new welcome video, followed by label anming the
            // name of the video currently being used as welcome video
            this.$el.append('<form method="post" id="fileAttachment"></form>');
            this.$el.find("#fileAttachment").append('<label for="_attachments">Upload Welcome Video</label>');
            this.$el.find("#fileAttachment").append('<input type="file" name="_attachments" id="_attachments" style="line-height: 28px;" multiple="multiple" label=" :" />');
            this.$el.find("#fileAttachment").append('<input class="rev" type="hidden" name="_rev">');
            this.$el.append('<button class="addNation-btn btn btn-success" id="saveUpdatedWelcomeVideoForm">Submit</button>');
            this.$el.append('<a class="btn btn-danger" id="cancel">Cancel</a>');
        },
		saveForm: function () {

			// @todo validate 
			//if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
			// Put the form's input into the model in memory
			var previousTitle = this.model.get("title")
			var isEdit = this.model.get("_id")
			var formContext = this
			this.form.commit()

			if (this.model.get('openWith') == 'PDF.js') {
				this.model.set('need_optimization', true)
			}
			// Send the updated model to the server
			var newTitle = this.model.get("title")
			if (this.model.get("title").length == 0) {
				alert("Resource Title is missing")
			}
			else if (this.model.get("subject") == null) {
				alert("Resource Subject is missing")
			}
			else if (this.model.get("Level") == null) {
				alert("Resource Level is missing")
			}
			else if (this.model.get("Tag") == null) {
				alert("Resource Tag is missing")
			}
			else {
				if (isEdit) {
					var addtoDb = true
					if (previousTitle != newTitle) {
						if (this.DuplicateTitle()) {
							addtoDb = false
						}
					}
					if (addtoDb) {
						this.model.save(null, {
							success: function (res) {

								if ($('input[type="file"]').val()) {
									formContext.model.unset('_attachments')
									App.startActivityIndicator()
									formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

								}
								else {
									window.history.back()
								}
							}
						})
					}
				}
				else {
					if (!this.DuplicateTitle()) {
						this.model.set("sum", 0)
						this.model.set("timesRated", 0)
						this.model.save(null, {
							success: function (res) {
								if ($('input[type="file"]').val()) {
									App.startActivityIndicator()
									formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

								}
								else {
									window.history.back()
								}
							}
						})
					}
				}
			}
			this.model.on('savedAttachment', function () {
				this.trigger('processed')
			}, formContext.model)



		},
		DuplicateTitle: function () {
			var checkTitle = new App.Collections.Resources()
			checkTitle.title = this.model.get("title")
			checkTitle.fetch({
				async: false
			})
			checkTitle = checkTitle.first()
			if (checkTitle != undefined)
				if (checkTitle.toJSON().title != undefined) {
					alert("Title already exist")
					return true
				}
			return false
		},
		statusLoading: function () {
			this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
		}

	})

})