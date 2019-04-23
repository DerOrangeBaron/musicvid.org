import license from 'editor/util/License'

export default class BaseItem {
    LICENSE = license;
    folders = [];
    __attribution = {
        showAttribution: false,
        name:"",
        authors: [
        ],
        description: "",
        license: "",
        changeDisclaimer: true,
        imageUrl: ""
    }

    

    constructor(info) {
        this.__startTime = 0;
        this.__endTime = 600;
        this.name = "";
       
        if(info) {
            this.width = info.width;
            this.height = info.height;
    
            this.__gui = info.gui;
            this.__overviewFolder = info.overviewFolder;
            this.parentRemove = info.remove; 
            this.ovFolder = this.__overviewFolder.addFolder(this.name);
            this.folder = this.__gui.addFolder(this.name);

            this.preFolderSetup(this.folder);
            this.preFolderSetup(this.ovFolder);
        }
    }

    dispose = () => {
        if(this.ovFolder)
            this.ovFolder.parent.removeFolder(this.ovFolder);
    }

    setFolderName = (name) => {
        this.folder.name = name;
        this.ovFolder.name = name;
        this.name = name;
        this.__nameDisplay.updateDisplay();
    }

    preFolderSetup = (folder) => {
        this.__nameDisplay = folder.add(this, "name").onChange(() => this.setFolderName(this.name))
        folder.add(this, "__startTime", 0, 1000).name("Start time(sec)");
        folder.add(this, "__endTime", 0, 1000).name("End time(sec)");
    }

    postFolderSetup = (folder) => {
        this.folders.push(folder);
        this.removeButton = folder.add(this, "remove");
    }

    setUpFolder = () =>  {
       
        this.setFolderName(this.name);
        this.__setUpGUI(this.folder);
        this.__setUpGUI(this.ovFolder);
        this.postFolderSetup(this.folder);
        this.postFolderSetup(this.ovFolder);

        return this.folder;
    }

    __setUpGUI = () => {

    }

    __addUndoAction = (func, args) => {
        const item = {func: func, args: args, type: "action"}
        this.folder.getRoot().addUndoItem(item);
    }

    __reAdd = () => {
        this.setUpFolder();
    }
 
    __addFolder = (folder) => {
        
        return folder;
    }

    remove = () => {
        if(!this.parentRemove) {
            console.log("CALL SUPER WITH ARGUMENTS")
            return;
        }

        //this.folder.parent.removeFolder(this.folder);
        //this.ovFolder.parent.removeFolder(this.ovFolder);
        this.parentRemove({item: this});
    }

    setUpGUI = (gui, name) => {
        
        const folder = gui.addFolder(name);
        /* ADD STUFF TO FOLDER HERE */
        return this.__addFolder(folder);
    }

    // handles all updates in the render-loop 
    update = () => {}
    applyAutomations = ()  => {}
    setTime = () => {}
    stop = () => {}
    play = () => {}
    setUpGUI =  () => {}

    updateDisplay = () => {
        this.folders.forEach(folder => {
            folder.updateDisplay();
        })
    }
}