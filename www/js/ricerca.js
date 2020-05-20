$(document).ready(function() {
	//listener per il submit del form di ricerca
	$("#form-ricerca").submit(function() {
		//se ci sono già dei dati di una ricerca precedente devo cancellarli
		$("#risultato-ricerca").empty();

		//recupero i dati inseriti nel form
		var nome=$("#nome-ristorante").val();
		var tipologia=$("#tipologia").find(":selected").text(); //prendo il testo dell'opzione selezionata
		var citta=$("#citta").val();
		var provincia=$("#provincia").val();
		var prezzo=$("#prezzo").find(":selected").text();
		var n_posti=$("#n-posti").val();

		//recupero i dati delle allergie dalla form
		var allAll = []; //array contenetne tutte le allergie
	    $('#cb :checked').each(function() { //per ogni box che è checked
	    	allAll.push($(this).val()); //aggiungo il suo value alla lista degli allergeni
	    });

		//recupero le informazioni sui ristoranti dallo storage
		var listaRistoranti=window.localStorage.getItem('ristoranti'); //string
		var ristorantiJson=JSON.parse(listaRistoranti); //array di ristoranti
	
		//itero sui ristoranti e controllo se le informazioni corrispondono a quelle recuperate dal form
		var risultatoRicerca=[]; //qui inserisco gli oggetti ristorante che soddisfano la ricerca
		$.each(ristorantiJson, function (index, entry) {

			var isNomeOk=true;
			if (nome!="" && nome.toLowerCase()!=entry["nome"].toLowerCase()) { //se non è vuoto e non corrisponde al nome del ristorante che valuto ora
				isNomeOk=false;
			}

			var isTipoOk=true;
			if (tipologia!="Qualsiasi") { //"qualsiasi" va bene per ogni ristorante
				var isTipoOk=false;
				$.each(entry["tipologia"], function (i, tipo) { //controllo l'array delle tipologie
					if(tipologia.toLowerCase()==tipo) {
						isTipoOk=true; //appena trovo una che va bene faccio passare il ristorante

						//alert ("Tengo "+entry["nome"]+"per la tipologia");
						return false; //esco dal ciclo (ho trovato quello che mi serve)
					}
				})
			}

			var isCittaOk=true;
			if (citta!="" && citta.toLowerCase()!=entry["citta"].toLowerCase()) {
				isCittaOk=false;
			}

			var isProvinciaOk=true;
			if (provincia!="" && provincia.toLowerCase()!=entry["provincia"].toLowerCase()) {
				isProvinciaOk=false;
			}

			var isPrezzoOk=true;
			if (prezzo!="Qualsiasi" && prezzo.toLowerCase()!=entry["fascia di prezzo"]) {
				isPrezzoOk=false;
			}

			var isPostiOk=true;
			if (n_posti!=null && n_posti>entry["posti"]) { //per far andar bene un ristorante deve avere più posti di quelli inseriti
				isPostiOk=false;
			}

			var isAllergeniOk=false;
			var menuSenzaAllergeni=[]; //controllo ciascun menù: se solo uno va bene allora il ristorante va bene (aggiungo tutti i menu che vanno bene in questo array)
			var isMenuOk=true; //vale true se questo menu nello specifico non contiene gli ingredienti che non si vogliono
			
			//ciclo su tutti i menu di questo ristoranti
			entry["menus"].forEach(function (currMenu) {

				//ciclo su tutti i suoi allergeni
				currMenu["allergeni"].forEach(function (all) {
					//ciclo su tutti gli allergenti selezionati
					allAll.forEach(function (checkati) {
						//controllo se in questo menu ci sono i checkati
						if (all.includes(checkati)) { //se anche ne trovo uno che coincide il ristorante non va bene
							isMenuOk=false;
						}
					})
				});

				//se il menu supera il controllo lo aggiungo alla lista di quelli che vanno bene
				if (isMenuOk) {
					menuSenzaAllergeni.push(currMenu);
				}
			});

			//se c'è almeno un menu senza gli allergeni allora il ristorante va bene
			if (menuSenzaAllergeni.length>0) {
				isAllergeniOk=true;
			}

			if (isNomeOk && isTipoOk && isCittaOk && isProvinciaOk && isPrezzoOk && isPostiOk && isAllergeniOk) {
				risultatoRicerca.push(entry); //se il ristorante supera tutto viene inserito nei risultati
			}

		})
		//alert (JSON.stringify(risultatoRicerca)); //YAY: qui dentro ci sono i ristoranti che soddisfano la ricerca, ora devo stamparli
		//alert (risultatoRicerca.length);

		var risultatoStr="";

		if (risultatoRicerca.length>0) { //se ho avuto risultati
			risultatoRicerca.forEach(function (entry, index) {
				//se l'indice è pari devo aprire la riga
				if (index%2==0) {
					risultatoStr+='<div class="row">'
				}

				//aggiungo il div
				risultatoStr+='<div class="col-lg-6 col-md-6"> \
					<form action="dettagli_ristorante.html" method="GET" class="image"> \
						<input type="hidden" name="nome" value="'+entry["codice"]+'"> \
						<button type="submit" class="image-submit"> \
							<div class="thumbnail ristorante"> \
								<img class="img-ristorante" src="'+entry["immagine"]+'" alt="..." /> \
								<div class="post-content"> \
									<h3>'+entry["nome"]+'</h3> \
									<p>'+entry["citta"]+" ("+entry["provincia"]+')</p> \
								</div> \
							</div> \
						</button> \
					</form> \
				</div>';

				//se l'indice è dispari devo chiudere la riga
				if (index%2==1) {
					risultatoStr+='</div>'
				} 
			})

			$("#risultato-ricerca").html(risultatoStr);

		} else { //se non ci sono stati risultati
			$("#risultato-ricerca").append("<div class='center'>La ricerca con questi paramentri non ha dato risultati</div>");
		}

		//va ai risultati
		//se non aggiungo stop() devo aspettare parecchio dopo che l'animazione finisca per poter nuovamente scrollare
		//scroll: quando la pagina viene scrollata
		//mousedown: quando viene premuto il pulsante del mouse
		//wheel: quando viene fatta ruotare la rotella del mouse
		//keyup: quando si preme un pulsante (ad esempio le freccie)
		$('html, body').on("scroll mousedown wheel keyup", function(){ //in ognuno di questi eventi l'animazione si ferma
		    $('html, body').stop();
		});

		//funzione che viene chiamata on submit
		$('html, body').animate({ //avvia un'animazione: termine dell'animazione + durata
			scrollTop: $("#risultato-ricerca").offset().top-60 
			//scrollTop: si sposta verticalmente fino ad arrivare all'altezza indicata
			//offset ritorna le coordinate dell'elemento
			//top da la distanza dell'oggetto in pixel lungo l'asse y (-60 per avere un pochino di margine)
		}, 1000);

		return false; //fa si che il submit del form non mandi da nessuna parte
	})

})