$(function () {

    App.Views.CourseInfoView = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "courseInfo-table",
        initialize: function () {
            this.$el.html('<th colspan="20">'+App.languageDict.attributes.Course_Information+'</th>')
        },

        add: function (model) {
            //Single Author Should not be displayed multiple times on The Screen

        },


        render: function () {
            var courseInfo = this.model.toJSON();
            var leaderInfo = this.leader.toJSON();
            this.$el.append('<tr><td>'+App.languageDict.attributes.Name+' : </td><td>' + courseInfo.name + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Levels+' : </td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Description+' : </td><td>' + courseInfo.description + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Name+' : </td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Email+' : </td><td>' + leaderInfo.email + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Phone_Number+': </td><td>' + leaderInfo.phone + '</td></tr>')
            var bgcolor = ''
            var fgcolor = ''
            if (courseInfo.backgroundColor == '')
                bgcolor = App.languageDict.attributes.Not_Set;
            this.$el.append('<tr><td>'+App.languageDict.attributes.Background_Color+' : </td><td><div style="border:2px solid black;width:50px;height:20px;background-color:' + courseInfo.backgroundColor + '"></div>' + bgcolor + '</td></tr>')
            if (courseInfo.foregroundColor == '')
                fgcolor =App.languageDict.attributes.Not_Set;
            this.$el.append('<tr><td>'+App.languageDict.attributes.Foreground_Color+' :</td><td><div style="border:2px solid black;width:50px;height:20px;background-color:' + courseInfo.foregroundColor + '"></div>' + fgcolor + '</td></tr>')

        }

    })

})