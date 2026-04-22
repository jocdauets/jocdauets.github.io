function tornejos_amb_cert_jugador(jugador, _tornejos) {
	var tornejos = [];
	for (var i = 0; i < _tornejos.length; i ++) {
		if (_tornejos[i].jugadors.includes(jugador)) {
			tornejos.push(_tornejos[i]);
		}
	}
	return tornejos;
}