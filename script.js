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

function descarregar(text, nom, extensio=txt) {
	var file = new File(["\ufeff"+text], nom + "." + extensio, {type: "text/plain:charset=UTF-8"});
	var url = window.URL.createObjectURL(file);
	var a = document.createElement("a");
	a.style = "display:none";
	a.href = url;
	a.download = file.name;
	a.click();
	window.URL.revokeObjectURL(url);
}

function escriure_nom(jugador, link=false, factor=1) {
	var div = document.createElement("div");
	if (link == true) {
		var a = document.createElement("a");
		a.href = "/jugadors.html?jugador=" + jugador;
		a.innerHTML = jugador;
		a.classList = ["link-cercar"];
		div.appendChild(a);
	} else {
		div.innerHTML = jugador + " ";
	}
	if (_regions["Barna"].includes(jugador)) {
		var img = document.createElement("img");
		img.src = "./escuts/regio_barna.png";
		img.height = 18*factor;
		div.innerHTML += " ";
		div.appendChild(img);
	}
	if (_regions["Chicago"].includes(jugador)) {
		var img = document.createElement("img");
		img.src = "./escuts/regio_chicago.png";
		img.height = 12*factor;
		div.innerHTML += " ";
		div.appendChild(img);
	}
	if (_regions["Lichtenberg"].includes(jugador)) {
		var img = document.createElement("img");
		img.src = "./escuts/regio_lichtenberg.png";
		img.height = 12*factor;
		div.innerHTML += " ";
		div.appendChild(img);
	}
	if (_regions["L'Escala"].includes(jugador)) {
		var img = document.createElement("img");
		img.src = "./escuts/regio_lescala.png";
		img.height = 15*factor;
		div.innerHTML += " ";
		div.appendChild(img);
	}
	if (_regions["Wesseling-Bonn"].includes(jugador)) {
		var img = document.createElement("img");
		img.src = "./escuts/regio_wesseling.png";
		img.height = 12*factor;
		div.innerHTML += " ";
		div.appendChild(img);
	}
	return div;
}