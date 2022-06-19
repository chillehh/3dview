export class Render {
    constructor(callback, fps) {
        var This = this;
        this.msLastFrame = null;    // Time in ms of the last frame
        this.callBack = callback;   // Function to call for each frame
        this.isActive = false;      // Control the on/off states of rendering
        this.fps = 0;               // The frames per second of the loop

        if (fps != undefined && fps > 0) {
            this.msFpsLimit = 1000/fps; // How many ms per frame in one second

            this.run = function() {
                // Calculate deltatime between frames and the current FPS
                var msCurrent = performance.now();
                var msDelta = (msCurrent - This.msLastFrame);
                var deltaTime = msDelta / 1000.0;

                // Execute frame since time elapsed
                if (msDelta >= This.msFpsLimit) {
                    This.fps = Math.floor(1 / deltaTime);
                    This.msLastFrame = msCurrent;
                    This.callBack(deltaTime);
                }

                if (This.isActive) {
                    window.requestAnimationFrame(This.run);
                }
            }
        } else {
            this.run = function() {
                // Calculate deltatime between frames and the current FPS
                var msCurrent = performance.now();
                var deltaTime = (msCurrent - This.msLastFrame) / 1000.0;

                This.fps = Math.floor(1 / deltaTime);
                This.msLastFrame = msCurrent;

                if (This.isActive) {
                    window.requestAnimationFrame(This.run);
                }
            }
        }
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        window.requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
    }
}