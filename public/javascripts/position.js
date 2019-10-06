/**
 *  Set up the main tags
 *
 *  @todo: Link to coordinate to the front end?
 */

var x = document.getElementById("x");
var y = document.getElementById("y");
var z = document.getElementById("z");
var filter = document.getElementById("filter");

//set up the Canvas to be across the browser but half its height
var width = window.innerWidth;
var height = window.innerHeight/2;

//set the AudioContext
var audioCtx = new AudioContext();

let startTime = '';

var setStart = (timeObj) => startTime = timeObj;

/**
 * Store the key of the type against the value with the {x,y,z,freq}
 */
let storeMap = function(key, valueObj) {
   sessionStorage.setItem(key, valueObj);
};

/**
 * Fetch the key from the coordinates
 * @param key
 * @returns {string}
 */
let fetchMap = function (key) {
    return sessionStorage.getItem(key);
};

/**
 *
 * Filter data array by an array of keys
 * Returns a map of objects
 * @param searchKeys
 * @param searchData
 * @returns {Array of Objects}
 */
var searchForEntity = function (searchKeys, searchData) {

    return  searchData.map( search => {
        let dataEnt = [];
        searchKeys.forEach(s => dataEnt.push({s : search.indexOf(s)}) );
        return { 'coords' : dataEnt };
    });
};

/**
 *
 * @param start
 * @param dataTime
 * @returns {number}
 */
var alignTime = function (start, dataTime) {
    return (start - dataTime);
};

/**
 *
 * @param dataObjects
 * @returns {Array}
 */
var alignTimeObjects = function (dataObjects) {
    return dataObjects.map(d => { return { 'align' : alignTime(startTime, d['time'])}; });
};

//set up the id for position. Fixes collisions.
//@todo does WAA do anything similar?
var id = 0;

/**
 * Function to get data
 */
let soundNotes = function (dtype, play, id) {

    let note = Note();

    let pos = envelope[dtype];
    //let pos = JSON.parse(fetchMap(dtype));

    //this test if there is data. Better to check the key higher up?
    if (pos) {
        console.log(pos);
        const sound = {freq: pos.freq, volume: 0.5, dur: 0.5};
        note.threeDimension(audioCtx, sound, pos,id, play);
    } else {
        //Identified a tag but not marked up. So centre again.
        note.threeDimension(audioCtx, {freq: 330.25, volume: 0.5, dur: 0.5},
            {x: play.startX, y: play.startY, z: play.z}, id, play);
    }
};

function timeline(myJson) {
    var play = new Playground();

    //const earlyDate = myJson[0].time;
    JSON.parse(myJson).forEach(my => {
        //reset the index based on the time data sent.
        //id = my.time - earlyDate;
        const id = my['begin'] / play.MILLIS;

        if (my['end'] > my['begin']) {
            let note = new Note();
            note.simpleTone(audioCtx,
                {freq: 231.21, dur: (my['end'] / play.MILLIS), vol: 0.5, id: id})
        } else {
            //searching for the polemic language.
            //@todo: Refactor this? Is it tied to PolemicLanguage?
            console.log('Polemics ' + my['content']['polemics']);
            if (my['content']['polemics'].includes('OK')) {
                soundNotes('OK', play, id);
            } else if (my['content']['polemics'].includes('REF')) {
                soundNotes('REF', play, id);
            } else if (my['content']['polemics'].includes('Q')) {
                soundNotes('Q', play, id);
            } else if (my['content']['polemics'].includes('KO')) {
                soundNotes('KO', play, id);
            } else {
                let note = new Note();
                note.threeDimension(audioCtx, {freq: 330.25, volume: 0.5, dur: 0.5},
                    {x: play.startX, y: play.startY, z: play.z}, id, play);
            }
        }
    });
}

var getData = function (url, sonification) {

    fetch('../data/' + url)
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(sonification);
            sonification(myJson);
        });
};

/**
 * Interact to begin the editing
 * @param filterType
 */
var setFilter = function(filterType) {
    document.addEventListener("dblclick", showClickEvent);
    console.log('setFilter ' + filterType);
    filter.value = filterType;
};

/**
 * Stop the event listener
 */
var stopFilter = function () {
    document.removeEventListener("dblclick", showClickEvent);
};


/**
* Function to mark the coordinates on a canvas
  * The one in red in the middle is default.
 * The marks in green are user driven elements
 *
 * @param coords - Array of coordinates
 *
 * @todo refactor the marks code
 * @todo: move this to a component section.
 */
function mark_image(coords) {
    var cnvs = document.getElementById("myCanvas");
    var ctx = cnvs.getContext("2d");

    cnvs.style.position = "absolute";
    cnvs.style.left = "10px";
    cnvs.style.top = "10px";
    cnvs.width = width;
    cnvs.height = height;
    cnvs.style.width = width;
    cnvs.style.height = height;

    // Mark the central point
    ctx.beginPath();
    ctx.arc(width/2, height/2, 10, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#950aff';
    ctx.stroke();
    for (let i in coords) {
        storeMap(coords[i]['symbol'],
            JSON.stringify({'x':coords[i].x, 'y': coords[i].y, 'z': coords[i].z, 'freq': coords[i].freq}))

        ctx.beginPath();
        ctx.arc(coords[i].x, coords[i].y, 10, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00ff00';
        ctx.stroke();
    }
    ctx.save();
}

/**
 *  Show click event in the UI
 *  @todo Add in the percentage to map the canvas to the screen
 */
var showClickEvent = function(evt) {
    x.value = evt.clientX;
    y.value = evt.clientY;
    storeClickEvent(evt.clientX, evt.clientY);
};

/**
 *  Store the click event
 */
var storeClickEvent = function(xpoint, ypoint) {
    coord.push({'x': xpoint, 'y': ypoint});
};
