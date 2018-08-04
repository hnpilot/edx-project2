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

function setNick() {
  nick = document.querySelector('#nick').value;
  if (nick.length>3) {
    localStorage.setItem('nick', nick);
    document.querySelector("#ask-nick").innerHTML=`<h3>Hello ${nick}!</h3>`;
    buildChannels();
  }
}

function selectChannel(chname) {
  if (channel != '')
    document.querySelector("#channel-" + channel).style.backgroundColor='#fff';
  localStorage.setItem('channel', chname);
  channel=chname;
  document.querySelector("#channel-" + chname).style.backgroundColor='#ccc';
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
});
