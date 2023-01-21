## 3D Viewer

This project was used to learn Webgl & Vue.js as I have a keen interest in Webgl as well as at the time, wanted to gain a better understanding of Vue.js. The backend is run using Express and data is stored in a MongoDB.

3D viewer is like Imgur but for 3D models, upload a 3D model and share the link to users for them to quickly view in their web browser.

The goals of the project are as follows:
1. Load and store .OBJ files on a server with associated data stored in a mongo database including an associated URL.
2. Have the URL directly link to a 3D model for X number of hours before removing the model from the database.
3. View a 3D model via a URL with features to rotate, pan, and zoom around the object.

The current state of the project is a WORK IN PROGRESS and is not finished. A user can upload an .OBJ file, but the rendered model may or may not work depending on if the mesh is triangulated as well as the size of the data of the model uploaded.
