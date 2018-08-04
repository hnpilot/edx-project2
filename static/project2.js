var nick="";
var channel="";
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

function hasNick() {
  if (localStorage.getItem('nick')){
    return localStorage.getItem('nick');
  } else {
    document.querySelector("#flack").style="display: none";
    return false;
  }
}

function selectChannel(chname) {
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  if (channel != '' && document.querySelector("#channel-" + channel))
    document.querySelector("#channel-" + channel).style.backgroundColor='#fff';
  localStorage.setItem('channel', chname);
  channel=chname;
  if (document.querySelector("#channel-" + chname)) {
    document.querySelector("#channel-" + chname).style.backgroundColor='#ccc';
    socket.emit('show channel', {'channel': channel});
  } else {
    channel="";
    localStorage.setItem('channel', channel);
  }
}

document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#create-channel').onclick = () => {
          const channel = document.querySelector('#new-channel').value;
          socket.emit('create channel', {'name': channel});
        };
        nick=hasNick();
        if (nick) {
          document.querySelector("#ask-nick").innerHTML=``;
          document.querySelector("#nick-label").innerHTML=`@${nick}`;
          socket.emit('get channels');
        }
    });

    socket.on('refresh channels', data => {
        let channel_list="";
        for (d in data) {
          channel_list = channel_list + "<span class='channel-links' id='channel-" + data[d] + "'' onClick=\"selectChannel('" + data[d]  + "')\";>#" + data[d] + "</span><br>";
        }
        document.querySelector("#channel-list").innerHTML=`<div class="channel-list">${channel_list}</div>`;
        if (localStorage.getItem('channel')){
          selectChannel(localStorage.getItem('channel'));
        }
    });

    document.querySelector('#just-saying-btn').onclick = () => {
      if (channel!="") {
        const msg = document.querySelector('#just-saying').value;
        document.querySelector('#just-saying').value="";
        if (msg.length>0)
          socket.emit('add message', {'channel': channel,'message' : msg, 'nick': nick});
      }
    };

    socket.on('refresh channel', data => {
        let channel_contents="";
        console.log(data);
        console.log(channel);
        if (data.channel==channel) {
          for (d in data.messages) {
            channel_contents += data.messages[d] + "<br>";
          }
          document.querySelector("#channel-contents").innerHTML=`${channel_contents}`;
      }
    });
});
