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


         },
         render: function () {
             this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
         }
     })
 })
