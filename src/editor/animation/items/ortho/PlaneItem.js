
import * as THREE from 'three'
import MeshItem from '../MeshItem'



export default class PlaneItem extends MeshItem {

    constructor(info) {
        super(info);
        this.name = "Plane";
        this.gui = info.gui;

        this.scene = info.scene;
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.Material());
        this.scene.add(this.mesh);        
    }

    update = (time, audioData) => {
        this.material.updateMaterial(time, audioData);
    }
}