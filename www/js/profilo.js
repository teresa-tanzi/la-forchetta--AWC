$(document).ready(function() {
	//reupero l'utente dal local storage confrontando l'indirizzo in sessione con gli utenti salvati
	var utenteAttivo=window.sessionStorage.getItem("session"); //string
	var email=JSON.parse(utenteAttivo)["email"]; //email
	var listaUtenti=window.localStorage.getItem('utenti'); //string
	var listaJson=JSON.parse(listaUtenti); //JSON

	//scorro la lista degli utenti per trovare quello attivo
	listaJson.forEach(function(entry) {
		if (email==entry["email"]) {
			console.log(JSON.stringify(entry));
			$("#nome_utente").html(entry["nome"]+" "+entry["cognome"]);

			$("#dettagli_utente").html("email: "+entry["email"]);
		}
	})

	//popolo la lista delle prenotazioni
	var prenotazioni=[]; //qui aggiungerò tutte le prenotazioni che ha fatto quell'utente
	var listaPrenotazioni=JSON.parse(window.localStorage.getItem('prenotazioni'));
	listaPrenotazioni.forEach(function (entry) {
		if (entry["utente"]==email) {
			prenotazioni.push(entry);
		}
	})

	//inserisco le prenotazioni nella tabella
	var prenotazioniStr=""; //stringa che verrà aggiunta all'html
	if (prenotazioni.length>0) { //se ci sono prenotazioni
		//intestazione della tabella
		prenotazioniStr+='<h4 class="forchetta"><b>PRENOTAZIONI</b></h4><table class="table"><thead><tr><th>Ristorante</th><th>Menu</th><th>Numero posti</th><th>Data</th><th>Ora</th><th>Importo</th><th>Operazioni</th></tr></thead><tbody>';
		prenotazioni.forEach(function (entry) {
			//stringa della tabella per ciascuna prenotazione
			prenotazioniStr+='<tr><td>'+entry["ristorante"]+'</td><td>'+entry["menu"]+'</td><td>'+entry["n_posti"]+'</td><td>'+entry["data"]+'</td><td>'+entry["ora"]+'</td><td>'+entry["costo"]+' &euro;</td>';

			//controllo se la data della prenotazione non è ancora passata: non posso poter eliminare prenotazioni passate
			var currentDate=new Date(); //data di oggi

			var from=entry["data"].split("/"); //divido la data in un array di 3 elementi: giorno [0], mese [1], anno [2]
			var prenotazioneDate=new Date(from[2], from[1] - 1, from[0]); //la data chiede prima l'anno, poi il mese (da 0) ed infine il giorno
			
			if (prenotazioneDate>currentDate) { //se la data non è ancora passata aggiungo il bottone per l'eliminazione
				prenotazioniStr+='<td><button class="btn table-btn">Elimina</button></td>'
			} else {
				prenotazioniStr+='<td></td>'; //lascio la colonna vuota
			}

			prenotazioniStr+='</tr>'; //chiudo la riga
		})
		prenotazioniStr+='</tbody></table>'; //finito di ciclare chiudo il corpo della tabella e la tabella stessa
	}
	$("#lista_prenotazioni").append(prenotazioniStr); //appendo la tabella all'html

	//controllo se sono avvenute modifiche al profilo, così segnalo il successo della modifica (snackbar)
	var modifica=window.sessionStorage.getItem("modifica");
	if (modifica) {
		$("#snackbar").removeClass("hide-s").addClass("show-s"); //mostro il messaggio (trasformzione di 1 secondo)
		setTimeout(function() { //dopo a 2 secondi eseguo:
			$("#snackbar").removeClass("show-s").addClass("hide-s"); //nascondo il messaggio (trasformazione di 1 secondo)
		}, 2000); //dopo un secondo rinasconde la snackbar

		window.sessionStorage.removeItem("modifica"); //cancello la modifica dallo storage perché ormai l'ho segnalata
	}

	//listener per aprire il form alla modifica del profilo
	$("#modifica-button").click(function() {
		//se è visibile il form per la cancellazione lo nascondo
		$("#cancella-profilo").removeClass("show").addClass("hidden");

		$("#modifica-profilo").removeClass("hidden").addClass("show");

		//va alla form (altrimenti non si capisce che è comparso qualcosa sotto)
		$('body').animate({ //body è l'elemento su cui viene applicata l'animazione
			scrollTop: $("#modifica-profilo").offset().top
			//scrollTop è il tipo di animazione che viene eseguita
			//offset ritorna le coordinate dell'emeneto
			//top da la distanza dell'oggetto in pixel lungo l'asse y
		}, 1000); //velocità (più è alto e più è lento)
	})

	//submit del form di modifica
	$("#modifica-profilo").submit(function() {
		//recupero le informazioni dal form
		var nome=$("#modifica-nome").val();
		var cognome=$("#modifica-cognome").val();
		var password=$("#modifica-password").val();

		//per ogni valore controllo se è stato modificato
		if (nome!="") { //se non è vuoto significa che è stato modificato -> va aggiornato
			//per cambiare il dato basta sovrascriverlo
			listaJson.forEach(function(entry) {
				if (email==entry["email"]) {
					entry["nome"]=nome;
				}
			})
			//salvo nello storage che il profilo è stato modificato, così, quando ricarico, notifico che la modifica è avvenuta con successo
			window.sessionStorage.setItem('modifica', 'true');
		}

		if (cognome!="") {
			//per cambiare il dato basta sovrascriverlo
			listaJson.forEach(function(entry) {
				if (email==entry["email"]) {
					entry["cognome"]=cognome;
				}
			})
			window.sessionStorage.setItem('modifica', 'true');
		}

		if (password!="") {
			//per cambiare il dato basta sovrascriverlo
			listaJson.forEach(function(entry) {
				if (email==entry["email"]) {
					entry["password"]=password;
				}
			})
			window.sessionStorage.setItem('modifica', 'true');
		}

		//salvo nello storage l'array con il profilo modificato
		window.localStorage.setItem('utenti', JSON.stringify(listaJson));
	})

	//elimino il profilo
	$("#elimina-button").click(function() {
		//se fosse visibile il form di modifica anzitutto lo rendo hidden
		$("#modifica-profilo").removeClass("show").addClass("hidden");

		//chiedo la conferma per l'eliminazione mostrando il form apposito
		$("#cancella-profilo").removeClass("hidden").addClass("show");

		//animazione che porta alla form uguale a quella per la modifica
		$('body').animate({
			scrollTop: $("#cancella-profilo").offset().top //offset ritorna le coordinate dell'emeneto, top da la distanza dell'oggetto in pixel lungo l'asse y
		}, 1000); //velocità (più è alto e più è lento)

	})

	//se confermo la cancellazione allora elimino definitivamente il profilo da quelli salvati
	$("#conferma-cancellazione").click(function() {
		//elimino l'entry dall'array degli utenti e lo ricarico
		listaJson.forEach(function(entry, index) {
			if (email==entry["email"]) {
				//elimino un elemento
				listaJson.splice(index, 1); //parte dall'indice, va avanti di uno e, nell'intervallo formato dal mio unico elemento, non sostituisce nulla
			}
			console.log(JSON.stringify(listaJson));
		})
		window.localStorage.setItem('utenti', JSON.stringify(listaJson));

		//se cancello direttamente mi si blocca il ciclo (non può cancellare elementi su cui cicla)
		var nuovePrenotazioni=[]; //salvo quindi le prenotazioni non di questo utente in questo nuovo array

		//elimino tutte le prenotazioni di quell'utente dalla lista delle prenotazioni
		listaPrenotazioni.forEach(function (entry) { //ciclo su tutte le prenotazioni
			//controllo se la prenotazione non è stata effettuata da questo utente
			if (email!=entry["utente"]) {
				//salvo la prenotazione
				nuovePrenotazioni.push(entry);
			}
		})
		window.localStorage.setItem('prenotazioni', JSON.stringify(nuovePrenotazioni));

		//cancello l'utente dallo storage
		window.sessionStorage.removeItem('session');

		//salvo nello storage che è avvenuta una cancellazione, così quando mando all'index mando la conferma di avvenuta cancellazione
		window.sessionStorage.setItem('cancellazione', 'true');

		//imposto come azione del form l'index
		$('#cancella-profilo').attr('action', 'index.html'); //redirigo all'index (non ha più un profilo)
		//window.location.replace("index.html");
	})

	//listener per i pulsanti di cancellazione su ciascuna riga della tabella delle prenotazioni
	$(".table-btn").click(function() {
		//recupero le informazioni della prenotazione dalla tabella
		var ristorante_c=$(this).closest('tr').find('td:eq(0)').text();
		//closest() trova l'elemento più vicino salendo nell'albero DOM
		//find() trova invece l'elemento scendendo nell'albero
		//:eq() seleziona l'elemento all'indice indicato
		var menu_c=$(this).closest('tr').find('td:eq(1)').text();
		var posti_c=$(this).closest('tr').find('td:eq(2)').text();
		var data_c=$(this).closest('tr').find('td:eq(3)').text();
		var ora_c=$(this).closest('tr').find('td:eq(4)').text();

		//recupero l'oggetto delle prenotazione dal local storage
		var prenotazioniArray=JSON.parse(window.localStorage.getItem('prenotazioni'));

		//scorro l'array delle prenotazioni e trovo quella con le caratteristiche di quella selezionata
		prenotazioniArray.forEach(function (entry, index) {
			if (entry["utente"]==email && entry["ristorante"]==ristorante_c && entry["menu"]==menu_c && entry["n_posti"]==posti_c && entry["data"]==data_c && entry["ora"]==ora_c) {
				//elimino la entry dall'array delle prenotazioni
				prenotazioniArray.splice(index, 1); //parto da index e cancello un elemento
				//ricarico l'array nello storage
				window.localStorage.setItem('prenotazioni', JSON.stringify(prenotazioniArray));
				//ricarico la pagina per vedere la lista delle prenotazioni aggiornata
				window.location.reload();
			}
		})
	})
})