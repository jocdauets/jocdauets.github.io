function dibuixar_taula_llista(llista){
	var text = "<table>";
	for (var i = 0; i < llista.length; i ++) {
		text += "<tr>";
		for (var j =  0; j < llista[i].length; j ++) {
			text += "<td>" + llista[i][j].toString() + "</td>";
		}
		text += "</tr>";
	}
	return text;
}