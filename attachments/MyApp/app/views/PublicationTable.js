$(function () {

    App.Views.PublicationTable = Backbone.View.extend({
    
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        add: function (model) {
           this.$el.append('<tr><td>'+model.IssueNo+'</td><td><a name="'+model._id+'" class="synPublication btn btn-info">Sync publication</a></td><tr>')
        },
        events:{
          "click .synPublication": 'synPublication',
        },
        render: function () {
    
			this.$el.html('<tr><th stylecolspan="20"><h6>Issue Number</th></h6><th stylecolspan="20"><h6>Actions</th></h6><tr>')
			var that=this
			var DbUrl=this.Url
			   $.ajax({
					url: DbUrl,
					type: 'GET',
					dataType: "jsonp",
					success: function (json) {
					    //console.log(json)
						_.each(json.rows,function(row){
						    console.log(row)
							that.add(row.doc)						    
						})				     
					}
				})    
        },
        synPublication:function(e){
           alert('This functionality is under construction :) ')
        }

    })

})