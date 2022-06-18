class Transform {
    constructor() {
        // Transform vectors
        this.position = new Vector3(0, 0, 0); // x, y, z position
        this.scale = new Vector3(1, 1, 1);    // scale the mesh, default is 1
        this.rotation = new Vector3(0, 0, 0); // hold rotation values in degrees, object can translate to radians
        this.matView = new Matrix4();         // cache the resault when calling updateMatrix
        this.matNormal = new Float32Array(9); // hold the raw array values as a Mat3

        // Directional vectors
        this.forward = new Float32Array(4); // Keep track of what the forward direction when rotating
        this.up = new Float32Array(4);      // Keep track of what the up direction is, can be used to get down direction
        this.right = new Float32Array(4);   // Keep track of what the right direction is, can be used to get left direction
    }

    // Methods
    updateMatrix() {
        this.matView.reset()
            .vtranslate(this.position)
            .rotateX(this.rotation.x * Transform.deg2Rad)
            .rotateZ(this.rotation.z * Transform.deg2Rad)
            .rotateY(this.rotation.y * Transform.deg2Rad)
            .vscale(this.scale);
        
        // Calculat normal matrix which doesn't need translate, then transpose and inverse the mat4 to a mat3
        Matrix4.normalMat3(this.matNormal, this.matView.raw);

        // Determine direction after the transformations
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.raw); // Z
        Matrix4.transformVec4(this.up,      [0, 1, 0, 0], this.matView.raw); // Y
        Matrix4.transformVec4(this.right,   [1, 0, 0, 0], this.matView.raw); // X

        return this.matView.raw;
    }
}