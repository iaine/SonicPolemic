var Playground = function () {

    this.data = [];
    this.mapData = [];
    //this.x = this.getX();
    //this.y = this.getY();
    this.z = 295;
    this.commands = [];
    this.id = Date.now();
    this.startX = Math.floor(window.innerWidth / 2);
    this.startY = Math.floor(window.innerHeight / 2);
    this.tones = new Map();
    this.history = [];
    this.MILLIS = 100000;
};