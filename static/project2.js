var nick="";
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
          channel_list = channel_list + "#" + data[d] + "<br>";
        }
        document.querySelector("#channel-list").innerHTML=`<div class="channel-list">${channel_list}</div>`;
    });
});
