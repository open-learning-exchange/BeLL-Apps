$(function () {
    App.Views.CoursesStudentsProgress = Backbone.View.extend({

        tagName: "div",
        totalRecords: null,
        startFrom: null,
        totalSpace: null,
        sresult: new Array,
        series : new Array,
        pass: 0,
        fail: 0,
        nonattempt:0,
        attemptnonReviewed:0,
        memberrecord:[],
        allmemberrecord:[],
        result:{},
        result1:{},
        ticks:[],
        data2:[],
        passpercentage:[],

        addOne: function (model) {
            temp = new Object
            dataa = model.toJSON().stepsStatus
            attemptdata = model.toJSON().pqAttempts
            data = model.toJSON().stepsStatus
            sResult = model.toJSON().stepsResult
            total = model.toJSON().stepsStatus.length
            this.totalstep = model.toJSON().stepsIds.length
            seriess = {};
            seriess.data = []
            var data = []
            this.data2 = []
            memberrecord = []; 
            dataPP = [];

            for(var i = 0; i < total; i++){
                
                this.memberrecord = []
                var coursestep = new App.Models.CourseStep({
                    _id: model.toJSON().stepsIds[i]
                })
                coursestep.fetch({
                    async: false
                })
                if(!this.result1['pp']) {
                    this.passpercentage[i] = [i,parseInt(coursestep.attributes.passingPercentage)];
                    dataPP.push({data:[this.passpercentage[i]], points: {show: true} , color: 'gray'})
                    this.ticks.push([i,coursestep.attributes.title])
                }
                if(sResult[i][attemptdata[i]] == null || sResult[i][attemptdata[i]] == undefined){
                    this.sresult = 0;
                } else {
                    this.sresult = parseInt(sResult[i][attemptdata[i]]); 
                }
                var coursestatus = parseInt(dataa[i][attemptdata[i]])
                if(parseInt(attemptdata[i]) == 0) {
                    this.nonattempt++
                } else if(dataa[i][attemptdata[i]] === null || dataa[i][attemptdata[i]] === "" || dataa[i][attemptdata[i]] === undefined){
                    this.attemptnonReviewed++
                } else if(coursestatus == 0 ){
                    this.fail++
                } else if(coursestatus == 1) {
                    this.pass++
                }
                seriess.data[i] = [i,this.sresult];

                var models = this.collection.models[i];
                var passfail = model.attributes.stepsStatus[i][model.attributes.pqAttempts[i]]
                if (model.attributes.pqAttempts[i] == 0){
                    color = 'blue';
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                } else if(passfail == null || passfail == undefined){
                    color = 'gray';
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                } else if(passfail == 0){
                    color = "red";
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                } else{
                    color = "green";
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                }

            }
            this.series.push(seriess);
            student = new App.Models.Member({
                _id: model.toJSON().memberId
            })
            student.fetch({
                async: false
            })  
            if(!this.result1['pp']) {
                this.result1['pp'] = {data:this.passpercentage};
                this.result['pp'] = dataPP
            }
            seriess.name = student.toJSON().firstName + ' ' + student.toJSON().lastName
            this.result[model.toJSON().memberId] = data
            this.result1[model.toJSON().memberId] = {data:seriess.data,label: student.toJSON().firstName + ' ' + student.toJSON().lastName};
            this.memberrecord.push([App.languageDict.attributes.Passed,this.pass,seriess.name],[App.languageDict.attributes.Failed,this.fail,seriess.name],[App.languageDict.attributes.Not_Attempt,this.nonattempt,seriess.name],[App.languageDict.attributes.Attempted_But_Not_Review,this.attemptnonReviewed,seriess.name])
            this.allmemberrecord.push(this.memberrecord);
            this.startFrom = this.startFrom + this.totalSpace
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.startFrom = 4
                this.totalRecords = this.collection.length
                this.totalSpace = 93 / this.collection.length
                this.collection.each(this.addOne, this)
            } else {
                alert(App.languageDict.attributes.No_Data_Error)
                Backbone.history.navigate('#courses', {
                    trigger: true
                })
            }
        },

        plotAccordingToChoices: function (){
            var checkcourse = [];
            checkcourse.push('pp');
            $('#choices input[type=checkbox]:checked').each(function(){
                checkcourse.push($(this).val());
            })      
            var resultdata = [];
            var i = 0;
            dt = this;
            $.each(this.result1, function(key,val) {
               var index = checkcourse.indexOf(key)
                    if (index > -1) {
                        val.color = i;
                        if(key == "pp"){
                            val.color="gray";
                        }
                        resultdata.push(val);
                        if (key && dt.result[key]) {
                            $.each(dt.result[key], function(k, v) {
                                resultdata.push(v);
                            })
                        } 
                    }  
               ++i;
            });
           
            if (resultdata.length > 0) {
                $.plot("#graph2", resultdata, {
                    axisLabels: {
                        show: true
                    },
                    yaxis: {
                        axisLabel: '<b>'+App.languageDict.attributes.Steps_Percentage+'</b>',
                        min: 0
                    },
                    xaxis: {
                       ticks: this.ticks,
                       axisLabel: '<b>'+App.languageDict.attributes.Steps+'</b>'
                    },
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    }
                });
            }
            var previousPoint = null;
            $("#graph2").unbind("plothover");
                $("#graph2").bind("plothover", function (event, pos, item) {
                    console.log(item,resultdata)
                if (item) {
                    if (previousPoint != item.datapoint) {
                        previousPoint = item.datapoint;
                        $("#tooltip").remove();
                        var seriesindex = item.seriesIndex
                        var memberindex = parseInt((seriesindex)/(dt.totalstep+1))
                        if(memberindex == 0) {
                            var lbl = '<br>'+ App.languageDict.attributes.Passing_Percentage +"<br>"
                        } else {
                            var labelindex = memberindex * (dt.totalstep + 1)
                            var lbl = resultdata[labelindex].label
                        }
                         x = item.datapoint[0], y = item.datapoint[1];
                        dt.showTooltip(item.pageX, item.pageY, lbl+'<br/>'+item.series.xaxis.ticks[x].label + " : " + y);
                    }
                } else {
                    $("#tooltip").remove();
                    previousPoint = null;            
                }

            });
        },

        showTooltip: function(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css( {
                position: 'absolute',
                display: 'none',
                top: y - 35,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#fee',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        },

        render: function () {
            this.sresult = []
            this.series = []
            this.ticks = []
            this.memberrecord = []
            this.allmemberrecord = []
            this.result1 = {}
            this.passpercentage = []
            if(this.model.get('courseLeader').indexOf($.cookie('Member._id')) == -1  &&  this.attributes.memberroles.indexOf("Manager") == -1){
                this.allView = false;
            } else {
                this.allView = true;
            }
            this.BuildString()
            dt = this;
            var choiceContainer = $("#choices");
            $.each(this.result1, function(key, val) {
                if(key != 'pp') {
                choiceContainer.append("<span class = \"spanclass\"><input type = 'checkbox' value = '" + key +
                    "' checked ='checked' id ='id" + key + "'></input>" +
                    "<label for ='id" + key + "'>"
                    + val.label + "</label></span>");
                }
            }); 
            this.plotAccordingToChoices();
            $('#choices input[type=checkbox]').click(function(){
                dt.plotAccordingToChoices();
            });
            $('.legendColorBox > div').each(function(i){
                $("#choices").find('span').eq(i).css('background-color', $(this).find('div').css('border-color'));
            });
            var label = $('<div class ="stprog_plot_color" ><b><span style ="color:green;">'+App.languageDict.attributes.Green_Point+'</span> || <span style = "color:red;">'+App.languageDict.attributes.Red_Point+'</span> || <span style = "color:blue;">'+App.languageDict.attributes.Blue_Point+'</span> || <span style = "color:gray;">'+App.languageDict.attributes.Gray_Point+'</span></b></div>'); 
            $(label).insertAfter('#graph2'); 
           
            $('#detailView').append('<a class = "btn btn-info" id = "Donut">'+App.languageDict.attributes.Birdeye_View+'</a>')
            $.jqplot('graph1', this.allmemberrecord, {
                    seriesDefaults: {
                        renderer:$.jqplot.DonutRenderer,
                        rendererOptions:{
                            sliceMargin: 3,
                            startAngle: -90,
                            showDataLabels: true,
                            dataLabels: 'value'
                        }
                    },
                    legend: { show:true, location: 'e' },
                    highlighter: {
                        formatString:'<b>%3$s</b><br/>%1$s : %2$s',
                        show: true,
                        useAxesFormatters: false,
                    }
              });
            $('#birdEye').append('<a class = "btn btn-info" id = "Bar">'+App.languageDict.attributes.Detailed_View+'</a>')
            $('#birdEye').hide();
            $('#Donut').click(function(){$("#detailView").hide();$('#birdEye').show();$('#graph2title').hide();});
            $('#Bar').click(function(){$("#birdEye").hide();$("#detailView").show();$('#graph2title').show();});
        }
    })
})
