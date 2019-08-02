var assert = require('assert');
var drag = require('../public/javascripts/drag');

describe('Envelope functions', function() {
    var envelope = {};
    describe('set data', function() {
        it('should return envelope when entry given', function() {
            assert.notStrictEqual(envelope.length, 0);
            drag.setData('test', "246.67", 220, 320, "400");
            assert.notStrictEqual(envelope.length, 1);
        });
        it('should return stored value', function() {
            assert.notStrictEqual(envelope.length, 1);
            let _test = retrieveData('test');
            assert.strictEqual(envelope.x, 220);
            assert.strictEqual(envelope.z, 400);
            assert.strictEqual(envelope.value, 246.67);
        });
        it('should return updated value if new value added', function() {
            assert.notStrictEqual(envelope.length, 1);
            setData('test', "258.89", 240, 325, "500");
            assert.notStrictEqual(envelope.length, 1);
        });
        it('should return updated stored value', function() {
            assert.notStrictEqual(envelope.length, 1);
            let _test = retrieveData('test');
            assert.strictEqual(envelope.x, 240);
            assert.strictEqual(envelope.z, 500);
            assert.strictEqual(envelope.value, 258.89);
        });
        it('should return empty when removed', function() {
            assert.notStrictEqual(envelope.length, 1);
            removeData('test')
            assert.notStrictEqual(envelope['test'].length, 1);
        });
    });
});

describe('Compile functions', function() {
    describe('set data', function() {
        it('should run from source', function() {
            envelope.source = {name: "test", value: "testend"};
            envelope.pipeline = {name: "test", value: "timeline"};
            getData(envelope.source.value, envelope.pipeline.value);
            assert.doesNotThrow(ErrorEvent);
        });
        it('should return error if no url', function() {
            envelope.source = {name: "test", value: ""};
            envelope.pipeline = {name: "test", value: "timeline"};
            getData(envelope.source.value, envelope.pipeline.value);
            assert.doesNotThrow(ErrorEvent);
        });
        it('should return error if no pipeline', function() {
            envelope.source = {name: "test", value: "testend"};
            envelope.pipeline = {name: "test", value: ""};
            getData(envelope.source.value, envelope.pipeline.value);
            assert.doesNotThrow(ErrorEvent);
        });
    });
});

//@todo: test for dragging.
describe('Event functions', function() {
    describe('test drag', function() {
        it('should get event', function() {
            let testev = mockEvent();
            drag(testev);
            assert.doesNotThrow(ErrorEvent);
        });
        it('test drag and drop', function() {
            let testev = mockEvent();
            drag(testev);
            getData(envelope.source.value, envelope.pipeline.value);
            assert.doesNotThrow(ErrorEvent);
        });
    });
});

//function to make a mock event for this test
let mockEvent = () => {
    let evInitDict = { detail: elem.dataset.time,
    x: 220,
    y: 345,
    target: 'testDrop'};
    let testEv = new CustomEvent('build', evInitDict);
    return testEv;
};

let mockHtml = (testDiv) => {
   document.body.innerHTML = "<body><div id='testDrop'/> "+
       "<div id='" + testDiv +"' data-polemic='test' data-z-value='300' >" +
        "</body>";

};
