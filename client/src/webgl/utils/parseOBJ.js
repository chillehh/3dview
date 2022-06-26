export class OBJ {
    static parseText(txt, flipYUV) {
        txt = txt.trim() + '\n'; // Add new line to be able to access last line in the loop

		var line,				// Line text from obj file
			itm,				// Line split into an array
			arr,				// Itm split into an array, used for faced decoding
			i,
			ind,				// used to calculate index of the cache arrays
			isQuad = false,		// Determine if face is a quad or not
			aCache = [],		// Cache Dictionary array element, val = final index of the vertice
			cVert = [],			// Cache Vertice array read from obj
			cNorm = [],			// Cache Normal array
			cUV = [],			// Cache UV array
			fVert = [],			// Final Index Sorted Vertice Array
			fNorm = [],			// Final Index Sorted Normal Array
			fUV = [],			// Final Index Sorted UV array
			fIndex = [],		// Final Sorted index array
			fIndexCnt = 0,		// Final count of unique vertices
			posA = 0,
			posB = txt.indexOf("\n",0);
        
        while (posB > posA) {
            line = txt.substring(posA, posB).trim();

            switch (line.charAt(0)) {
                // Cache vertex data for index processing when going through face data
                case 'v':
                    itm = line.split(" ");
                    itm.shift();
                    switch(line.charAt(1)) {
                        case " ": // Vertex
                            cVert.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));
                            break;
                        case 't': // UV
                            cUV.push(parseFloat(itm[0]), parseFloat(itm[1]));
                            break;
                        case 'n': // Normal
                            cNorm.push(parseFloat(itm[0]), parseFloat(itm[1]), parseFloat(itm[2]));
                            break;
                    }
                    break;
                
                // Process face data
                case 'f':
                    itm = line.split(" ");
                    itm.shift();
                    isQuad = false;

                    for (i = 0; i < itm.length; i++) {
                        // If face is quad
                        if (i == 3 && !isQuad) {
                            i = 2; // Last vertex in the first triangle is the start of the 2nd triangle in a quad
                            isQuad = true;
                        }

                        // Has vertex data been processed?
                        if (itm[i] in aCache) {
                            fIndex.push(aCache[itm[i]]);
                        } else {
                            // Process the vertex data
                            arr = itm[i].split('/');

                            // Parse vertex data and save final version ordered correctly by index
                            ind = (parseInt(arr[0]) - 1) * 3;
                            fVert.push(cVert[ind], cVert[ind + 1], cVert[ind + 2]);

                            // Parse normal data and save
                            ind = (parseInt(arr[2]) - 1) * 3;
                            fNorm.push(cNorm[ind], cNorm[ind + 1], cNorm[ind + 2]);

                            // Parse texture data if available
                            if (arr[1] != "") {
                                ind = (parseInt(arr[1]) - 1) * 2;
                                fUV.push(cUV[ind], (!flipYUV) ? cUV[ind + 1] : 1 - cUV[ind + 1]);
                            }

                            // Cache the vertex item value and its new index
                            aCache[itm[i]] = fIndexCnt;
                            fIndex.push(fIndexCnt);
                            fIndexCnt++;
                        }

                        // In a quad, the last vertex of the second triangle is the first vertex in the first triangle
                        if (i == 3 && isQuad) {
                            fIndex.push(aCache[itm[0]]);
                        }
                    }
                    break;
            }

            // Get ready for the next line of obj data
            posA = posB + 1;
            posB = txt.indexOf('\n', posA);
        }

        return [fIndex, fVert, fNorm, fUV];
    }
}