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
    name=data["name"]
    if name in channels:
        app.logger.info('Channel exists')
    else:
        app.logger.info('Create channel')
        channels[name]="Empty so far"
        lister=list(channels.keys())
        emit("refresh channels", lister, broadcast=True)

@socketio.on("get channels")
def get_channels():
    app.logger.info('Getting channels first')
    lister=list(channels.keys())
    emit("refresh channels", lister, broadcast=True)
