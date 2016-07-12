 /**
 * Created by Sadia.Rasheed on 6/30/2016.
 */
 $(function () {

     App.Views.BadgesTable = Backbone.View.extend({
         tagName: "table",
         className: "table table-striped",

         events:{
         },
         addOne: function (model) {
             var badgesRow = new App.Views.BadgesRow({
                 model: model
             })

            // badgesRow.courseId = this.courseId

             badgesRow.render()
             this.$el.append(badgesRow.el);
         },
         addAll: function() {

            /* var courseSteps = new App.Collections.coursesteps()
             courseSteps.courseId=this.courseId;
             courseSteps.fetch({
                 async: false
             })
             console.log(this.collection);*/
           //  _.each(this.collection,this.add)
             this.collection.forEach(this.addOne, this)
            // this.collection.forEach(this.addOne, this)
           /*  for(var i=0;i<this.collection.models[i].get('stepsResult').length;i++)
             {
                var courseSteps = new App.Models.coursesteps()
                 {

                 }

            }*/
         },
         render: function () {
             this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
             this.addAll();
             /////////////////////////////////////////

         }
     })
 })
