$(document).ready(function() {
	//recupero i dati dei ristoranti dal local storage
	var listaRistoranti=window.localStorage.getItem('ristoranti'); //string
	var ristorantiJson=JSON.parse(listaRistoranti); //array di ristoranti
	console.log(JSON.stringify(ristorantiJson));

	//window è la root dell'albero DOM (finestra corrente del browser)
	//location è l'elemento DOM che rappresenta le informazioni sull'URL corrente
	//search prende la porzione dell'URL relativa ai parametri della GET
	var nome=(window.location.search).substring(6); //codice passato con la GET
	
	//dichiaro queste variabili fuori dal ciclo perché mi servono nella funzione che imposta i valori predefiniti nella prenotazioe
	var idMenu;
	var nome_ristorante;
	//scorro l'array JSON salvato e trovo quale oggetto ha "codice"=var nome
	ristorantiJson.forEach(function (entry) {
		if (nome==entry["codice"]) { //ho trovato il ristorante giusto (codice indica proprio ciò che passo nel form)
			console.log ("nome: "+entry["nome"]);
			nome_ristorante=entry["nome"];
			//imposto il titolo della pagina col nome del ristorante (informazione che starebbe nell'head dell'HTML)
			document.title=nome_ristorante;
			//riempio i campi delle informazioni del ristorante
			$("#nome_ristorante").html(entry["nome"]);
			$("#indirizzo").html(entry["via"]+" - "+entry["citta"]+" ("+entry["provincia"]+")");

			//apro l'array della tipologia e ne mostro i risultati
			var tipologiaStr="";
			entry["tipologia"].forEach(function (tipo) {
				tipologiaStr+=tipo+", ";
			})
			tipologiaStr=tipologiaStr.slice(0, -2); //tolgo lo spazio e la virgola dall'ultimo elemento
			$("#dettagli_ristorante").html("Tipologia: "+tipologiaStr);

			//mostro la mappa in base alle coordinate salvate nel JSON
			var gps=entry["gps"];
			var lat=gps["lat"];
			var lng=gps["lng"];

			//var geocoder=new google.maps.Geocoder();
			//funzione che crea una mappa associata allo spazio riservato nell'HTML
			//Map: classe JavaScript che rappresenta la mappa
			var map=new google.maps.Map(document.getElementById('map'), {
				center: {lat: lat, lng: lng}, //coordinate in cui centrare la mappa
				zoom: 15 //livello di zoom (più è alto e meno larga è la porzione visibile)
			});

			var marker = new google.maps.Marker({ //Marker rappresenta il simbolo che indica un punto specifico sulla mappa
		       	position: {lat: lat, lng: lng}, //coordinate dove posizionare il simbolo
		       	map: map, //a quale mappa deve essere applicato (map è la variabile che contiene il mio oggetto mappa)
		       	title: (entry["nome"]) //testo che compare quando si passa sopra il mouse
		    });

			//ciclo sull'array dei menu e per ciascuno stampo le portate
			var appendStr="";
			entry["menus"].forEach(function (menu, i) {
				//se l'indice è 0,2,... pari allora aggiungo una row (metto 2 menu per row: italiano ed inglese)
				if (i%2==0) {
					appendStr+="<div class='row'>";
				}

				//nome del menu
				appendStr+="<div class='col-lg-6 col-md-6'>";
				var nome=menu["menu"];
				appendStr+="<h4>"+nome+"</h4>";

				//antipasti
				var antipasti=menu["antipasti"];
				var antipastiStr="";
				if (antipasti.length>0) {
					//lista degli antipasti
					antipasti.forEach(function (a) {
						antipastiStr+=a+"<br/>"; //stampo ciascun antipasto su una riga
					})

					//etichetta (in italiano o in inglese)
					var antipastiLabel="";
					if (menu["lang"]=="ita") {
						antipastiLabel="Antipasti";
					} else {
						antipastiLabel="Appetizers";
					}

					appendStr+="<p><h5><span class='menu-title'>"+antipastiLabel+"</span></h5>"+antipastiStr+"</p>";
				}

				var primi=menu["primi"];
				var primiStr="";
				if (primi.length>0) {
					primi.forEach(function (p) {
						primiStr+=p+"<br/>";
					})

					var primiLabel="";
					if (menu["lang"]=="ita") {
						primiLabel="Primi";
					} else {
						primiLabel="First dishes";
					}

					appendStr+="<p><h5><span class='menu-title'>"+primiLabel+"</span></h5>"+primiStr+"</p>";
				}

				var secondi=menu["secondi"];
				var secondiStr="";
				if (secondi.length>0) {
					secondi.forEach(function (s) {
						secondiStr+=s+"<br/>";
					})

					var secondiLabel="";
					if (menu["lang"]=="ita") {
						secondiLabel="Secondi";
					} else {
						secondiLabel="Second dishes";
					}

					appendStr+="<p><h5><span class='menu-title'>"+secondiLabel+"</span></h5> "+secondiStr+"</p>";
				}

				var contorni=menu["contorni"];
				var contorniStr="";
				if (contorni.length>0) {
					contorni.forEach(function (c) {
						contorniStr+=c+"<br/>";
					})

					var contorniLabel="";
					if (menu["lang"]=="ita") {
						contorniLabel="Contorni";
					} else {
						contorniLabel="Side dishes";
					}

					appendStr+="<p><h5><span class='menu-title'>"+contorniLabel+"</span></h5>"+contorniStr+"</p>";
				}

				var dessert=menu["dessert"];
				var dessertStr="";
				if (dessert.length>0) {
					dessert.forEach(function (d) {
						dessertStr+=d+"<br/>";
					})
					appendStr+="<p><h5><span class='menu-title'>Dessert</span></h5>"+dessertStr+"</p>";
				}

				var bevande=menu["bevande"];
				var bevandeStr="";
				if (bevande.length>0) {
					bevande.forEach(function (b) {
						bevandeStr+=b+"<br/>";
					})

					var bevandeLabel="";
					if (menu["lang"]=="ita") {
						bevandeLabel="Bevande";
					} else {
						bevandeLabel="Drinks";
					}

					appendStr+="<p><h5><span class='menu-title'>"+bevandeLabel+"</span></h5>"+bevandeStr+"</p>";
				}

				var allergeni=menu["allergeni"];
				var allergeniStr="";
				if (allergeni.length>0) {
					if (menu["lang"]=="ita") {
						allergeniStr="allergeni: ";
					} else {
						allergeniStr="allergens: ";
					}

					allergeni.forEach(function (a) {
						allergeniStr+=a+", "; //non vado più a capo, ma li metto tutti sulla stessa riga
					})
					allergeniStr=allergeniStr.slice(0, -2); //elimino gli ultimi due caratteri (una virgola ed uno spazio)
					appendStr+="<p class='comment'>"+allergeniStr+"</p>";
				}

				var prezzo=menu["prezzo"];
				if (menu["lang"]=="ita") {
					appendStr+="<p><b>prezzo: "+prezzo+" euro</b></p>";
				} else {
					appendStr+="<p><b>price: "+prezzo+" euro</b></p>";
				}

				var sconti=menu["sconti"];
				var scontiStr="";
				if (sconti.length>0) {
					sconti.forEach(function (s) {
						//ogni elemento dell'array è a sua volta un oggetto JSON
						//il primo elemento è il tipo di sconto, ma non lo stampo sulla pagina, lo uso tuttavia per decidere la stringa da stampare
						if (s["tipo"]=="giorno") {
							if (menu["lang"]=="ita") {
								if (s["valore"].length==1) { //se ho solo un valore devo mettere la stringa al singolare
									scontiStr+="Nel giorno ";
								} else {
									scontiStr+="Nei giorni ";
								}
							} else {
								scontiStr+="On ";
							}
						}

						if (s["tipo"]=="orario") {
							if (menu["lang"]=="ita") {
								if (s["valore"].length==1) {
									scontiStr+="Nell'orario ";
								} else {
									scontiStr+="Negli orari ";
								}
							} else {
								scontiStr+="At ";
							}
						}

						//il secondo elemento è un array di valori: devo scorrerlo
						s["valore"].forEach(function (gg) {
							scontiStr+=gg+" ";
						})

						//il teszo elemento è il valore effettivo dello sconto
						var prezzoSconto=parseFloat(s["sconto"]).toFixed(2);
						if (menu["lang"]=="ita") {
							scontiStr+="viene applicato lo sconto di "+prezzoSconto+" euro";
						} else {
							scontiStr+="is applied the discount of "+prezzoSconto+" euro";
						}

						scontiStr+="<br/>";
					})
					appendStr+="<p>"+scontiStr+"</p>";

					if (menu["lang"]=="ita") {
						//voglio che il tag dei menu sia per entrambi in italiano, questo mi serve perché nella prenotazione non devono essere ripetuti
						idMenu=nome; //idMenu viene assegnato solo quando passo dal menu in italano
						appendStr+="<button class='btn btn-prenotazione' menu='"+idMenu+"'>Prenota questo menu</button>";
					} else {
						//idMenu ha lo sesso valore che aveva al passaggio precedente (quindi dello stesso menù, ma in italiano)
						appendStr+="<button class='btn btn-prenotazione' menu='"+idMenu+"'>Book this menu</button>";
					}
				}

				appendStr+="</div>"; //chiudo la colonna
				//se l'indice è 1,3,... dispari allora chiudo la row
				if (i%2==1) {
					appendStr+="</div>";
				}
			})

			$("#menu").append(appendStr);
		}
	});

	//al click sul bottone per la prenotazione salvo nel sessionStorage il ristorante e il menu, rimando poi a prenotazone.html e da lì li recupero per metterli come default
	$(".btn-prenotazione").click(function() {
		//recupero il menu
		var idMenu=$(this).attr("menu"); //prendo l'attributo menu del bottone che ho premuto (corrisponde al nome del menu)
		
		//creo l'oggetto
		var prenotazione=new Object();
		prenotazione.ristorante=nome_ristorante;
		prenotazione.menu=idMenu;

		//salvo le preferenze nel sessionStorage
		window.sessionStorage.setItem('prenotazione', JSON.stringify(prenotazione));

		//mando a prenotazione.html
		window.location.href='prenotazione.html';
	})
})