import os
import requests

from flask import Flask,render_template, request
from flask_socketio import SocketIO, emit
from logging import FileHandler, WARNING

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels={}
file_handler = FileHandler('error.log')
file_handler.setLevel(WARNING)

app.logger.addHandler(file_handler)

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("create channel")
def create_channel(data):
    name=data["name"].replace(' ', '-')
    if name in channels:
        app.logger.info('Channel exists')
    else:
        channels[name]=[]
        lister=list(channels.keys())
        emit("refresh channels", lister, broadcast=True)

@socketio.on("get channels")
def get_channels():
    lister=list(channels.keys())
    emit("refresh channels", lister, broadcast=True)

@socketio.on("add message")
def add_comment(data):
    output={}
    channel=data["channel"]
    message=data["message"]
    nick=data["nick"]
    channels[channel].append("@" + nick +": " +message)
    output['messages']=channels[channel]
    output['channel']=channel
    emit("refresh channel",output,broadcast=True)

@socketio.on("show channel")
def show_channel(data):
    output={}
    app.logger.info(data)
    output['messages']=channels[data["channel"]]
    output['channel']=data["channel"]
    emit("refresh channel",output,broadcast=True)
