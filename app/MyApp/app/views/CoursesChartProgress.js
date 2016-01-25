$(function () {
    App.Views.CoursesChartProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
                //document.getElementById('horizontallabel').style.visibility = 'hidden'
               // document.getElementById('veticallable').style.visibility = 'hidden';
                document.getElementById('infoAboutGraph').style.visibility = 'hidden';
                this.$el.html('<a class="btn btn-info" id="Bar">'+App.languageDict.attributes.Detailed_View+'</a>')
                Morris.Donut({
                    element: 'graph',
                    data: [{
                        label: App.languageDict.attributes.Passed+' '+App.languageDict.attributes.Steps,
                        value: this.grandpassed
                    }, {
                        label:App.languageDict.attributes.Remaining+' '+App.languageDict.attributes.Steps,
                        value: this.grandremaining
                    }],
                    colors: ['#0B62A4', '#7A92A3']

                });
            },
            "click #Bar": function () {
                $('#graph').html(' ')
               // document.getElementById('horizontallabel').style.visibility = 'visible'
               // document.getElementById('veticallable').style.visibility = 'visible'
                document.getElementById('infoAboutGraph').style.visibility = 'visible';
                this.$el.html('<a class="btn btn-info" id="Donut">'+App.languageDict.attributes.Birdeye_View+'</a>')
                Morris.Bar({
                    element: 'graph',
                    data: this.arrayOfData,
                    xkey: 'subject',
                    ykeys: ['passed', 'remaining'],
                    labels: [App.languageDict.attributes.Passed, App.languageDict.attributes.Remaining],
                    gridTextWeight: 900,
                    gridTextSize: 16,
                    axes: true,
                    grid: true,
                    stacked: true
                });
            }


        },


        addOne: function (model) {
            temp = new Object
            data = model.toJSON().stepsStatus
            total = model.toJSON().stepsStatus.length
            passed = 0
            remaining = 0
            for (var i = 0; i < total; i++) {
                if (data[i] != "1") {
                    remaining++
                    this.grandremaining++
                } else {
                    passed++
                    this.grandpassed++
                }
            }
            course = new App.Models.Group({
                _id: model.toJSON().courseId
            })
            course.fetch({
                async: false
            })
            if (total == 0) {
                temp.subject = (course.toJSON().name +' ' +App.languageDict.attributes.No_Steps)
            } else {
                temp.subject = (course.toJSON().name)
            }

            temp.passed = passed
            temp.remaining = remaining
            this.arrayOfData.push(temp)
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {
                alert("No Data Found on Server")
            }
        },

        render: function () {
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()

            Morris.Bar({
                element: 'graph',
                data: this.arrayOfData,
                xkey: 'subject',
                ykeys: ['passed', 'remaining'],
                labels: [App.languageDict.attributes.Passed, App.languageDict.attributes.Remaining],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5


            });
            this.$el.append('<a class="btn btn-info" id="Donut">'+App.languageDict.attributes.Birdeye_View+'</a>')
        }

    })

})