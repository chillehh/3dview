var Primatives = {};
Primatives.GridAxis = class {
    static createMesh(gl) {
        var verts = [],
            size = 1.8,
            div = 10.0,
            step = size / div,
            half = size / 2;
        var p;
        for(let i = 0; i <= div; i++) {
            // Vertical line
            p = -half + (i * step);
            verts.push(p);
            verts.push(half);
            verts.push(0);
            verts.push(0);

            verts.push(p);
            verts.push(-half);
            verts.push(0);
            verts.push(1);

            // Horizontal line
            p = half - (i * step);
            verts.push(-half);
            verts.push(p);
            verts.push(0);
            verts.push(0);

            verts.push(half);
            verts.push(p);
            verts.push(0);
            verts.push(1);
        }

        var attrColourLoc = 4;
        var strideLen;
        var mesh = { drawMode: gl.LINES, vao: gl.createVertexArray() };

        mesh.vertextComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertextComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertextComponentLen; // Stride length is the vertex size for the buffer in bytes

        // Setup buffer
        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColourLoc);

        gl.vertextAttribPointer(
            ATTR_POSITION_LOC,
            3,
            gl.FLOAT,
            false,
            strideLen,
            0
        );

        gl.vertexAttribPointer(
            attrColourLoc,
            1,
            gl.FLOAT,
            false,
            strideLen,
            Float32Array.BYTES_PER_ELEMENT * 3
        );

        // Cleanup
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.mMeshCache['grid'] = mesh;
        return mesh;
    }
}