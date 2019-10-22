function CreateScheduleData(game, gameMode, date, time, creatorId){
	firebase.database().ref('Schedule/' + GetScheduleHash(game, gameMode, date, time)).set({
    Game: game,
    GameMode: gameMode,
    Creator : creatorId,
	DateTime: getFormatedDateTime(date, time)
	Participants: [creatorId]
  }, function(error) {
    if (error) {
      return false;
    } else {
      return true;
    });
}

function UpdateScheduleData(game, gameMode, date, time, creatorId){

	var timeStamp = DateTime
	var updateData ={
		Game: game,
		GameMode: gameMode,
		Creator : creatorId,
		DateTime: getFormatedDateTime(date, time)
	}
	
	var updates = {};
	updates['/Schedule/'+GetScheduleHash(game, gameMode, date, time)] = updateData;
	
	return firebase.database().ref().update(updates);
}

function RemoveScheduleData(game, gameMode, date, time, creatorId){
	var canRemove = false;
	
	var hash = GetScheduleHash(game, gameMode, date, time);
	
	firebase.database().ref('/Schedule/' + hash).once('Creator').then(function(snapshot){
		var creator = snapshot.val();
		if(creator === creatorId){		
			return firebase.database().ref('Schedule/' + GetScheduleHash(game, gameMode, date, time)).remove();
		}
	}
	
}

function SignUpScheduleData(game, gameMode, date, time, participant){
	var updateData ={}
	var hash = GetScheduleHash(game, gameMode, date, time);
	
	firebase.database().ref('/Schedule/' + hash).once('Participants').then(function(snapshot){
		var participants = snapshot.val();
		participants.push(participant);
		updateData[Participants] = participants;
	}
	
	var updates = {};
	updates['/Schedule/'+hash] = updateData;
	
	
	return firebase.database().ref().update(updates);
}

function GetUpcomingScheduledEvents(){
	var now = new Date().now();
	
	var query = firebase.database().ref('/Schedule/').orderbyChild('DateTime').startAt(now);
	
	query.on("value", function(snapshot){
		return snapshot.val();
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	
	ref.off();
	return [];
}

function getFormatedDateTime(date, time){
	var tmp = time.toLower();
	if(tmp.contains('pm')){
		tmp = tmp.replace('pm', ' PM');
		
	}
	else if(tmp.contains('am') ){
		tmp = tmp.replace('am', ' AM');
	}
	
	return new Date(date + ' ' + tmp);
	
}

function GetScheduleHash(game, gameMode, date, time){
	var scheduleName = game+gameMode+date+time;
	return scheduleName.hashCode()
}