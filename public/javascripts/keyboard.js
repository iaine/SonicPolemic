var noteModel = [{'note': 'C3', 'tone': 130.81},
    {'note': 'C#3', 'tone': 138.59},
    {'note': 'D3', 'tone': 146.83},
    {'note': 'D#3', 'tone': 155.56},
    {'note': 'E3', 'tone': 164.81},
    {'note': 'F3', 'tone': 174.61},
    {'note': 'F#3', 'tone': 184.997},
    {'note': 'G3', 'tone': 195.998},
    {'note': 'G#3', 'tone': 207.65},
    {'note': 'A3', 'tone': 261.25},
    {'note': 'A#3', 'tone': 233.09},
    {'note': 'B3', 'tone': 246.94},
    {'note': 'C4', 'tone': 261.62},
    {'note': 'C#4', 'tone': 277.18},
    {'note': 'D4', 'tone': 293.66},
    {'note': 'D#4', 'tone': 311.13},
    {'note': 'E4', 'tone': 329.63},
    {'note': 'F4', 'tone': 349.23},
    {'note': 'F#4', 'tone': 369.99},
    {'note': 'G4', 'tone': 391.995},
    {'note': 'G#4', 'tone': 415.30},
    {'note': 'A4', 'tone': 440.00},
    {'note': 'A#4', 'tone': 466.16},
    {'note': 'B4', 'tone': 493.88}];

//Keyboard constants
var keyboard = '';
var sel = '';

/**
 * Function to put raise keyboard
 *
 * @param divId - box div
 * @param selectDiv - div to set the selection
 */
createKeyboard =  (divId, selectDiv, parentDiv) => {
    keyboard = document.getElementById(divId);
    let build = '<div id="keys">';
    noteModel.forEach(e => {
        let tmp = (e.note.length === 3) ? "sharpkey": "key";
        build += '<div id="' + tmp +'" onclick="playNote(\''+ e.note +'\','+ e.tone +',' +
            '\''+ selectDiv +'\', \''+ parentDiv +'\')"></div>';
    });
    build += '<div onclick="removeKeyboard()">Clear</div></div>';

    keyboard.innerHTML = build;
};

removeKeyboard = () => {
    keyboard.innerHTML = '';
};

/**
 * Function to play the note and add to the div object
 *
 * @param tone - the name of the tone
 * @param noteValue - the frequency of the tone
 * @param selectNote - the div to attach the data
 * @param parentDiv - the parent div for the input value
 */
playNote = (tone, noteValue, selectNote, parentDiv,) => {

    sel = document.getElementById(selectNote);

    sel.value = '(' + noteValue + ')' + tone ;
    let audioCtx = new AudioContext();
    let x = Math.floor(window.innerWidth/2);
    let note = new Note();

    note.simpleTone(audioCtx, {freq:noteValue, dur:1, vol:1, pos:x, id:1});
    updateFreq(parentDiv, selectNote);
};

