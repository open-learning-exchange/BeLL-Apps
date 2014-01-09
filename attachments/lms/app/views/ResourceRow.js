$(function () {

    App.Views.ResourceRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function (event) {
                alert("destroying")
                this.model.destroy()
                event.preventDefault()
            },
            "click .trigger-modal": function () {
                $('#myModal').modal({
                    show: true
                })
            },
            "click .resFeedBack": function (event) {
                $('ul.nav').html($('#template-nav-logged-in').html()).hide()
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

        render: function () {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()
            /*var resourceFeedback = new App.Collections.ResourceFeedback()
      resourceFeedback.resourceId = this.model.get("_id")
      resourceFeedback.fetch({async:false})
      var averageRating = 0
      var sum = 0
      var that = this
      vars.totalRatings = resourceFeedback.length
      resourceFeedback.each(function(m){
          sum = sum + parseInt(m.get("rating"))
      })
      averageRating = Math.round(sum/resourceFeedback.length)
      if(!isNaN(averageRating)){
        this.model.set("averageRating",parseInt(averageRating))
      }
      else{
        this.model.set("averageRating",0)
      }
      this.model.on('sync',function(){
          that.$el.append(that.template(vars))      
      }) 
      this.model.save()
      */
            if (this.model.get("sum") != 0) {
                vars.totalRatings = this.model.get("timesRated")
                vars.averageRating = (parseInt(this.model.get("sum")) / parseInt(vars.totalRatings))
            } else {
                vars.totalRatings = 0
            }

            if (this.isadmin > -1) {
                vars.admn = 1
            } else {
                vars.admn = 0
            }

            this.$el.append(this.template(vars))


        },


    })

})