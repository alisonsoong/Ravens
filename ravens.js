// Please press "Show Text" on the upper right corner to view my code more easily!
//    - Alison

var lastScreen; // will hold info for what screen it was on last before going into any screen, for back buttons.

//myRaven (current user code)
var isSignedIn = false;
var username;
var user = getUserId();
var userPlace; // what index the user's information is located in Users
var numUsers;
readRecords("Users", {}, function(records) { // get number of Users
  numUsers = records.length;
  setKeyValue("numUsers", records.length, function () {
  });
});

var userViewDefaultText = "This tutor has not marked any tags yet.";
var myRavenText = "Here, you can see what classes/topics you are comfortable tutoring for! Select a subject using the dropdown menu to see your lists/tags, and edit your lists/tags by pressing the + button.";
var subjectsDefaultText = "To see what specific classes this person is able to tutor you for, select the subject in the dropdown menu!";

readRecords("Users", {}, function(records) { // checking if an account has been created on this device, then setting or creating info accordingly
  for (var i =0; i < records.length; i++) {
    if (user.localeCompare(records[i].userID) == 0){
      isSignedIn = true;
      username = records[i].username;
      userPlace = i;
      updateUserInfo(userPlace);
      setOverallSubjectList(user, "myRavenTopicsText", "\n\n" + myRavenText, myRavenText);
      setUpTagEdits();
      getMSList();
      break;
    }
  }
  // an account has not been created on this device yet
  if (isSignedIn == false){
    username = "Anonymous Raven";
    createRecord("Users", {userID: user, username: username, school: "unknown", grade:"unknown"}, function() {
    });
    userPlace = getUserPlace(user);
    userPlace = numUsers;
    numUsers = numUsers + 1;
    setKeyValue("numUsers", numUsers, function () {
    });
    // create data table with class information
    createRecord("UserTags", {userID: user, subjects: subjectsDefaultText, math: "", science: "", english: "", historyS: "", languageS: "", other: ""}, function(record) {
      setOverallSubjectList(user, "myRavenTopicsText", "\n\n" + myRavenText, myRavenText);
      setUpTagEdits();
    });
    createRecord("Kernels", {userID: user, kernels: 0}, function(record) {
      setText("myRavenKernels", "0");
    });

  }

});

//get userPlace
function getUserPlace(userID) {
  var userPlace;
  readRecords("Users", {}, function(records) { // checking if an account has been created on this device
      for (var i =0; i < records.length; i++) {
        if (userID.localeCompare(records[i].userID) == 0){
          userPlace = i;
          break;
        }
      }
  });
  return userPlace;
}

//myRaven update info
function updateUserInfo(i) {
  readRecords("Users", {}, function(records) {
      setText("myRavenSchool", records[i].school);
      setText("myRavenName", records[i].username);
      setText("myRavenGrade", "Grade: " + records[i].grade);
  });
}

function setOverallSubjectList(user, place, elseText, defaultText){ // sets the list of general subjects of a specified person into a specified text box
  var result = "";
  readRecords("UserTags", {}, function(records) {
    for (var i = 0; i < records.length; i++){
      if (user.localeCompare(records[i].userID)==0){
        if (records[i].math.length > 0){
          result = result + "Math, ";
        }
        if (records[i].science.length > 0){
          result = result + "Science, ";
        }
        if (records[i].english.length > 0){
          result = result + "English, ";
        }
        if (records[i].historyS.length > 0){
          result = result + "History, ";
        }
        if (records[i].languageS.length > 0){
          result = result + "Language, ";
        }
        if (records[i].other.length > 0){
          result = result + "Other: " + records[0].other; // CORRECT?
        }
        if (result.length == 0){
          if (place == "userInfoText"){
            result = userViewDefaultText;
            setText(place, result);
          }
          else{
            result = defaultText;
            setText(place, result);
          }
        }
        else{
          result = result + elseText;
          setText(place, result);
        }
      }
    }
  });
}

function getOverallSubjectList(user){ // gets list of subjects for a specified user
  var result = "";
  readRecords("UserTags", {}, function(records) {
    for (var i = 0; i < records.length; i++){
      if (user.localeCompare(records[i].userID)==0){
        if (records[i].math.length > 0){
          result = result + "Math, ";
        }
        if (records[i].science.length > 0){
          result = result + "Science, ";
        }
        if (records[i].english.length > 0){
          result = result + "English, ";
        }
        if (records[i].historyS.length > 0){
          result = result + "History, ";
        }
        if (records[i].languageS.length > 0){
          result = result + "Language, ";
        }
        if (records[i].other.length > 0){
          result = result + "Other: " + records[0].other;
        }
      }
    }
  });
  return result;
}

function setScreenMyRaven(){ // setting myRaven screen up
  setKernels(user, "myRavenKernels");
  setText("myRavenDropDown","Subjects");
  setMyRavenTextBox();
  setScreen("myRaven");
}

onEvent("myRavenDropDown", "change", function() { // update text box in myRaven according to dropdown menu
  setMyRavenTextBox();
});

function setMyRavenTextBox(){ // function for setting tags text box
  var option;
  readRecords("UserTags", {}, function(records) {
    for (var i = 0; i < records.length; i++){
      if (user.localeCompare(records[i].userID)==0){
        option = "Subjects";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setOverallSubjectList(user, "myRavenTopicsText", "\n\n" + myRavenText, myRavenText);
        }
        option = "Math";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setText("myRavenTopicsText", records[i].math);
        }
        option = "English";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setText("myRavenTopicsText", records[i].english);
        }
        option = "Science";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setText("myRavenTopicsText", records[i].science);
        }
        option = "History";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setText("myRavenTopicsText", records[i].historyS);
        }
        option = "Other";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setText("myRavenTopicsText", records[i].other);
        }
        option = "Language";
        if (option.localeCompare(getText("myRavenDropDown")) == 0){
          setText("myRavenTopicsText", records[i].languageS);
        }
      }
    }
  });
}

// function for setting tag edits
function setUpTagEdits(){ 
  readRecords("UserTags", {}, function(records) {
    for (var i = 0; i < records.length; i++){
      if (user.localeCompare(records[i].userID)==0){
        if (records[i].math == ""){
          setText("editTagsMath", "---");
        }
        else{
          setText("editTagsMath", records[i].math);
        }
        if (records[i].science == ""){
          setText("editTagsScience", "---");
        }
        else{
          setText("editTagsScience", records[i].science);
        }
        if (records[i].english == ""){
          setText("editTagsEnglish", "---");
        }
        else{
          setText("editTagsEnglish", records[i].english);
        }
        if (records[i].historyS == ""){
          setText("editTagsHistory", "---");
        }
        else{
          setText("editTagsHistory", records[i].historyS);
        }
        if (records[i].languageS == ""){
          setText("editTags2Language", "---");
        }
        else{
          setText("editTags2Language", records[i].languageS);
        }
        if (records[i].other == ""){
          setText("editTags2Other", "---");
        }
        else{
          setText("editTags2Other", records[i].other);
        }
      }
    }
  });
}

//Buttons for myRaven screen
    onEvent("myRavenHomeButton", "click", function(event) {
      setScreen("Home");
    });
    onEvent("myRavenTutoringButton", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("myRavenMyScheduleButton", "click", function(event) {
      setScreenMySchedule()
    });
    onEvent("myRavenEdit", "click", function(event) {
      setScreen("UserSettings");
    });
    onEvent("myRavenAddTags", "click", function(event) {
      setScreen("EditTags");
    });
    onEvent("myRavenSU", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("myRavenMS", "click", function(event) {
      setScreenMySchedule()
    });


    
//Buttons for Tutoring screen
    onEvent("tutoringHomeButton", "click", function(event) {
      setScreen("Home");
    });
    onEvent("tutoringMyRavenButton", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("tutoringMyScheduleButton", "click", function(event) {
      setScreenMySchedule()
    });

//Buttons for Home screen
    onEvent("homeMyRavenButton", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("homeTutoringButton", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("homeMyScheduleButton", "click", function(event) {
      setScreenMySchedule()
    });
    
//Buttons for mySchedule screen
    onEvent("myScheduleHomeButton", "click", function(event) {
      setScreen("Home");
    });
    onEvent("myScheduleTutoringButton", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("myScheduleMyRavenButton", "click", function(event) {
      setScreenMyRaven();
    });
    
//Buttons for userSettings screen (myRaven)
    onEvent("userSettingsMyRavenButton", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("userSettingsExit", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("userSettingsTutoringButton", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("userSettingsMyScheduleButton", "click", function(event) {
      setScreenMySchedule()
    });
    onEvent("userSettingsHomeButton", "click", function(event) {
      setScreen("Home");
    });
    
    //Apply changes to myRaven info
    onEvent("userSettingsApply", "click", function(event) {
      var idPlace;
      readRecords("Users", {}, function(records) {
        for (var i = 0; i < records.length; i++){
          if (user.localeCompare(records[i].userID)==0){
            idPlace = records[i].id;
          }
        }
        readRecords("Users", {}, function(records){
          var name = records[userPlace].username;
          var school = records[userPlace].school;
          var grade = records[userPlace].grade;
          if (getText("userSettingsName").length > 0){
            name = getText("userSettingsName");
            username = name;
          }
          if (getText("userSettingsSchool").length > 0){
            school = getText("userSettingsSchool");
          }
          if (getText("userSettingsGrade").length > 0){
            grade = getText("userSettingsGrade");
          }
          updateRecord("Users", {id: idPlace, userID: user, username: name, school: school, grade: grade}, function(record) {
            username = name;
            setText("myRavenSchool", school);
            setText("myRavenName", name);
            setText("myRavenGrade", "Grade: " + grade);
            setScreenMyRaven();
          });
      });
      });
    });

  
//Buttons for Edit Tags and Edit Tags2
    onEvent("editTagsMyRaven", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("editTagsExit", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("editTagsTutoring", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("editTagsMySchedule", "click", function(event) {
      setScreenMySchedule()
    });
    onEvent("editTagsHome", "click", function(event) {
      setScreen("Home");
    });
    onEvent("editTagsRight", "click", function(event) {
      setScreen("EditTags2");
    });
    
    onEvent("editTags2MyRaven", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("editTags2Exit", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("editTags2Tutoring", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("editTags2MySchedule", "click", function(event) {
      setScreenMySchedule()
    });
    onEvent("editTags2Home", "click", function(event) {
      setScreen("Home");
    });
    onEvent("editTags2Left", "click", function(event) {
      setScreen("EditTags");
    });
    
    onEvent("editTags2Apply", "click", function(event) { //apply changes to tags
      var mathC;
      var scienceC;
      var englishC;
      var historyC;
      var otherC;
      var languageC;
      var idPlace;
      readRecords("UserTags", {}, function(records) {
        for (var i = 0; i < records.length; i++){
          if (user.localeCompare(records[i].userID)==0){
            idPlace = records[i].id;
            if (getText("editTags2Language") != "---"){
              languageC = getText("editTags2Language");
            }
            else{
              languageC = records[i].languageS; 
            }
            if (getText("editTags2Other") != "---"){
              otherC = getText("editTags2Other");
            }
            else{
              otherC = records[i].other; 
            }
            if (getText("editTagsMath") != "---"){
              mathC = getText("editTagsMath");
            }
            else{
              mathC = records[i].math; 
            }
            if (getText("editTagsScience") != "---"){
              scienceC = getText("editTagsScience");
            }
            else{
              scienceC = records[i].science; 
            }
            if (getText("editTagsEnglish") != "---"){
              englishC = getText("editTagsEnglish");
            }
            else{
              englishC = records[i].english; 
            }
            if (getText("editTagsHistory") != "---"){
              historyC = getText("editTagsHistory");
            }
            else{
              historyC = records[i].historyS; 
            }
          }
        }
        updateRecord("UserTags", {id:idPlace, userID: user, subjects: subjectsDefaultText, math: mathC, science: scienceC, english: englishC, historyS: historyC, languageS: languageC, other: otherC}, function(record) {
            setMyRavenTextBox();
            setScreenMyRaven();
        });
      });
    });

//Buttons for UserInfo screen
    onEvent("userInfoMyRaven", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("userInfoBack", "click", function(event) {
      if (lastScreen == "SessionSSignUp"){
          lastScreen = "SessionList";
          goToSessionSignUp(getText("tutoringDropdown"), holdNum);
      }
      else{
        setScreen(lastScreen);
      }
    });
    onEvent("userInfoTutoring", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("userInfoMySchedule", "click", function(event) {
      setScreenMySchedule()
    });
    onEvent("userInfoHome", "click", function(event) {
      setScreen("Home");
    });
    
// Buttons for Tutoring (by availability)
    onEvent("tutoringByTutor", "click", function(event) {
      setScreen("TutoringByTutor");
    });
    
    onEvent("tutoringMath", "click", function(event) {
      lastScreen = "Tutoring";
      setSessions("Math");
      setSessionList(getText("tutoringDropdown"), "Math");
      setScreen("SessionList");
    });
    
    onEvent("tutoringScience", "click", function(event) {
      lastScreen = "Tutoring";
      setSessions("Science");
      setSessionList(getText("tutoringDropdown"), "Science");
      setScreen("SessionList");
    });
    
    onEvent("tutoringEnglish", "click", function(event) {
      lastScreen = "Tutoring";
      setSessions("English");
      setSessionList(getText("tutoringDropdown"), "English");
      setScreen("SessionList");
    });
    
    onEvent("tutoringHistory", "click", function(event) {
      lastScreen = "Tutoring";
      setSessions("History");
      setSessionList(getText("tutoringDropdown"), "History");
      setScreen("SessionList");
    });
    
    onEvent("tutoringLanguage", "click", function(event) {
      lastScreen = "Tutoring";
      setSessions("Language");
      setSessionList(getText("tutoringDropdown"), "Language");
      setScreen("SessionList");
    });
    
    onEvent("tutoringOther", "click", function(event) {
      lastScreen = "Tutoring";
      setSessions("Other");
      setSessionList(getText("tutoringDropdown"), "Other");
      setScreen("SessionList");
    });
    
    var curSubject;
    var curDate;
    function setSessions(subject){
      curSubject = subject;
      setText("sessionListSubject", curSubject);
      
      curDate = getText("tutoringDropdown");
      setText("sessionListDay", curDate);
    }


// Buttons for Tutoring (by tutor)
    onEvent("tutoring2MyRaven", "click", function(event) {
      setScreenMyRaven();
    });
    onEvent("tutoring2BySchedule", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("tutoring2Tutoring", "click", function(event) {
      setScreen("Tutoring");
    });
    onEvent("tutoring2MySchedule", "click", function(event) {
      setScreenMySchedule();
    });
    onEvent("tutoring2Home", "click", function(event) {
      setScreen("Home");
    });

// Buttons for SessionList
    onEvent("sessionListBack", "click", function(event) {
      setScreen("Tutoring");
      setSessionList(getText("tutoringDropdown"), curSubject);
    });
    
// Buttons for SessionSSignUp
    onEvent("sessionSSUBack", "click", function(event) {
      setScreen("SessionList");
      setSessionList(getText("tutoringDropdown"), curSubject);
    });
    

// code for getting sessionList:
    var sessionIndexList = []; // super important
    var startShift;
    
    function setSessionList(date, subject){ // sets session list give date and subject
      sessionIndexList = [];
      var index;
      var tutorNameTextbox;
      var sessionTimeTextbox;
      var subjectString;
      var tutorButton;
      var goButton;
      var sessionArea;
      var x;
      startShift = 0;
      showCounter = 0;
      readRecords(date, {}, function(records){
        for (var i = 0; i < records.length; i++) {
          subjectString = records[i].subject;
          if (subjectString.includes(subject) && records[i].isSignedUp == false){
            sessionIndexList.push(i); // i is the index of the session in the table
            
          }
        }
        for (var j = startShift; j<5+startShift ; j++){
          x = j+1;
          tutorNameTextbox = "sessionName" + x;
          sessionTimeTextbox = "sessionTime" + x;
          goButton = "sessionGo" + x;
          tutorButton = "sessionTutorInfo" + x;
          sessionArea = "sessionArea" + x;
          if (j >= sessionIndexList.length){
            hideElement(tutorNameTextbox);
            hideElement(sessionTimeTextbox);
            hideElement(goButton);
            hideElement(tutorButton);
            hideElement(sessionArea);
          }
          else{
            showElement(tutorNameTextbox);
            showElement(sessionTimeTextbox);
            showElement(goButton);
            showElement(tutorButton);
            showElement(sessionArea);
            showCounter++;
            setText(tutorNameTextbox, "Tutor: " + records[sessionIndexList[j]].tutor);
            setText(sessionTimeTextbox, "Time: " + records[sessionIndexList[j]].time);
          }
        }
      });
    }
    
    var showCounter = 0;
    
    onEvent("sessionDown", "click", function(event) {
        if (showCounter < sessionIndexList.length){
          showCounter++;
          startShift++;
          shiftSessions(getText("tutoringDropdown"),curSubject);
        }
    });
    
    onEvent("sessionUp", "click", function(event) {
        if (startShift >= 1){
          startShift--;
          shiftSessions(getText("tutoringDropdown"),curSubject);
        }
    });
    
    function shiftSessions(date,subject){ // update sessions according to shift (changes due to up and down buttons)
      var index;
      var tutorNameTextbox;
      var sessionTimeTextbox;
      var subjectString;
      var tutorButton;
      var goButton;
      var sessionArea;
      showCounter = 0;
      readRecords(date, {}, function(records){
        var y = 0;
        for (var j = startShift; j<5+startShift ; j++){
          y++;
          tutorNameTextbox = "sessionName" + y;
          sessionTimeTextbox = "sessionTime" + y;
          goButton = "sessionGo" + y;
          tutorButton = "sessionTutorInfo" + y;
          sessionArea = "sessionArea" + y;
          if (j >= sessionIndexList.length){
            hideElement(tutorNameTextbox);
            hideElement(sessionTimeTextbox);
            hideElement(goButton);
            hideElement(tutorButton);
            hideElement(sessionArea);
          }
          else{
            showElement(tutorNameTextbox);
            showElement(sessionTimeTextbox);
            showElement(goButton);
            showElement(tutorButton);
            showElement(sessionArea);
            showCounter++;
            
            setText(tutorNameTextbox, "Tutor: " + records[sessionIndexList[j]].tutor);
            setText(sessionTimeTextbox, "Time: " + records[sessionIndexList[j]].time);
          }
        }
      });
    }
    
    function goToSessionSignUp(date,num){ // num = 1 is the first go to button, num = 5 is the last (and fifth) go button. Go to session's sign up from SessionList
      var index = num - 1 + startShift;
      readRecords(date, {}, function(records){
        setText("sessionSSUName", "Tutor: " + records[sessionIndexList[index]].tutor);
        setText("sessionSSUTime", "Time: " + records[sessionIndexList[index]].time);
        setText("sessionSSUDate", "Date: " + getText("tutoringDropdown"));
      });
      setScreen("SessionSSignUp");
    }
    
    onEvent("sessionGo1", "click", function(event) {
      goToSessionSignUp(getText("tutoringDropdown"), 1);
      holdNum = 1;
    });
    onEvent("sessionGo2", "click", function(event) {
      goToSessionSignUp(getText("tutoringDropdown"), 2);
      holdNum = 2;
    });
    onEvent("sessionGo3", "click", function(event) {
      goToSessionSignUp(getText("tutoringDropdown"), 3);
      holdNum = 3;
    });
    onEvent("sessionGo4", "click", function(event) {
      goToSessionSignUp(getText("tutoringDropdown"), 4);
      holdNum = 4;
    });
    onEvent("sessionGo5", "click", function(event) {
      goToSessionSignUp(getText("tutoringDropdown"), 5);
      holdNum = 5;
    });
    
    
    // go to user info from session list
    var viewingUser;
    function setUserInfo(date, num){
      var index = num - 1 + startShift;
      var viewUser;
      readRecords(date, {}, function(records){
        viewUser = records[sessionIndexList[index]].tutorUserID;
        viewingUser = viewUser;
        setUserInfoForView(viewUser);
        readRecords("Users", {}, function(records){
          for (var i = 0; i < records.length; i++) {
            if (viewUser.localeCompare(records[i].userID) == 0){
              setText("userInfoName", records[i].username);
              setText("userInfoSchool", records[i].school);
              setText("userInfoDropdown", "What Subjects They Can Tutor");
              setUserInfoForView(viewingUser);
              setText("userInfoGrade", "Grade: " + records[i].grade);
              break;
            }
          }
          setScreen("UserInfo");
        });
      });
    }
    var holdNum;
    onEvent("sessionTutorInfo1", "click", function(event) {
      setUserInfo(getText("tutoringDropdown"), 1);
      holdNum = 1;
      lastScreen = "SessionList";
    });
    onEvent("sessionTutorInfo2", "click", function(event) {
      setUserInfo(getText("tutoringDropdown"), 2);
      holdNum = 2;
      lastScreen = "SessionList";
    });
    onEvent("sessionTutorInfo3", "click", function(event) {
      setUserInfo(getText("tutoringDropdown"), 3);
      holdNum = 3;
      lastScreen = "SessionList";
    });
    onEvent("sessionTutorInfo4", "click", function(event) {
      setUserInfo(getText("tutoringDropdown"), 4);
      holdNum = 4;
      lastScreen = "SessionList";
    });
    onEvent("sessionTutorInfo5", "click", function(event) {
      setUserInfo(getText("tutoringDropdown"), 5);
      holdNum = 5;
      lastScreen = "SessionList";
    });
    
    // go to user info screen from session sign up screen
    onEvent("sessionSSUTutorUser", "click", function(event) {
      setUserInfo(getText("tutoringDropdown"), holdNum);
      lastScreen = "SessionSSignUp";
    });

// additional code for setting up UserInfo
    onEvent("userInfoDropdown", "change", function() { // update text box in myRaven according to dropdown menu
      setUserInfoForView(viewingUser);
    });

    function setUserInfoForView(viewUser){
      var option;
      setKernels(viewUser, "userInfoKernels");
      readRecords("UserTags", {}, function(records) {
        for (var i = 0; i < records.length; i++){
          if (viewUser.localeCompare(records[i].userID)==0){
            option = "What Subjects They Can Tutor";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setOverallSubjectList(viewUser, "userInfoText", "\n\n" + subjectsDefaultText, subjectsDefaultText);
            }
            option = "Math";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setText("userInfoText", records[i].math);
            }
            option = "English";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setText("userInfoText", records[i].english);
            }
            option = "Science";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setText("userInfoText", records[i].science);
            }
            option = "History";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setText("userInfoText", records[i].historyS);
            }
            option = "Other";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setText("userInfoText", records[i].other);
            }
            option = "Language";
            if (option.localeCompare(getText("userInfoDropdown")) == 0){
              setText("userInfoText", records[i].languageS);
            }
          }
        }
      });
    }

// Buttons for mySchedule
    onEvent("myScheduleCreateSession", "click", function(event) {
      setOverallSubjectList(user, "sessionTCreateList", "", "Before you create this session, please go into \"myRaven\" and add tags!");
      setText("sessionTCreateApp", null);
      setText("sessionTCreateTime", null);
      setText("sessionTCreateTouch", null);
      hideElement("sessionTCreateCreate");
      setScreen("SessionTCreate");
    });
    
    onEvent("sessionTCreateBack", "click", function(event) {
      setScreenMySchedule()
    });

// code for TutoringByTutors screen (get list, set info, etc)
    var TTSearchList = [];
    var lookingFor;
    var usernameInQ;
    var TTShift = 0;
    var TTShowCounter = 0;
    var usernameOfInterest;
    shiftTutors()
    onEvent("TTGo", "click", function( ) {
      TTShift = 0;
      TTSearchList = [];
      lookingFor = getText("TTSearch");
      readRecords("Users", {}, function(records) {
        for (var i = 0; i < records.length; i++){
          usernameInQ = records[i].username;
          if (usernameInQ.includes(lookingFor)){
            TTSearchList.push(i);
            shiftTutors();
          }
        }
        shiftTutors();
      });
    });
    
    
    function goTTUser(num){
      var index = num - 1 + TTShift;
      var curUser;
      readRecords("Users", {}, function(records){
        setText("userInfoName", records[TTSearchList[index]].username);
        setText("userInfoSchool", records[TTSearchList[index]].school);
        setText("userInfoGrade", "Grade: " + records[TTSearchList[index]].grade);
        viewingUser = records[usernameOfInterest].userID;
        setUserInfoForView(viewingUser);
      });
      setScreen("UserInfo");
      lastScreen = "TutoringByTutor";
    }
    
    function shiftTutors(){
      var index;
      var tutorButton;
      var tutorName;
      var tutorArea;
      readRecords("Users", {}, function(records){
        TTShowCounter = 0;
        var y = 0;
        for (var j = TTShift; j<4+TTShift ; j++){
          y++;
          tutorName = "TT" + y;
          tutorArea = "TTA" + y;
          tutorButton = "TTU" + y;
          if (j >= TTSearchList.length){
            hideElement(tutorArea);
            hideElement(tutorButton);
            hideElement(tutorName);
          }
          else{
            showElement(tutorArea);
            showElement(tutorButton);
            showElement(tutorName);
            TTShowCounter++;
            
            setText(tutorName, records[TTSearchList[j]].username);
          }
        }
      });
    }
    
    onEvent("TTU1", "click", function(event) {
      usernameOfInterest = TTSearchList[TTShift];
      goTTUser(1);
    });
    onEvent("TTU2", "click", function(event) {
      usernameOfInterest = TTSearchList[1+TTShift];
      goTTUser(2);
    });
    onEvent("TTU3", "click", function(event) {
      usernameOfInterest = TTSearchList[2+TTShift];
      goTTUser(3);
    });
    onEvent("TTU4", "click", function(event) {
      usernameOfInterest = TTSearchList[3+TTShift];
      goTTUser(4);
    });
    
    onEvent("TTDown", "click", function(event) {
        if (TTShowCounter < TTSearchList.length){
          TTShowCounter++;
          TTShift++;
          shiftTutors();
        }
    });
    
    onEvent("TTUp", "click", function(event) {
        if (TTShift >= 1){
          TTShift--;
          shiftTutors();
        }
    });
    
    
    if (TTSearchList.length > 0){
      onEvent("TT1", "click", function( ) {
        lastScreen = "TutoringByTutor";
      });
    }
    
// create sessions
    onEvent("sessionTCreateApp", "change", function(event){
      if (getText("sessionTCreateTime") != "" && getText("sessionTCreateTouch") != "" && getText("sessionTCreateApp") != "" && getText("sessionTCreateList") != "Before you create this session, please go into \"myRaven\" and add tags!"){
        showElement("sessionTCreateCreate");
      }
    });
    
    onEvent("sessionTCreateCreate", "click", function(event){
      var TCday;
      var TCsubject = getText("sessionTCreateList");
      if (getText("sessionTCreateTime") != "" && getText("sessionTCreateTouch") != "" && getText("sessionTCreateApp") != "" && TCsubject != "Before you create this session, please go into \"myRaven\" and add tags!"){
        TCday = getText("sessionTCreateDropdown");
        createRecord(TCday, {tutor: username, tutee: "", time: getText("sessionTCreateTime"), touch: getText("sessionTCreateTouch"), app: getText("sessionTCreateApp"), statement: "", isSignedUp: false, subject: TCsubject, tutorUserID: user, tuteeUserID: ""}, function(record) {
          hideElement("sessionTCreateCreate");
        });
        createRecord("Schedule", {day: TCday, tutorID: user, tutor: username,time: getText("sessionTCreateTime"), tutee: "", tuteeID: ""}, function(record) {
          setScreenMySchedule();
        });
      }
    });

// mySchedule code
    var MSshift = 0;
    var MSShowCounter = 0;
    var MSList = [];
    
    function getMSList(){
      MSList = [];
      readRecords("Schedule", {}, function(records){
        for (var i = 0; i<records.length ; i++){
          if (records[i].tutorID == user || records[i].tuteeID == user){
            MSList.push(i)
          }
        }
        setMSInfo();
        updateMySchedule();
      });
    }
    
    onEvent("myScheduleDown", "click", function(event) {
        if (MSShowCounter < MSList.length){
          MSShowCounter++;
          MSshift++;
          updateMySchedule();
        }
    });
    
    onEvent("myScheduleUp", "click", function(event) {
        if (MSshift >= 1){
          MSshift--;
          updateMySchedule();
        }
    });
    
    function setScreenMySchedule(){
      MSshift = 0;
      getMSList();
      setScreen("mySchedule");
    }
    
    function updateMySchedule(){
      var index;
      var backArea;
      var circleArea;
      var tutorName;
      var tuteeName;
      var mDate;
      var mTime;
      var mOn;
      var mOff;
      var editButton;
      var viewButton;
      readRecords("Schedule", {}, function(records){
        MSShowCounter = 0;
        var y = 0;
        for (var j = MSshift; j<4+MSshift ; j++){
          y++;
          backArea = "mS" + y;
          circleArea = "msback" + y;
          tutorName = "mSTutor" + y;
          tuteeName = "mSTutee" + y;
          mDate = "mSDate" + y;
          mTime = "mSTime" + y;
          mOn = "mSOn"+ y;
          mOff = "mSOff" + y;
          editButton = "mSEdit" + y;
          viewButton = "mSView" + y;
          if (j >= MSList.length){
            hideElement(backArea);
            hideElement(circleArea);
            hideElement(tutorName);
            hideElement(tuteeName);
            hideElement(mDate);
            hideElement(mTime);
            hideElement(mOn);
            hideElement(mOff);
            hideElement(editButton);
            hideElement(viewButton);
          }
          else{
            var day = records[MSList[j]].day;
            var time = records[MSList[j]].time; 
            var tutor = records[MSList[j]].tutor;
            var tutee = records[MSList[j]].tutee;
            extraCheck(mOn, mOff, day, tutor, tutee, time, y);
            showElement(backArea);
            showElement(circleArea);
            showElement(tutorName);
            showElement(tuteeName);
            showElement(mDate);
            showElement(mTime);
            showElement(editButton);
            showElement(viewButton);
            MSShowCounter++;
            
            setText(tutorName, "Tutor: " + records[MSList[j]].tutor);
            setText(tuteeName, "Tutee: " + records[MSList[j]].tutee);
            setText(mDate, "Date: " + records[MSList[j]].day);
            setText(mTime, "Time: " + records[MSList[j]].time);
          }
        }
      });
    }
    
    function extraCheck(onButton, offButton, day, tutor, tutee, time){
        var oB = onButton;
        var oF = offButton;
        var dIndex;
        readRecords(day, {}, function(records){
          for (var i = 0; i<records.length; i++){
            if (records[i].tutor == tutor && records[i].tutee == tutee && records[i].time == time){
              if (records[i].isSignedUp){
                showElement(oB);
                hideElement(oF);
              }
              else{
                showElement(oF);
                hideElement(oB);
              }
            }
          }
        });
    }
    
    onEvent("mSEdit1", "click", function(event) {
      setEditSession(1);
    });
    onEvent("mSEdit2", "click", function(event) {
      setEditSession(2);
    });
    onEvent("mSEdit3", "click", function(event) {
      setEditSession(3);
    });
    onEvent("mSEdit4", "click", function(event) {
      setEditSession(4);
    });
    

// sign up for a session
    onEvent("sessionSSUResponse", "change", function(event){
      if (getText("sessionSSUResponse") != 0){
        showElement("sessionSSUSignUp");
      }
    });
    
    onEvent("sessionSSUSignUp", "click", function(event){
      var signUpDate = getText("sessionSSUDate").substring(6);
      readRecords(signUpDate, {}, function(records){
        for (var i = 0; i<records.length; i++){
          if (records[i].time == getText("sessionSSUTime").substring(6) && records[i].tutor == getText("sessionSSUName").substring(7)){
            updateRecord(signUpDate, {id: records[i].id, tutor: records[i].tutor, tutee: username, time: records[i].time, touch: records[i].touch, app: records[i].app, statement: getText("sessionSSUResponse"), isSignedUp: true, subject: records[i].subject, tutorUserID: records[i].tutorUserID, tuteeUserID: user}, function(record) {
            });
          }
        }
      });
      readRecords("Schedule", {}, function(records){
        for (var i = 0; i<records.length; i++){
          if (records[i].day == signUpDate && records[i].time == getText("sessionSSUTime").substring(6) && records[i].tutor == getText("sessionSSUName").substring(7)){
            updateRecord("Schedule", {id: records[i].id, tutor: records[i].tutor, tutee: username, tutorID: records[i].tutorID, time: records[i].time, day: records[i].day, tuteeID: user}, function(record) {
              setScreenMySchedule();
            });
          }
        }
      });
    });

// SessionTEdit
    var eIndex;
    var eHoldIndex;
    var eDate;
    function setEditSession(num){
      setChecked("STECheckBox", false);
      hideElement("sessionTEditDelete");
      var index = num - 1 + MSshift;
      index = MSList[index];
      eHoldIndex = index;
      var time;
      var tutorID;
      var tuteeID;
      readRecords("Schedule", {}, function(records){
        if (records[index].tutorID == user){
          eDate = records[index].day;
          setText("sessionTEditDropdown", eDate);
          tutorID = records[index].tutorID;
          tuteeID = records[index].tuteeID;
          time = records[index].time;
          readRecords(eDate, {}, function(records){
            for (var i = 0; i < records.length; i++){
              if (records[i].tutorUserID == tutorID && records[i].tuteeUserID == tuteeID && records[i].time == time){
                eIndex = i;
                setText("sessionTEditTime", records[eIndex].time);
                setText("sessionTEditApp", records[eIndex].app);
                setText("sessionTEditTutor", records[eIndex].subject);
                setText("sessionTEditTouch", records[eIndex].touch);
              }
            }
          });
          setScreen("SessionTEdit");
        }
      });
    }
    hideElement("sessionTEditApply");
    onEvent("sessionTEditTime", "change", function(event){
      showElement("sessionTEditApply");
    });
    onEvent("sessionTEditTime", "change", function(event){
      if (getText("sessionTEditTime") != ""){
        showElement("sessionTEditApply");
      }
    });
    onEvent("sessionTEditTouch", "change", function(event){
      if (getText("sessionTEditTouch") != ""){
        showElement("sessionTEditApply");
      }
    });
    onEvent("sessionTEditApp", "change", function(event){
      if (getText("sessionTEditApp") != ""){
        showElement("sessionTEditApply");
      }
    });
    onEvent("sessionTEditBack", "click", function(event){
      setScreenMySchedule();
    });
    
    onEvent("sessionTEditApply", "click", function(event){
      readRecords("Schedule", {}, function(records){
        updateRecord("Schedule", {id: records[eHoldIndex].id, day: getText("sessionTEditDropdown"), tutorID: records[eHoldIndex].tutorID, time: getText("sessionTEditTime"), tutor: records[eHoldIndex].tutor, tutee: records[eHoldIndex].tutee, tuteeID: records[eHoldIndex].tuteeID}, function(record){
        });
      });
      readRecords(eDate, {}, function(records){
        if (eDate != getText("sessionTEditDropdown")){
          var tutor = records[eIndex].tutor;
          var tutee = records[eIndex].tutee;
          var statement = records[eIndex].statement;
          var isSignedUp = records[eIndex].isSignedUp;
          var subject = records[eIndex].subject;
          var tutorUserID = records[eIndex].tutorUserID;
          var tuteeUserID = records[eIndex].tuteeUserID;
          deleteRecord(eDate,{id:records[eIndex].id},function(record){
          });
          createRecord(getText("sessionTEditDropdown"), {tutor: tutor, tutee: tutee, time: getText("sessionTEditTime"), touch: getText("sessionTEditTouch"), app: getText("sessionTEditApp"), statement: statement, isSignedUp: isSignedUp, subject: subject, tutorUserID: tutorUserID, tuteeUserID: tuteeUserID}, function(record) {
            setScreenMySchedule();
          });
        }
        else{
          updateRecord(eDate, {id: records[eIndex].id, tutor: records[eIndex].tutor, tutee: records[eIndex].tutee, time: getText("sessionTEditTime"), touch: getText("sessionTEditTouch"), app: getText("sessionTEditApp"), statement: records[eIndex].statement, isSignedUp: records[eIndex].isSignedUp, subject: records[eIndex].subject, tutorUserID: records[eIndex].tutorUserID, tuteeUserID: records[eIndex].tuteeUserID}, function(record) {
            setScreenMySchedule();
          });
        }
      });
    });

// delete session code, only tutor can delete their session
    setChecked("STECheckBox", false);
    onEvent("STECheckBox", "change", function(event) {
      if (getChecked("STECheckBox") == true){
        showElement("sessionTEditDelete");
      }
      else{
        hideElement("sessionTEditDelete");
      }
    });

    onEvent("sessionTEditDelete", "click", function(event){
      readRecords("Schedule", {}, function(records){
        deleteRecord("Schedule",{id: records[eHoldIndex].id},function(record){
        });
      });
      readRecords(eDate, {}, function(records){
        deleteRecord(eDate,{id:records[eIndex].id},function(record){
          MSshift = 0;
          getMSList();
          setMSInfo();
          setScreen("mySchedule");
        });
      });
    });

// set info on mySchedule screen
    var mSTATvalue=0;
    var mSTEvalue=0;
    
    function getTotalSessions(){
      return MSList.length;
    }
    
    function setTotalAsTutor(){
      var total = 0;
      readRecords("Schedule", {}, function(records){
        for (var i = 0; i<MSList.length; i++){
          if (records[MSList[i]].tutorID == user){
            total++;
            mSTATvalue = total;
            setText("mSTAT", "Total As Tutor: " + mSTATvalue);
          }
        }
      });
      setText("mSTAT", "Total As Tutor: " + mSTATvalue);
    }
    
    function setTotalAsTutee(){
      var total = 0;
      readRecords("Schedule", {}, function(records){
        for (var i = 0; i<MSList.length; i++){
          if (records[MSList[i]].tuteeID == user){
            total++;
            mSTEvalue = total;
            setText("mSTE", "Total As Tutee: " + mSTEvalue);
          }
        }
      });
      setText("mSTE", "Total As Tutee: " + mSTEvalue);
    }
    
    function setMSInfo(){
      setTotalAsTutor();
      setTotalAsTutee();
      setText("mSTS", "Total Sessions: " + getTotalSessions());
    }

// SessionTEdit + session view
    var vIndex;
    var vHoldIndex;
    var vDate;
    function setViewSession(num){
      hideElement("sessionViewCancel");
      setChecked("sessionViewCheckbox", false);
      showElement("sessionViewCheckbox");
      showElement("sessionViewLabel2");
      showElement("sessionViewProxy");
      var index = num - 1 + MSshift;
      index = MSList[index];
      vHoldIndex = index;
      var time;
      var tutorID;
      var tuteeID;
      readRecords("Schedule", {}, function(records){
          vDate = records[index].day;
          setText("sessionTEditDropdown", vDate);
          tutorID = records[index].tutorID;
          tuteeID = records[index].tuteeID;
          time = records[index].time;
          setText("sessionViewTime", "Time: " + time);
          readRecords(vDate, {}, function(records){
            for (var i = 0; i < records.length; i++){
              if (records[i].tutorUserID == tutorID && records[i].tuteeUserID == tuteeID && records[i].time == time){
                vIndex = i;
                setText("sessionViewTime", "Time: " + records[vIndex].time);
                setText("sessionViewApp", records[vIndex].app);
                setText("sessionViewTouch", records[vIndex].touch);
                setText("sessionViewTutor", "Tutor: " + records[vIndex].tutor);
                setText("sessionViewTutee", "Tutee: " + records[vIndex].tutee);
                setText("sessionViewStatement", records[vIndex].statement);
                setText("sessionViewDate", "Date: " + vDate);
              }
              if (records[i].tutorUserID == user){
                hideElement("sessionViewCheckbox");
                hideElement("sessionViewLabel2");
                hideElement("sessionViewProxy");
              }
              else{
                showElement("sessionViewCheckbox");
                showElement("sessionViewLabel2");
                showElement("sessionViewProxy");
              }
            }
          });
          lastScreen="mySchedule";
          setScreen("SessionView");
      });
    }
    
    setChecked("sessionViewCheckbox", false);
    onEvent("sessionViewCheckbox", "change", function(event) {
      if (getChecked("sessionViewCheckbox") == true){
        showElement("sessionViewCancel");
      }
      else{
        hideElement("sessionViewCancel");
      }
    });
    
    onEvent("sessionViewCancel", "click", function(event){ // cancel session (if tutee)
      readRecords("Schedule", {}, function(records){
        updateRecord("Schedule", {id: records[vHoldIndex].id, day: records[vHoldIndex].day, tutorID: records[vHoldIndex].tutorID, time: records[vHoldIndex].time, tutor: records[vHoldIndex].tutor, tutee: "", tuteeID: ""}, function(record){
        });
      });
      readRecords(vDate, {}, function(records){
        updateRecord(vDate, {id: records[vIndex].id, tutor: records[vIndex].tutor, tutee: "", time: records[vIndex].time, touch: records[vIndex].touch, app: records[vIndex].app, statement: "", isSignedUp: records[vIndex].isSignedUp, subject: records[vIndex].subject, tutorUserID: records[vIndex].tutorUserID, tuteeUserID: ""}, function(record) {
            setScreenMySchedule();
        });
      });
      setScreenMySchedule();
    });
    
    onEvent("sessionViewBack", "click", function(event){
      setScreen(lastScreen);
    });
    
    onEvent("mSView1", "click", function(event) {
      setViewSession(1);
    });
    onEvent("mSView2", "click", function(event) {
      setViewSession(2);
    });
    onEvent("mSView3", "click", function(event) {
      setViewSession(3);
    });
    onEvent("mSView4", "click", function(event) {
      setViewSession(4);
    });

// userSchedule - use viewingUser, which is the person of interest's userID
    onEvent("userInfoSS", "click", function(event) {
      lastScreen = "UserInfo";
      setScreenUserSchedule();
    });
    
    var Ushift = 0;
    var UShowCounter = 0;
    var UList = [];
    
    function setScreenUserSchedule(){
      Ushift = 0;
      setText("uSDropdown", "All");
      getUList();
      setScreen("UserSchedule");
    }

    // code for getting UList
    function getUList(){
      UList = [];
      var temp = [];
      var date;
      var tutor; //userID
      var tutee; // userID
      var time;
      var hold;
      if (getText("uSDropdown")=="All"){
        readRecords("Schedule", {},function(records){
          for (var m = 0; m<records.length;m++){
            if (records[m].tutorID == viewingUser && records[m].tutee == ""){
              UList.push(m);
            }
          }
           updateUserSchedule();
        });
      }
      else{
        readRecords("Schedule", {},function(records){
          for (var m = 0; m<records.length;m++){
            if (records[m].tutorID == viewingUser && records[m].tutee == "" && records[m].day==getText("uSDropdown")){
              UList.push(m);
            }
          }
           updateUserSchedule();
        });
      }
      setText("uSOpen", "Total Open Sessions: " + UList.length);
    }
    
    function updateUserSchedule(){
      UShowCounter = 0;
      var atutor;
      var ago;
      var adate;
      var atime;
      var abackground;
      var hold;
      readRecords("Users", {}, function(records){
        for (var i =0; i<records.length;i++){
          if (records[i].userID == viewingUser){
            setText("uSTitle", records[i].username + "'s Schedule");
          }
        }
      });
      readRecords("Schedule", {}, function(records){
        UShowCounter = 0;
        var y = 0;
        for (var j = Ushift; j<4+Ushift ; j++){
          y++;
          atutor = "uSTutor" + y;
          ago = "uSGo"+ y;
          adate = "uSDate" + y;
          atime = "uSTime" + y;
          abackground = "uS" + y;
          if (j >= UList.length){
            hideElement(abackground);
            hideElement(atime);
            hideElement(adate);
            hideElement(ago);
            hideElement(atutor);
          }
          else{
            showElement(abackground);
            showElement(atime);
            showElement(adate);
            showElement(ago);
            showElement(atutor);
            UShowCounter++;
            setText(atutor, "Tutor: " + records[UList[j]].tutor);
            setText(adate, "Date: " + records[UList[j]].day);
            setText(atime, "Time: " + records[UList[j]].time);
            setText("uSTitle", records[UList[j]].tutor + "'s Schedule");
            setText("uSOpen", "Total Open Sessions: " + UList.length);
          }
        }
      });
    }
    
    
    onEvent("uSDown", "click", function(event) {
        if (UShowCounter < UList.length){
          UShowCounter++;
          Ushift++;
          updateUserSchedule();
        }
    });
    
    onEvent("uSUp", "click", function(event) {
        if (Ushift >= 1){
          Ushift--;
          updateUserSchedule();
        }
    });
    
    
    function goToSessionSignUpUS(num){ // num = 1 is the first go to button, num = 5 is the last and fifth go to button
      var index = num - 1 + Ushift;
      var date =  getText("uSDate" + num).replace("Date: ","");
      readRecords("Schedule", {}, function(records){
        setText("sessionSSUName", "Tutor: " + records[UList[index]].tutor);
        setText("sessionSSUTime", "Time: " + records[UList[index]].time);
        setText("sessionSSUDate", "Date: " + date);
      });
      setScreen("SessionSSignUp");
    }
    
    onEvent("uSDropdown", "change", function(event){
      Ushift = 0;
      getUList();
    });
    
    onEvent("uSGo1", "click", function(event) {
      goToSessionSignUpUS(1);
    });
    onEvent("uSGo2", "click", function(event) {
      goToSessionSignUpUS(2);
    });
    onEvent("uSGo3", "click", function(event) {
      goToSessionSignUpUS(3);
    });
    onEvent("uSGo4", "click", function(event) {
      goToSessionSignUpUS(4);
    });
    
    onEvent("uSBack", "click", function(event) {
      setScreen(lastScreen);
      lastScreen = "SessionList";
    });
    
    
// kernels
  function setKernels(user, place){
    var total = 0;
    readRecords("Schedule", {}, function(records){
      for (var i = 0; i<records.length;i++){
        if (records[i].tutorID == user && records[i].tuteeID != ""){
          total++;
        }
      }
      readRecords("Kernels", {}, function(records){
        for (var i = 0; i<records.length;i++){
          if (records[i].userID == user){
            updateRecord("Kernels", {id: records[i].id, userID: records[i].userID, kernels: total}, function(records){
              setText(place, total);
            });
          }
        }
      });
    });
  }

  onEvent("myRavenWAK", "click", function(event){
    setScreen("Kernels");
  });
  
  onEvent("kernelsBack", "click", function(event){
    setScreenMyRaven();
  });


