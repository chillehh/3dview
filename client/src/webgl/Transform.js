import { Vector3, Matrix4 } from "./Math";

export class Transform {
    constructor() {
        // Transform vectors
        this.worldPosition = new Vector3(0, 0, 0); // x, y, z position in regards to the world space
        this.position = new Vector3(0, 0, 0); // x, y, z fake position, using the localPosition as an offset to the position so it will return 0,0,0 as a center
        this.scale = new Vector3(1, 1, 1);    // scale the mesh, default is 1
        this.rotation = new Vector3(0, 0, 0); // hold rotation values in degrees, object can translate to radians
        this.matView = new Matrix4();         // cache the result when calling updateMatrix
        this.matNormal = new Float32Array(9); // hold the raw array values as a Mat3

        // Directional vectors
        this.forward = new Float32Array(4); // Keep track of what the forward direction when rotating
        this.up = new Float32Array(4);      // Keep track of what the up direction is, can be used to get down direction
        this.right = new Float32Array(4);   // Keep track of what the right direction is, can be used to get left direction
    }

    // Methods
    updateMatrix() {
        this.matView.reset();
        this.matView.vtranslate(new Vector3(this.position.x + this.worldPosition.x, this.position.y + this.worldPosition.y, this.position.z + this.worldPosition.z));
        this.matView.rotateX(this.rotation.x * Transform.deg2Rad);
        this.matView.rotateZ(this.rotation.z * Transform.deg2Rad);
        this.matView.rotateY(this.rotation.y * Transform.deg2Rad);
        this.matView.vscale(this.scale);
        
        // Calculate normal matrix which doesn't need translate, then transpose and inverse the mat4 to a mat3
        Matrix4.normalMat3(this.matNormal, this.matView.raw);

        // Determine direction after the transformations
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw); // Z
        Matrix4.transformVec4(this.up,      [0, 1, 0, 0], this.matView.raw); // Y
        Matrix4.transformVec4(this.right,   [1, 0, 0, 0], this.matView.raw); // X

        return this.matView.raw;
    }

    updateDirection(){
		Matrix4.transformVec4(this.forward,	[0,0,1,0],this.matView.raw);
		Matrix4.transformVec4(this.up,		[0,1,0,0],this.matView.raw);
		Matrix4.transformVec4(this.right,	[1,0,0,0],this.matView.raw);
		return this;
	}

    getViewMatrix() { return this.matView.raw; }
    getNormalMatrix() { return this.matNormal; }

    reset() {
        this.position.set(0, 0, 0);
        this.scale.set(1, 1, 1);
        this.rotation.set(0, 0, 0);
    }
}

Transform.deg2Rad = Math.PI / 180;