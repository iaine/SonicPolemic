/**
 * Code to generate some test data with different times
 * and entities from Polemic Language
 */

/**
 *
 * @type {number}
 */
const nowTime = new Date().getTime();

const oldTime = nowTime - (24 * 60 * 60 * 1000);

const  polemicLang = ['++', '+-', '-+', '--'];

let makeRandom = function (nowTime, oldTime) {
    return Math.floor(Math.random() * (nowTime - oldTime + 1)) + oldTime;
};

let genData = [];

for (let i=0; i<=10;i++) {
    let tmpTime = makeRandom(nowTime, oldTime);
    let polemicSign = polemicLang[makeRandom(0, 3)];

    //@todo: make the polemicSign more random
    genData.push({time: tmpTime, text: polemicSign + " test data "});

}

console.log(JSON.stringify(genData));