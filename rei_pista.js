var nombre_jugadors_totals = 0;
var jugadors_totals = [];
var ordre_total = [];
const _NJUGADORS = 4;
var n_partida = -1;
var esperant = [];
var jugant = [];
var rei = null;
var input_puntuacions = [];
var casella_puntuacions = [];
var noms_puntuacions = [];
var suma_puntuacions = [];
var ratxes = {};
const _CATESP = ["4/4", "5/3", "2/2/2/2", "color", "forma", "dauet(12)", "buida"];
const _DEVMODE = true;

// colors
const _color_rei_classificacio = "yellow";

// configuració inicial
document.getElementById("nombre-jugadors-totals").value = 0;
document.getElementById("nombre-jugadors-totals").addEventListener("change", modificar_nombre_jugadors_totals);
document.getElementById("puntuacions").style.display = "none";
document.getElementById("ordre-partida").style.display = "none";
document.getElementById("ordre-total").style.display = "none";
document.getElementById("classificacio").style.display = "none";
document.getElementById("desempat").style.display = "none";
document.getElementById("popup").style.display = "none";
input_puntuacions = [];
casella_puntuacions = [];
const taula = document.getElementById("taula-puntuacions");
for (var i = 0; i < _NJUGADORS; i ++) {
	var fila_input_puntuacions = [];
	var fila_casella_puntuacions = [];

	const fila = document.createElement("tr");
	
	noms_puntuacions.push(document.createElement("td"));
	noms_puntuacions[i].innerHTML = "Jugador/a";
	fila.appendChild(noms_puntuacions[i]);

	for (var j = 0; j < 8; j ++) {
		fila_input_puntuacions.push(document.createElement("input"));
		fila_input_puntuacions[j].type = "number";
		const jj = j;
		fila_input_puntuacions[j].addEventListener("change", function () {nova_puntuacio(jj);});
		fila_casella_puntuacions.push(document.createElement("td"));
		fila_casella_puntuacions[j].appendChild(fila_input_puntuacions[j]);
		fila.appendChild(fila_casella_puntuacions[j]);
	}
	input_puntuacions.push(fila_input_puntuacions);
	casella_puntuacions.push(fila_casella_puntuacions);

	suma_puntuacions.push(document.createElement("td"));
	fila.appendChild(suma_puntuacions[i]);

	taula.appendChild(fila);
}
for (var i = 0; i < _CATESP.length; i ++) {
	const s1 = document.createElement("option");
	s1.innerHTML = _CATESP[i];
	document.getElementById("categoria-especial-1").options.add(s1);
	const s2 = document.createElement("option");
	s2.innerHTML = _CATESP[i];
	document.getElementById("categoria-especial-2").options.add(s2);
}

// dev options
if (_DEVMODE == false) {
	document.getElementById("dev-omplir-puntuacions").style.display="none";
}

function modificar_nombre_jugadors_totals() {
	nombre_jugadors_totals = document.getElementById("nombre-jugadors-totals").value;
	const div = document.getElementById("piscina-jugadors-noms");
	div.innerHTML = "";
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		const input_nom = document.createElement("input");
		input_nom.type = "text";
		input_nom.id = "input-nom-" + i.toString();
		div.append(input_nom);
		const br = document.createElement("br");
		div.append(br);
	}
}

function piscina_jugadors_completada() {
	if (nombre_jugadors_totals < _NJUGADORS) {
		alert("Calen " + _NJUGADORS.toString() + " jugadors");
	} else {
		for (var i = 0; i < nombre_jugadors_totals; i ++) {
			jugadors_totals.push(document.getElementById("input-nom-" + i.toString()).value);
			ratxes[jugadors_totals[i]] = [];
		}
		document.getElementById("piscina-jugadors").style.display = "none";
		document.getElementById("ordre-partida").style.display = "";
		document.getElementById("ordre-total").style.display = "";
		document.getElementById("classificacio").style.display = "";
		crear_ordre_total_inicial();
		preguntar_ordre_partida();
	}
}

function crear_ordre_total_inicial() {
	var copia_jugadors_totals = [];
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		copia_jugadors_totals.push(jugadors_totals[i]);
	}
	const fila = document.getElementById("ordre-total");
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		const td = document.createElement("td");
		const index = Math.floor(Math.random()*copia_jugadors_totals.length);
		td.innerHTML = "";
		td.id = "ordre-total-" + i.toString();
		if (i < _NJUGADORS) {
			td.style.backgroundColor = "lightGreen";
			jugant.push(copia_jugadors_totals[index]);
		} else {
			esperant.push(copia_jugadors_totals[index]);
		}
		copia_jugadors_totals.splice(index,1);
		fila.appendChild(td);
	}
	actualitzar_ordre_total();
}

function actualitzar_ordre_total() {
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		if (i < _NJUGADORS) {
			document.getElementById("ordre-total-" + i.toString()).innerHTML = jugant[i];
		} else {
			document.getElementById("ordre-total-" + i.toString()).innerHTML = esperant[i-_NJUGADORS];
		}
	}
}

function preguntar_ordre_partida() {
	document.getElementById("puntuacions").style.display = "none";
	document.getElementById("ordre-partida").style.display = "";
	const div = document.getElementById("ordre-partida-input");
	div.innerHTML = "";
	for (var i = 0; i < _NJUGADORS; i ++) {
		const input = document.createElement("input");
		input.type = "number";
		input.id = "input-ordre-partida-" + i.toString();
		div.innerHTML += jugant[i] + ": ";
		div.appendChild(input);
		const br = document.createElement("br");
		div.appendChild(br);
	}
}

function ordre_partida_completat() {
	var ordres = [];
	for (var i = 0; i < _NJUGADORS; i ++) {
		const input = document.getElementById("input-ordre-partida-" + i.toString());
		if (input.value == null || input.value == "") {
			alert("L'ordre està incomplet");
			return -1;
		} else if (ordres.includes(input.value)) {
			alert("L'ordre és invàlid");
			return -2;
		} else {
			ordres.push(input.value);
		}
	}
	n_partida ++;
	var copia_jugant = [];
	for (var i = 0; i < _NJUGADORS; i ++) {
		copia_jugant.push(jugant[i]);
	}
	jugant = [];
	while (ordres.length > 0) {
		var min = ordres[0];
		var index = 0;

		for (var i = 1; i < ordres.length; i ++) {
			if (ordres[i] < min) {
				min = ordres[i];
				index = i;
			}
		}
		ordres.splice(index,1);
		jugant.push(copia_jugant[index]);
		copia_jugant.splice(index,1);
	}
	iniciar_partida();
}

function nova_puntuacio(columna) {
	// comprovar trumfo
	maxim = -1;
	indexs_maxim = [];
	for (var i = 0; i < _NJUGADORS; i ++) {
		if (input_puntuacions[i][columna].value != null && input_puntuacions[i][columna].value != "") {
			if (parseInt(input_puntuacions[i][columna].value) > maxim) {
				maxim = parseInt(input_puntuacions[i][columna].value);
				indexs_maxim = [i];
			} else if (parseInt(input_puntuacions[i][columna].value) == maxim) {
				indexs_maxim.push(i);
			}
		}
	}

	// pintar caselles
	if (indexs_maxim.length == 1) {
		casella_puntuacions[indexs_maxim[0]][columna].style.backgroundColor = "yellow";
		for (var i = 0; i < _NJUGADORS; i ++) {
			if (i != indexs_maxim[0]) {
				casella_puntuacions[i][columna].style.backgroundColor = "white";
			}
		}
	} else {
		for (var i = 0; i < _NJUGADORS; i ++) {
			casella_puntuacions[i][columna].style.backgroundColor = "white";
		}
	}
}

function iniciar_partida() {
	document.getElementById("ordre-partida").style.display = "none";
	document.getElementById("puntuacions").style.display = "";
	document.getElementById("seguent-partida").style.display = "none";
	for (var i = 0; i < _NJUGADORS; i ++) {
		noms_puntuacions[i].innerHTML = jugant[i];
		for (var j = 0; j < 8; j ++) {
			casella_puntuacions[i][j].style.backgroundColor = "white";
			input_puntuacions[i][j].value = null;
		}
		if (jugant[i] != rei) {
			ratxes[jugant[i]].push(0);
		}
		suma_puntuacions[i].innerHTML = "";
	}
}

function finalitzar_partida() {
	for (var i = 0; i < _NJUGADORS; i ++) {
		for (var j = 0; j < 8; j ++) {
			if (input_puntuacions[i][j].value == "" || input_puntuacions[i][j].value == null) {
				alert("La partida encara no ha finalitzat");
				return -1;
			}
		}
	}
	baixar_partida();
	espectacle_mostrar_guanyadors();
	const suma = calcular_suma();
	var max = suma[0];
	var index = [0];
	suma_puntuacions[0].innerHTML = suma[0];
	for (var i = 1; i < _NJUGADORS; i ++) {
		suma_puntuacions[i].innerHTML = suma[i];
		if (suma[i] > max) {
			max = suma[i];
			index = [i];
		} else if (suma[i] == max) {
			index.push(i);
		}
	}
	if (index.length == 1) {
		actualitzar_classificacio(index[0]);
	} else {
		preguntar_desempat();
	}
}

function calcular_suma() {
	var suma = [];
	for (var i = 0; i < _NJUGADORS; i ++) {
		suma.push(0);
		for (var j = 0; j < 8; j ++) {
			suma[i] += parseInt(input_puntuacions[i][j].value);
		}
	}
	for (var j = 0; j < 8; j ++) {
		var max = parseInt(input_puntuacions[0][j].value);
		var indexs = [0];
		for (var i = 1; i < _NJUGADORS; i ++) {
			if (parseInt(input_puntuacions[i][j].value) > max) {
				max = parseInt(input_puntuacions[i][j].value);
				indexs = [i];
			} else if (parseInt(input_puntuacions[i][j].value) == max) {
				indexs.push(i);
			}
		}
		if (indexs.length == 1) {
			suma[indexs[0]] += 5;
		}
	}
	return suma;
}

function baixar_partida() {
	return 0;
}

function preguntar_desempat() {
	document.getElementById("desempat").style.display = "";
	const selector_desempat = document.getElementById("select-desempat");
	for (var i = 0; i < selector_desempat.options.length; i ++) {
		selector_desempat.options.remove(0);
	}
	var suma = calcular_suma();
	var maxim = suma[0];
	var indexs = [0];
	for (var i = 1; i < _NJUGADORS; i ++) {
		if (suma[i] > maxim) {
			maxim = suma[i];
			indexs = [i];
		} else if (suma[i] == maxim) {
			indexs.push(i);
		}
	}
	for (var i = 0; i < indexs.length; i ++) {
		const opcio = document.createElement("option");
		opcio.innerHTML = jugant[indexs[i]];
		selector_desempat.options.add(opcio);
	}
}

function desempat_resolt() {
	document.getElementById("desempat").style.display="none";
	actualitzar_classificacio(jugant.indexOf(document.getElementById("select-desempat").value));
}

function espectacle_mostrar_guanyadors() {
	const popup = activar_popup();
	var posicions = [];
	var afegits = [];
	const suma = calcular_suma();
	var n = 1;
	while (afegits.length < _NJUGADORS) {
		var maxim = -1;
		var afegir = [];
		for (var i = 0; i < _NJUGADORS; i ++) {
			if (afegits.includes(i) == false) {
				if (suma[i] > maxim) {
					maxim = suma[i];
					afegir = [i];
				} else if (suma[i] == maxim) {
					afegir.push(i);
				}
			}
		}
		for (var i = 0; i < afegir.length; i ++) {
			afegits.push(afegir[i]);
			posicions.push(n);
		}
		n += afegir.length;
	}

	// html
	const h1 = document.createElement("h1");
	h1.innerHTML = "Classificació final"
	popup.appendChild(h1);

	// html table
	const taula = document.createElement("table");
	for (var i = 0; i < _NJUGADORS; i ++) {
		const fila = document.createElement("tr");
		
		const posicio = document.createElement("td");
		posicio.id = "popup-posicio-" + i.toString();
		posicio.style.visibility = "hidden";
		posicio.innerHTML = posicions[i];
		fila.appendChild(posicio);

		const nom = document.createElement("td");
		nom.id = "popup-nom-" + i.toString();
		nom.style.visibility = "hidden";
		nom.innerHTML = jugant[afegits[i]];
		fila.appendChild(nom);

		const punts = document.createElement("td");
		punts.id = "popup-punts-" + i.toString();
		punts.style.visibility = "hidden";
		punts.innerHTML = suma[afegits[i]];
		fila.appendChild(punts);

		taula.appendChild(fila);
	}
	popup.appendChild(taula);

	// animacio
	function aux(n) {
		if (posicions.includes(n) == true) {
			setTimeout(function() {
				var indexs = [];
				for (var j = 0; j < _NJUGADORS; j ++) {
					if (posicions[j] == n) {
						indexs.push(j);
					}
				}
				for (var j = 0; j < indexs.length; j ++) {
					document.getElementById("popup-posicio-" + indexs[j].toString()).style.visibility = "";
				}
				setTimeout(function() {
					for (var j = 0; j < indexs.length; j ++) {
						document.getElementById("popup-punts-" + indexs[j].toString()).style.visibility = "";
					}
					setTimeout(function() {
						for (var j = 0; j < indexs.length; j ++) {
							document.getElementById("popup-nom-" + indexs[j].toString()).style.visibility = "";
						}
						if (n >= 1) {
							aux(n-1);
						} else {
							setTimeout(function() {
								desactivar_popup();
							}, 3000);
						}
					}, 3000);
				}, 1000);
			}, 1000);
		} else if (n >= 1){
			aux(n-1);
		} else {
			setTimeout(function() {
				desactivar_popup();
			}, 3000);
		}
	}
	aux(_NJUGADORS);
}

function actualitzar_classificacio(index) {
	rei = jugant[index];
	ratxes[rei][ratxes[rei].length-1] ++;
	document.getElementById("seguent-partida").style.display = "";

	// ordenem classificació (els jugadors sense ratxa es queden fora)
	ratxes_ord = ratxes_ordenades();
	var jugadors_per_classificar = [];
	var classificacio = [];
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		if (ratxes_ord[jugadors_totals[i]].length > 0) {
			jugadors_per_classificar.push(jugadors_totals[i]);
		}
	}
	while (jugadors_per_classificar.length > 0) {
		maxims = [jugadors_per_classificar[0]];
		for (var i = 1; i < jugadors_per_classificar.length; i ++) {
			const comparacio = comparar_ratxes(ratxes_ord[jugadors_per_classificar[i]], ratxes_ord[maxims[0]]);
			if (comparacio == 1) {
				maxims = [jugadors_per_classificar[i]];
			} else if (comparacio == 0) {
				maxims.push(jugadors_per_classificar[i]);
			}
		}
		for (var i = 0; i < maxims.length; i ++) {
			jugadors_per_classificar.splice(jugadors_per_classificar.indexOf(maxims[i]),1);
		}
		classificacio.push(maxims);
	}

	// fem la classificació en html
	const header = document.createElement("tr");
	const header_posicio = document.createElement("th");
	header_posicio.innerHTML = "Posició";
	header.appendChild(header_posicio);
	const header_nom = document.createElement("th");
	header_nom.innerHTML = "Jugador/a";
	header.appendChild(header_nom);
	const maxim_n_ratxes = maxim_nombre_ratxes();
	for (var i = 0; i < maxim_n_ratxes; i ++) {
		const th = document.createElement("th");
		header.appendChild(th);
	}
	const taula = document.getElementById("taula-classificacio");
	taula.innerHTML = "";
	taula.appendChild(header);

	var posicio = 1;
	var pintat_rei = false;
	for (var i = 0; i < classificacio.length; i ++) {
		for (var j = 0; j < classificacio[i].length; j ++) {
			const tr = document.createElement("tr");

			const td_posicio = document.createElement("td");
			td_posicio.innerHTML = posicio.toString();
			tr.appendChild(td_posicio);

			const td_nom = document.createElement("td");
			td_nom.innerHTML = classificacio[i][j];
			tr.appendChild(td_nom);

			var ratxa = ratxes_ord[classificacio[i][j]];
			for (var k = 0; k < maxim_n_ratxes; k ++) {
				const td = document.createElement("td");
				if (k < ratxa.length) {
					td.innerHTML = ratxa[k];
					if (classificacio[i][j] == rei && pintat_rei == false && ratxa[k] == ratxes[rei][ratxes[rei].length-1]) {
						td.style.backgroundColor = _color_rei_classificacio;
						pintat_rei = true;
					}
				}
				tr.appendChild(td);
			}
			taula.appendChild(tr);
		}
		posicio += classificacio[i].length;
	}
}

function ratxes_ordenades() {
	var ratxes_ordenades = {};
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		ratxes_ordenades[jugadors_totals[i]] = [];
		var comptades = [];
		while (comptades.length < ratxes[jugadors_totals[i]].length) {
			var maxim = -1;
			var index = -1;
			for (var j = 0; j < ratxes[jugadors_totals[i]].length; j ++) {
				if (ratxes[jugadors_totals[i]][j] > maxim && comptades.includes(j) == false) {
					maxim = ratxes[jugadors_totals[i]][j];
					index = j;
				}
			}
			comptades.push(index);
			if (maxim > 0) {
				ratxes_ordenades[jugadors_totals[i]].push(maxim);
			}
		}
	}
	return ratxes_ordenades;
}

function maxim_nombre_ratxes() {
	ratxes_ord = ratxes_ordenades();
	var max = -1;
	for (var i = 0; i < nombre_jugadors_totals; i ++) {
		if (ratxes_ord[jugadors_totals[i]].length > max) {
			max = ratxes_ord[jugadors_totals[i]].length;
		}
	}
	return max;
}

// 1: r > s, 0: r = s, -1: r < s
function comparar_ratxes(r,s) {
	var longitud = r.length;
	if (s.length < longitud) {
		longitud = s.length;
	}
	for (var i = 0; i < longitud; i ++) {
		if (r[i] > s[i]) {
			return 1;
		} else if (r[i] < s[i]) {
			return -1;
		}
	}
	if (r.length > s.length) {
		return 1;
	} else if (r.length < s.length) {
		return -1;
	} else {
		return 0;
	}
}

function seguent_partida() {
	const suma = calcular_suma();
	while (esperant.length < nombre_jugadors_totals-1) {
		var maxim = -1;
		var indexs = [];
		for (var i = 0; i < _NJUGADORS; i ++) {
			if (jugant[i] != rei && esperant.includes(jugant[i]) == false) {
				if (suma[i] > maxim) {
					maxim = suma[i];
					indexs = [i];
				} else if (suma[i] == maxim) {
					indexs.push(i);
				}
			}
		}
		if (indexs.length == 1) {
			esperant.push(jugant[indexs[0]]);
		} else {
			var r = Math.floor(Math.random()*indexs.length);
			for (var k = 0; k < indexs.length; k ++) {
				esperant.push(jugant[indexs[(k+r)%indexs.length]]);
			}
		}
	}
	jugant = [rei];
	for (var i = 0; i < _NJUGADORS-1; i ++) {
		jugant.push(esperant[0]);
		esperant.splice(0,1);
	}
	actualitzar_ordre_total();
	preguntar_ordre_partida();
}

function activar_popup() {
	document.getElementById("div-principal").style.filter = "blur(5px)";
	const popup = document.getElementById("popup")
	popup.innerHTML = "";
	popup.style.display = "";
	return popup;
}

function desactivar_popup() {
	document.getElementById("div-principal").style.filter = "";
	document.getElementById("popup").style.display = "none";
}

function __omplir_puntuacions() {
	for (var i = 0; i < _NJUGADORS; i ++) {
		for (var j = 0; j < 8; j ++) {
			input_puntuacions[i][j].value = parseInt(Math.floor(9*Math.random())*(j+1));
			nova_puntuacio(j);
		}
	}
}