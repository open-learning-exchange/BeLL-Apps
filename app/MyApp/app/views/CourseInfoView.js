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
            console.log(this.leader.length);
            var leaderNames = "";
            var leaderEmails = "";
            var leaderPhones = "";


            for(var i = 0; i < this.leader.length; i++)
            {
                leaderNames += this.leader[i].get("firstName") + ' ' + this.leader[i].get("lastName");
                if(this.leader[i].get("email") == "" || this.leader[i].get("email") == undefined)
                {
                    leaderEmails += "-";
                }
                else
                {
                    leaderEmails += this.leader[i].get("email");
                }
                if(this.leader[i].get("phone") == "" || this.leader[i].get("phone") == undefined)
                {
                    leaderPhones += "-";
                }
                else
                {
                    leaderPhones += this.leader[i].get("phone");
                }
                if((i + 1) != this.leader.length)
                {

                    leaderNames += ", ";
                    leaderEmails += ", ";
                    leaderPhones += ", ";

                }

            }
            console.log('Information of Leader');
            this.$el.append('<tr><td>'+App.languageDict.attributes.Name+' : </td><td>' + courseInfo.name + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Levels+' : </td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Description+' : </td><td>' + courseInfo.description + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Name+' : </td><td>' + leaderNames + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Email+' : </td><td>' + leaderEmails + '</td></tr>')
            this.$el.append('<tr><td>'+App.languageDict.attributes.Leader_Phone_Number+': </td><td>' + leaderPhones + '</td></tr>')
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