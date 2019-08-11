/**
 *  Function to build an emergent graph using links.
 */

/**
 * Interface for the reciprocal links.
 * Should be called once.
 *
 * Assumes that the data has the same structure as the normal data
 * but speakers are included.
 *
 * @param data: assumes data structure is IRI based.
 */
let emergent = function (data) {

    //set of all speakers
    let speakers = new Set();

    //set of the annotations
    let annotators = new Set();

    //list to hold an object with name and a count
    let linkcounts = [];

    data.forEach(datum => {
        const op = ':';

        //get the session authors
        if (datum["title"].indexOf(op) < 0) {
            //we don't split authors here. May be a todo at some point?
            speakers.add(datum["title"].trim());
        }
        else {
            //assume a tweeter not speaker
            let notetaker = findAnnotation(op, datum['description']);
            //annotators.add(notetaker);

            //simple count of appearances of the author
            annotators[notetaker]++;
        }

    });


};

/**
 * Function to split the data and returns the speaker
 * Format is author: text
 * @param operator
 * @param notation
 */
let findAnnotation = function (operator, notation) {
    return notation.split(operator)[0];
};

/**
 * Get the link density of a particular term
 * @param dataSet
 * @param term
 */
let linkDensity = (dataSet, term) => {
    let allLinks = 0;
    //get the terms
    const localSet = dataSet.filter( d => {
        allLinks++;
        if ( d["polemic"].indexOf(term) > -1){ return d}
    });

    localSet.forEach(ls => {
        let total = 0;
        localSet.filter(l => {if (l === ls) { total++ } });
        console.log(total / allLinks);
        //@todo: make into a note
    });
};