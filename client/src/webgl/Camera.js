import { Matrix4 } from "./Math";
import { Transform } from './Transform'

export class Camera {
    constructor(gl, fov, near, far) {
        // Setup perspective matrix
        this.projectionMatrix = new Float32Array(16);
        var ratio = gl.canvas.width / gl.canvas.height;
        Matrix4.perspective(this.projectionMatrix, fov || 45, ratio, near || 0.1, far || 100.0);
        this.transform = new Transform();
        this.viewMatrix = new Float32Array(16);

        this.mode = Camera.MODE_ORBIT;
    }

    panX(v) {
        // Only pan x when not orbiting
        if (this.mode == Camera.MODE_ORBIT) return;
        this.updateViewMatrix();
        this.transform.position.x += this.transform.right[0] * v;
        this.transform.position.y += this.transform.right[1] * v;
        this.transform.position.z += this.transform.right[2] * v;
    }

    panY(v) {
        this.updateViewMatrix();
        this.transform.position.y += this.transform.right[1] * v;
        // Only move y when orbiting
        if (this.mode == Camera.MODE_ORBIT) return;
        this.transform.position.x += this.transform.right[0] * v;
        this.transform.position.z += this.transform.right[2] * v;
    }

    panZ(v) {
        this.updateViewMatrix();
        // Translate after rotate so set z, rotate will handle the rest
        if (this.mode == Camera.MODE_ORBIT) {
            this.transform.position.z += v;
        } else {
            // Move forward based on which forward is relative to the current rotation
            this.transform.position.x += this.transform.forward[0] * v;
            this.transform.position.y += this.transform.forward[1] * v;
            this.transform.position.z += this.transform.forward[2] * v;
        }
    }

    // To have different modes of movements, this will handle the view matrix update for the transform object
    updateViewMatrix() {
        if (this.mode === Camera.MODE_FREE) {
            this.transform.matView.reset();
            this.transform.matView.vtranslate(this.transform.position);
            this.transform.matView.rotateX(this.transform.rotation.x * Transform.deg2Rad);
            this.transform.matView.rotateY(this.transform.rotation.y * Transform.deg2Rad);
        } else {
            this.transform.matView.reset();
            this.transform.matView.rotateX(this.transform.rotation.x * Transform.deg2Rad);
            this.transform.matView.rotateY(this.transform.rotation.y * Transform.deg2Rad);
            this.transform.matView.vtranslate(this.transform.position);
        }

        this.transform.updateDirection();

        // Cameras work by doing the inverse transformation on all meshes
        Matrix4.invert(this.viewMatrix, this.transform.matView.raw);
        return this.viewMatrix;
    }

    getTranslatelessMatrix() {
        var mat = new Float32Array(this.viewMatrix);
        mat[12] = mat[13] = mat[14] = 0.0;
        return mat;
    }
}

// Allows free movement of position and rotation
Camera.MODE_FREE  = 0;
// Movement will be locked to rotate around a specified origin
Camera.MODE_ORBIT = 1;