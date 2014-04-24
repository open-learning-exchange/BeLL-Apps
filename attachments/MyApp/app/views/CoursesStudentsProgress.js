$(function () {
    App.Views.CoursesStudentsProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        totalRecords: null,
        startFrom: null,
        totalSpace: null,
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'hidden'
                document.getElementById('veticallable').style.visibility = 'hidden'
                this.$el.html('<a class="btn btn-info" id="Bar">Detailed View</a>')
                Morris.Donut({
                    element: 'graph',
                    data: [{
                        label: "Passed Steps",
                        value: this.grandpassed
                    }, {
                        label: "Remaining Steps",
                        value: this.grandremaining
                    }],
                    colors: ['#0B62A4', '#7A92A3']

                });
            },
            "click #Bar": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'visible'
                document.getElementById('veticallable').style.visibility = 'visible'

                this.$el.html('<a class="btn btn-info" id="Donut">Birdeye View</a>')
                Morris.Bar({
                    element: 'graph',
                    data: this.arrayOfData,
                    xkey: 'subject',
                    ykeys: ['passed', 'remaining'],
                    labels: ['passed', 'remaining'],
                    gridTextWeight: 900,
                    gridTextSize: 16,
                    axes: true,
                    grid: true,
                    stacked: true
                });
            }


        },


        addOne: function (model) {
            var that = this
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
            student = new App.Models.Member({
                _id: model.toJSON().memberId
            })
            student.fetch({
                async: false
            })
            console.log(student.toJSON())
            if (student.toJSON().firstName != undefined) {
                temp.name = student.toJSON().firstName
                temp.passed = passed
                temp.remaining = remaining
                this.arrayOfData.push(temp)

                var assignmentpapers = new App.Collections.AssignmentPapers()
                assignmentpapers.senderId = model.get("memberId")
                assignmentpapers.courseId = model.get("courseId")
                assignmentpapers.fetch({
                    async: false
                })
                var marginLeft = this.startFrom + (this.totalSpace / 2) - 8
                var papers = '<table style="margin-top:14px;margin-left: ' + marginLeft + '%; position:absolute ">'

                assignmentpapers.each(function (m) {
                    var attchmentURL = '/assignmentpaper/' + m.get("_id") + '/'
                    var attachmentName = ''
                    if (typeof m.get('_attachments') !== 'undefined') {
                        attchmentURL = attchmentURL + _.keys(m.get('_attachments'))[0]
                        attachmentName = _.keys(m.get('_attachments'))[0]
                    }
                    papers = papers + '<tr><td><a href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">Paper for Step No. ' + m.get("stepNo") + '</button></td></tr></a>'
                })
                papers = papers + '</table>'
                this.$el.append(papers)
                this.startFrom = this.startFrom + this.totalSpace
            }
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.startFrom = 4
                this.totalRecords = this.collection.length
                this.totalSpace = 93 / this.collection.length
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
                xkey: 'name',
                ykeys: ['passed', 'remaining'],
                labels: ['passed', 'remaining'],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5
            });
            //this.$el.append('<a class="btn btn-info" id="Donut">Birdeye View</a>')
        }

    })

})