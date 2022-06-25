import { Transform } from '@/webgl/Transform'
import { Bounds } from './Math';

export class Model {
    constructor(meshData) {
        this.transform = new Transform();
        this.mesh = meshData;
        this.bounds = new Bounds(this.mesh.aVert);
        // centre the model to 0, 0, 0
        let origin = this.getOrigin();
        let bounds = this.getBounds();
        let x = (bounds.xMin + (0.5 * origin.x))
        let y = (bounds.yMin + (0.5 * origin.y))
        let z = (bounds.zMin + (0.5 * origin.z))
        // console.log('x:',x, bounds.xMin, origin.x,'y:',y,bounds.yMin, origin.y,'z:',z,bounds.zMin, origin.z)
        this.setWorldPosition(x == bounds.xMin ? 0 : -x, y == bounds.yMin ? 0 : -y, z == bounds.zMin ? 0 : -z);
    }

    // Getters / Setters
    getPosition() { return this.transform.position.getArray(); }
    getBounds() { return this.bounds.getBounds(); }
    getSize() { return this.bounds.getSize(); }
    getOrigin() { return this.bounds.getOrigin(); }
    getCentre() { return this.bounds.getCentre(); }

    setScale(x, y, z) { this.transform.scale.set(x, y, z); return this; }
    setPosition(x, y, z) { this.transform.position.set(x, y, z); return this; }
    setRotation(x, y, z) { this.transform.rotation.set(x, y, z); return this; }
    
    addScale(x, y, z) {    this.transform.scale.x += x;    this.transform.scale.y += y;    this.transform.scale.z += z;    return this; }
    addPosition(x, y, z) { this.transform.position.x += x; this.transform.position.y += y; this.transform.position.z += z; return this; }
    addRotation(x, y, z) { this.transform.rotation.x += x; this.transform.rotation.y += y; this.transform.rotation.z += z; return this; }

    addWorldPosition(x, y, z) { this.transform.worldPosition.x += x; this.transform.worldPosition.y += y; this.transform.worldPosition.z += z; return this; }
    setWorldPosition(x, y, z) { this.transform.worldPosition.x = x; this.transform.worldPosition.y = y; this.transform.worldPosition.z = z; return this; }
    getWorldPosition() { return this.transform.worldPosition; }

    // Methods
    preRender() {
        this.transform.updateMatrix();
        return this;
    }
}