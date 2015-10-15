$(function(){App.Models.App=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/apps/"+this.id+"?rev="+this.get("_rev"):App.Server+"/apps/"+this.id;else var a=App.Server+"/apps";return a}})}),$(function(){App.Models.Assignment=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/assignments/"+this.id+"?rev="+this.get("_rev"):App.Server+"/assignments/"+this.id;else var a=App.Server+"/assignments";return a},defaults:{kind:"Assignment"}})}),$(function(){App.Models.AssignmentPaper=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/assignmentpaper/"+this.id+"?rev="+this.get("_rev"):App.Server+"/assignmentpaper/"+this.id;else var a=App.Server+"/assignmentpaper";return a},schema:{sednerId:"Text",courseId:"Text",stepId:"Text",sentDate:"Text",stepNo:"Text"},saveAttachment:function(a,b,c){var d=App.Server,e="assignmentpaper",f=this.get("_id")?this.get("_id"):this.get("id"),g=this;$.couch.db(e).openDoc(f,{success:function(b){_.has(b,"_attachments")?$.ajax({url:"/assignmentpaper/"+b._id+"/"+_.keys(b._attachments)[0]+"?rev="+b._rev,type:"DELETE",success:function(b,h,i){b=JSON.parse(b),$(c).val(b.rev),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})}}):($(c).val(g.get("rev")),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}}))},error:function(b){$.couch.db(e).saveDoc({_id:f},{success:function(b){$(c).val(b.rev),$(a).ajaxSubmit({url:"/"+e+"/"+f,success:function(a){console.log("file submitted successfully!"+a),g.trigger("savedAttachment")}})}})}})}})}),$(function(){App.Models.Calendar=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/calendar/"+this.id+"?rev="+this.get("_rev"):App.Server+"/calendar/"+this.id;else var a=App.Server+"/calendar";return a},schema:{title:{title:"Event Name",validators:["required"]},description:{type:"TextArea",title:"Event description",validators:["required"]},startDate:"Text",endDate:"Text",startTime:"Text",endTime:"Text",userId:{validators:["required"],type:"Hidden"},url:{type:"Hidden"}}})}),$(function(){App.Models.CollectionList=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/collectionlist/"+this.id+"?rev="+this.get("_rev"):App.Server+"/collectionlist/"+this.id;else var a=App.Server+"/collectionlist";return a},defaults:{kind:"CollectionList",IsMajor:!0,show:!0},schema:{CollectionName:"Text",Description:"TextArea",NesttedUnder:{title:"Nested Under",type:"Select",options:["--Select--"]},AddedBy:"Text",AddedDate:"Text"}})}),$(function(){App.Models.Community=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/community/"+this.id+"?rev="+this.get("_rev"):App.Server+"/community/"+this.id;else var a=App.Server+"/community";return a},defaults:{kind:"Community"},schema:{community_code:{type:"Text",validators:["required"]},nationName:{type:"Text",validators:["required"]},nationUrl:{type:"Text",validators:["required"]}}})}),$(function(){App.Models.CommunityReport=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/communityreports/"+this.id+"?rev="+this.get("_rev"):App.Server+"/communityreports/"+this.id;else var a=App.Server+"/communityreports";return a},defaults:{kind:"CommunityReport"},schema:{title:"Text",author:"Text",Date:"Date"},saveAttachment:function(a,b,c){var d=App.Server,e="communityreports",f=this.get("_id")?this.get("_id"):this.get("id"),g=this;$.couch.db(e).openDoc(f,{success:function(b){_.has(b,"_attachments")?$.ajax({url:"/communityreports/"+b._id+"/"+_.keys(b._attachments)[0]+"?rev="+b._rev,type:"DELETE",success:function(b,h,i){b=JSON.parse(b),$(c).val(b.rev),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})}}):($(c).val(g.get("rev")),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){alert("Successfully Saved!"),g.trigger("savedAttachment"),Backbone.history.navigate("reports",{trigger:!0})},error:function(a){alert("Error")}}))},handleError:function(a,b,c,d){a.error&&a.error.call(a.context||window,b,c,d),a.global&&(a.context?jQuery(a.context):jQuery.event).trigger("ajaxError",[b,a,d])},error:function(b){$.couch.db(e).saveDoc({_id:f},{success:function(b){alert("error success"),$(c).val(b.rev),$(a).ajaxSubmit({url:"/"+e+"/"+f,success:function(a){console.log("file submitted successfully"),g.trigger("savedAttachment")}})}})}})}})}),$(function(){App.Models.CommunityReportComment=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/communityreports/"+this.id+"?rev="+this.get("_rev"):App.Server+"/communityreports/"+this.id;else var a=App.Server+"/communityreports";return a},defaults:{kind:"CommunityReportComment"},schema:{CommunityReportId:"Text",commentNumber:"Text",comment:"TextArea",memberLogin:"Text",time:"Text"}})}),$(function(){App.Models.Configuration=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/configurations/"+this.id+"?rev="+this.get("_rev"):App.Server+"/configurations/"+this.id;else var a=App.Server+"/configurations";return a},schema:{name:{type:"Text",validators:["required"]},code:{type:"Text",validators:["required"]},type:{type:"Select",options:["community","nation"],validators:["required"]},region:"Text",nationName:{type:"Text",validators:["required"]},nationUrl:{type:"Text",validators:["required"]},version:{type:"Text"},notes:{type:"Text"},selectLanguage:{type:"Select",options:["Select an Option","Arabic","Asante","Chinese","English","Ewe","French","Hindi","Kyrgyzstani","Nepali","Portuguese","Punjabi","Russian","Somali","Spanish","Swahili","Urdu"]},currentLanguage:{type:"Text"}}})}),$(function(){App.Models.CourseInvitation=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/courseinvitations/"+this.id+"?rev="+this.get("_rev"):App.Server+'/courseinvitations/_design/bell/_view/getByCourseId?key="'+this.courseId+'"&include_docs=true ';else var a=App.Server+"/courseinvitations";return a},defaults:{kind:"CourseInvitation"},schema:{courseId:"Text",userId:"Text",status:"Text"}})}),$(function(){App.Models.CourseSchedule=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/courseschedule/"+this.id+"?rev="+this.get("_rev"):App.Server+'/courseschedule/_design/bell/_view/ScheduleByCourseId?key="'+this.courseId+'"&include_docs=true ';else var a=App.Server+"/courseschedule";return a}})}),$(function(){App.Models.CourseStep=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/coursestep/"+this.id+"?rev="+this.get("_rev"):App.Server+"/coursestep/"+this.id;else var a=App.Server+"/coursestep";return a},defaults:{kind:"Course Step"},schema:{title:{type:"Text",validators:["required"]},stepMethod:"Text",description:{type:"TextArea",validators:["required"]},stepGoals:"TextArea",step:"Text",courseId:"Text",resourceId:{type:"Select",options:[]},questions:{type:"Select",options:[]},qoptions:{type:"Select",options:[]},answers:{type:"Select",options:[]},resourceTitles:{type:"Select",options:[]},allowedErrors:{type:"Text",validators:["required"]},outComes:{title:"Outcomes",type:"Checkboxes",options:["Paper","Quiz"]},passingPercentage:{type:"Select",options:[10,20,30,40,50,60,70,80,90,100]}},saveAttachment:function(a,b,c){var d=App.Server,e="coursestep",f=this.get("_id")?this.get("_id"):this.get("id"),g=this;$.couch.db(e).openDoc(f,{success:function(b){$(c).val(g.get("_rev")),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})},error:function(b){$.couch.db(e).saveDoc({_id:f},{success:function(b){$(c).val(b.rev),$(a).ajaxSubmit({url:"/"+e+"/"+f,success:function(a){console.log("file submitted successfully"),g.trigger("savedAttachment")}})}})}})}})}),$(function(){App.Models.Credentials=Backbone.Model.extend({idAttribute:"_id",schema:{login:"Text",password:"Password"}})}),$(function(){App.Models.DailyLog=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/activitylog/"+this.id+"?rev="+this.get("_rev"):App.Server+"/activitylog/"+this.id;else var a=App.Server+"/activitylog";return a},schema:{male_deleted_count:"number",female_deleted_count:"number",logDate:"Text",female_visits:"number",male_visits:"number",female_new_signups:"number",male_new_signups:"number",resourcesIds:[],female_rating:[],female_timesRated:[],male_rating:[],male_timesRated:[],resources_opened:[],resources_names:[],female_opened:[],male_opened:[],community:"Text"}})}),$(function(){App.Models.ExploreBell=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/explorebell/"+this.id+"?rev="+this.get("_rev"):App.Server+"/explorebell/"+this.id;else var a=App.Server+"/explorebell";return a}})}),$(function(){App.Models.Feedback=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/feedback/"+this.id+"?rev="+this.get("_rev"):App.Server+"/feedback/"+this.id;else var a=App.Server+"/feedback";return a},defaults:{kind:"Feedback"},schema:{rating:"Text",comment:"TextArea",resourceId:"Text",memberId:"Text",communityCode:"Text"}})}),$(function(){App.Models.Group=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/groups/"+this.id+"?rev="+this.get("_rev"):App.Server+"/groups/"+this.id;else var a=App.Server+"/groups";return a},defaults:{kind:"Group"},schema:{CourseTitle:"Text",languageOfInstruction:"Text",memberLimit:"Text",courseLeader:{type:"Select",options:null},description:"TextArea",method:"Text",gradeLevel:{type:"Select",options:["Pre-K","K","1","2","3","4","5","6","7","8","9","10","11","12","College","Post-Grad"]},subjectLevel:{type:"Select",options:["Beginner","Intermediate","Advanced","Expert"]},startDate:"Text",endDate:"Text",frequency:{type:"Radio",options:["Daily","Weekly"]},Day:{type:"Checkboxes",options:["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"]},startTime:"Text",endTime:"Text",location:"Text",backgroundColor:"Text",foregroundColor:"Text",members:{type:"Checkboxes",options:null}}})}),$(function(){App.Models.InviFormModel=Backbone.Model.extend({schema:{invitationType:{type:"Select",options:["All","Level","Members"]},levels:{type:"Checkboxes",options:["1","2","3","4","5","6","7","8","9","10","11","12","Higher"]},members:{type:"Checkboxes",options:null}}})}),$(function(){App.Models.InviMeetup=Backbone.Model.extend({schema:{invitationType:{type:"Select",options:["All","Members"]},members:{type:"Checkboxes",options:null}}})}),$(function(){App.Models.Invitation=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/invitations/"+this.id+"?rev="+this.get("_rev"):App.Server+"/invitations/"+this.id;else var a=App.Server+"/invitations";return a},defaults:{kind:"invitation"},schema:{title:"Text",type:"Text",senderId:"Text",senderName:"Text",entityId:"Text",memberId:"Text"}})}),$(function(){App.Models.Language=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/languages/"+this.id+"?rev="+this.get("_rev"):App.Server+"/languages/"+this.id;else var a=App.Server+"/languages";return a}})}),$(function(){App.Models.Mail=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/mail/"+this.id+"?rev="+this.get("_rev"):App.Server+"/mail/"+this.id;else var a=App.Server+"/mail";return a},schema:{sednerId:"Text",receiverId:"Text",subject:"Text",body:"Text",type:"Text",status:"Text",sentDate:"Text",mailingList:"Text"},saveAttachment:function(a,b,c){var d=App.Server,e="mail",f=this.get("_id")?this.get("_id"):this.get("id"),g=this;$.couch.db(e).openDoc(f,{success:function(b){_.has(b,"_attachments")?$.ajax({url:"/mail/"+b._id+"/"+_.keys(b._attachments)[0]+"?rev="+b._rev,type:"DELETE",success:function(b,h,i){b=JSON.parse(b),$(c).val(b.rev),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})}}):($(c).val(g.get("rev")),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}}))},error:function(b){$.couch.db(e).saveDoc({_id:f},{success:function(b){$(c).val(b.rev),$(a).ajaxSubmit({url:"/"+e+"/"+f,success:function(a){console.log("file submitted successfully!"+a),g.trigger("savedAttachment")}})}})}})}})}),$(function(){App.Models.MeetUp=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/meetups/"+this.id+"?rev="+this.get("_rev"):App.Server+"/meetups/"+this.id;else var a=App.Server+"/meetups";return a},defaults:{kind:"Meetup"},schema:{title:"Text",description:"TextArea",startDate:"Text",endDate:"Text",recurring:{type:"Radio",options:["Daily","Weekly"]},Day:{type:"Checkboxes",options:["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"]},startTime:"Text",endTime:"Text",category:{type:"Select",options:["ICT","First Time","Mothers","General","E Learning","Farming","Academic Discussion","Academic Help","Awareness"]},meetupLocation:"Text"}})}),$(function(){App.Models.Member=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/members/"+this.id+"?rev="+this.get("_rev"):App.Server+"/members/"+this.id;else var a=App.Server+"/members";return a},defaults:{kind:"Member",roles:["Learner"]},toString:function(){return this.get("login")+": "+this.get("firstName")+" "+this.get("lastName")},schema:{firstName:{validators:["required"]},lastName:{validators:["required"]},middleNames:"Text",login:{validators:["required"]},password:{validators:["required"]},phone:"Text",email:"Text",language:"Text",BirthDate:"Date",visits:"Text",Gender:{type:"Select",options:["Male","Female"]},levels:{type:"Select",options:["1","2","3","4","5","6","7","8","9","10","11","12","Higher"]},status:"Text",yearsOfTeaching:{type:"Select",options:["None","1 to 20","More than 20"]},teachingCredentials:{type:"Select",options:["Yes","No"]},subjectSpecialization:"Text",forGrades:{type:"Checkboxes",options:["Pre-k","Grades(1-12)","Higher Education","Completed Higer Education","Masters","Doctrate","Other Professional Degree"]},community:"Text",region:"Text",nation:"Text"},saveAttachment:function(a,b,c){var d=App.Server,e="members",f=this.get("_id")?this.get("_id"):this.get("id"),g=this;$.couch.db(e).openDoc(f,{success:function(b){_.has(b,"_attachments")?$.ajax({url:"/members/"+b._id+"/"+_.keys(b._attachments)[0]+"?rev="+b._rev,type:"DELETE",success:function(b,h,i){b=JSON.parse(b),$(c).val(b.rev),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})}}):($(c).val(g.get("rev")),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}}))},error:function(b){$.couch.db(e).saveDoc({_id:f},{success:function(b){$(c).val(b.rev),$(a).ajaxSubmit({url:"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})}})}})}})}),$(function(){App.Models.Publication=Backbone.Model.extend({idAttribute:"_id",url:function(){if(1==this.recPub)if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/recpublication/"+this.id+"?rev="+this.get("_rev"):App.Server+"/recpublication/"+this.id;else var a=App.Server+"/recpublication";else if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/publications/"+this.id+"?rev="+this.get("_rev"):App.Server+"/publications/"+this.id;else var a=App.Server+"/publications";return a},defaults:{kind:"publication"},schema:{Date:"Text",IssueNo:"Number",editorName:"Text",editorEmail:"Text",editorPhone:"Text",resources:{type:"Select",options:[]}},setUrl:function(a){this.url=a}})}),$(function(){App.Models.ReleaseNotes=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/configurations/"+this.id+"?rev="+this.get("_rev"):App.Server+"/configurations/"+this.id;else var a=App.Server+"/configurations";return a}})}),$(function(){App.Models.Resource=Backbone.Model.extend({idAttribute:"_id",url:function(){if(1==this.pubResource)if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/pubresources/"+this.id+"?rev="+this.get("_rev"):App.Server+"/pubresources/"+this.id;else var a=App.Server+"/pubresources";else if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/resources/"+this.id+"?rev="+this.get("_rev"):App.Server+"/resources/"+this.id;else var a=App.Server+"/resources";return a},defaults:{kind:"Resource"},schema:{title:"Text",author:{title:"Author/Editor",type:"Text"},Publisher:{title:"Publisher/Attribution",type:"Text"},language:{type:"Select",options:[{val:"Arabic",label:"Arabic"},{val:"Asante",label:"Asante"},{val:"Chinese",label:"Chinese"},{val:"English",label:"English"},{val:"Ewe",label:"Ewe"},{val:"French",label:"French"},{val:"Hindi",label:"Hindi"},{val:"Kyrgyzstani",label:"Kyrgyzstani"},{val:"Nepali",label:"Nepali"},{val:"Portuguese",label:"Portuguese"},{val:"Punjabi",label:"Punjabi"},{val:"Russian",label:"Russian"},{val:"Somali",label:"Somali"},{val:"Spanish",label:"Spanish"},{val:"Swahili",label:"Swahili"},{val:"Urdu",label:"Urdu"}]},Year:"Text",linkToLicense:{title:"Link To License",type:"Text"},subject:{title:"Subjects",type:"Select",options:["Agriculture","Arts","Business and Finance","Environment","Food and Nutrition","Geography","Health and Medicine","History","Human Development","Languages","Law","Learning","Literature","Math","Music","Politics and Government","Reference","Religion","Science","Social Sciences","Sports","Technology"]},Level:{title:"Levels",type:"Select",options:["Early Education","Lower Primary","Upper Primary","Lower Secondary","Upper Secondary","Undergraduate","Graduate","Professional"]},Tag:{title:"Collection",type:"Select",options:[]},Medium:{type:"Select",options:["Text","Graphic/Pictures","Audio/Music/Book ","Video"]},openWith:{type:"Select",options:[{val:"Just download",label:"Just download"},{val:"HTML",label:"HTML"},{val:"PDF.js",label:"PDF"},{val:"Bell-Reader",label:"Bell-Reader"},{val:"MP3",label:"Audio (MP3)"},{val:"Flow Video Player",label:"Video (MP4, FLV)"},{val:"BeLL Video Book Player",label:"Video Book (webm+json)"},{val:"Native Video",label:"Native Video"}]},resourceFor:{type:"Select",options:[{val:"Default",label:"Default"},{val:"Leader",label:"Leader"},{val:"Learner",label:"Learner"}]},resourceType:{type:"Select",options:[{val:"Textbook",label:"Textbook"},{val:"Lesson Plan",label:"Lesson Plan"},{val:"Activities",label:"Activities"},{val:"Exercises",label:"Exercises"},{val:"Discussion Questions",label:"Discussion Questions"}]},uploadDate:"Date",averageRating:"Text",articleDate:{title:"Date Added to Library",type:"Date"},addedBy:"Text"},saveAttachment:function(a,b,c){var d=App.Server,e="resources",f=this.get("_id")?this.get("_id"):this.get("id"),g=this;$.couch.db(e).openDoc(f,{success:function(b){_.has(b,"_attachments")?$.ajax({url:"/resources/"+b._id+"/"+_.keys(b._attachments)[0]+"?rev="+b._rev,type:"DELETE",success:function(b,h,i){b=JSON.parse(b),$(c).val(b.rev),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment")}})}}):($(c).val(g.get("rev")),$(a).ajaxSubmit({url:d+"/"+e+"/"+f,success:function(a){g.trigger("savedAttachment"),alert("Resource Successfully added"),App.stopActivityIndicator()},error:function(a){alert("Error"),App.stopActivityIndicator()}}))},handleError:function(a,b,c,d){a.error&&a.error.call(a.context||window,b,c,d),a.global&&(a.context?jQuery(a.context):jQuery.event).trigger("ajaxError",[b,a,d])},error:function(b){$.couch.db(e).saveDoc({_id:f},{success:function(b){alert("error success"),$(c).val(b.rev),$(a).ajaxSubmit({url:"/"+e+"/"+f,success:function(a){console.log("file submitted successfully"),g.trigger("savedAttachment")}})}})}})}})}),$(function(){App.Models.ResourceFrequency=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/resourcefrequency/"+this.id+"?rev="+this.get("_rev"):App.Server+"/resourcefrequency/"+this.id;else var a=App.Server+"/resourcefrequency";return a},defaults:{kind:"resourcefrequency",memberID:"",resourceID:[],frequency:[]}})}),$(function(){App.Models.Shelf=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/shelf/"+this.id+"?rev="+this.get("_rev"):App.Server+"/shelf/"+this.id;else var a=App.Server+"/shelf";return a},schema:{memberId:"Text",resourceId:"Text",resourceTitle:"Text"}})}),$(function(){App.Models.UserMeetup=Backbone.Model.extend({idAttribute:"_id",initialize:function(){},url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/usermeetups/"+this.id+"?rev="+this.get("_rev"):App.Server+"/usermeetups/"+this.id;else var a=App.Server+"/usermeetups";return a},schema:{memberId:"Text",meetupId:"Text",meetupTitle:"Text"}})}),$(function(){App.Models.membercourseprogress=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/membercourseprogress/"+this.id+"?rev="+this.get("_rev"):App.Server+"/membercourseprogress/"+this.id;else var a=App.Server+"/membercourseprogress";return a},defaults:{kind:"course-member-result"},schema:{courseId:"Text",memberId:"Text",stepsIds:"null",stepsStatus:"null",stepsResult:"null"}})}),$(function(){App.Models.report=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/report/"+this.id+"?rev="+this.get("_rev"):App.Server+"/report/"+this.id;else var a=App.Server+"/report";return a},defaults:{kind:"report"},schema:{PageUrl:"Text",comment:"TextArea",Resolved:"Text",category:{type:"Select",options:["Bug","Question","Suggestion"]},priority:{type:"Checkboxes",options:["urgent"]},memberLogin:"Text",time:"Text",communityCode:"Text"}})}),$(function(){App.Models.reportComment=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/report/"+this.id+"?rev="+this.get("_rev"):App.Server+"/report/"+this.id;else var a=App.Server+"/report";return a},defaults:{kind:"reportComment"},schema:{reportId:"Text",commentNumber:"Text",comment:"TextArea",memberLogin:"Text",time:"Text"}})}),$(function(){App.Models.request=Backbone.Model.extend({idAttribute:"_id",url:function(){if(_.has(this,"id"))var a=_.has(this.toJSON(),"_rev")?App.Server+"/requests/"+this.id+"?rev="+this.get("_rev"):App.Server+"/requests/"+this.id;else var a=App.Server+"/requests";return a},defaults:{kind:"request"},schema:{senderId:"Text",status:"Text",sendFrom:"Text",sendFromName:"Text",request:"TextArea",response:"TextArea",type:"Text",date:"Text"}})});