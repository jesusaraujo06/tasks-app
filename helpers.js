// Cuando se van a exportar varias funciones no se debe utilizar modules.exports, sino solo exports.nombrefuncion

exports.vardump = (objeto) => JSON.stringify(objeto, null, 2);
