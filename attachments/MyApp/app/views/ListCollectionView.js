$(function () {

    App.Views.ListCollectionView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",
            "click #deleteButton":"deleteRecord",
            "click #invitationForm .bbf-form .field-IsMajor input":"nesttedHideShow"

        },
        nesttedHideShow:function(e){
        	if($("#invitationForm .bbf-form .field-IsMajor input").is(':checked'))
        	{
        		$("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'hidden')
        	}
        	else
        	{
        		$("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'visible')
        	}
        },
        hidediv: function () {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        deleteRecord: function () {
        $('.form .field-Tag select option[value=' + this.model.get("_id") + "]").remove();
        $('#'+this.model.get("_id")).parent('tr').remove()
        this.model.set({'show':false})
        this.model.save()
        location.reload()
        },
        render: function () {
            var inviteForm = this
            
		    this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
                if(this.model.get('_id')!=undefined)
                {
            		this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                	this.$el.append('<a class="btn btn-danger" id="deleteButton">Delete</button>')
            	}
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },
			setForm: function ()
			{

				// Put the form's input into the model in memory
				this.form.commit()
				var newTitle = this.model.get("CollectionName")
				var titleMatch = false
				var allres = new App.Collections.listRCollection()
				allres.fetch(
				{
					async: false
				})
				allres.each(function (m)
				{
					
					if (m.get("show")==true && newTitle == m.get("CollectionName"))
					{
						titleMatch = true
					}
				})
				if (titleMatch)
				{
					alert("Collection Name already exist")
					$('#invitationdiv').fadeOut(1000)

					document.getElementById('cont').style.opacity = 1.0
					document.getElementById('nav').style.opacity = 1.0
				}
				else
				{
					if (this.model.get('NesttedUnder') != '--Select--')
					{
						this.model.set(
						{
							'IsMajor': false
						})
					}
					else
					{
						this.model.set(
						{
							'IsMajor': true
						})
					}
					if (this.model.get('CollectionName').length > 0)
					{

						var that = this

						this.model.save(null,
						{
							success: function (m)
							{
								alert("Collection Saved Successfully")
								if (that.model.get('_id') == undefined)
								{
									if (that.model.get('NesttedUnder') == '--Select--')
									{
										if (that.model.get('IsMajor') == true)
										{
											$('.form .field-Tag select').append('<option class="MajorCategory" value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>')
										}
										else
											$('.form .field-Tag select').append('<option value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>')


									}
									else
									{
										if ($('.form .field-Tag select option[value=' + that.model.get("NesttedUnder") + "]") != null)
										{
											$('.form .field-Tag select option[value=' + that.model.get("NesttedUnder") + "]").after('<option  value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>');
										}
									}
									$('#invitationdiv').fadeOut(1000)

									document.getElementById('cont').style.opacity = 1.0
									document.getElementById('nav').style.opacity = 1.0
									setTimeout(function ()
									{
										$('#invitationdiv').hide()
									}, 1000);

									$('.form .field-Tag select').multiselect('refresh')
								}
								else
								{
									location.reload()
								}
							}
						})

					}
					else
					{
						alert("Enter collection name!")
					}

				}


			},

    })

})