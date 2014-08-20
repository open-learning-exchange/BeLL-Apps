var searchText = "";
var skip = 0;    //Variable used to skip the number of records been fetched before.
var enablenext=0;
var searchRecordsPerPage = 2;
var limitofRecords = 5;
var skipStack = new Array()
var ratingFilter = new Array();
var rtitle = new Array() ;
var rids = new Array() ; 
var numberOfNotificattions="."
 url="unknown";
var lastpage = false
var mailView;

function SyncDbSelect(){
    App.Router.SyncDbSelect()
}
function showFeedbackForm(){
	  App.renderFeedback()
		if(document.getElementById('site-feedback').style.visibility!='visible'){
		$('#site-feedback').animate({height:'320px'})
		document.getElementById('site-feedback').style.visibility='visible'
		}
		else{
		$('#site-feedback').animate({height:'toggle'})
		}
}
function sendAdminRequest(courseLeader,courseName,courseId){

		var currentdate = new Date();
		var mail = new App.Models.Mail();
		mail.set("senderId",$.cookie('Member._id'));
		mail.set("receiverId",courseLeader);
		mail.set("subject","Course Admission Request | " + decodeURI(courseName));
		mail.set("body",'Admission request recieved from user \"' + $.cookie('Member.login') + '\" in ' +decodeURI( courseName) + ' <br/><br/><button class="btn btn-primary" id="invite-accept" value="' + courseId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + courseId + '" >Reject</button>');
		mail.set("status","0");
		mail.set("type","admissionRequest");
		mail.set("sentDate",currentdate);
		mail.save()
		$('#admissionButton').hide()
		alert("Admission request successfully sent to this course leader.")
		

}

function searchResources()
{
	skip = 0;
        popAll();
	lastpage = false;
        App.Router.SearchResult();
         $('#previous_button').remove()
	$('#searchText').focus();
	$("#searchText").val(searchText)
}
function popAll()
{
      while(skipStack.length > 0 )
      {
            skipStack.pop();        
      }
}

function onFocus(obj) { 
      var end = obj.value.length; 
      if(obj.setSelectionRange) 
      obj.setSelectionRange(end, end); 
}
function showComposePopupMultiple(email)
{ 
    $("#subject").val("")
	$("#recipients").val("")
    $("#mailbodytexarea").val("")
    
    var multipalMembers=new Array()
    $("input[name='courseMember']").each(function () {
                if ($(this).is(":checked")) {
                    multipalMembers.push($(this).val());
                }
            })        
    console.log(multipalMembers)
   // if(email)
    $('#recipients').val(multipalMembers)
    showComposePopup()
    
    
}
function hideMail(){}

function showComposePopup()
{
	$('#emailCompose').popup({
        horizontal: 'right',
        vertical: 'bottom',
        background : false,
        blur : false,
        scrolllock : true

    });
	$('#emailCompose').popup('show');
}
function HandleBrowseClick(stepId)
{
   var fileinput = document.forms["fileAttachment"+stepId]["_attachments"]
    fileinput.click();
}
function FieSelected(stepId)
{
	var courseId = document.getElementById("courseId"+stepId).value;
	var stepTitle = document.getElementById("stepTitle"+stepId).value;
	var stepNo = document.getElementById("stepNo"+stepId).value;
	
	var courseModel = new App.Models.Group()
    courseModel.set('_id', courseId)
    courseModel.fetch({
    	async: false
    })
    if(!courseModel.get("courseLeader"))
    {
    	return
    }
	var img = $('input[type="file"]')
	var extension = img.val().split('.')
	if(img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt'
			&& extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' 
				&& extension[(extension.length - 1)] != 'png')
	{
		alert("Invalid attatchment.")
		return;
	}
	var currentdate = new Date();
	var mail = new App.Models.Mail();
	mail.set("senderId",$.cookie('Member._id'));
	mail.set("receiverId",courseModel.get("courseLeader"));
	mail.set("subject","Assignment | " + courseModel.get("name") );
	mail.set("body","Assignment submited for <b>" + stepTitle + '</b>.');
	mail.set("status","0");
	mail.set("type","mail");
	mail.set("sentDate",currentdate);
	mail.save()
	var assignmentpaper = new App.Models.AssignmentPaper();
	assignmentpaper.set("sentDate",currentdate);
	assignmentpaper.set("senderId",$.cookie('Member._id'));
	assignmentpaper.set("courseId",courseId);
	assignmentpaper.set("stepId",stepId);
	assignmentpaper.set("stepNo",stepNo);
	assignmentpaper.save(null, {
        	success: function () {   	
            	//assignmentpaper.unset('_attachments')
                if ($('input[type="file"]').val()) {
                	assignmentpaper.saveAttachment("form#fileAttachment"+stepId, "form#fileAttachment"+ stepId +" #_attachments", "form#fileAttachment"+ stepId +" .rev")
               	} 
               	else {
               		////no attachment
               		 alert('no attachment')
                }
                assignmentpaper.on('savedAttachment', function () {
                	/////Attatchment successfully saved
                	alert("Assignement successfully submitted.")
                }, assignmentpaper)
                	
        }
	})
}
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
function sendMail()
{
	var configurations=Backbone.Collection.extend({
		url: App.Server + '/configurations/_all_docs?include_docs=true'
   	})
   	var config=new configurations()
    config.fetch({async:false})
    var currentConfig=config.first()
    var cofigINJSON=currentConfig.toJSON()
   var scode = cofigINJSON.rows[0].doc.code + cofigINJSON.rows[0].doc.nationName.substring(3,5)
	var attachment = true
	var rec = $("#recipients").val()
	var invalidEmails = new Array()
	var invalidIndex = new Array()
	var mailingList =new Array()
	mailingList=rec.split(',')
	
	for(var i=0; i<mailingList.length ; i++)
	{
		var mailadd = mailingList[i]
	    
		if(validateEmail(mailadd))
		{	
			if(mailadd!="mycommunity@olebell.org")
			{
			    
				var temp = (mailadd.split('@')[0]).split('.')
				 
				if(temp.length>0)
				{
					var code = temp[temp.length-1]
					
				  console.log(scode+"    "+code)
					
					if(code==scode && mailadd.split('@')[1]=='olebell.org')
					{
					//alert('valid mail')
						///valid email address
					}
					else
					{
						invalidEmails.push(mailadd)
						invalidIndex.push(i)
					}
				}
				else
				{
					invalidIndex.push(i)
					invalidEmails.push(mailadd)
				}
			}
		}
		else
		{
			invalidIndex.push(i)
			invalidEmails.push(mailadd)
		}
	}
	for(var i=0 ; i<invalidIndex.length ; i++)
	{
		mailingList.splice(invalidIndex[i],1)
	}
	
	var subject = $("#subject").val();
	var mailBody = $("textarea#mailbodytexarea").val();
	var img = $('input[type="file"]')
	if(!img.val())
	{
		attachment = false
	}
	else
	{
		var extension = img.val().split('.')
	}
	if(rec=="" )
	{
		alert("Please enter recipient.");
	}
	else if(subject=="")
	{
		alert("Please enter subject.");
	}
	else if(mailBody=="")
	{
		alert("Please enter message.");
	}
	else if(attachment && img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt'
			&& extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' 
				&& extension[(extension.length - 1)] != 'png')
	{
		alert("Invalid attatchment.")
	}
	else
	{
		//alert(invalidEmails + ' are invalid email addresses.')
		
		if(mailingList.length<=0)
		{
			return 
		}
	    var mailId='' 
	   	if(mailingList.indexOf('mycommunity@olebell.org')!=-1)
		{
				var members = new App.Collections.Members()
				members.fetch({async:false})
				members.each(function(member) {
					mailId = member.get('login')
					sendSingleMail(mailId,mailBody,subject,mailingList)
    			});
    			alert("Mail successfully send.")
				return
		}
		for(var i=0;i<mailingList.length;i++)
		{
	    	if(mailingList[i].indexOf('@olebell.org')!=-1)
		 	{
		 		var names=mailingList[i].split(".")
		 		console.log(names[0])
				mailId=names[0]
		 	}
		 	else{
		   		mailId=mailingList[i]
		 	}
	     	sendSingleMail(mailId,mailBody,subject,mailingList)
		
	   }
	   alert("Mail successfully send.")
	   $('#MakeMailForMembers').popup('hide');
	}

}
function sendSingleMail(mailId,mailBody,subject,mailingList)
{
  $.getJSON('/members/_design/bell/_view/MembersByLogin?include_docs=true&key="' + mailId + '"', function(response) {
      		if(response.rows[0]){
      			var currentdate = new Date();
      			var id = response.rows[0].doc._id
      			var mail = new App.Models.Mail();
      			mail.set("senderId",$.cookie('Member._id'));
      			mail.set("receiverId",id);
      			mail.set("subject",subject);
      			mail.set("body",mailBody);
      			mail.set("status","0");
      			mail.set("type","mail");
      			mail.set("sentDate",currentdate);
      			mail.set('mailingList',mailingList);
      			//console.log(mail)
      			$('#emailCompose').popup('hide');
      			
      			mail.save(null, {
                	success: function () {   	
                    	mail.unset('_attachments')
                        if ($('input[type="file"]').val()) {
                        	mail.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                       	} 
                       	else {
                       		////no attachment
                        }
                        mail.on('savedAttachment', function () {
                        	/////Attatchment successfully saved
                        }, mail)
                        	
                }
     		})
      		$('#emailCompose').popup('hide');
      		
      		}
      		else
      		{
      			alert("Invalid mail address"+mailId)
      		}

		});

}
function getScheduleDatesForCourse(startDate,endDate,days)
{
	//startDate = new Date(2008, 2, 4);
	//endDate = new Date(2009, 2, 4);
	//var days = new Array(1,2,3)
	//alert(startDate + ' ' +endDate + ' ' +days)
	var day = startDate.getDay() ;
	var scheduleDates = new Array();
	while(startDate<endDate || startDate.valueOf()==endDate.valueOf())
	{
		day = startDate.getDay() ;	
		var tempDate =new Date(startDate.valueOf()) ;
		for(var i=0; i<days.length ; i++)
		{
			if(day<=days[i])
			{
				var t = startDate.getDate()+(days[i]-day)
				tempDate.setDate(t)
				//alert(day + ' ' + days[i] + ' ' + t + ' ' + tempDate)
				if(tempDate<endDate || tempDate.valueOf()==endDate.valueOf())
				{
					var sdate = new Date(tempDate.valueOf())
					scheduleDates.push(sdate)
				}
				else
				{
					//endDate.setHours(tempDate.getHours())
					if(tempDate.valueOf()==endDate.valueOf())
					{
						var sdate = new Date(tempDate.valueOf())
						scheduleDates.push(sdate)
					}
					else
					{
						break;
					}
				}
			}
		}
		startDate.setDate(startDate.getDate()+(7-startDate.getDay()))
	}
	return scheduleDates;
	
}
function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    return hours;
    if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
}
$(window).scroll(function () {
  var $menu = $('#addEvent'),
      scrollpos = $(window).scrollTop();
  if (scrollpos >= 118) {
      $menu.css( {
        "top" : "0",
        "position": "fixed",
      });
  } else {
      $menu.css( {
        "position": "fixed",
        "top" : "68px",
      });
  }
});


function startRecording()
{
	var that=this
	var mediaConstraints = { audio: true };
            var adio;
            navigator.getUserMedia_ = (   navigator.getUserMedia
                           || navigator.webkitGetUserMedia 
                           || navigator.mozGetUserMedia 
                           || navigator.msGetUserMedia);

			if ( !! navigator.getUserMedia_) {
    			//navigator.getUserMedia_('video', successCallback, errorCallback);
            	navigator.getUserMedia_(mediaConstraints, onMediaSuccess, onMediaError);
			}

            function onMediaSuccess(stream) {
                var audio = document.createElement('audio');
                audio = mergeProps(audio, {
                    controls: true,
                    src: URL.createObjectURL(stream)
                });
                audio.volume = 0;
                audio.play();

                audiosContainer.appendChild(audio);
                audiosContainer.appendChild(document.createElement('hr'));

                var mediaRecorder = new MediaStreamRecorder(stream);
                adio = mediaRecorder;
                mediaRecorder.mimeType = 'audio/wav';
                
                mediaRecorder.ondataavailable = function(blob) {
    				  stopButtonPressed(blob);  // list the audio and stop
                };

                // get blob after each 20 second!
                mediaRecorder.start(20 * 1000);
                
                alert('You have 20 seconds')
            }

            function onMediaError(e) {
                console.error('media error', e);
            }
			function stopButtonPressed(blob)
			{ 
			     var a = document.createElement('a');
                    a.target = '_blank';
                    a.innerHTML = 'Listen Recording ' + (index++);
					a.style.color = 'black';
                    a.href = URL.createObjectURL(blob);

                    audiosContainer.appendChild(a);
                    audiosContainer.appendChild(document.createElement('hr'));
                    
				var audioPlayer = document.getElementsByTagName('audio')[0];
    			    audioPlayer.pause();
               alert('stoped')
			}
            var audiosContainer = document.getElementById('audios-container');
            var index = 1;
}
function addToshelf(rId,title){
     App.Router.AddToshelf(rId,title)
  }
  function showSubjectCheckBoxes()
  {
    var subjects = ['Agriculture','Arts','Business and Finance','Food and Nutrition','Geography','Health and Medicine','History','Human Development','Languages','Law','Learning','Literature','Math','Music','Politics and Government','Reference','Religion','Science','Social Sciences','Sports','Technology'];
  	var length = subjects.length;
  	var htmlString = "<label style='font-size:16px'><b>Subject</b></label><br>" ;
  	    htmlString += "<select id='multiselect-subject-search' multiple='multiple' style='width: 370px;'>" ; 
  	for(var i=0 ; i<length ; i++)
  	{	
  		htmlString = htmlString + '<option id="subject' + (i+1) + '" value="' + subjects[i] +'">'+subjects[i]+'</option>' ;    
  	}
  	   htmlString+='</select>'
  	$("#SubjectCheckboxes").html(htmlString);
 
  }
  function ResourceSearch() {
      // alert('in resource search function ')
      
     skip = 0;
  	 searchText = $("#searchText").val()
  	 searchType= $('#searchtype').val()
      
        var collectionFilter=new Array()
        var subjectFilter=new Array()
        var levelFilter=new Array()
        var languageFilter=new Array()
         ratingFilter.length=0   
        skipStack.push(skip)
            
        collectionFilter=$("#multiselect-collections-search").val()
        subjectFilter=$("#multiselect-subject-search").val()
        levelFilter=$("#multiselect-levels-search").val()
		languageFilter=$("#Language-filter").val()
		authorName=$('#Author-name').val()
		
		mediumFilter=$('#multiselect-medium-search').val()
           $("input[name='star']").each(function () {
                if ($(this).is(":checked")) {
                    ratingFilter.push($(this).val());
                }
            })

            if (searchText != "" || (collectionFilter) || (subjectFilter) || (levelFilter) || (languageFilter) || (authorName)|| (mediumFilter) || (ratingFilter && ratingFilter.length > 0)) {
              // alert('in search')
                
                var search = new App.Views.Search()
                
                search.collectionFilter = collectionFilter
                search.languageFilter = languageFilter
                search.levelFilter = levelFilter
                search.subjectFilter = subjectFilter
                search.ratingFilter = ratingFilter
                search.mediumFilter = mediumFilter
                search.authorName = authorName
                
                search.addResource = false
                
                App.$el.children('.body').html(search.el)
                search.render()
                
                
                $("#srch").show()
                $(".row").hide()
                $('#not-found').show()
          
                $(".search-bottom-nav").hide()
                $(".search-result-header").hide()
                $("#selectAllButton").hide()
                
            }
    
    }
 function backtoSearchView()
  {
     $('#not-found').hide()
     searchText=''
     App.Router.bellResourceSearch();
  
  }
  function changeRatingImage(checkID,count)
	{
		//alert($('#' + checkID + 1).attr('src'));
		var imgName = "";
		if($('#' + checkID + 1).attr('src')=="star-on.png")
		{
			imgName = "star-off.png";
		}
		else
		{
			imgName = "star-on.png";
		}
		for(var i=1 ; i<=5 ; i++)
		{
			$('#' + checkID + i).attr('src', imgName);
		}
	}
function showRequestForm(modl){
	  App.renderRequest(modl)
  }
  function showSearchView()
  {
  	 $('#not-found').hide()
      App.Router.SearchBell(grpId,levelrevId,0);

  }
 function selectAllSearchResult()
  {
      $("input[name='result']").each( function () {
		$(this).prop('checked', true);
      })
  }  
  
  function CourseSearch()
  {
    //alert("COURSE SEARCH");
    skip = 0;
  	searchText = $("#searchText").val();
    App.Router.GroupSearch();
  }
  function ListAllCourses()
  {
     App.Router.Groups()
  }
function AddColletcion()
  {
    App.Router.AddNewSelect("Add New")
  }
 function EditColletcion(value)
  {
  App.Router.EditTag(value)
  } 
  function continueMerging(){
  
     var collections=$('#selectCollections').val()
     var collectionText=$('#collectionName').val()
     
     if(collections)
     {
        if(collections.length <2)
          alert('Please select 2 or more than 2 items to merge')
        else if(collectionText=="")
          alert('Collection Name can not be Empty')
        else
         App.Router.mergecollection(collections,collectionText)
     }
     else
       alert('Please Select Collections to Merge')
     
  }
  function cancelMerging(){
  
  
  document.getElementById('cont').style.opacity = 1
                document.getElementById('nav').style.opacity = 1
                $('#invitationdiv').hide()
  } 