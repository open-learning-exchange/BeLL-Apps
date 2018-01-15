$(function() {

    App.Views.PublicationCoursesTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {

        },
        addOne: function(model) {
            var publicationCourseRowView = new App.Views.PublicationCourseRow({
                model: model
            })
            publicationCourseRowView.Id = this.Id
            publicationCourseRowView.render()
            this.$el.append(publicationCourseRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>'+App.languageDictValue.get('Title')+'</th><th colspan="2" width="30%">'+App.languageDictValue.get('Actions')+'</th></tr>')
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2">'+App.languageDictValue.get('No_Course_Pub')+'<td></tr>')

            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})