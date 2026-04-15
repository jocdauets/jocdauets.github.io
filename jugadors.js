const categories_basiques = ["v","n","j","q","k","a"];
const categories_basiques_diccionari = {"v":0, "n":1, "j":2, "q":3, "k":4, "a":5};

function categories_especials(_partides){
	categories = [];
	for (var i = 0; i < _partides.length; i ++) {
		for (var j = 0; j < _partides[i].categories_especials.length; j ++) {
			if (categories.includes(_partides[i].categories_especials[j]) == false) {
				categories.push(_partides[i].categories_especials[j]);
			}
		}
	}
	return categories;
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