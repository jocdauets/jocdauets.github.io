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