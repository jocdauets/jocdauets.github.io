function constructor_estrategia(nom, categories_especials) {
	if (nom == "<Tomeu>") {
		return new EstrategiaSenzilla(tomeu_guardar, tomeu_puntuar, categories_especials);
	}
}

class EstrategiaSenzilla {
	constructor(funcio_guardar, funcio_puntuar, categories_especials) {
		this.guardar = funcio_guardar;
		this.puntuar_taulell = funcio_puntuar;
		this.categories_especials = categories_especials;
		this.n_categories_especials = categories_especials.length;
	}

	puntuar(daus, categoria) {
		var modificacio = this.guardar(daus, categoria);
		return this.puntuar_taulell(modificacio, categoria);
	}

	escollir_categoria(daus, completades, ultima=false) {
		var categories_disponibles = [];
		for (var i = 0; i < 6; i ++) {
			if (completades.includes(i) == false) {
				categories_disponibles.push(i);
			}
		}
		for (var i = 0; i < this.n_categories_especials; i ++) {
			if (completades.includes(this.categories_especials[i]) == false) {
				categories_disponibles.push(this.categories_especials[i]);
			}
		}
		var escollir = categories_disponibles[0];
		var puntuacio = this.puntuar(daus, escollir);
		for (var j = 1; j < categories_disponibles.length; j ++) {
			var nova_puntuacio = this.puntuar(daus, categories_disponibles[j]);
			if (nova_puntuacio >= puntuacio && (ultima == false || (this.categories_especials.includes(categories_disponibles[j]) == false || nova_puntuacio == 8))) {
				puntuacio = nova_puntuacio;
				escollir = categories_disponibles[j];
			}
		}
		return escollir;
	}

	actuar(daus, completades, obligatori, ultima=false) {
		var puntuar = false;
		if (obligatori == null) {
			var escollir = this.escollir_categoria(daus, completades, ultima=ultima);
		} else {
			var escollir = obligatori;
		}
		var modificacio = this.guardar(daus, escollir);
		var suma = 0;
		for (var i = 0; i < 6; i ++) {
			suma += modificacio[i];
		}
		if (suma == 8) {
			obligatori = escollir;
			puntuar = true;
		}
		if (ultima == true) {
			obligatori = escollir;
		}
		return [modificacio, puntuar, obligatori];
	}
}

function tomeu_guardar(daus, categoria) {
	var nous_daus = [0,0,0,0,0,0];
	if ([0,1,2,3,4,5].includes(categoria)) {
		nous_daus[categoria] = daus[categoria];
		nous_daus[5] = daus[5];
	} else if (categoria == "color") {
		var vermelles = daus[0] + daus[4] + daus[5];
		var negres = daus[1] + daus[2] + daus[3];
		if (vermelles == negres) {
			var suma_v = daus[0] + daus[4]*5 + daus[5]*6;
			var suma_n = daus[1]*2 + daus[2]*3 + daus[3]*4;
			if (suma_v >= suma_n) {
				nous_daus[0] = daus[0];
				nous_daus[4] = daus[4];
				nous_daus[5] = daus[5];
			} else {
				nous_daus[1] = daus[1];
				nous_daus[2] = daus[2];
				nous_daus[3] = daus[3];
			}
		} else if (vermelles > negres) {
			nous_daus[0] = daus[0];
			nous_daus[4] = daus[4];
			nous_daus[5] = daus[5];
		} else {
			nous_daus[1] = daus[1];
			nous_daus[2] = daus[2];
			nous_daus[3] = daus[3];
		}
	} else if (categoria == "4/4") {
		nous_daus[5] = daus[5];
		var primera = 0;
		for (var i = 0; i < 5; i ++) {
			if (daus[i] >= daus[primera]) {
				primera = i;
			}
		}
		if (daus[primera] <= 4) {
			nous_daus[primera] = daus[primera];
		} else {
			nous_daus[primera] = 4;
		}
		if (nous_daus[primera] + nous_daus[5] < 8) {
			var segona = 0;
			if (primera == 0) {
				segona = 1;
			}
			for (var i = 0; i < 5; i ++) {
				if (i != primera && daus[i] >= daus[segona]) {
					segona = i;
				}
			}
			if (daus[segona] <= 4) {
				nous_daus[segona] = daus[segona];
			} else {
				nous_daus[segona] = 4;
			}
		}
	}
	return nous_daus;
}

function tomeu_puntuar(daus, categoria) {
	var suma = 0;
	for (var i = 0; i < 6; i ++) {
		suma += daus[i];
	}
	if (categoria == "color" || categoria == "4/4") {
		if (suma < 8) {
			suma = suma - 2.5;
		}
	}
	return suma;
}

function evaluar(categoria, daus) {
	if ([0,1,2,3,4,5].includes(categoria)) {
		if (categoria == 5) {
			return 6*daus[5];
		} else {
			return (categoria+1)*(daus[categoria]+daus[5]);
		}
	} else if (categoria == "color") {
		if (daus[0] + daus[4] + daus[5] == 8 || daus[1] + daus[2] + daus[3] == 8) {
			var suma = 0;
			for (var i = 0; i < 6; i ++) {
				suma += (i+1)*daus[i];
			}
			return suma;
		} else {
			return 0;
		}
	} else if (categoria == "4/4") {
		var diferents = [];
		for (var i = 0; i < 6; i ++) {
			if (daus[i]>0) {
				diferents.push(i);
			}
		}
		if (diferents.length == 1) {
			if (diferents.includes(5) == true) {
				return 4*(5+6);
			} else {
				return 0;
			}
		} else if (diferents.length == 2) {
			if (diferents.includes(5) == true) {
				if (diferents[0] <= 4) {
					return 4*(diferents[0]+1+6);
				} else {
					return 0;
				}
			} else if (diferents[0] == 4 && diferents[1] == 4) {
				return 4*(diferents[0]+diferents[1]+2);
			} else {
				return 0;
			}
		} else if (diferents.length == 3) {
			if (diferents.includes(5) == true) {
				if (diferents[0] <= 4 && diferents[1] <= 4) {
					return 4*(diferents[0]+diferents[1]+2);
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
}