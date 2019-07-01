import uuid from "uuid/v4";
import { copyController } from '../dat.gui.src/gui/GUI'

export default class SerializableObject {
    constructor() {
        this.__id = uuid();
        this.__automations = [];
        this.__controllers = {};
    }
    __setControllerValues = values => {
        let keysChanged = [];
        Object.keys(values).forEach(key => {
            const obj = values[key];
            const controller = this.__controllers[key];
            if(!controller) {
                keysChanged.push(key);
            }else {
                controller.setValue(values[key].value);
                controller.updateDisplay();
            }

            if(obj.subcontrollers && obj.subcontrollers.length > 0) {
                obj.subcontrollers.forEach(c => {
                    copyController({item: controller, location: c.location, name: c.name});
                })
            }
        });

        if(keysChanged.length > 0)
            alert(`${this.name}:${keysChanged.join(" ")} settings has changed internal id or does no longer exist`)

    };

    __serializeControllers = () => {
        const obj = { controllers: {} };
        Object.keys(this.__controllers).forEach(key => {
            const c = this.__controllers[key];
            const subcontrollers  = c.__subControllers.map(e => {return { name: e.getName(), location: e.__location}});
            if (c.object[c.property] !== Object(c.object[c.property])) {
                obj.controllers[key] = {
                    value: c.object[c.property],

                };

                if(subcontrollers.length > 0) {
                    obj.controllers[key].subcontrollers = subcontrollers;
                }
            } 
        });
        return obj;
    };

    serialize = () => {
        const obj = this.__serializeControllers();
        obj.__itemName = this.__itemName;
        obj.__automations = this.__automations;
        obj.name = this.name;
        obj.__startTime = this.startTime;
        obj.__endTime = this.__endTime;
        return obj;
    };

    addControllerWithMeta = (gui, object, name, params, meta) => {
        const c = gui.addWithMeta(object, name, {}, meta);
        const n = params.path ? params.path + ":" + name : name;
        c.__path = n;
        c.__parentObject = this;
        this.__controllers[n] = c;
        return c;
    }

    addController = (gui, object, name, arg1 = null, arg2 = null, arg3 = null) => {
        let options = {};
        if (arg2) {
            options.min = arg1;
            options.max = arg2;
            options.step = arg3;
        } else {
            options = arg1 || {};
        }
        let c;
        if (options.values) {
            c = gui.add(object, name, options.values);
        } else if (options.color) {
            c = gui.addColor(object, name);
        } else {
            c = gui.add(object, name, options.min, options.max, options.step);
        }
        const n = options.path ? options.path + ":" + name : name;
        c.__path = n;
        c.__parentObject = this;
        c.__loadInfo = options.loadInfo;
        this.__controllers[n] = c;
        return c;
    };

    applyAutomations = active => {
        if (active) {
            const toRemove = [];
            const ca = {};
            for (var i = 0; i < this.__automations.length; i++) {
                const link = this.__automations[i];
                const automation = this.__gui.getRoot().__automations[
                    link.automationID
                ];
                if (!automation) {
                    toRemove.push(i);
                } else {
                    const controller = this.__controllers[link.controllerID];
                    ca[link.controllerID] = ca[link.controllerID] + 1 || 0;
                    automation.apply(
                        controller,
                        link,
                        0 === ca[link.controllerID]
                    );
                }
            }

            if (toRemove.length > 0) {
                const oldAutos = [...this.__automations];
                this.__automations = [];
                oldAutos.forEach((link, i) => {
                    if (!toRemove.includes(i)) this.__automations.push(link);
                });
            }

            Object.keys(ca).forEach(key => {
                const item = this.__controllers[key];
                if (
                    item.__updateCounter++ %
                        this.__gui.getRoot()
                            .__automationConfigUpdateFrequency ===
                    0
                ) {
                    item.updateDisplay();
                }
            });
        }
    };
}
