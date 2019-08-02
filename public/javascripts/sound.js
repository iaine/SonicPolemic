var Note = function() {

    /**
     * Function to play a note in 3 dimensions
     *
     * The assumption is that the middle note (or the base data) is the base of the
     * sound source.
     *
     * @todo: Add play as a structure for the editor
     */
    var threeDimension = function (audioContext, sound, pos, id, play) {

        if (pos.z == null) pos.z = play.z;
        console.log(pos);
        this.context = audioContext;

        let listener = this.context.listener;

        // Create static position for the listener
        if (listener.forwardX) {
            listener.forwardX.value = 0;
            listener.forwardY.value = 0;
            listener.forwardZ.value = -1;
            listener.upX.value = 0;
            listener.upY.value = 1;
            listener.upZ.value = 0;
        } else {
            listener.setOrientation(0, 0, -1, 0, 1, 0);
        }

        if (listener.positionX) {
            listener.positionX.value = pos.x;
            listener.positionY.value = play.startY;
            listener.positionZ.value = play.z;
        } else {
            listener.setPosition(pos.x, play.startY, play.z);
        }

        let oscillator = this.context.createOscillator();
        

        let gainNode = this.context.createGain();
        gainNode.connect(this.context.destination);
        gainNode.gain.setValueAtTime(sound.volume, id);
        oscillator.detune.value = 100;

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(sound.freq, id);
        oscillator.frequency.exponentialRampToValueAtTime(sound.freq, id + 0.03);
        oscillator.start(id);
        oscillator.stop(id + sound.dur);

        //connect all the parts up now
        oscillator.connect(this.context.destination);
        gainNode.connect(this.context.destination);
    };

    /**
     * Function to create a simple tone.
     * @param audioContext
     * @param sound
     * @param id
     * @param play
     */
    var simpleTone = function (audioContext, sound) {

        let osc = audioContext.createOscillator();

        let gain = audioContext.createGain();
        gain.gain.setValueAtTime(sound.vol, sound.id);

        osc.type = "sine";
        osc.frequency.setValueAtTime(sound.freq, sound.id);
        osc.frequency.exponentialRampToValueAtTime(sound.freq, sound.id + 0.03);
        osc.start(sound.id);
        osc.stop(sound.id + sound.dur);

        osc.connect(audioContext.destination);
        gain.connect(audioContext.destination);

    };

    return {threeDimension:threeDimension, simpleTone: simpleTone};
};
