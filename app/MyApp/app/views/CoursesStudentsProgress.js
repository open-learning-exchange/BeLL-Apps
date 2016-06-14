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
            if (student.toJSON().firstName != undefined) {
                temp.name = student.toJSON().firstName
                temp.passed = passed
                temp.remaining = remaining
                temp.memberId = model.get("memberId");
                temp.courseId = model.get("courseId");
                this.arrayOfData.push(temp)

                if(this.totalRecords == 1)
                {
                    var assignmentpapers = new App.Collections.AssignmentPapers()
                    assignmentpapers.senderId = model.get("memberId")
                    assignmentpapers.courseId = model.get("courseId")
                    assignmentpapers.fetch({
                        async: false
                    })
                    var papers = '<table style="border-collapse: separate; height: 100%;" align="center"><tr>'

                    var count = 0;
                    assignmentpapers.each(function (m) {
                        var attchmentURL = '/assignmentpaper/' + m.get("_id") + '/'
                        var attachmentName = ''
                        if (typeof m.get('_attachments') !== 'undefined') {
                            attchmentURL = attchmentURL + _.keys(m.get('_attachments'))[0]
                            attachmentName = _.keys(m.get('_attachments'))[0]
                        }
                        if((count % 7) == 0)
                        {
                            papers = papers + '</tr><tr>';
                        }
                        papers = papers + '<td><a download="' + attachmentName + '" href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">'+App.languageDict.attributes.PaperForStep+' ' + m.get("stepNo") + '</button></a></td>';
                        count++;
                    })
                    papers = papers + '</tr></table>'
                    this.$el.append(papers)
                }
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
                alert(App.languageDict.attributes.No_Data_Error)
            }
        },
        render: function () {
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()

            var morris1 = Morris.Bar({
                element: 'graph',
                data: this.arrayOfData,
                xkey: 'name',
                ykeys: ['passed', 'remaining'],
                labels: [App.languageDict.attributes.Passed, App.languageDict.attributes.Remaining],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5
            });
            if(this.totalRecords != 1)
            {
                morris1.on('click', function(i, row){
                    var data = morris1.options.data[i];
                    var assignmentpapers = new App.Collections.AssignmentPapers()
                    assignmentpapers.senderId = data.memberId;
                    assignmentpapers.courseId = data.courseId;
                    assignmentpapers.fetch({
                        async: false
                    })
                    var papers = '<table style="border-collapse: separate; height: 100%;" align="center"><tr>'

                    var count = 0;
                    assignmentpapers.each(function (m) {
                        var attchmentURL = '/assignmentpaper/' + m.get("_id") + '/'
                        var attachmentName = ''
                        if (typeof m.get('_attachments') !== 'undefined') {
                            attchmentURL = attchmentURL + _.keys(m.get('_attachments'))[0]
                            attachmentName = _.keys(m.get('_attachments'))[0]
                        }
                        if((count % 7) == 0)
                        {
                            papers = papers + '</tr><tr>';
                        }
                        papers = papers + '<td><a download="' + attachmentName + '" href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">'+App.languageDict.attributes.PaperForStep+' ' + m.get("stepNo") + '</button></a></td>';
                        count++;
                    })
                    if(count == 0)
                    {
                        papers = papers + '<td>' + App.languageDict.get("No_Record_Found") + '</td>';
                    }
                    papers = papers + '</tr></table>';
                    $('.Graphbutton').html(papers);
                });
            }
        }

    })

})