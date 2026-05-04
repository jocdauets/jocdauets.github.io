const categories_basiques = ["v","n","j","q","k","a"];
const categories_basiques_diccionari = {"v":0, "n":1, "j":2, "q":3, "k":4, "a":5};
const llindar_condicions_estandard = {"v": 8, "n": 16, "j": 24, "q": 32, "k": 40, "a": 48, "4/4": 44, "5/3": 55, "buida": 0, "color": 48, "dauet(10)": 22, "dauet(12)": 24, "dauet(5)": 17, "forma": 48};

function categories_especials(_partides){
	categories = [];
	for (var i = 0; i < _partides.length; i ++) {
		for (var j = 0; j < _partides[i].categories_especials.length; j ++) {
			if (categories.includes(_partides[i].categories_especials[j]) == false) {
				categories.push(_partides[i].categories_especials[j]);
			}
		}
	}
	return categories.sort();
}

function partides_amb_cert_jugador(jugador,_partides){
	var partides = [];
	for(var i = 0; i < _partides.length; i ++){
		var pertany = false;
		for(var j = 0; j < _partides[i].jugadors.length; j ++){
			if(jugador == _partides[i].jugadors[j]){
				pertany = true;
			}
		}
		if(pertany == true){
			partides.unshift(_partides[i])
		}
	}
	return partides;
}

function frequencia(jugador,categoria,_partides){
	var partides = partides_amb_cert_jugador(jugador,_partides);
	var frequencia = {};
	// és una categoria bàsica
	if (categories_basiques.includes(categoria)){
		for (var i = 0; i < partides.length; i ++) {
			var valor = partides[i].puntuacions[jugador][categories_basiques_diccionari[categoria]];
			if (valor in frequencia) {
				frequencia[valor] ++;
			} else {
				frequencia[valor] = 1;
			}
		}
	} else {
		for (var i = 0; i < partides.length; i ++) {
			if (partides[i].categories_especials.includes(categoria)) {
				for (var j = 0; j < partides[i].categories_especials.length; j ++) {
					if (partides[i].categories_especials[j] == categoria) {
						var valor = partides[i].puntuacions[jugador][6+j];
						if (valor in frequencia) {
							frequencia[valor] ++;
						} else {
							frequencia[valor] = 1;
						}
					}
				}
			}
		}
	}
	return frequencia;
}

function mitjana(jugador, categoria, _partides) {
	var freq = frequencia(jugador, categoria, _partides);
	var n = 0;
	var suma = 0;
	for (const entrada of Object.entries(freq)) {
		n += entrada[1];
		suma += entrada[0]*entrada[1];
	}
	if (n == 0) {
		return -1;
	} else {
		return suma/n;
	}
}

function mitjanes(jugador, _partides) {
	const cat_especials = categories_especials(_partides);
	var mitjanes = {};
	for (var i = 0; i < 6; i ++) {
		mitjanes[categories_basiques[i]] = mitjana(jugador, categories_basiques[i], _partides);
	}
	for (var i = 0; i < cat_especials.length; i ++) {
		mitjanes[cat_especials[i]] = mitjana(jugador, cat_especials[i], _partides);
	}
	return mitjanes;
}

function maxim_unic(partida) {
	const n = partida.puntuacions[partida.jugadors[0]].length;
	var resultat = [];
	for (var i = 0; i < n; i ++) {
		var maxim = partida.puntuacions[partida.jugadors[0]][i];
		var unic = true;
		var jugador_maxim = partida.jugadors[0];
		for (var j = 1; j < partida.jugadors.length; j ++) {
			if (partida.puntuacions[partida.jugadors[j]][i] == maxim) {
				unic = false;
			} else if (partida.puntuacions[partida.jugadors[j]][i] > maxim) {
				maxim = partida.puntuacions[partida.jugadors[j]][i];
				unic = true;
				jugador_maxim = partida.jugadors[j];
			}
		}
		if (unic == true) {
			resultat.push(jugador_maxim);
		} else {
			resultat.push(false);
		}
	}
	return resultat;
}

function minim_no_unic(partida) {
	const n = partida.puntuacions[partida.jugadors[0]].length;
	var resultat = [];
	for (var i = 0; i < n; i ++) {
		var minim = partida.puntuacions[partida.jugadors[0]][i];
		var jugadors_minims = [partida.jugadors[0]];
		for (var j = 1; j < partida.jugadors.length; j ++) {
			if (partida.puntuacions[partida.jugadors[j]][i] == minim) {
				jugadors_minims.push(partida.jugadors[j]);
			} else if (partida.puntuacions[partida.jugadors[j]][i] < minim) {
				jugadors_minims = [partida.jugadors[j]];
			}
		}
		resultat.push(jugadors_minims);
	}
	return resultat;
}

function puntuacions(partida) {
	const n = partida.puntuacions[partida.jugadors[0]].length;

	// Categories tatxades
	var categories_tatxades = [];
	if ("trumfo" in partida) {
		for (var i = 0; i < n; i ++) {
			for (var j = 0; j < partida.trumfo[i].length; j ++) {
				var text = partida.trumfo[i][j].split("-");
				if (text[0] == "tatxar" && text.length == 2) {
					categories_tatxades.push(parseInt(text[1]));
				}
			}
		}
	}

	// Suma de punts
	resultat = {};
	for (var i = 0; i < partida.jugadors.length; i ++) {
		resultat[partida.jugadors[i]] = 0;
		for (var j = 0; j < n; j ++) {
			if (categories_tatxades.includes(j) == false) {
				resultat[partida.jugadors[i]] += partida.puntuacions[partida.jugadors[i]][j];
			}
		}
	}

	// Propines
	var maxim_unic_partida = maxim_unic(partida);
	for (var i = 0; i < n; i ++) {
		if (categories_tatxades.includes(i) == false) {
			if (maxim_unic_partida[i] != false) {
				resultat[maxim_unic_partida[i]] += 5;
			}
		}
	}

	// Trumfos
	if ("trumfo" in partida) {
		var minim_no_unic_partida = minim_no_unic(partida);
		for (var i = 0; i < n; i ++) {
			if (categories_tatxades.includes(i) == false) {
				for (var j = 0; j < partida.trumfo[i].length; j ++) {
					if (partida.trumfo[i][j] == "penyora") {
						for (var k = 0; k < minim_no_unic_partida[i].length; k ++) {
							resultat[minim_no_unic_partida[i][k]] -= 5;
						}
					}
				}
			}
		}
	}

	return resultat;
}

function puntuacions_relatives(partida) {
	const punt = puntuacions(partida);
	minim = punt[partida.jugadors[0]];
	maxim = punt[partida.jugadors[0]];
	for (var i = 1; i < partida.jugadors.length; i ++) {
		if (punt[partida.jugadors[i]] > maxim) {
			maxim = punt[partida.jugadors[i]];
		} else if (punt[partida.jugadors[i]] < minim) {
			minim = punt[partida.jugadors[i]];
		}
	}
	if (minim == maxim) {
		for (var i = 0; i < partida.jugadors.length; i ++) {
			punt[partida.jugadors[i]] = 100;
		}
	} else {
		for (var i = 0; i < partida.jugadors.length; i ++) {
			punt[partida.jugadors[i]] = 100*(punt[partida.jugadors[i]]-minim)/(maxim-minim);
		}
	}
	return punt;
}

function puntuacio_relativa_mitjana(jugador, _partides){
	const partides = partides_amb_cert_jugador(jugador, _partides);
	if (partides.length == 0) {
		return -1;
	} else {
		var suma = 0;
		for (var i = 0; i < partides.length; i ++) {
			suma += puntuacions_relatives(partides[i])[jugador];
		}
		return suma/partides.length;
	}
}

function percentatge_victories(jugador, _partides) {
	const partides = partides_amb_cert_jugador(jugador, _partides);
	if (partides.length == 0) {
		return -1;
	} else {
		var victories = 0;
		for (var i = 0; i < partides.length; i ++) {
			const punts = puntuacions(partides[i]);
			var guanyador = true;
			for (var j = 0; j < partides[i].jugadors.length; j ++) {
				if (punts[jugador] < punts[partides[i].jugadors[j]]) {
					guanyador = false;
				}
			}
			if (guanyador == true) {
				victories ++;
			}
		}
		return 100*victories/partides.length;
	}
}

function maxima_puntuacio(jugador, _partides) {
	var max = -1;
	const partides = partides_amb_cert_jugador(jugador, _partides);
	for (var i = 0; i < partides.length; i ++) {
		var punt = puntuacions(partides[i])[jugador];
		if (punt > max) {
			max = punt;
		}
	}
	return max;
}

function maxima_puntuacio_categoria(jugador, categoria, _partides) {
	var max = -1;
	const partides = partides_amb_cert_jugador(jugador, _partides);
	for (var i = 0; i < partides.length; i ++) {
		if (categories_basiques.includes(categoria)) {
			if (partides[i].puntuacions[jugador][categories_basiques_diccionari[categoria]] > max) {
				max = partides[i].puntuacions[jugador][categories_basiques_diccionari[categoria]];
			}
		} else {
			for (var j = 0; j < partides[i].categories_especials.length; j ++) {
				if (partides[i].categories_especials[j] == categoria) {
					if (partides[i].puntuacions[jugador][6+j] > max) {
						max = partides[i].puntuacions[jugador][6+j];
					}
				}
			}
		}
	}
	return max;
}

function percentatge_fora_condicions_estandard(jugador, categoria, _partides) {
	if (categoria in llindar_condicions_estandard) {
		var total = 0;
		var fce = 0;
		const partides = partides_amb_cert_jugador(jugador, _partides);
		for (var i = 0; i < partides.length; i ++) {
			if (categories_basiques.includes(categoria)) {
				total ++;
				if (partides[i].puntuacions[jugador][categories_basiques_diccionari[categoria]] > llindar_condicions_estandard[categoria]) {
					fce ++;
				}
			} else {
				for (var j = 0; j < partides[i].categories_especials.length; j ++) {
					if (partides[i].categories_especials[j] == categoria) {
						total ++;
						if (partides[i].puntuacions[jugador][6+j] > llindar_condicions_estandard[categoria]) {
							fce ++;
						}
					}
				}
			}
		}
		if (total == 0) {
			return -1;
		} else {
			return 100*fce/total;
		}
	} else {
		return -2;
	}
}

function percentatge_propines(jugador, categoria, _partides) {
	var total = 0;
	var n = 0;
	const partides = partides_amb_cert_jugador(jugador, _partides);
	for (var i = 0; i < partides.length; i ++) {
		const propines = maxim_unic(partides[i]);
		if (categories_basiques.includes(categoria)) {
			total ++;
			if (propines[categories_basiques_diccionari[categoria]] == jugador) {
				n ++;
			}
		} else {
			for (var j = 0; j < partides[i].categories_especials.length; j ++) {
				if (partides[i].categories_especials[j] == categoria) {
					total ++;
					if (propines[6+j] == jugador) {
						n ++;
					}
				}
			}
		}
	}
	if (total == 0) {
		return -1;
	} else {
		return 100*n/total;
	}
}

function percentatge_penyores(jugador, categoria, _partides) {
	var total = 0;
	var n = 0;
	const partides = partides_amb_cert_jugador(jugador, _partides);
	for (var i = 0; i < partides.length; i ++) {
		if ("trumfo" in partides[i]) {
			const trmf = minim_no_unic(partides[i]);
			if (categories_basiques.includes(categoria) && partides[i].trumfo[categories_basiques_diccionari[categoria]].includes("penyora")) {
				total ++;
				if (trmf[categories_basiques_diccionari[categoria]].includes(jugador)) {
					n ++;
				}
			} else {
				for (var j = 0; j < partides[i].categories_especials.length; j ++) {
					if (partides[i].categories_especials[j] == categoria && partides[i].trumfo[6+j].includes("penyora")) {
						total ++;
						if (trmf[6+j].includes(jugador)) {
							n ++;
						}
					}
				}
			}
		}
	}
	if (total == 0) {
		return -1;
	} else {
		return 100*n/total;
	}
}

function percentatge_tatxar(jugador, categoria, _partides) {
	var total = 0;
	var n = 0;
	const partides = partides_amb_cert_jugador(jugador, _partides);
	for (var i = 0; i < partides.length; i ++) {
		if ("trumfo" in partides[i]) {
			const trmf = maxim_unic(partides[i]);
			if (categories_basiques.includes(categoria)) {
				var includes = false;
				for (var j = 0; j < partides[i].trumfo[categories_basiques_diccionari[categoria]]; j ++) {
					if (partides[i].trumfo[categories_basiques_diccionari[categoria]][j].split("-")[0] == "tatxar") {
						includes = true;
					}
				}
				if (includes) {
					total ++;
					if (trmf[categories_basiques_diccionari[categoria]].includes(jugador)) {
						n ++;
					}
				}
			} else {
				for (var j = 0; j < partides[i].categories_especials.length; j ++) {
					if (partides[i].categories_especials[j] == categoria) {
						var includes = false;
						for (var k = 0; k < partides[i].categories_especials[j]; k ++) {
							if (partides[i].trumfo[6+j].split("-")[0] == "tatxar") {
								includes = true;
							}
						}
						if (includes) {
							total ++;
							if (trmf[6+j].includes(jugador)) {
								n ++;
							}
						}
					}
				}
			}
		}
	}
	if (total == 0) {
		return -1;
	} else {
		return 100*n/total;
	}
}

function frequencia_relativa(jugador, categoria, _partides) {
	var frequencia = {};
	var n = 0;
	const partides = partides_amb_cert_jugador(jugador,_partides);
	for (var i = 0; i < partides.length; i ++) {
		if (categories_basiques.includes(categoria)) {
			n ++;
			var puntuacio = parseInt(partides[i].puntuacions[jugador][categories_basiques.indexOf(categoria)]);
			if (Object.keys(frequencia).includes(puntuacio.toString()) == true) {
				frequencia[puntuacio] ++;
			} else {
				frequencia[puntuacio] = 1;
			}
		} else {
			for (var j = 0; j < partides[i].categories_especials.length; j ++) {
				if (partides[i].categories_especials[j] == categoria) {
					n ++;
					var puntuacio = parseInt(partides[i].puntuacions[jugador][6+j]);
					if (Object.keys(frequencia).includes(puntuacio.toString()) == true) {
						frequencia[puntuacio] ++;
					} else {
						frequencia[puntuacio] = 1;
					}
				}
			}
		}
	}
	for (var i = 0; i < Object.keys(frequencia).length; i ++) {
		frequencia[Object.keys(frequencia)[i]] = frequencia[Object.keys(frequencia)[i]]/n;
	}
	return frequencia;
}

function frequencia_relativa_comparada(jugador1, jugador2, categoria, _partides) {
	const frequencia1 = frequencia_relativa(jugador1, categoria, _partides);
	const frequencia2 = frequencia_relativa(jugador2, categoria, _partides);
	var frequencia_comparada = {};
	for (var i = 0; i < Object.keys(frequencia1).length; i ++) {
		var p1 = frequencia1[Object.keys(frequencia1)[i]];
		for (var j = 0; j < Object.keys(frequencia2).length; j ++) {
			var p2 = frequencia2[Object.keys(frequencia2)[j]];
			var diferencia = parseInt(Object.keys(frequencia1)[i]) - parseInt(Object.keys(frequencia2)[j]);
			if (Object.keys(frequencia_comparada).includes(diferencia.toString())) {
				frequencia_comparada[diferencia] += p1*p2;
			} else {
				frequencia_comparada[diferencia] = p1*p2;
			}
		}
	}
	return frequencia_comparada;
}