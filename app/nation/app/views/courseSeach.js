$(function() {

    App.Views.courseSeach = Backbone.View.extend({

        className: "form",
        events: {
            "click #seachCourse": "seachCourse",
            "click #back": 'publicationdetails'
        },
        publicationdetails: function() {
            window.location.href = '#publicationdetail/' + this.publicationId
        },

        render: function() {
            var that = this
            this.$el.append('<p><h3>'+App.languageDictValue.get('Courses')+'</h3><a id="back" class="btn btn-success"> '+App.languageDictValue.get('Done')+' </a><h6 style="margin-top:-52px;float:right"><input style="margin-right:20px;height:30px;width:170px" type="text" id="SeachCourseText" placeholder="" ><a  style="margin-top: -11px; width: 60px;" class="btn btn-info" id="seachCourse" > '+App.languageDictValue.get('Search')+' </a> </h6></p>')
            this.$el.append('<div id="courseList"></div>')
            var coll = new App.Collections.Courses()
            coll.fetch({
                success: function(response) {
                    var coursesTable = new App.Views.CoursesTable({
                        collection: response
                    })
                    coursesTable.publicationId = that.publicationId
                    coursesTable.render()
                    $('#courseList').html(coursesTable.el)
                }
            })
        },
        seachCourse: function(e) {
            var that = this
            var coll = new App.Collections.Courses()
            if ($('#SeachCourseText').val() != '')
                coll.seachText = '["' + $('#SeachCourseText').val() + '"]'
            coll.fetch({
                success: function(response) {
                    var coursesTable = new App.Views.CoursesTable({
                        collection: response
                    })
                    coursesTable.publicationId = that.publicationId
                    coursesTable.render()
                    $('#courseList').html(coursesTable.el)
                }
            })
        }
    })
})