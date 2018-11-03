console.log('connected!!');

var config = {
    apiKey: "AIzaSyAB5ntX0mHHJCSd__5OFa5nSMxtGvBofVM",
    authDomain: "ucb-victor.firebaseapp.com",
    databaseURL: "https://ucb-victor.firebaseio.com",
    projectId: "ucb-victor",
    storageBucket: "ucb-victor.appspot.com",
    messagingSenderId: "431763745217"
  };

  firebase.initializeApp(config);

var database = firebase.database();

database.ref().on("child_added", function (snapshot) {
    var val = snapshot.val();    
    createNewRow(val);

}, function (errorObject) {
    console.log("Error " + errorObject.code);
});

var createNewRow = function (data){

    var timeObj = getTimeObj(data);

    var newRow = $("<tr>");
    var nameCell = $("<td class='name'>").text(data.name);
    var destinationCell = $("<td class='destination'>").text(data.destination);
    var frequencyCell = $("<td>").text(data.frequency);
    var nextArrivalCell = $("<td class='nextArrival' >").text(timeObj.nextArrival);
    var minutesAwayCell = $("<td>").text(timeObj.minutes);
    
    newRow.append(nameCell, destinationCell, frequencyCell, nextArrivalCell, minutesAwayCell);
    $("table").append(newRow);

}

var getTimeObj = function(data){

    var firstTrainTimeConverted = moment(data.time, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    var timeRemainder = diffTime % parseInt(data.frequency);
    var minutes = parseInt(data.frequency) - timeRemainder;
    var nextArrival = moment().add(minutes, "m").format("hh:mm A");

    return timeObj = {
        "nextArrival":nextArrival,
        "minutes":minutes,
    }
}


$("#submit").on("click", function () {
   
    event.preventDefault();
    var trainName = $("#text-train-name").val().trim();
    var destination = $("#text-destination").val().trim();
    var trainTime = $("#text-time").val().trim();
    var trainFrequency = $("#text-frequency").val().trim();

    if(trainName.length === 0 || destination.length === 0 || trainTime.length === 0 || trainFrequency.length ===0){
        alert("Train name, Destination, Train Time & Frequency are Mandatory");
    }else{
        console.log("push to firebase");
        database.ref().push({
            name: trainName,
            destination: destination,
            time: trainTime,
            frequency: trainFrequency
        });

    }

});