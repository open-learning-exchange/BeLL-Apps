$(function () {

    App.Views.PublicationForm = Backbone.View.extend({

        className: "form",
        events: {
            "click .save": "saveForm",
            "click #AddResPublication":"searchres",
            "click #AddCoursePublication":"listCourses",
            "click #cancel": function () {
              window.location.href='#publication'
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function () {
            var vars = {}

            // prepare the header

            if (_.has(this.model, 'id')) {

                vars.header = 'Publication Issue : "' + this.model.get('IssueNo') + '"'
                
            } else {
                vars.header = 'New Publication Issue'
                
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            vars.form = ""
            vars.rlength=this.rlength
            this.form.render()
            this.$el.html(this.template(vars))
            $('.fields').html(this.form.el)
            $('.form .field-resources').hide();
            $('#progressImage').hide();
            return this
        },

        saveForm: function () {
            var isEdit = this.model.get("_id")
            var addtoDb=true
            this.form.commit()
            if (this.model.get("IssueNo")==undefined) {
                alert("Publication Issue is missing")
            } 
           
            else if(this.rlength <= 0)
            {
            	alert("Please add resource('s)")
            }
            else {
                 if (isEdit == undefined) {
                   
                    var that = this
                    var allres = new App.Collections.Publication()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function (m) {
                        if (that.model.get("IssueNo") == m.get("IssueNo")) {
                            alert("IssueNo already exist")
                            addtoDb = false
                        }
                    })
                }
                
                if (addtoDb) {
                    alert("Issue Saved!")
                    window.location.href='#publication'
                }
            }

        },
		searchres:function(){
		  var showsearch=true
		  var isEdit = this.model.get("_id")
		  this.form.commit()
		  this.model.set({"kind":'ResourcePublication'})
		  console.log(this.model.toJSON())
		  if (this.model.get("IssueNo")==undefined) {
                alert("Publication Issue is missing")
                showsearch=false
            }
            else {
                 if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.issue=this.model.get("IssueNo")
                    allpub.fetch({
                        async: false
                    })
                    allpub=allpub.first()
                    if(allpub!=undefined)
                    if (allpub.toJSON().IssueNo!=undefined) {
                    alert("IssueNo already exist")
                    showsearch=false
                    }
                  
                }
            }
            if(showsearch)
            {
            		this.model.save(null,{success:function(e){
		 				 window.location.href = '../MyApp/index.html#search-bell/'+e.toJSON().id;
		 				 }
		  			})
		  
            		
            }
		},
		listCourses: function()
		{
		  var showcourse=true
		  var myCourses=new Array()
		  var isEdit = this.model.get("_id")
		  this.form.commit()
		  this.model.unset("resources", { silent: true });
		  this.model.set({"courses":myCourses})
		  this.model.set({"kind":'CoursePublication'})
		  console.log(this.model.toJSON())
		  if (this.model.get("IssueNo")==undefined) {
                alert("Publication Issue is missing")
                showcourse=false
            }
            else {
                 if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.issue=this.model.get('IssueNo')
                    allpub.fetch({
                        async: false
                    })
                     allpub=allpub.first()
                    if(allpub!=undefined)
                    if (allpub.toJSON().IssueNo!=undefined) {
                    alert("IssueNo already exist")
                    showcourse=false
                    }
                  
                }
            }
            if(showcourse)
            {
            		this.model.save(null,{success:function(e){
		 				 window.location.href = '../MyApp/index.html#courses/'+e.toJSON().id;
		 				 }
		  			})
		  
            		
            }
		},
        statusLoading: function () {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})