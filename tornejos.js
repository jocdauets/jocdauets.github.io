function tornejos_amb_cert_jugador(jugador, _tornejos) {
	var tornejos = [];
	for (var i = 0; i < _tornejos.length; i ++) {
		if (_tornejos[i].jugadors.includes(jugador)) {
			tornejos.push(_tornejos[i]);
		}
	}
	return tornejos;
}

function tornejos_finalitzats_ultim_any(_tornejos) {
	var avui = new Date();
	var tornejos = [];
	for (var i = 0; i < _tornejos.length; i ++)	{
		if (_tornejos[i].estat == "finalitzat") {
			var ultim_any = false;
			var data = _tornejos[i].finalitzacio.split("-");
			data[0] = parseInt(data[0]);
			data[1] = parseInt(data[1]);
			data[2] = parseInt(data[2]);
			if (data[2] >= avui.getFullYear()) {
				ultim_any = true;
			} else if (data[2] == avui.getFullYear()-1) {
				if (data[1] > avui.getMonth()) {
					ultim_any = true;
				} else if (data[1] == avui.getMonth()) {
					if (data[0] > avui.getDate()) {
						ultim_any = true;
					}
				}
			}
			if (ultim_any == true) {
				tornejos.unshift(_tornejos[i]);
			}
		}
	}
	return tornejos;
}

function classificacio_ultim_any(_tornejos) {
	const tornejos = tornejos_finalitzats_ultim_any(_tornejos);
	var jugadors = [];
	var classificacio = {};

	for (var i = 0; i < tornejos.length; i ++) {
		for (var j = 0; j < tornejos[i].jugadors.length; j ++) {
			if (jugadors.includes(tornejos[i].jugadors[j]) == false) {
				jugadors.push(tornejos[i].jugadors[j]);
				classificacio[tornejos[i].jugadors[j]] = {"posicio": -1, "punts": 0, "tornejos": {}};
			}
		}
	}

	for (var i = 0; i < tornejos.length; i ++) {
		for (var j = 0; j < jugadors.length; j ++) {
			if (tornejos[i].jugadors.includes(jugadors[j])) {
				classificacio[jugadors[j]].tornejos[tornejos[i].abreviatura] = tornejos[i].puntuacions[jugadors[j]];
				classificacio[jugadors[j]].punts += tornejos[i].puntuacions[jugadors[j]];
			} else {
				classificacio[jugadors[j]].tornejos[tornejos[i].abreviatura] = false;
			}
		}
	}

	var jugadors_posicionats = [];
	for (var i = 0; i < jugadors.length; i ++) {
		var max = -1;
		var jgdrs = [];
		for (var j = 0; j < jugadors.length; j ++) {
			if (jugadors_posicionats.includes(jugadors[j]) == false) {
				if (classificacio[jugadors[j]].punts == max) {
					jgdrs.push(jugadors[j]);
				} else if (classificacio[jugadors[j]].punts > max) {
					max = classificacio[jugadors[j]].punts;
					jgdrs = [jugadors[j]];
				}
			}
		}
		var posicio = jugadors_posicionats.length + 1;
		for (var k = 0; k < jgdrs.length; k ++) {
			jugadors_posicionats.push(jgdrs[k]);
			classificacio[jgdrs[k]].posicio = posicio;
		}
	}

	return classificacio;
}

function taula_classificacio_ultim_any(_tornejos) {
	const classificacio = classificacio_ultim_any(_tornejos);
	var taula = [];
	const jugadors = Object.keys(classificacio);
	if (jugadors.length > 0) {
		const tornejos = Object.keys(classificacio[jugadors[0]].tornejos);
		var tornejos_header = [];
		for (var i = 0; i < tornejos.length; i ++) {
			tornejos_header.push("<b>" + tornejos[i] + "</b>");
		}
		var fila = ["<b>Posició</b>", "<b>Jugador/a</b>", "<b>Punts</b>"].concat(tornejos_header);
		taula.push(fila);
		for (var i = 0; i < jugadors.length; i ++) {
			for (var k = 0; k < jugadors.length; k ++) {
				if (classificacio[jugadors[k]].posicio == i+1) {
					var fila = [classificacio[jugadors[k]].posicio, jugadors[k], classificacio[jugadors[k]].punts];
					for (var j = 0; j < tornejos.length; j ++) {
						if (classificacio[jugadors[k]].tornejos[tornejos[j]] == false) {
							fila.push("-");
						} else {
							fila.push(classificacio[jugadors[k]].tornejos[tornejos[j]]);
						}
					}
					taula.push(fila);
				}
			}
		}
		console.log(taula);
		return taula;
	} else {
		return [[]];
	}
}