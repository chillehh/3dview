var Primatives = {};
Primatives.GridAxis = class {
    static createModel(gl, inclAxis) { return new Model(Primatives.GridAxis.createMesh(gl, inclAxis)); }
    static createMesh(gl, inclAxis) {
        var verts = [],
            size = 2,
            div = 10.0,
            step = size / div,
            half = size / 2;

        var p;
        for(let i = 0; i <= div; i++) {
            // Vertical line
            p = -half + (i * step);
            verts.push(p);          // x1
            verts.push(0);          // y1
            verts.push(half);       // z1
            verts.push(0);          // c2

            verts.push(p);          // x2
            verts.push(0);          // y2
            verts.push(-half);      // z2
            verts.push(1);          // c2

            // Horizontal line
            p = half - (i * step);
            verts.push(-half);      // x1
            verts.push(0);          // y1
            verts.push(p);          // z1
            verts.push(0);          // c1

            verts.push(half);       // x2
            verts.push(0);          // y2
            verts.push(p);          // z2
            verts.push(0);          // c2
        }

        if(incAxis){
			//x axis
			verts.push(-1.1);	//x1
			verts.push(0);		//y1
			verts.push(0);		//z1
			verts.push(1);		//c2

			verts.push(1.1);	//x2
			verts.push(0);		//y2
			verts.push(0);		//z2
			verts.push(1);		//c2

			//y axis
			verts.push(0);      //x1
			verts.push(-1.1);	//y1
			verts.push(0);		//z1
			verts.push(2);		//c2

			verts.push(0);		//x2
			verts.push(1.1);	//y2
			verts.push(0);		//z2
			verts.push(2);		//c2

			//z axis
			verts.push(0);		//x1
			verts.push(0);		//y1
			verts.push(-1.1);	//z1
			verts.push(3);		//c2

			verts.push(0);		//x2
			verts.push(0);		//y2
			verts.push(1.1);	//z2
			verts.push(3);		//c2
		}

        var attrColourLoc = 4;
        var strideLen;
        var mesh = { drawMode: gl.LINES, vao: gl.createVertexArray() };

        mesh.vertextComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertextComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen; // Stride length is the vertex size for the buffer in bytes

        // Setup buffer
        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColourLoc);

        gl.vertexAttribPointer(
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