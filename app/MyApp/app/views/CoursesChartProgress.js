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
        result:{},
        result1:{},
        pass: 0,
        fail: 0,
        nonattempt:0,
        attemptnonReviewed:0,
        stepindex:0,
        resultdata:[],
        addOne: function (model) {

            temp = new Object
            dataa = model.toJSON().stepsStatus
            attemptdata = model.toJSON().pqAttempts
            sResult = model.toJSON().stepsResult
            total1 = model.toJSON().stepsResult.length
            total = model.toJSON().stepsStatus.length
            totalstep =model.toJSON().stepsIds.length
            this.maxarray.push(totalstep)         
            seriess ={};
            seriess.data = []
            var data = []
            var data2 = []
            for(var i = 0; i < total1; i++){
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
                seriess.data[i] = [(i+1).toString(),this.sresult];

                var models = this.collection.models[i];
                var passfail = model.attributes.stepsStatus[i][model.attributes.pqAttempts[i]]
                if (model.attributes.pqAttempts[i] == 0){
                    color = 'blue';
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                } else if(passfail == null || passfail == undefined){
                    color = 'gray';
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                } else if(passfail == 0){
                    color ="red";
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                } else{
                    color ="green";
                    data.push({data:[seriess.data[i]], points: {show: true} , color: color})
                }
            }
            this.series.push(seriess);
            course = new App.Models.Course({
                _id: model.toJSON().courseId
            })
            course.fetch({
                async: false
            })
            seriess.name = course.attributes.name
            this.result[model.toJSON().courseId] = data
            this.result1[model.toJSON().courseId] = {data:seriess.data,label: course.attributes.name}; 
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {
                alert(App.languageDict.attributes.No_Data_Error)
            }
        },
        plotAccordingToChoices: function (){
            var checkcourse = [];
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
                        tickDecimals: 0,
                        tickSize: 1, 
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
                        if (item) {
                            if (previousPoint != item.datapoint) {
                                previousPoint = item.datapoint;
                                $("#tooltip").remove();
                                this.seriesindex = item.seriesIndex
                                 cnt = 0;
                                for (var i = 0; i < dt.maxarray.length; i++) {
                                   cnt  += (dt.maxarray[i]+1 )

                                   if(item.seriesIndex < cnt){
                                    var labelindex = cnt - (dt.maxarray[i]+1)
                                    var lbl = resultdata[labelindex].label
                                    break;
                                   }
                                }
                                var x = item.datapoint[0], y = item.datapoint[1];
                                dt.showTooltip(item.pageX, item.pageY,lbl+'<br/>'+"Step "+x + " : " + y);
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
            this.maxarray=[]
            this.sresult = []
            this.series =[]
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.result1={}
            this.BuildString()
            dt = this;
            var choiceContainer = $("#choices");
            $.each(this.result1, function(key, val) {
                choiceContainer.append("<span class = \"spanclass\"><input type='checkbox' value = '" + key +
                    "' checked ='checked' id ='id" + key + "'></input>" +
                    "<label for ='id" + key + "'>"
                    + val.label + "</label></span>");
            }); 
            this.plotAccordingToChoices();
            $('#choices input[type=checkbox]').click(function(){
                dt.plotAccordingToChoices();
            });
            $('.legendColorBox > div').each(function(i){
                $("#choices").find('span').eq(i).css('background-color', $(this).find('div').css('border-color'));
            });
            var label = $('<div class="stprog_plot_color" ><b><span style="color:green;">'+App.languageDict.attributes.Green_Point+'</span> || <span style="color:red;">'+App.languageDict.attributes.Red_Point+'</span> || <span style="color:blue;">'+App.languageDict.attributes.Blue_Point+'</span> || <span style="color:gray;">'+App.languageDict.attributes.Gray_Point+'</span></b></div>'); 
            $(label).insertAfter('#graph2');   
            $('#detailView').append('<a class="btn btn-info" id="Donut">'+App.languageDict.attributes.Birdeye_View+'</a>')
            var data = [[App.languageDict.attributes.Passed,this.pass],[App.languageDict.attributes.Failed,this.fail],[App.languageDict.attributes.Not_Attempt,this.nonattempt],[App.languageDict.attributes.Attempted_But_Not_Review,this.attemptnonReviewed]]
            var plot1 = jQuery.jqplot ('graph1', [data], 
                    { 
                        seriesDefaults: {
                            renderer: jQuery.jqplot.PieRenderer, 
                            rendererOptions: {
                                showDataLabels: true
                            }
                        }, 
                        legend: { show:true, location: 'e' },
                        highlighter: {
                            formatString:'<b>%1$s : %2$s</b>',
                            show: true,
                            useAxesFormatters: false,
                        }
            });  
            $('#birdEye').append('<a class="btn btn-info" id="Bar">'+App.languageDict.attributes.Detailed_View+'</a>')
            $('#birdEye').hide();
            $('#Donut').click(function(){$("#detailView").hide();$('#birdEye').show();$('#graphtitle').hide();});
            $('#Bar').click(function(){$("#birdEye").hide();$("#detailView").show();$('#graphtitle').show();});
        }

    })

})