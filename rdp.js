function calcular_rdp(_partides) {
	var rdp = {};
	var rdp_historic = {};
	for (var i = 0; i < _partides.length; i ++) {
		var partida = _partides[i];
		var afegir = false;
		if (partida.rdp_extra == true) {
			afegir = true;
			for (var j = 0; j < partida.jugadors.length; j ++) {
				jugador = partida.jugadors[j];
				if (rdp[jugador] == null) {
					rdp[jugador] = 50 + partida.rdp[jugador];
				} else {
					rdp[jugador] += partida.rdp[jugador];
				}
			}
		} else if (partida.puntua_rdp == true || partida.puntua_rdp == null) {
			afegir = true;
			var puntuacio_partida = puntuacions(partida);
			for (var j = 0; j < partida.jugadors.length; j ++) {
				if (rdp[partida.jugadors[j]] == null) {
					rdp[partida.jugadors[j]] = 50;
				}
			}
			// càlcul rdp
			lliga = calcular_lliga(rdp);
			var nou_rdp = {};
			for (var j = 0; j < partida.jugadors.length; j ++) {
				nou_rdp[partida.jugadors[j]] = 0;
			}
			for (var j = 0; j < partida.jugadors.length; j ++) {
				for (var k = 0; k < j; k ++) {
					if (puntuacio_partida[partida.jugadors[j]] < puntuacio_partida[partida.jugadors[k]]) {
						nou_rdp[partida.jugadors[j]] --;
						nou_rdp[partida.jugadors[k]] ++;
						if (lliga[partida.jugadors[k]] > lliga[partida.jugadors[j]]) {
							nou_rdp[partida.jugadors[j]] --;
							nou_rdp[partida.jugadors[k]] ++;
						}
					} else if (puntuacio_partida[partida.jugadors[k]] < puntuacio_partida[partida.jugadors[j]]) {
						nou_rdp[partida.jugadors[k]] --;
						nou_rdp[partida.jugadors[j]] ++;
						if (lliga[partida.jugadors[j]] > lliga[partida.jugadors[k]]) {
							nou_rdp[partida.jugadors[k]] --;
							nou_rdp[partida.jugadors[j]] ++;
						}
					}
				}
			}
			var mitjana_taula = 0;
			for (var j = 0; j < partida.jugadors.length; j ++) {
				mitjana_taula += puntuacio_partida[partida.jugadors[j]];
			}
			mitjana_taula = mitjana_taula/partida.jugadors.length;
			for (var j = 0; j < partida.jugadors.length; j ++) {
				if (partida.sistema_daus == 1) {
					nou_rdp[partida.jugadors[j]] += 10*(puntuacio_partida[partida.jugadors[j]]/mitjana_taula - 1);
				} else {
					nou_rdp[partida.jugadors[j]] += 3*(puntuacio_partida[partida.jugadors[j]]/mitjana_taula - 1);
				}
			}
			if (partida.multiplicador_rdp != null) {
				for (var j = 0; j < partida.jugadors.length; j ++) {
					nou_rdp[partida.jugadors[j]] *= partida.multiplicador_rdp;
				}
			}
			for (var j = 0; j < partida.jugadors.length; j ++) {
				var increment = 0;
				if (partida.sistema_daus == 1) {
					increment = Math.round(nou_rdp[partida.jugadors[j]]);
				} else {
					increment = Math.round(nou_rdp[partida.jugadors[j]]);
					if (increment <= -5 && (partida.multiplicador_rdp == 1 || partida.multiplicador_rdp == null)) {
						increment ++;
					}
				}
				rdp[partida.jugadors[j]] += increment;
			}
		}
		if (afegir == true){
			var dia = new Date();
			dia.setDate(parseInt(partida.data.split("-")[0]));
			dia.setMonth(parseInt(partida.data.split("-")[1])-1);
			dia.setYear(parseInt(partida.data.split("-")[2]));
			rdp_historic[dia] = {};
			for (var j = 0; j < Object.keys(rdp).length; j ++) {
				var jugador = Object.keys(rdp)[j];
				rdp_historic[dia][jugador] = rdp[jugador];
			}
		}
	}
	return rdp_historic;
}

function calcular_lliga(rdp) {
	var array_rdp_antic = Object.values(rdp);
	var jugadors = Object.keys(rdp);
	var quartil1 = calcQuartile(array_rdp_antic, 0.25);
	var quartil3 = calcQuartile(array_rdp_antic, 0.75);
	var lliga = {};
	for (var j = 0; j < jugadors.length; j ++) {
		if (rdp[jugadors[j]] < quartil1) {
			lliga[jugadors[j]] = 3;
		} else if (rdp[jugadors[j]] > quartil3) {
			lliga[jugadors[j]] = 1;
		} else {
			lliga[jugadors[j]] = 2;
		}
	}
	return lliga;
}


/** Calculate the 'q' quartile of an array of values
*
* @arg arr - array of values
* @arg q - percentile to calculate (e.g. 0.95)
*/
function calcQuartile(arr,q){
    var a = arr.slice();

    // Sort the array into ascending order
    data = sortArr(a);

    // Work out the position in the array of the percentile point
    var p = ((data.length) - 1) * q;
    var b = Math.floor(p);

    // Work out what we rounded off (if anything)
    var remainder = p - b;

    // See whether that data exists directly
    if (data[b+1]!==undefined){
        return parseFloat(data[b]) + remainder * (parseFloat(data[b+1]) - parseFloat(data[b]));
    }else{
        return parseFloat(data[b]);
    }
}

/** Sort values into ascending order
*
*/
function sortArr(arr){
    var ary = arr.slice();
    ary.sort(function(a,b){ return parseFloat(a) - parseFloat(b);});
    return ary;
}





/// CODI REPETIT!!! S'HAURIA DE CORREGIR

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