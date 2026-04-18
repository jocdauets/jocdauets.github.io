function dibuixar_taula_llista(llista, header=false){
	if (header == false) {
		var text = "<table>";
		for (var i = 0; i < llista.length; i ++) {
			text += "<tr>";
			for (var j =  0; j < llista[i].length; j ++) {
				text += "<td>" + llista[i][j].toString() + "</td>";
			}
			text += "</tr>";
		}
		return text;
	} else {
		var indices = [];
		for (var i = 0; i < llista[0].length; i ++) {
			if (header.includes(llista[0][i])) {
				indices.push(i);
			}
		}
		var nova_llista = [];
		for (var i = 0; i < llista.length; i ++) {
			var fila = [];
			for (var j = 0; j < llista[i].length; j ++) {
				if (indices.includes(j)) {
					fila.push(llista[i][j]);
				}
			}
			nova_llista.push(fila);
		}
		return dibuixar_taula_llista(nova_llista);
	}
}