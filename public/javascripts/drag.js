const editor = document.getElementById("editor");

let dragged = null;

//set up the parse tree for the functions
var envelope = {};


function allowDrop(ev) {
    ev.preventDefault();
}

setSource = (datasource) => {
  envelope.source = datasource + ".json";
};

/**
 * Set the text in the draggable item.
 * @param ev
 */
function drag(ev) {
    const zval = ev.target.getAttribute("data-z-value");
    const zvalue = ( zval == null || zval === ' ') ? 0 : zval;

    const functionName = (! ev.target.getAttribute("data-polemic")) ?
        ev.target.getAttribute("data-function"): ev.target.getAttribute("data-polemic");

    ev.dataTransfer.setData("text",
        JSON.stringify({ name: functionName,
            function : ev.target.getAttribute("data-function"),
            id: ev.target.id,
            value: ev.target.getAttribute("data-value"),
            z: zvalue
        }));
    dragged = ev.target;
    //style with border on transfer
    ev.target.style.border = "2px solid red";
}

/**
 * Drop the item and set the data in the dragged item.
 * @param ev
 */
function drop(ev) {
    ev.preventDefault();
    dragged.style = '';

    let data = JSON.parse(ev.dataTransfer.getData("text"));

    let _divid = document.getElementById(data.id);
    ev.target.appendChild(_divid);

    const x = ev.pageX;
    const y = ev.pageY;

    setCoordinates(data.id, editor, x, y);

    // assume that tool box is less than 200 pixels.
    if (x > 200) {
        setData(data.name, data.value, x, y, data.z);
    } else {
        // if it appears that we're in toolbox, remove the div
        removeData(data.name);
    }
}

/**
 * Method to set the position. Needs to account for the position of the box and the
 * offsets in the div.
 * @param divId
 * @param containerId
 * @param ev
 */
function setCoordinates(divId, containerId, x, y) {
    const div = document.getElementById(divId);

    div.style.position = 'absolute';
    div.style.left = x - div.offsetWidth/2  + 'px';
    div.style.top = y - div.offsetHeight/2 + 'px';
}

/**
 * Function to get the set up the data array with objects relating
 * to the drop.
 *
 * @param id - key for storage
 * @param value - frequency
 * @param x - the x axis
 * @param y - the y axis
 * @param z - the z axis
 */
function setData(id, value, x, y, z) {
    envelope[id] = {freq: parseFloat(value), x:x, y:y, z: parseInt(z)};
}

/**
 * Function to remove a block from the data
 * @param id
 */
function removeData(id) {
   envelope[id]={};
}

/**
 * Access existing data.
 * @param id
 * @returns {any}
 */
function retrieveData (id) {
    return envelope[id];
}

/**
 * Allow a div to be made draggable.
 *
 * @param divId
 */
function makeDraggable (divId) {
    divId.draggable = true;
}

/**
 * Change the z index and update the tree
 *
 * @param event
 */
function changeZHandler(event) {
    const originalWidth = 150;

    const divid = document.getElementById(event.target.id);
    //needs to be a constant value or works off resized values
    divid.parentElement.style.width = originalWidth * ((event.target.value/100)/10).toString() + 'px';
    divid.parentElement.setAttribute('data-z-value', event.target.value);

    const name = divid.parentElement.getAttribute("data-polemic");
    const existing = envelope[name];
    setData(name, existing.value, existing.x, existing.y, event.target.value);
}

/**
 * Change the datasource and update the tree
 *
 * @param event
 */
function changeDataHandler(event) {

    const divid = document.getElementById(event.target.id);
    //needs to be a constant value or works off resized values
    divid.parentElement.setAttribute('data-value', event.target.value);

    const name = divid.parentElement.getAttribute("data-function");
    const existing = retrieveData(item);
    setData(name, existing.value, existing.x, existing.y, event.target.value);
}

/**
 * Event listener to run the changes in the background
 */
document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="zvalue"]').onchange=changeZHandler;
    document.querySelector('select[name="zvalue1"]').onchange=changeZHandler;
    document.querySelector('select[name="zvalue2"]').onchange=changeZHandler;
    document.querySelector('select[name="zvalue3"]').onchange=changeZHandler;
},false);




/* Slider Javascript */
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
    MILLIS = this.value;
};

/**
 * Function to update the frequency
 * @param divId
 * @param inputId
 */
var updateFreq = function(divId, inputId) {
    const val = document.getElementById(inputId).value;
    const div =  document.getElementById(divId);
    div.setAttribute('data-freq', val);
    const name = div.getAttribute('data-polemic');
    const existing = envelope[name];
    let cleanVal = val.split(')')[0].replace('(','');
    setData(name, cleanVal, existing.x, existing.y, existing.z);
};

/* Create Draggable items*/
var createDraggableBox = function(parentDiv, divName, divId, inputId) {

    const child = document.createElement(divName);
    child.setAttribute('id', divId);
    child.ondragstart='drag(event)';
    child.draggable = true;
    //@todo: add input
    child.innerHTML = 'input<type="text" id="'+inputId +'" oninput="updateFreq(\''+ divId+'\', \''+ inputId+'\')">';

    // add to the parent div.
    document.getElementById(parentDiv).appendChild(child);
};

//decision to leave with timeline. We'll do emergent in text.
/**
 * Function to run the code.
 */
function compile() {
//needs to run the timeline.
    getData(envelope.source, timeline);
}

