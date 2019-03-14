
import * as THREE from 'three';
import getItemClassFromText from '../items'
import OrbitControls from '../controls/OrbitControls';

export default class Scene3DOrtho {
    constructor(gui, resolution, remove, moveScene) {
        this.__moveScene = moveScene;
        this.remove = remove;        
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );
        this.camera.position.z = 1;
        this.resolution = resolution;
        this.items = [];
        this.gui = gui;
        this.setUpControls();
        this.setUpGui(gui);
    }


    stop = () => {
        this.items.forEach(item => {
            item.stop();
        })
    }

    updateCamera = () => {
        this.controls.dispose();
        this.setUpControls();
    }

    resetCamera =  () => {
        this.controls.reset();
    }

    removeMe = () => {
        while(this.items.length > 0) {
            this.items[0].dispose();
            this.items.pop();
        }
        this.remove(this);
    }

    setUpControls = () => {
        this.controls = new OrbitControls(this.camera, this.gui.__root.canvasMountRef)
        this.controls.enabled = false;
    }

    setUpGui = (gui) => {
        
        this.folder = gui.addFolder("Scene3D Ortho", true, true);
        this.folder.upFunction = () => this.__moveScene(true, this);
        this.folder.downFunction = () => this.__moveScene(false, this);
        this.overviewFolder = gui.__root.__folders["Overview"];
        this.itemsFolder = this.folder.addFolder("Items");
        this.itemsFolder.add(this, "addItem");
        this.cameraFolder = this.folder.addFolder("Camera");
        this.settingsFolder = this.folder.addFolder("Settings");
        
        this.cameraFolder.add(this, "resetCamera");
        this.cameraFolder.add(this.controls, "enabled").name("Controls enabled");
        this.settingsFolder.add(this, "removeMe").name("Remove this scene");
    }

    removeItem = (item) => {
        const index = this.items.findIndex(e => e === item);
        this.scene.remove(this.items[index].mesh);
        this.items.splice(index, 1);
    }

    addItemFromText = (name) => {
        if(name) {
            const info = {
                gui: this.itemsFolder,
                overviewFolder: this.overviewFolder,
                width: this.resolution.width,
                height: this.resolution.height,
                scene: this.scene,
                camera: this.camera,
                remove: this.removeItem
            };
    
    
            const itemClass = getItemClassFromText("ortho", name);
            const item = new itemClass(info);
            this.items.push(item);
            return item;
        }
     
    }

    addItem = () => {
        const ref = this.itemsFolder.__root.modalRef;
        ref.toggleModal(6).then(this.addItemFromText);
    }

    update = (time, audioData, shouldIncrement) => {
        if(shouldIncrement) {
            this.items.forEach(item => item.update(time, audioData));
        }
    }
}