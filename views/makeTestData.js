let fs = require('fs');
/**
 * Random Generator
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 *
 * @param max
 * @returns {number}
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//seed the test data with the PolemicTweet variables
let variables = ['','++', '+-', '-+', '--'];

let tags = ['SmartCity', 'macron', 'insertion'];


let testData = [];
/**
 * Generate an amount of test data using a random seed to put in a
 * test variable
 */
for (let i = 0; i < 100; i++) {
    let _t = variables[getRandomInt(4)] + " This is a test string " + tags[getRandomInt(3)];

    testData.push({ 'time': new Date().getTime(), 'text' : _t });
}

let c = JSON.stringify(testData);

console.log(c);

