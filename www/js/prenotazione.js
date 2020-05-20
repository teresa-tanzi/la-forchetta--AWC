$(document).ready(function() {
	//controllo se c'è un utente loggato
	//già che accedo alla sessione mi salvo in una variabile l'email dell'utente in sessione così da poterla associare poi alla prenotazione
	var email;
	var utente=window.sessionStorage.getItem('session');
	if (!utente) {
		//dico di loggarsi
		$("#login-msg").removeClass("hidden").addClass("show");
		//nascondo il form per la prenotazione
		$("#prenotazione-form").removeClass("show").addClass("hidden");
	} else {
		$("#login-msg").removeClass("show").addClass("hidden");
		$("#prenotazione-form").removeClass("hidden").addClass("show");
		email=JSON.parse(utente)["email"];
	}

	//recupero le informazioni dei ritoranti dallo storage
	var listaRistoranti=JSON.parse(window.localStorage.getItem('ristoranti'));

	//ciclo sui ristoranti e per ciascuno aggiungo il suo nome alla lista dei ristoranti tra cui poter prenotare
	listaRistoranti.forEach(function (entry) {
		$("#ristorante").append("<option>"+entry["nome"]+"</option>");
	})

	//controllo se arrivo dalla scelta di un menu in particolare
	var preferenze=JSON.parse(window.sessionStorage.getItem('prenotazione'));
	if (preferenze) { //se arrivo da delle scelte già fatte le imposto come default
		$("#ristorante option:contains('"+preferenze["ristorante"]+"')").prop("selected", true);
		//cerco tra le opzioni del ristorante, il particolare quella che contiene il nome del ristornte salvato nel Session Storage
		//una volta che l'ho trovato gli do la proprietà selected

		//ciclo sui menu di questo ristorante, li appendo al select ed imposto quello che arriva come selected
		$("#menu").empty(); //lo svuoto, nel caso avesse già dei valori

		var ristoranteSelezionato=$("#ristorante").find(":selected").text(); //recupero quale ristorante è selezionato
		
		listaRistoranti.forEach(function (entry, index) {
			if (ristoranteSelezionato==entry["nome"]) {
				entry["menus"].forEach(function (menu, i) { //ciclo su i menu di quel ristorante
					if (menu["lang"]=="ita") { //considero solo i menu scritti in italiano
						$("#menu").append("<option>"+firstLetterUppercase(menu["menu"])+"</option>"); //attacco al select tutti i menu di quel ristorante
					}
				})
			}
		})

		$("#menu option:contains('"+firstLetterUppercase(preferenze["menu"])+"')").prop("selected", true);
		//allo stesso modo cerco tra le opzioni quella che corrisponde a quella salvata e la seleziono
		//i nomi dei menu come sono salvati sono tutti in minuscolo: metto la prima lettera in maiuscolo per conformità con la pagina

		//elimino la preferenza dal sessionStorage
		window.sessionStorage.removeItem('prenotazione');

	} else { //altrimenti imposto come default i menu del primo ristorante in lista
		//setto il default sul menu con quelli del primo ristorante dell'array
		listaRistoranti[0]["menus"].forEach(function (entry, index) {
			if (entry["lang"]=="ita") { //metto solo i menu in italiano (non voglio ripetizioni perché quelli italiani ed inglesi sono gli stessi)
				$("#menu").append("<option>"+firstLetterUppercase(entry["menu"])+"</option>");
			}
		})
	}

	//se cambia il ristorante voglio cambiare anche i menu associati
	$("#ristorante").change(function() {
		//devo anzitutto ripulire il select dai vecchi risultati
		$("#menu").empty();

		var ristoranteSelezionato=$("#ristorante").find(":selected").text();
		
		listaRistoranti.forEach(function (entry, index) {
			if (ristoranteSelezionato==entry["nome"]) {
				entry["menus"].forEach(function (menu, i) {
					if (menu["lang"]=="ita") { //prendo solo quelli in italiano
						$("#menu").append("<option>"+firstLetterUppercase(menu["menu"])+"</option>");
					}
				})
			}
		})
	})

	//imposto il default, il min ed il max dell'imput per la data
	var currentDate=new Date();
	var day=("0"+currentDate.getDate()).slice(-2); //aggiungo 0 a sinistra e prendo solo le ultime due cifre (per valori da 1 a 9)
	var month=("0"+(currentDate.getMonth()+1)).slice(-2); //parte a contare i meso da 0, inoltre devo portarlo su due decimali
	var year=currentDate.getYear()+1900; //parte a contare gli anni dal 1900
	var dateStr=year+"-"+month+"-"+day; //formato richiesto dal tag input type=date

	$("#data").attr("value", dateStr); //imposto il default ad oggi
	$("#data").attr("min", dateStr); //la data di oggi è anche la prima data di prenotazione

	var nextWeek=new Date(currentDate.getTime()+6*24*60*60*1000); //al tempo di adesso aggungo 6 giorni, 24 ore, 60 minuti, 60 secondi e 1000 millisecondi
	var nextWeekDay=("0"+nextWeek.getDate()).slice(-2);
	var nextWeekMonth=("0"+(nextWeek.getMonth()+1)).slice(-2);
	var nextWeekYear=nextWeek.getYear()+1900;
	var nextWeekStr=nextWeekYear+"-"+nextWeekMonth+"-"+nextWeekDay;

	$("#data").attr("max", nextWeekStr);

	//calcolo i posti disponibili in base al ristorante, alla data ed alla fascia oraria
	//devono cambiare dinamicamente: per ora guardo quelli selezionati di default
	var ristoranteSel=$("#ristorante").find(":selected").text();
	var dataSel=$("#data").val();
	var oraSel=$('input[name=optradio]:checked').val(); //i due radio button hanno entrambi name=optradio: guardo quale dei due è selezionato
	var postiRimasti=checkPosti(ristoranteSel, dataSel, oraSel);

	$("#posti-disponibili").html("Numero posti disponibili: "+postiRimasti); //mostro quanti posti sono rimasti
	$("#n-posti").attr("max", postiRimasti); //impedisco di inserire un numero di posti maggiore di quello inserito

	//al variare del ristorante, della data o dell'ora modifico posti-disponibili
	$("#ristorante").change(function() {
		//riassegno la variabile del ristorante da passare
		ristoranteSel=$("#ristorante").find(":selected").text();
		//gli altri valori restano invece quelli che erano già selezionati (ne cambio uno alla volta)
		postiRimasti=checkPosti(ristoranteSel, dataSel, oraSel);

		$("#posti-disponibili").html("Numero posti disponibili: "+postiRimasti);
		$("#n-posti").attr("max", postiRimasti);
	})

	$("#data").change(function() {
		dataSel=$("#data").val();
		postiRimasti=checkPosti(ristoranteSel, dataSel, oraSel);

		$("#posti-disponibili").html("Numero posti disponibili: "+postiRimasti);
		$("#n-posti").attr("max", postiRimasti);
	})

	$('input[name=optradio]').change(function() {
		oraSel=$('input[name=optradio]:checked').val();
		//alert (ristoranteSel+" "+dataSel+" "+oraSel);
		postiRimasti=checkPosti(ristoranteSel, dataSel, oraSel);

		$("#posti-disponibili").html("Numero posti disponibili: "+postiRimasti);
		$("#n-posti").attr("max", postiRimasti);
	})

	//submit del form: calcolo il prezzo e mostro il riassunto dell'ordine per chiedere ulteriore conferma
	var titolare, dFormat, ristorante, menu, n_posti, data, ora, prezzo, dataFormat; //li dichiaro fuori perché mi servono per effettuare la prenotazione vera e propria
	$("#prenotazione-form").submit(function() {
		//recupero le nformazioni dal form
		ristorante=$("#ristorante").find(":selected").text();
		menu=$("#menu").find(":selected").text();
		n_posti=$("#n-posti").val();
		data=$("#data").val();
		ora=$('input[name=optradio]:checked').val(); //tra i radio con name=optradio scelgo quello checked e ne prendo il valore indicato nel tag

		//controllo quanti posti sono rimasti disponibili per quel ristorante, in quel giorno ed in quell'orario
		var postiDisponibili=checkPosti(ristorante, data, ora);
		//controllo se i posti disponibili sono sufficienti per la mia prenotazione
		if (n_posti>postiDisponibili) { //non dovrebbe comunque entrare mai perché ho impostato il massimo sull'input dei posti
			alert ("Non ci sono abbastanza posti. Posti rimasti: "+postiDisponibili);
			return false;
		} else { //faccio la prenotazione
			//calcolo il prezzo compreso di sconti
			listaRistoranti.forEach(function (entry) {
				if (ristorante==entry["nome"]) { //trovo il ristorante corrispondente a quello selezionato
					//scorro la lista dei menu del ristorante per trovare quello giusto
					entry["menus"].forEach(function (m) {
						if (menu.toLowerCase()==m["menu"]) { //trovo il menù che corrisponde a quello selezionto (nel JSON sono scritti tutti in minuscolo)
							//salvo il prezzo del menu
							prezzo=m["prezzo"];

							//devo ora applicare gli sconti relativi a questo menu, al giorno e all'ora
							if (m["sconti"].length>0) { //controllo se ci sono effettivamente degli sconti
								m["sconti"].forEach(function (s) { //possono esserci più sconti per ciascun menu
									
									if (s["tipo"]=="giorno") {
										s["valore"].forEach(function (value) {
											var myDate=new Date (data); //metto l'input ricevuto in formato date per poter ottenere il giorno della settimana
											//controllo se il giorno inserito nel form coincide con un giorno di sconto
											if (value=="luned&igrave" && myDate.getDay()==1 || value=="marted&igrave" && myDate.getDay()==2 || value=="mercoled&igrave" && myDate.getDay()==3 || value=="gioved&igrave" && myDate.getDay()==4 || value=="venerd&igrave" && myDate.getDay()==5 || value=="sabato" && myDate.getDay()==6 || value=="domenica" && myDate.getDay()==7) {
												prezzo-=s["sconto"];
											}
										})
									}

									if (s["tipo"]=="orario") {
										s["valore"].forEach(function (value) {
											if (value==ora) {
												prezzo-=s["sconto"];
											}
										})
									}
								})
							}
						}
					})
				}
			})
			prezzo*=n_posti;
			prezzo=parseFloat(prezzo).toFixed(2); //porto il prezzo in float con due decimali (toFixed porta il numero in stringa con due decimali)

			//popolo il riassunto dell'ordine per chiedere poi conferma
			var email=JSON.parse(utente)["email"]; //utente attivo in questo momento
			var listaUtenti=JSON.parse(window.localStorage.getItem('utenti'));
			listaUtenti.forEach(function (entry) {
				if (email==entry["email"]) { //uso l'email dell'utente attivo per trovare, nella lista degli utenti, il suo nome ed il suo cognome
					$("#titolare").html(entry["nome"]+" "+entry["cognome"]);
					titolare=entry["nome"]+" "+entry["cognome"];
				}
			});
			
			var d=new Date(); //data di oggi
			dFormat=("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+(d.getYear()+1900);
			//imposto la data ma secondo il formato italiano (nello stesso modo che uso sopra)
			$("#data-ordine").html(("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+(d.getYear()+1900));

			//svuoto la tabella da possibili riassunti di prenotazione precedenti
			$("#dati-prenotazione").empty();
			//cambio il formato della data da mettere nella tabella
			dataFormat=new Date(data);
			//("0"+nextWeek.getDate()).slice(-2);
			dataFormat=("0"+dataFormat.getDate()).slice(-2)+"/"+("0"+(dataFormat.getMonth()+1)).slice(-2)+"/"+(dataFormat.getYear()+1900);
			//riempio la tabella con i dettagli della prenotazione ed il prezzo totale
			$("#dati-prenotazione").append("<td>"+ristorante+"</td><td>"+menu+"</td><td>"+dataFormat+"</td><td>"+ora+"</td><td>"+(parseFloat(prezzo/n_posti).toFixed(2))+" &euro;</td><td>"+n_posti+"</td><td><b>"+prezzo+" &euro;</b></td>");

			//nascondo il form e mostro il riassunto
			$("#prenotazione-form").removeClass("show").addClass("hidden");
			$("#riassunto").removeClass("hidden").addClass("show");

			return false; //resto nella stessa pagina anche dopo aver confermato il form perché devo confermare il riassunto dell'ordine
		}
	})

	//imposto i listener per la conferma e per l'annullamento della prenotazione
	$("#conferma-prenotazione").click(function() {
		//aggiungo la prenotazione alla lista nel local storage
		var listaPrenotazioni=JSON.parse(window.localStorage.getItem('prenotazioni'));

		//costruisco l'oggetto con le informazioni della prenotazione
		var newPrenotazione=new Object();
		newPrenotazione.utente=email;
		newPrenotazione.ristorante=ristorante;
		newPrenotazione.menu=menu;
		newPrenotazione.n_posti=n_posti;
		newPrenotazione.data=dataFormat;
		newPrenotazione.ora=ora;
		newPrenotazione.costo=prezzo;

		//salvo la prenotazione dello storage
		listaPrenotazioni.push(newPrenotazione);
		window.localStorage.setItem('prenotazioni', JSON.stringify(listaPrenotazioni));

		//stampo il pdf della prenotazione
		/*var doc=new jsPDF('l', 'pt', 'a4'); //preparo un documento landscape, con minure in punti ed in formato A4

		doc.fromHTML($('#canvas').get(0), 15, 15, { //prendo il div con id "canvas", in particolare l'elemento stesso (get(0))
		    'width': 200
		});

		doc.save('ricevuta.pdf'); //nome del file da salvare
		//rimando al profilo dove è possibile vedere il riassunto di tutte le prenotazioni
		window.location.href='profilo.html';*/
		
		//stessa funzione, ma applica il css a costo di risoluzione
        /*var pdf=new jsPDF('l', 'pt', 'a4'); //'l' per salvare in landscape, 'pt' indica l'unità di misura in point, 'a4' è il formato del foglio
		
		pdf.addHTML($('#canvas'), 10, 10, function(){ //10 10 è il margine nello screen
		    pdf.save("ricevuta.pdf");

		    //redirigo al profilo
			window.location.href='profilo.html'; //se lo faccio fuori dalla funzione non mi salva il documento
		});*/

		//stessa funzione, ma non prendo dal file, scrivo direttamente sul foglio
		var doc=new jsPDF('p', 'pt', 'a4'); //preparo un documento portrait, con minure in punti ed in formato A4

		doc.text(40, 60, 'LA FORCHETTA'); //a queste coordinate (x, y a partire dall'angolo in alto a sinistra) scrivo la stringa
		doc.text(40, 100, 'Titolare: '+titolare);
		doc.text(40, 120, 'Data ordine: '+dFormat);
		doc.text(40, 160, 'Ristorante: '+ristorante);
		doc.text(40, 180, 'Menu: '+menu);
		doc.text(40, 200, 'Prezzo per menu: '+parseFloat(prezzo/n_posti).toFixed(2)+" euro");
		doc.text(40, 220, 'Numero posti: '+n_posti);
		doc.text(40, 240, 'Data prenotazione: '+dataFormat);
		doc.text(40, 260, 'Orario: '+ora);
		doc.text(40, 280, 'Importo totale: '+prezzo+" euro");

		doc.save('ricevuta.pdf'); //nome del file da salvare

		//rimando al profilo dove è possibile vedere il riassunto di tutte le prenotazioni
		window.location.href='profilo.html';
	});

	$("#annulla-prenotazione").click(function() {
		//nascondo la conferma e rimostro il form
		$("#riassunto").removeClass("show").addClass("hidden");
		$("#prenotazione-form").removeClass("hidden").addClass("show");
	});
})

function firstLetterUppercase (text) {
	return text.charAt(0).toUpperCase()+text.slice(1);
	//prendo il primo character della sctringa, lo faccio diventare maiuscolo e gli attacco poi il resto della stringa
}

function checkPosti(ristorante, data, ora) {
	//cerco il numero totale di posti del ristorante
	var listaRistoranti=JSON.parse(window.localStorage.getItem('ristoranti'));

	var totPosti;
	listaRistoranti.forEach(function (entry) {
		if (ristorante==entry["nome"]) {
			//cerco il numero totale di posti che ha il ristorante che viene passato
			totPosti=entry["posti"];
		}
	})

	//la data nelle prenotazioni salvate è formattata in modo differente: devo convertire
	dataFormat=new Date(data);
	dataFormat=("0"+dataFormat.getDate()).slice(-2)+"/"+("0"+(dataFormat.getMonth()+1)).slice(-2)+"/"+(dataFormat.getYear()+1900);
	
	//per ogni prenotazione controllo se è questo ristorante, in questa data ed in quest'ora: se è così allora tolgo da totPosti il numero di posti nella prenotazione
	var listaPrenotazioni=JSON.parse(window.localStorage.getItem('prenotazioni'));
	listaPrenotazioni.forEach(function (entry) {
		if (ristorante==entry["ristorante"] && dataFormat==entry["data"] && ora==entry["ora"]) {
			//tolgo al numero di posti totale, ogni volta, il numero di posti della prenotazione
			totPosti-=entry["n_posti"];
		}
	})

	return totPosti; //mi resta il numero di posti totale meno quelli di tutte le prenotazioni, quindi i posti rimasti
}