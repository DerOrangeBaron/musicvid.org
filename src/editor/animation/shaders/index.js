try {
    module.exports = {
        //Noise: require('./licensed/Noise'),
        Filaments: require("./StarNest"),
        SimplicityGalaxy: require("./StarNest"),
        UniverseWithin: require("./StarNest"),
        HexaGone: require("./StarNest"),
        Sinuous: require("./StarNest")
    };
} catch (ex) {
    module.exports.OutrunTheRain = {};
    module.exports.Noise = {};
    module.exports.Filaments = {};
    module.exports.SimplicityGalaxy = {};
    module.exports.UniverseWithin = {};
    module.exports.HexaGone = {};
    module.exports.Sinuous = {};
    alert(
        "Shader is licensed and not implemented in this version.",
        ex.message
    );
    console.log(ex);
}
