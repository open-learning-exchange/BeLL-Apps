 /**
 * Created by Sadia.Rasheed on 6/30/2016.
 */
 $(function () {

     App.Views.BadgesTable = Backbone.View.extend({
         tagName: "table",
         className: "table table-striped",

         events:{

         },
         add: function () {
             var badgesRow = new App.Views.BadgesRow({
                 model: model,

             })
            // badgesRow.courseId = this.courseId
             badgesRow.render()
             this.$el.append(badgesRow.el);


         },
         addAll: function() {
             this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
            /* var courseSteps = new App.Collections.coursesteps()
             courseSteps.courseId=this.courseId;
             courseSteps.fetch({
                 async: false
             })
             console.log(this.collection);
             courseSteps.forEach(this.addOne, this)*/
           /*  for(var i=0;i<this.collection.models[i].get('stepsResult').length;i++)
             {
                var courseSteps = new App.Models.coursesteps()
                 {

                 }

            }*/
         },
         render: function () {
             this.addAll();
             //this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
             /////////////////////////////////////////

         }
     })
 })
