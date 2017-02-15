$(function () {
    App.Views.CoursesStudentsProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        membername: new Array,
        grandpassed: null,
        grandremaining: null,
        totalRecords: null,
        startFrom: null,
        totalSpace: null,
        sstatus: new Array,
        sresult: new Array,
        sname : new Array,
        series : new Array,
        data: new Array,
        series1 : new Array,
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
            attemptdata = model.toJSON().pqAttempts
            data = model.toJSON().stepsStatus
            sResult = model.toJSON().stepsResult
            total = model.toJSON().stepsStatus.length
            passed = 0
            remaining = 0
            for (var i = 0; i < total; i++) {
                if ((!$.isArray(data[i])) && data[i] != "1") {
                    remaining++
                    this.grandremaining++
                } else if($.isArray(data[i])) {
                    if(data[i][0] == "1" && data[i][1] == "1") {
                        passed++
                        this.grandpassed++
                    }
                    else {
                        remaining++
                        this.grandremaining++
                    }

                }else {
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
                temp.name = student.toJSON().firstName + ' ' + student.toJSON().lastName
                temp.passed = passed
                temp.remaining = remaining
                temp.memberId = model.get("memberId");
                temp.courseId = model.get("courseId");
                this.arrayOfData.push(temp)
                this.membername.push(student.toJSON().firstName + ' ' + student.toJSON().lastName)
         console.log(this.membername);
           for(var i = 0; i < total; i++){
            if(!this.sstatus[i] && !this.sresult[i]){
                this.sstatus[i] =[]
                this.sresult[i] =[]
            }
            this.sstatus[i].push(parseInt(data[i][attemptdata[i]]));  
            this.sresult[i].push(parseInt(sResult[i][attemptdata[i]]));
            }
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
                            if((count % 7) == 0)
                            {
                                papers = papers + '</tr><tr>';
                            }
                            papers = papers + '<td><a download="' + attachmentName + '" href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">'+App.languageDict.attributes.DownloadPaperForStep+' ' + m.get("stepNo") + '</button></a></td>';
                            count++;
                        }
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
            this.membername = []
            this.sstatus = []
            this.sresult = []
            this.series= []
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()
            var courseStep = new App.Collections.coursesteps()
            courseStep.courseId = this.collection.courseId
            courseStep.fetch({
                async: false
            })
            console.log(courseStep)
             for(var i = 0; i < courseStep.length; i++){
                var stepName = courseStep.models[i];
                seriesResult = {};
                seriesResult.name = stepName.attributes.title;
                seriesResult.type = 'bar';
                seriesResult.yAxis = 1;
                seriesResult.data = this.sresult[i];
                seriesResult.tooltip = {'valueSuffix': '%'}
                seriess = {};
                seriess.name = stepName.attributes.title + '(Status)';
                seriess.type = 'spline';
                seriess.yAxis = 0;
                seriess.data = this.sstatus[i];
                //seriess.data = [[1,1], [0,1]];
               this.series.push(seriesResult); 
               this.series.push(seriess); 
            } 
             Highcharts.chart('graph1', {
                chart: { 
                    zoomType: 'xy'
                },
                title: {
                    text: 'Progress of individual steps and pass/fail results'
                },
                subtitle: {
                    text: 'Progress Barchart'
                },
                xAxis: [{
                    categories: this.membername,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    min: -1,
                    max: 1,
                    labels: {
                         overflow: 'justify'
                    },
                    title: {
                        text: 'Pass/Fail',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    min:0,
                    max: 100,
                    title: {
                        text: 'Steps Percentage',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        overflow: 'justify'
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 450,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: this.series

            });

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
                            if((count % 7) == 0)
                            {
                                papers = papers + '</tr><tr>';
                            }
                            papers = papers + '<td><a download="' + attachmentName + '" href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">'+App.languageDict.attributes.DownloadPaperForStep+' ' + m.get("stepNo") + '</button></a></td>';
                            count++;
                        }
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