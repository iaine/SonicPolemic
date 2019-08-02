//Plain Old Timeline Object

//set up the session counter
let sessionId = 0;
/**
 * Function for the timeline.
 *
 * Assume it is given a JSON object.
 * There are no controls to dive into data yet
 * @param tld - data object from response.
 */
let timeline = function (tld) {
    let audioCtx = new AudioContext();
    const tldata = JSON.parse(tld);

    tldata.forEach( tl => {
        //divide into sessions and notation events
        //@todo: how tied to existing data is this?
        //What does it assume about the difference between them?
        //that they are two streams?
        if (tl['end'] > tl['begin']) {
            //we're in a session now
            handleSession(audioCtx, tl);
        } else {
            handleEvent(audioCtx, tl);
        }
    });
};

/**
 * Function to encapsulate the session
 * @param tlevent
 */
let handleSession = function(audio, tlevent) {
    const n = new Note();
    const _sound = mapToNote('session', (tlevent['end'] - tlevent['begin'])/10000,
        tlevent['begin']/10000, sessionId++);
    n.simpleTone(audio, _sound);
};

/**
 * Function to handle the annotation event
 * @param tlevent
 */
let handleEvent = function (audio, tlevent) {
    console.log(tlevent);
    const n = new Note();
    //annotation durations are arbitrary. Does this change?
    const _sound = mapToNote('event', 0.2, tlevent['begin']/10000);
    n.simpleTone(audio, _sound);
};

/**
 * Handle the mapping to the expected sound object
 * @param tlType - is this a session or an event?
 * @param duration - the length of the note.
 * @param id - the begin time using the event time.
 * @param sessionid - optional time to alter the session note.
 */
let mapToNote = function (tlType, duration, id, sessionid=0) {
    let sound = {};
    switch (tlType) {
        case 'event':
            console.log('event ' + id);
            //event sound mapped to C4
            sound.freq = 261.63;
            break;
        case 'session':
            //sound is set to C3 as bass.
            sound.freq = calculateNewNote(130.81, sessionid);
            break;
        default:
            throw Error('Cannot map this type ' + tlType);
    }
    sound.id = id;
    sound.dur = duration;
    sound.vol = 0.5;

    return sound;
};

/**
 * Constant of the power 2 (1/12) for the note calculations.
 * @type {number}
 */
const power = Math.pow(2, 1 / 12);

/**
 * Function to calculate a new frequency given a base note and
 * the number of steps to be taken between them.
 * @param base
 * @param newnote
 * @returns {number}
 */
let calculateNewNote = function calculateNewNote(base, newnote) {
    return base * Math.pow(power, newnote);
};

/**
 * Interface to get the data.
 * Catches the exceptions as well.
 * @param urlstring
 */
var getNotationData = function(urlstring) {
    try {
        fetch(urlstring)
            .then(function(jresponse) {
                return jresponse.json();
            })
            .then(function(jsonResponse) {
                timeline(jsonResponse);
            })
    } catch (Exception) {
        //@todo Sonify the error!
        console.log('Timeline Error: ' + Exception.toString());
    }
};