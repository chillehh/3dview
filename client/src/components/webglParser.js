/* eslint-disable */
class WebglParser {
    parseOBJ(data) {
        // because indices are base 1 let's just fill in the 0th data
        const objPositions = [[0, 0, 0]];
        const objTexcoords = [[0, 0]];
        const objNormals = [[0, 0, 0]];

        // same order as `f` indices
        const objVertexData = [
            objPositions,
            objTexcoords,
            objNormals,
        ];
        
        // same order as `f` indices
        let webglVertexData = [
            [],   // positions
            [],   // texcoords
            [],   // normals
        ];
        
        // // If there is an existing geometry and it's
        // // not empty then start a new one.
        // if (geometry && geometry.data.position.length) {
        //     geometry = undefined;
        // }
        // setGeometry();
        
        function addVertex(vert) {
            const ptn = vert.split('/');
            ptn.forEach((objIndexStr, i) => {
                if (!objIndexStr) {
                    return;
                }
                const objIndex = parseInt(objIndexStr);
                const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
                webglVertexData[i].push(...objVertexData[i][index]);
            });
        }
        
        const keywords = {
            v(parts) {
                objPositions.push(parts.map(parseFloat));
            },
            vn(parts) {
                objNormals.push(parts.map(parseFloat));
            },
            vt(parts) {
                // should check for missing v and extra w?
                objTexcoords.push(parts.map(parseFloat));
            },
            f(parts) {
                const numTriangles = parts.length - 2;
                for (let tri = 0; tri < numTriangles; ++tri) {
                    addVertex(parts[0]);
                    addVertex(parts[tri + 1]);
                    addVertex(parts[tri + 2]);
                }
            },
        };
        
        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = data.split('\n');
        // console.log(lines)
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = unparsedArgs.split(/\s+/);
            const handler = keywords[keyword];
            // console.log(keyword)
            if (!handler) {
                console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                continue;
            }
            // console.log('UNPARSED: ', parts)
            handler(parts);
        }
        
        return {
            position: webglVertexData[0],
            texcoord: webglVertexData[1],
            normal: webglVertexData[2],
        };
    }

    async render(canvas, data) {
        // Get A WebGL context
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            return;
        }

        const vs = `
            attribute vec4 a_position;
            attribute vec3 a_normal;

            uniform mat4 u_projection;
            uniform mat4 u_view;
            uniform mat4 u_world;

            varying vec3 v_normal;

            void main() {
                gl_Position = u_projection * u_view * u_world * a_position;
                v_normal = mat3(u_world) * a_normal;
            }
            `;
        
        const fs = `
            precision mediump float;

            varying vec3 v_normal;

            uniform vec4 u_diffuse;
            uniform vec3 u_lightDirection;

            void main () {
                vec3 normal = normalize(v_normal);
                float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
                gl_FragColor = vec4(u_diffuse.rgb * fakeLight, u_diffuse.a);
            }
        `;
        
        
        // compiles and links the shaders, looks up attribute and uniform locations
        const meshProgramInfo = webglUtils.createProgramInfo(gl, [vs, fs]);

        // Because data is just named arrays like this
        //
        // {
        //   position: [...],
        //   texcoord: [...],
        //   normal: [...],
        // }
        //
        // and because those names match the attributes in our vertex
        // shader we can pass it directly into `createBufferInfoFromArrays`
        // from the article "less code more fun".

        // create a buffer for each array by calling
        // gl.createBuffer, gl.bindBuffer, gl.bufferData
        const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
        const position = data.position
        console.log(data)
        let yPositions = []
        let xPositions = []
        let zPositions = []
        let i = 0
        while (i < position.length) {
            xPositions.push(position[i])
            zPositions.push(position[i + 1])
            yPositions.push(position[i + 2])
            i += 3
        }
        // console.log(yPositions)
        const xSorted = xPositions.sort((a, b) => a - b);
        const ySorted = yPositions.sort((a, b) => a - b);
        const zSorted = zPositions.sort((a, b) => a - b);
        const xMax = Math.abs(xSorted[xSorted.length - 1]);
        const xMin = Math.abs(xSorted[0]);
        const yMax = Math.abs(ySorted[ySorted.length - 1]);
        const yMin = Math.abs(ySorted[0]);
        const zMax = Math.abs(zSorted[zSorted.length - 1]);
        const zMin = Math.abs(zSorted[0]);
        const xDelta = xMax - xMin
        const yDelta = yMax - yMin
        const zDelta = zMax - zMin
        const xMid = xDelta / 2
        const yMid = yDelta / 2
        const zMid = zDelta / 2
        // const cameraZ = (max - min) * -1.25
        console.log('xMID: ', xMid, ' yMID: ', yMid, ' zMID: ', zMid)

        const cameraTarget = [xMid, yMid, zMid];
        // const cameraPosition = [0, 0, cameraZ < -5 ? cameraZ : 5];
        const cameraPosition = [xMid, yMid, zMid + 20];
        const zNear = 0.1;
        const zFar = 500;

        function degToRad(deg) {
            return deg * Math.PI / 180;
        }

        function render(time) {
            time *= 0.001;  // convert to seconds

            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

            const fieldOfViewRadians = degToRad(60);
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

            const up = [0, 1, 0];
            // Compute the camera's matrix using look at.
            const camera = m4.lookAt(cameraPosition, cameraTarget, up);

            // Make a view matrix from the camera matrix.
            const view = m4.inverse(camera);

            const sharedUniforms = {
                u_lightDirection: m4.normalize([-1, 3, 5]),
                u_view: view,
                u_projection: projection,
            };

            gl.useProgram(meshProgramInfo.program);

            // calls gl.uniform
            webglUtils.setUniforms(meshProgramInfo, sharedUniforms);

            // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
            webglUtils.setBuffersAndAttributes(gl, meshProgramInfo, bufferInfo);

            // calls gl.uniform
            webglUtils.setUniforms(meshProgramInfo, {
                u_world: m4.yRotation(time),
                u_diffuse: [1, 0.7, 0.5, 1],
            });

            // calls gl.drawArrays or gl.drawElements
            webglUtils.drawBufferInfo(gl, bufferInfo);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
}

export default new WebglParser()