const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const firebaseAuth = requer('./auth.json');
const firebase = require("firebase/app");
const auth = require("firebase/auth");
const ScheduleRepo = require("./ScheduleRepo.js");

// Initialize Firebase
firebase.initializeApp(firebaseAuth);

var  botActions = new Map();

client.on('ready', () => {
	botActions.set('ping', MessageText);
	botActions.set('Is a hotdog a sandwich?', MessageText);
	botActions.set('schedule', ScheduleCreateEvent);
	botActions.Set('listEvents', ListScheduledEvents);
	
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Doubling down on being bold.");
});

function MessageText(text, msg){
	if(text === 'ping'){		
		msg.reply('pong');
	}
	
	if(text === 'Is a hotdog a sandwich?') {
		msg.reply('Of course it is, you filthy casual.');
	}
}

function ScheduleCreateEvent(MessageList, msg){
	//example request -> !boldBot schedule destiny raid 10/25/19 7:00pm
    
    console.log(MessageList.toString());
    console.log(msg.author.id);

    if (MessageList.length != 6) {
      //msg.author.send('u r dum');
      msg.channel.send("Invalid syntax, please use 'gameName gameMode date time'. ex. !BoldBot schedule pingpong Tourney 10/22/2019 7:00pm");
      return;
    }

    var [prefix, action, game, gameMode, date, time] = MessageList;
    var creatorId = msg.author.id;

    var committed = ScheduleRepo.CreateScheduleData(game, gameMode, date, time, creatorId);
	if(!committed){
		msg.channel.send('Error Occured while saving');
	}
	else {
		msg.channel.send(`Got it. ${game} ${gameMode} scheduled for ${date} at ${time}.`);
	}
}

function ListScheduledEvents(MessageList, msg){
	var msgString = "List of events incoming: \n\n";
    var results;
	
	var result = ScheduleRepo.GetUpcomingScheduledEvents();

    result.forEach( event => msgString += `${event.Game} ${event.GameMode} scheduled for ${event.DateTime}.\n\n`);
    await msg.channel.send(msgString);

}

client.on('message', async msg => {

  if(msg.author.bot) return;
  
  var messageList = msg.content.split(" ");
	
  if(messageList[0] !== config.prefix) return;

  if (messageList[1]  === 'ping' || messageList[1]  === 'Is a hotdog a sandwich?') {
    functions[messageList[1]](messageList[1], msg);
  }

  if(botActions.has(messageList[1])){
	  botActions.get(messageList[1])(MessageList, msg);
  }

});


client.login(auth.token);