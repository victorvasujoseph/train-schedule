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
    database.ref().push({
        name: $("#text-train-name").val(),
        destination: $("#text-destination").val().trim(),
        time: $("#text-time").val().trim(),
        frequency: $("#text-frequency").val().trim()
    });

});