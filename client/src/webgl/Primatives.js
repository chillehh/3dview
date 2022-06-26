import { Model } from "./Model";
import { ATTR_POSITION_LOC } from "./gl.js";

export var Primatives = {};

Primatives.Cube = class {
	static createModel(gl){ return new Model(Primatives.Cube.createMesh(gl,1,1,1,0,0,0)); }
	static createMesh(gl,width,height,depth,x,y,z){
		var w = width*0.5, h = height*0.5, d = depth*0.5;
		var x0 = x-w, x1 = x+w, y0 = y-h, y1 = y+h, z0 = z-d, z1 = z+d;

		//Starting bottom left corner, then working counter clockwise to create the front face.
		//Backface is the first face but in reverse (3,2,1,0)
		//keep each quad face built the same way to make index and uv easier to assign
		var aVert = [
			x0, y1, z1, 0,	//0 Front
			x0, y0, z1, 0,	//1
			x1, y0, z1, 0,	//2
			x1, y1, z1, 0,	//3 

			x1, y1, z0, 1,	//4 Back
			x1, y0, z0, 1,	//5
			x0, y0, z0, 1,	//6
			x0, y1, z0, 1,	//7 

			x0, y1, z0, 2,	//7 Left
			x0, y0, z0, 2,	//6
			x0, y0, z1, 2,	//1
			x0, y1, z1, 2,	//0

			x0, y0, z1, 3,	//1 Bottom
			x0, y0, z0, 3,	//6
			x1, y0, z0, 3,	//5
			x1, y0, z1, 3,	//2

			x1, y1, z1, 4,	//3 Right
			x1, y0, z1, 4,	//2 
			x1, y0, z0, 4,	//5
			x1, y1, z0, 4,	//4

			x0, y1, z0, 5,	//7 Top
			x0, y1, z1, 5,	//0
			x1, y1, z1, 5,	//3
			x1, y1, z0, 5	//4
		];

		//Build the index of each quad [0,1,2, 2,3,0]
		var aIndex = [];
		for(let i=0; i < aVert.length / 4; i+=2) aIndex.push(i, i+1, (Math.floor(i/4)*4)+((i+2)%4));

		//Build UV data for each vertex
		var aUV = [];
		for(let i=0; i < 6; i++) aUV.push(0,0,	0,1,  1,1,  1,0);

		//Build Normal data for each vertex
		var aNorm = [
			0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
			0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
			-1, 0, 0,	-1, 0, 0,	-1, 0,0 ,	-1, 0, 0,		//Left
			0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
			1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Right
			0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
		]

		var mesh = gl.createMeshVAO("Cube",aIndex,aVert,aNorm,aUV,4);
		mesh.noCulling = true;	//TODO Only setting this true to view animations better.
		return mesh;
	}
}

Primatives.Quad = class {
    static createModel(gl) {
        return new Model(Primatives.Quad.createMesh(gl));
    }
    
    static createMesh(gl) {
        var aVert = [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0],
            aUV = [0, 0, 0, 1, 1, 1, 1, 0],
            aIndex = [0, 1, 2, 2, 3, 0];
        var mesh = gl.createMeshVAO('Quad', aIndex, aVert, null, aUV);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
}

Primatives.GridAxis = class {
    static createModel(gl, inclAxis) { console.log('creating grid..'); return new Model(Primatives.GridAxis.createMesh(gl, inclAxis)); }
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

        if(inclAxis){
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

        mesh.vertexComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertexComponentLen;
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