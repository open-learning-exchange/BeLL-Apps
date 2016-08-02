/**
 * Created by Sadia.Rasheed on 7/20/2016.
 */

$(function () {

    App.Views.CreditsTable = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",

        events:{
        },
        addOne: function (model) {
            var creditsRow = new App.Views.CreditsRow({
                model: model
            })
            creditsRow.courseId=this.courseId;
            creditsRow.memberId=this.memberId
            creditsRow.render()
            this.$el.append(creditsRow.el);
        },
        addAll: function() {
            this.collection.forEach(this.addOne, this)
        },
        render: function () {
            this.$el.html('<tr><th>' + 'StepNO' + '</th><th>' + 'Step Type' + '</th><th>' + 'Quiz Credits' + '</th><th>' + 'Paper Credits' + '</th><th>' + 'Status' + '</th></tr>');
            this.addAll();
        }
    })
})
