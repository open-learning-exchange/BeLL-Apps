$(function () {

    App.Views.ResourcesDetail = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyShelfItem": function (e) {
            
             var vars = this.model.toJSON()
             var rId = vars._id
             var mId=$.cookie('Member._id')
    
             var memberShelfResource=new App.Collections.shelfResource() 
             memberShelfResource.resourceId=rId
             memberShelfResource.memberId=mId          
             memberShelfResource.fetch({async:false})
             memberShelfResource.each(
             		function(e){
             			e.destroy()	
             })
             alert("Resource Successfully removed from Shelf ")
             Backbone.history.navigate('dashboard', {trigger: true})
             
            }
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>Resource Detail</h6></th>')
        },
        SetShelfId: function (s, r) {
            this.sid = s
            this.rid = r
        },
        render: function () {
            var vars = this.model.toJSON()
            console.log(vars)
            this.$el.append("<tr><td>Title</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>Subject</td><td>" + vars.subject + "</td></tr>")
            this.$el.append("<tr><td>Tag</td><td>" + vars.Tag + "</td></tr>")
            this.$el.append("<tr><td>Level</td><td>" + vars.Level + "</td></tr>")
            if (vars.author) {
                this.$el.append("<tr><td>Author</td><td>" + vars.author + "</td></tr>")
            } else {
                this.$el.append("<tr><td>Author</td><td>No Author Defined</td></tr>")
            }
            //if the model has the Attachments
            if (vars._attachments) {
                this.$el.append("<tr><td>Attachement</td><td><a class='btn open' target='_blank' href='/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id + "'>View</a></td></tr>")
            } else {
                this.$el.append("<tr><td>Attachement</td><td>No Attachment</td></tr>")
            }	
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyShelfItem">Remove</button></td></tr>')

        },

    })

})