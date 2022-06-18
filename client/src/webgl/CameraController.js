class CameraController {
    constructor(gl, camera) {
        var This = this;
        var box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;
        this.camera = camera;
        this.rotateRate = -300;
        this.panRate = 5;
        this.zoomRate = 200;
        this.offsetX = box.left;
        this.offsetY = box.top;
        this.initX = 0;
        this.initY = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.onUpHandler = function(e) { This.onMouseUp(e); };
        this.onMoveHandler = function(e) { This.onMouseMove(e); };
        this.canvas.addEventListener('mousedown', function(e) { This.onMouseDown(e); });
        this.canvas.addEventListener('mousewheel', function(e) { This.onMouseWheel(e); });
    }

    // Transform mouse x, y coords to something usable by the canvas
    getMouseVec2(e) {
        return {
            x: e.pageX - this.offsetX,
            y: e.pageY - this.offsetY
        };
    }

    // Listen for drag
    onMouseDown(e) {
        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;
        this.canvas.addEventListener('mouseup', this.onUpHandler);
        this.canvas.addEventListener('mousemove', this.onMoveHandler);
    }

    // Finish listening for drag
    onMouseUp(e) {
        this.canvas.removeEventListener('mouseup', this.onUpHandler);
        this.canvas.removeEventListener('mousemove', this.onMoveHandler);
    }

    onMouseWheel(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.camera.panZ(delta * (this.zoomRate / this.canvas.height));
    }

    onMouseMove(e) {
        var x = e.pageX - this.offsetX,
            y = e.pageY - this.offsetY,
            dx = x - this.prevX,
            dy = y - this.prevY;
        
        // Listen for shift key and pan around otherwise rotate
        if (!e.shiftKey) {
            this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width);
            this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height);
        } {
            this.camera.panX(-dx * (this.panRate / this.canvas.width));
            this.camera.panY(dy * (this.panRate / this.canvas.height));
        }

        this.prevX = x;
        this.prevY = y;
    }
}