$(function () {
    App.Views.CoursesChartProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        array:new Array,
        sresult:new Array,
        series:new Array,
        maxarray:[],
        catarray:[],
        maxcount:'',
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
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
            attemptdata = model.toJSON().pqAttempts
            sResult = model.toJSON().stepsResult
            total1 = model.toJSON().stepsResult.length
            total = model.toJSON().stepsStatus.length
            totalstep =model.toJSON().stepsIds.length
            this.maxarray.push(totalstep)
            this.maxcount = Math.max.apply(Math,this.maxarray)
            seriess ={};
                seriess.data = []
                 for(var i = 0; i < total1; i++){
                    this.sresult= parseInt(sResult[i][attemptdata[i]]); 
                    seriess.data[i] = this.sresult;       
                }
            this.series.push(seriess); 
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
            course = new App.Models.Course({
                _id: model.toJSON().courseId
            })
            course.fetch({
                async: false
            })
            seriess.name = course.attributes.name
            if (total == 0) {
                temp.subject = (course.toJSON().name +' ' +App.languageDict.attributes.No_Steps)
            } else {
                temp.subject = (course.toJSON().name)
            }
            this.array.push(temp.subject)
            temp.passed = passed
            temp.remaining = remaining
            this.arrayOfData.push(temp)
            
            
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {
                alert(App.languageDict.attributes.No_Data_Error)
            }
        },

        render: function () {
            this.maxarray=[]
            this.sresult = []
            this.series =[]
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()
            for (var i = 0; i < this.maxcount; i++) {
                  this.catarray.push(i+1)
               }

            Highcharts.chart('graph2', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Individual Courses Progress'
                },
                subtitle: {
                    text: ' '
                },
                xAxis: {
                    title: {
                        text: 'Steps No'
                    },
                    categories: this.catarray
                },
                yAxis: {
                    title: {
                        text: 'Each Step Percentage %'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                series: this.series
            });

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