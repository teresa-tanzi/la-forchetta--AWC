$(document).ready(function() {
	//registrazione: al click sul bottone di submit aggiungo i dati all'array JSON
	$("#registrazione").submit(function() {        
		//recupero le informazioni dal form
		var email=$("#email-input-r").val();
		var nome=$("#nome-input-r").val();
		var cognome=$("#cognome-input-r").val();
		var password=$("#password-input-r").val();

		//creo l'oggetto per il nuovo utente (ma ancora non so se va bene, devo fare i controlli)
		var newUtente=new Object();
		newUtente.email=email;
		newUtente.nome=nome;
		newUtente.cognome=cognome;
		newUtente.password=password;

		//controllo nello storage se c'è un array per gli utenti: se non c'è lo creo, altrimenti nulla
		var listaUtenti=window.localStorage.getItem('utenti');
		var utentiJson;
		if (listaUtenti) {
			//esiste già l'array: lo recupero
			utentiJson=JSON.parse(listaUtenti); //array di utenti
			console.log("utenti: "+JSON.stringify(utentiJson));
		} else {
			//creo l'array vuoto (tanto di utenti non ce n'erano)
			utentiJson=[];
		}

		//controllo se l'utente ha già un account
		var noAccount=true; //vale true se l'utente non ha un account, quindi può registrarsi
		$.each(utentiJson, function (index, entry) {
			var storedEmail=entry["email"];

			if (email==storedEmail) { //l'utente ha già un account: non può registrarsi
				//alert ("Hai già un account");
				$("#errore-registrazione").html("Impossibile creare un nuovo account: questa email &egrave; gi&agrave; associata ad un account esistente");
				noAccount=false; //l'utente ha già un account
				return false; //esco dal ciclo
			}
		})

		if(noAccount) {
			//aggiungo il nuovo utente all'array di utenti
			utentiJson.push(newUtente);
			success ("#registrazione", email);
			//salvo l'array degli utenti nello storage al posto di quello di prima
			window.localStorage.setItem('utenti', JSON.stringify(utentiJson));
		} else {
			return false; //non ricarico la pagina (non viene fatta l'action)
		}
	});

	//login: al click sul submit devo controllare che i dati corrispondano ad un utente salvato nell'array
	$("#login").submit(function() {
		//recupero le informazioni dal form
		var email=$("#email-input-l").val();
		var password=$("#password-input-l").val();

		//recupero l'array di utenti dallo storage
		var listaUtenti=window.localStorage.getItem('utenti');
		var utentiJson=JSON.parse(listaUtenti);

		//dichiaro queste variabili all'esterno perchè mi servono per fare un controllo esterno al fine di imedire che la pagina venga ricaricata
		var nonRegistrato=true; //vale true se l'utente non si è ancora registrato (deve prima farlo per poter fare il login poi)
		var wrongMail=false; //vale true se la mail inserita è sbagliata
		//ciclo sull'array e controllo che esista l'utente e che la password sia corretta
		$.each(utentiJson, function (index, entry) {
			var storedEmail=entry["email"];
			var storedPassword=entry["password"];

			if (email==storedEmail) { //l'utente è iscritto
				if (password==storedPassword) { //la password inserita è quella corretta
					success ("#login", email); //l'utente si logga e va al profilo
					nonRegistrato=false; //di fatti l'utente ha un account
					return false; //esco dal ciclo
				} else { //la password inserita non è quella associata a tale utente
					//alert ("Wrong password");
					nonRegistrato=false
					wrongMail=true;
					return false; //esco dal ciclo
				}
				
			}
		})
		
		if (nonRegistrato) { //l'utente non ha un account, non può quindi autenticarsi
			//alert ("Utete non registrato");
			$("#errore-login").html("Impossibile effettuare il login: non esiste un account associato a questa email");
			return false; //non invia il form
		}

		if (wrongMail) { //l'utente esiste, ma ha sbagliato ad inserire la password
			$("#errore-login").html("Impossibile effettuare il login: la password non &egrave; corretta");
			return false;
		}
	});  
})

//se la registrazione o il login sono andati a buon fine allora avvio la sessione
function success(formId, email) {
	//salvo nello storage l'email dell'utente che è ora attivo
	var utenteLog=new Object;
	utenteLog.email=email;
	window.sessionStorage.setItem('session', JSON.stringify(utenteLog));

	//redirect a profilo.html
	$(formId).attr('action', 'profilo.html'); //cambio la action al form per far sì che ridiriga al profilo
	//i cambiamenti alla navbar vengono fatti quando carico la pagina nuova
}