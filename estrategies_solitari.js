_estrategies = {
	"<Tomeu>": tomeu
};

function tomeu(daus, completades, obligatori, ultima=false){
	var nous_daus = [0,0,0,0,0,0];
	var nou_obligatori = obligatori;
	var puntuar = false;
	if (obligatori != null) {
		nous_daus[obligatori] = daus[obligatori];
		nous_daus[5] = daus[5];
		var suma = 0;
		for (var i = 0; i < 6; i ++) {
			suma += nous_daus[i];
		}
		if (suma == 8) {
			puntuar = true;
		}
	} else {
		var count = [];
		var categories_lliures = []
		for (var i = 0; i < 5; i ++) {
			if (completades.includes(i) == false) {
				categories_lliures.push(i);
				count.push(daus[i]+daus[5]);
			}
		}
		if (completades.includes(5) == false) {
			categories_lliures.push(5);
			count.push(daus[5]);
		}
		var escollir = categories_lliures[categories_lliures.length-1];
		for (var j = categories_lliures.length-2; j >= 0; j --) {
			if (count[j] > count[categories_lliures.indexOf(escollir)]) {
				escollir = categories_lliures[j];
			}
		}
		nous_daus[escollir] = daus[escollir];
		nous_daus[5] = daus[5];
		var suma = 0;
		for (var i = 0; i < 6; i ++) {
			suma += nous_daus[i];
		}
		if (suma == 8 || ultima == true) {
			nou_obligatori = escollir;
			puntuar = true;
		}
	}
	return [nous_daus, puntuar, nou_obligatori];
}