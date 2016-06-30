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
             badgesRow.render()
             this.$el.append(badgesRow.el);
         },

         addAll: function() {

             this.collection.forEach(this.addOne, this)
         },

         render: function () {
             this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
             this.addAll();
             /////////////////////////////////////////

         }

     })
 })