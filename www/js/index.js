$(document).ready(function() {
	//se ancora non è presente inserisco nel local storage la stringa JSON dei ristoranti
	salvaRistoranti();
	//controllo nello storage se c'è un utente attivo: se sì allora attivo le cose che può fare
	session();
	//controllo nel session storage se c'è l'array per le prenotazioni: se non c'è lo creo vuoto
	var prenotazioni=window.localStorage.getItem('prenotazioni');
	if (!prenotazioni) {
		prenotazioni=[];
		window.localStorage.setItem('prenotazioni', JSON.stringify(prenotazioni));
	}

	//controllo se è stato appena cancellato un profilo, così mando la notifica sullo schermo
	var cancellazione=window.sessionStorage.getItem("cancellazione");
	if (cancellazione) {
		$("#snackbar").removeClass("hide-s").addClass("show-s");
		setTimeout(function() {
			$("#snackbar").removeClass("show-s").addClass("hide-s"); //funzione che fa scaduto il tempo
		}, 2000); //dopo due secondo rinasconde la snackbar

		window.sessionStorage.removeItem("cancellazione");
	}

	//quando scrollo la pagina cambio il colore alla navbar
	//var scroll_pos=0; //inizializzo a 0, quando la pagina viene caricata vedo la porzione più alta e di default ho la classe on-top
	$(document).scroll(function() { //document è la porzione del DOM che si riferisce al contenuto della schermata
		scroll_page();
	});

	//anche appena carico la pagina (senza scrollare) controllo dove si trova la barra
	scroll_page();

	//logout
	$("#logout").click(function() {
		//cancello l'utente dallo storage
		window.sessionStorage.removeItem('session');

		//controllo la versione della navbar da inserire
		session();
	})
});

function scroll_page() {
	scroll_pos=$(this).scrollTop(); //numero di pixel che sono nascosti al di sopra dell'area visualizzata

	if (scroll_pos>10) {
		console.log("yess: "+scroll_pos);
		//$("#heder").css('background-color', 'red');
		$(".navbar-fixed-top").removeClass("on-top").addClass('not-top');
	} else {
		console.log("nop "+scroll_pos);
		$(".navbar-fixed-top").removeClass('not-top').addClass('on-top');
	}
}

function session() {
	//controllo nello storage se c'è un utente loggato
	var sessione=window.sessionStorage.getItem('session');
	if (sessione) { //un utente è loggato
		//cambio la barra di navigazione per poter vedere il profilo, aggiungo il logout ed elimino il login
		$("#navbar").children("li").eq(4).remove();
		$("#navbar").append('<li><a href="profilo.html">Profilo</a></li><li><a href="index.html" id="logout">Logout</a></li>')
	} else {
		//modifico la navbar
		$("#navbar").children("li").eq(5).remove();
		$("#navbar").children("li").eq(4).remove();
		$("#navbar").append('<li><a href="login.html">Login</a></li>');
	}
}

function salvaRistoranti() {
	var listaRistoranti=window.localStorage.getItem('ristoranti');

	if (listaRistoranti) {
		//non faccio niente: significa che le informazioni dei ristoranti sono già salvate
	} else {
		//devo salvare la lista dei ristoranti
		caricaRistoranti();
		//var datiRistoranti='[{"codice": "antica-trattoria-del-gallo", "nome": "Antica Trattoria del Gallo","tipologia": ["cucina locale", "cucina tradizionale"],"via": "via Risorgimento, 46","citta": "Clusane Iseo","provincia": "BS","gps": {"lat": 45.660215, "lng": 10.003098},"fascia di prezzo": "media","posti": 40,"menus": [{"lang": "ita","menu": "terra","antipasti": ["salame tipo Montisola", "spiedini di maiale"],"primi": ["tagliatelle al salame di Folaga", "tagliatelle con porcini"],"secondi": ["manzo al olio con polenta", "filetto di maiale"],"contorni": ["patate fritte", "verdure fresche", "verdure grigliate"],"dessert": ["ananas del gallo", "delizie al carrello"],"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"],"bevande": ["acqua", "vino bianco del gallo", "vino rosso del gallo"],"prezzo": 35.00,"sconti": [{"tipo": "giorno","valore": ["lunedì", "giovedì"],"sconto": 2.00}]}, {"lang": "eng","menu": "land","antipasti": ["Montisola sousage", "pork skewers"],"primi": ["Folaga sousage noodles", "porcini noodles"],"secondi": ["beef in oil with polenta", "pork tenderloin"],"contorni": ["french fries", "fresh vegetables", "grilled vegetables"],"dessert": ["rooster pineapple", "delights to cart"],"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"],"bevande": ["water", "rooster white wine", "rooster red wine"],"prezzo": 35.00,"sconti": [{"tipo": "giorno","valore": ["monday", "thursday"],"sconto": 2.00}]}, {"lang": "ita","menu": "lago","antipasti": ["insalata di luccio", "pesciolino fritto"],"primi": ["casoncelli caserecci alla salvia", "linguine ai gamberi di lago"],"secondi": ["filetti di persico reale dorati alla salvia", "tinca ripiena al forno"],"contorni": ["patate fritte", "verdure fresche", "verdure grigliate"],"dessert": ["ananas del gallo", "delizie al carrello"],"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini", "pesce e prodotti a base di pesce"],"bevande": ["acqua", "vino bianco del gallo", "vino rosso del gallo"],"prezzo": 40.00,"sconti": [{"tipo": "giorno","valore": ["lunedì", "giovedì"],"sconto": 2.00}]}, {"lang": "eng","menu": "lake","antipasti": ["pike salad", "fried fish"],"primi": ["homemade casoncelli with sage", "linguine with shrimp lake"],"secondi": ["fillets on golden perch with sage", "stuffed tench baked"],"contorni": ["french fries", "fresh vegetables", "grilled vegetables"],"dessert": ["rooster pineapple", "delights to cart"],"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products", "fish and fish-based products"],"bevande": ["water", "rooster white wine", "rooster red wine"],"prezzo": 40.00,"sconti": [{"tipo": "giorno","valore": ["monday", "thursday"],"sconto": 2.00}]}]},{"codice": "corte-sconta","nome": "Corte Sconta","tipologia": ["cucina locale", "pesce", "cucina mediterranea"],"via": "calle del Pestrin Castello, 3886","citta": "Venezia","provincia": "VE","gps": {"lat": 45.434787, "lng": 12.347967},"fascia di prezzo": "alta","posti": 52,"menus": [{"lang": "ita","menu": "degustazione di pesce","antipasti": ["antipasto di pesce del giorno", "bollito di pesce, crostacei e molluschi", "vongole allo zenzero"],"primi": ["pasta fresca ai frutti di mare", "zuppa di pesce, molluschi e zafferano"],"secondi": ["baccalà mantecato", "granseola al naturale", "sarde in saor"],"contorni": ["insalata di fagioli, sedano e cipolla", "piatto di verdure e legumi"],"dessert": ["dessert del giorno"],"allergeni": ["cereali contenenti glutine", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini", "pesce e prodotti a base di pesce", "crostacei e prodotti a base di crostacei", "molluschi e prodotti a base di molluschi"],"bevande": ["acqua", "vino"],"prezzo": 59.00,"sconti": [{"tipo":"orario","valore": ["19-21"],"sconto":0.50}]}, {"lang": "eng","menu": "fish tasting","antipasti": ["seafood appetizer of the day", "boiled fish, shellfish and mollusc", "ginger clams"],"primi": ["fresh pasta with seafood", "fish and shellfish soup with saffron"],"secondi": ["salt cod creamed", "granseola natural", "sardines in sauce"],"contorni": ["beans, celery and onion salad", "vegetables and legumes"],"dessert": ["dessert of the day"],"allergeni": ["cereals containing gluten", "celery and celery-based products", "lupini and lupini-based products", "fish and fish-based products", "shellfish and shellfish-based products", "mollusc and mollusc-based products"],"bevande": ["water", "wine"],"prezzo": 59.00,"sconti": [{"tipo":"orario","valore": ["19-21"],"sconto":0.50}]}]},{"codice": "il-rovescio","nome": "Il Rovescio","tipologia": ["pizzeria", "cucina biologica", "cucina sperimentale", "vegetariano"],"via": "via Pietralata, 75","citta": "Bologna","provincia": "BO","gps": {"lat": 44.495716, "lng": 11.331121},"fascia di prezzo": "economica","posti": 24,"menus": [{"lang": "ita","menu": "pizza","antipasti": [],"primi": [],"secondi": ["pizza a scelta"],"contorni": ["patate fritte", "patate al forno"],"dessert": [],"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte"],"bevande": ["acqua", "birra", "bibita", "caffè"],"prezzo": 18.00,"sconti": [{"tipo": "giorno","valore": ["lunedì", "martedì", "mercoledì", "giovedì"],"sconto": 2.00}, {"tipo": "orario","valore": ["19-21"],"sconto": 1.00}]}, {"lang": "eng","menu": "pizza","antipasti": [],"primi": [],"secondi": ["pizza choice"],"contorni": ["french fries", "baked potatoes"],"dessert": [],"allergeni": ["cereals containing gluten", "milk and milk-based products"],"bevande": ["water", "beer", "soft drink", "coffee"],"prezzo": 18.00,"sconti": [{"tipo": "giorno","valore": ["monday", "tuesday", "wednesday", "thursday"],"sconto": 2.00}, {"tipo": "orario","valore": ["19-21"],"sconto": 1.00}]}, {"lang": "ita","menu": "osteria","antipasti": ["vellutata di verdura", "degustazione di formaggi"],"primi": ["ravioli ripieni ai carciofi e parmigiano", "tagliatelle alle cime di rapa"],"secondi": ["crepe al cavolo cappuccio e spinaci", "farinata di ceci con verdure"],"contorni": ["tuberi al forno", "cicoria saltata"],"dessert": ["tiramisù", "torta della casa"],"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"],"bevande": ["acqua", "vino", "caffè"],"prezzo": 25.00,"sconti": [{"tipo": "giorno","valore": ["lunedì", "martedì", "mercoledì", "giovedì"],"sconto": 1.00}]}, {"lang": "eng","menu": "public house","antipasti": ["creamed vegetables", "cheese tasting"],"primi": ["ravioli with artichokes and parmesan", "turnip greens noodles"],"secondi": ["crepe with cabbage and spinach", "chickpea flour with vegetables"],"contorni": ["baked tubers", "sauteed chicory"],"dessert": ["tiramisù", "homemade cake"],"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"],"bevande": ["water", "wine", "coffee"],"prezzo": 25.00,"sconti": [{"tipo": "giorno","valore": ["monday", "tuesday", "wednesday", "thursday"],"sconto": 1.00}]}]},{"codice": "aia-del-tufo","nome": "Aia del Tufo","tipologia": ["cucina casalinga", "cucina biologica", "cucina locale", "cucina tradizionale"],"via": "località Poggio la mezzadria","citta": "Sorano","provincia": "GR","gps": {"lat": 42.712952, "lng": 11.746615},"fascia di prezzo": "media","posti": 34,"menus": [{"lang": "ita","menu": "tradizionale","antipasti": ["antipasto misto toscano", "misto formaggi con mostarda e miele", "tagliere di salumi"],"primi": ["pappardelle di ragù di cinghiale in bianco", "pici al aglione"],"secondi": ["agnello al guglione"],"contorni": ["insalata verde", "patate al forno"],"dessert": ["pannacotta alla lavanda", "cantuccini con vin santo", "tortino con cuore caldo al cioccolato"],"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"],"bevande": ["acqua", "vino"],"prezzo": 25.00,"sconti": [{"tipo": "giorno","valore": ["martedì"],"sconto": 1.00}]}, {"lang": "eng","menu": "traditional","antipasti": ["tuscan mixed appetizer", "mixed cheese with mustard and honey", "salami plate"],"primi": ["pappardelle with wild boar sauce in white", "pici with garlic"],"secondi": ["guglione lamb"],"contorni": ["green salad", "baked potatoes"],"dessert": ["pannacotta with lavender", "cantuccini with vin santo", "cake with hot chocolate heart"],"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"],"bevande": ["acqua", "vino"],"prezzo": 25.00,"sconti": [{"tipo": "giorno","valore": ["tuesday"],"sconto": 1.00}]}]}]';
		}
}

function caricaRistoranti() {
	var datiRistoranti='[{ \
		"codice": "antica-trattoria-del-gallo", \
		"nome": "Antica Trattoria del Gallo", \
		"immagine": "images/trattoria-gallo.jpeg", \
		"tipologia": ["cucina locale", "cucina tradizionale", "carne", "pesce"], \
		"via": "via Risorgimento, 46", \
		"citta": "Clusane d\'Iseo", \
		"provincia": "BS", \
		"gps": {"lat": 45.660215, "lng": 10.003098}, \
		"fascia di prezzo": "media", \
		"posti": 40, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "terra", \
			"antipasti": ["salame tipo Montisola", "spiedini di maiale"], \
			"primi": ["tagliatelle al salame di Folaga", "tagliatelle con porcini"], \
			"secondi": ["manzo all\'olio con polenta", "filetto di maiale"], \
			"contorni": ["patate fritte", "verdure fresche", "verdure grigliate"], \
			"dessert": ["ananas del gallo", "delizie al carrello"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"], \
			"bevande": ["acqua", "vino bianco del gallo", "vino rosso del gallo"], \
			"prezzo": 35.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["lunedì", "giovedì"], \
				"sconto": 2.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "land", \
			"antipasti": ["Montisola sousage", "pork skewers"], \
			"primi": ["Folaga sousage noodles", "porcini noodles"], \
			"secondi": ["beef in oil with polenta", "pork tenderloin"], \
			"contorni": ["french fries", "fresh vegetables", "grilled vegetables"], \
			"dessert": ["rooster pineapple", "delights to cart"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"], \
			"bevande": ["water", "rooster white wine", "rooster red wine"], \
			"prezzo": 35.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["monday", "thursday"], \
				"sconto": 2.00 \
			}] \
		}, { \
			"lang": "ita", \
			"menu": "lago", \
			"antipasti": ["insalata di luccio", "pesciolino fritto"], \
			"primi": ["casoncelli caserecci alla salvia", "linguine ai gamberi di lago"], \
			"secondi": ["filetti di persico reale dorati alla salvia", "tinca ripiena al forno"], \
			"contorni": ["patate fritte", "verdure fresche", "verdure grigliate"], \
			"dessert": ["ananas del gallo", "delizie al carrello"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini", "pesce e prodotti a base di pesce"], \
			"bevande": ["acqua", "vino bianco del gallo", "vino rosso del gallo"], \
			"prezzo": 40.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["lunedì", "giovedì"], \
				"sconto": 2.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "lake", \
			"antipasti": ["pike salad", "fried fish"], \
			"primi": ["homemade casoncelli with sage", "linguine with shrimp lake"], \
			"secondi": ["fillets on golden perch with sage", "stuffed tench baked"], \
			"contorni": ["french fries", "fresh vegetables", "grilled vegetables"], \
			"dessert": ["rooster pineapple", "delights to cart"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products", "fish and fish-based products"], \
			"bevande": ["water", "rooster white wine", "rooster red wine"], \
			"prezzo": 40.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["monday", "thursday"], \
				"sconto": 2.00 \
			}] \
		}] \
	}, \
	{ \
		"codice": "corte-sconta", \
		"nome": "Corte Sconta", \
		"immagine": "images/corte-sconta.jpg", \
		"tipologia": ["cucina locale", "pesce", "cucina mediterranea"], \
		"via": "calle del Pestrin Castello, 3886", \
		"citta": "Venezia", \
		"provincia": "VE", \
		"gps": {"lat": 45.434787, "lng": 12.347967}, \
		"fascia di prezzo": "alta", \
		"posti": 52, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "degustazione di pesce", \
			"antipasti": ["antipasto di pesce del giorno", "bollito di pesce, crostacei e molluschi", "vongole allo zenzero"], \
			"primi": ["pasta fresca ai frutti di mare", "zuppa di pesce, molluschi e zafferano"], \
			"secondi": ["baccalà mantecato", "granseola al naturale", "sarde in saor"], \
			"contorni": ["insalata di fagioli, sedano e cipolla", "piatto di verdure e legumi"], \
			"dessert": ["dessert del giorno"], \
			"allergeni": ["cereali contenenti glutine", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini", "pesce e prodotti a base di pesce", "crostacei e prodotti a base di crostacei", "molluschi e prodotti a base di molluschi"], \
			"bevande": ["acqua", "vino"], \
			"prezzo": 59.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["19-21"], \
				"sconto":0.50 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "fish tasting", \
			"antipasti": ["seafood appetizer of the day", "boiled fish, shellfish and mollusc", "ginger clams"], \
			"primi": ["fresh pasta with seafood", "fish and shellfish soup with saffron"], \
			"secondi": ["salt cod creamed", "granseola natural", "sardines in sauce"], \
			"contorni": ["beans, celery and onion salad", "vegetables and legumes"], \
			"dessert": ["dessert of the day"], \
			"allergeni": ["cereals containing gluten", "celery and celery-based products", "lupini and lupini-based products", "fish and fish-based products", "shellfish and shellfish-based products", "mollusc and mollusc-based products"], \
			"bevande": ["water", "wine"], \
			"prezzo": 59.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["19-21"], \
				"sconto":0.50 \
			}] \
		}] \
	}, \
	{ \
		"codice": "il-rovescio", \
		"nome": "Il Rovescio", \
		"immagine": "images/il-rovescio.jpg", \
		"tipologia": ["pizzeria", "cucina biologica", "cucina sperimentale", "vegetariano"], \
		"via": "via Pietralata, 75", \
		"citta": "Bologna", \
		"provincia": "BO", \
		"gps": {"lat": 44.495716, "lng": 11.331121}, \
		"fascia di prezzo": "economica", \
		"posti": 24, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "giro pizza", \
			"antipasti": [], \
			"primi": [], \
			"secondi": ["pizza a scelta"], \
			"contorni": ["patate fritte", "patate al forno"], \
			"dessert": [], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte"], \
			"bevande": ["acqua", "birra", "bibita", "caffè"], \
			"prezzo": 18.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["lunedì", "martedì", "mercoledì", "giovedì"], \
				"sconto": 2.00 \
			}, { \
				"tipo": "orario", \
				"valore": ["19-21"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "pizzas", \
			"antipasti": [], \
			"primi": [], \
			"secondi": ["pizza choice"], \
			"contorni": ["french fries", "baked potatoes"], \
			"dessert": [], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products"], \
			"bevande": ["water", "beer", "soft drink", "coffee"], \
			"prezzo": 18.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["monday", "tuesday", "wednesday", "thursday"], \
				"sconto": 2.00 \
			}, { \
				"tipo": "orario", \
				"valore": ["19-21"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "ita", \
			"menu": "osteria", \
			"antipasti": ["vellutata di verdura", "degustazione di formaggi"], \
			"primi": ["ravioli ripieni ai carciofi e parmigiano", "tagliatelle alle cime di rapa"], \
			"secondi": ["crepe al cavolo cappuccio e spinaci", "farinata di ceci con verdure"], \
			"contorni": ["tuberi al forno", "cicoria saltata"], \
			"dessert": ["tiramisù", "torta della casa"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"], \
			"bevande": ["acqua", "vino", "caffè"], \
			"prezzo": 25.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["lunedì", "martedì", "mercoledì", "giovedì"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "public house", \
			"antipasti": ["creamed vegetables", "cheese tasting"], \
			"primi": ["ravioli with artichokes and parmesan", "turnip greens noodles"], \
			"secondi": ["crepe with cabbage and spinach", "chickpea flour with vegetables"], \
			"contorni": ["baked tubers", "sauteed chicory"], \
			"dessert": ["tiramisù", "homemade cake"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"], \
			"bevande": ["water", "wine", "coffee"], \
			"prezzo": 25.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["monday", "tuesday", "wednesday", "thursday"], \
				"sconto": 1.00 \
			}] \
		}] \
	}, \
	{ \
		"codice": "aia-del-tufo", \
		"nome": "Aia del Tufo", \
		"immagine": "images/aia-del-tufo.jpg", \
		"tipologia": ["cucina casalinga", "cucina biologica", "cucina locale", "cucina tradizionale", "carne"], \
		"via": "località Poggio la Mezzadria", \
		"citta": "Sorano", \
		"provincia": "GR", \
		"gps": {"lat": 42.712952, "lng": 11.746615}, \
		"fascia di prezzo": "media", \
		"posti": 34, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "tradizionale", \
			"antipasti": ["antipasto misto toscano", "misto formaggi con mostarda e miele", "tagliere di salumi"], \
			"primi": ["pappardelle di ragù di cinghiale in bianco", "pici all\'aglione"], \
			"secondi": ["agnello al guglione"], \
			"contorni": ["insalata verde", "patate al forno"], \
			"dessert": ["pannacotta alla lavanda", "cantuccini con vin santo", "tortino con cuore caldo al cioccolato"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"], \
			"bevande": ["acqua", "vino"], \
			"prezzo": 25.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["martedì"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "traditional", \
			"antipasti": ["tuscan mixed appetizer", "mixed cheese with mustard and honey", "salami plate"], \
			"primi": ["pappardelle with wild boar sauce in white", "pici with garlic"], \
			"secondi": ["guglione lamb"], \
			"contorni": ["green salad", "baked potatoes"], \
			"dessert": ["pannacotta with lavender", "cantuccini with vin santo", "cake with hot chocolate heart"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"], \
			"bevande": ["water", "wine"], \
			"prezzo": 25.00, \
			"sconti": [{ \
				"tipo": "giorno", \
				"valore": ["tuesday"], \
				"sconto": 1.00 \
			}] \
		}] \
	}, \
	{ \
		"codice": "entree", \
		"nome": "Entree", \
		"immagine": "images/entree.jpg", \
		"tipologia": ["cucina mediterranea", "cucina tradizionale", "vegetariano"], \
		"via": "via Lodovico il Moro, 133", \
		"citta": "Milano", \
		"provincia": "MI", \
		"gps": {"lat": 45.444076, "lng": 9.138886}, \
		"fascia di prezzo": "media", \
		"posti": 38, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "vegetariano", \
			"antipasti": ["flan di zucca", "vellutata al taleggio e amaretti"], \
			"primi": ["risotto in crema di asparagi in quartirolo", "crema di finocchi d\'entrée"], \
			"secondi": ["sformato di radicchio con mirtilli e noci", "caprese con fichi"], \
			"contorni": [], \
			"dessert": ["trilogia al cioccolato", "crema di mascarpone con granella di amaretti", "cheescake con cuore di fragole e pesche sciroppate"], \
			"allergeni": ["latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini"], \
			"bevande": ["acqua", "vino"], \
			"prezzo": 25.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["19-21"], \
				"sconto": 1 \
			}, {"tipo":"giorno", \
				"valore": ["martedì"], \
				"sconto": 1 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "vegetarian", \
			"antipasti": ["pumpkin flan", "taleggio and amaretti cream"], \
			"primi": ["risotto in asparagus cream with quartirolo", "entrée fennel cream"], \
			"secondi": ["chicory flan with cranberries and walnuts", "caprese with figs"], \
			"contorni": [], \
			"dessert": ["chocolate trilogy", "mascarpone cream with amaretti grains", "cheescake with heart of strawberries and peaches in syrup"], \
			"allergeni": ["milk and milk-based products", "celery and celery-based products", "lupini and lupini-based products"], \
			"bevande": ["water", "wine"], \
			"prezzo": 25.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["19-21"], \
				"sconto": 1 \
			}, {"tipo":"giorno", \
				"valore": ["thursday"], \
				"sconto": 1 \
			}] \
		}, { \
			"lang": "ita", \
			"menu": "carne e pesce", \
			"antipasti": ["tartare di salmone, finocchi e arance", "crema di finocchi d\'entrée"], \
			"primi": ["troccioli ai gamberi e funghi porcini", "risotto con speck e zola"], \
			"secondi": ["tagliata di black angus con radicchio e grana", "salmone affumicato con patate al forno"], \
			"contorni": [], \
			"dessert": ["trilogia al cioccolato", "crema di mascarpone con granella di amaretti", "cheescake con cuore di fragole e pesche sciroppate"], \
			"allergeni": ["cereali contenenti glutine", "sedano e prodotti a base di sedano", "lupini e prodotti a base di lupini", "pesce e prodotti a base di pesce", "crostacei e prodotti a base di crostacei"], \
			"bevande": ["acqua", "vino"], \
			"prezzo": 35.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["19-21"], \
				"sconto": 1 \
			}, {"tipo":"giorno", \
				"valore": ["martedì"], \
				"sconto": 1.50 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "meat and fish", \
			"antipasti": ["salmon tartare", "entrée fennel cream"], \
			"primi": ["troccioli with shrimp and porcini mushrooms", "risotto with bacon and gorgonzola"], \
			"secondi": ["sliced black angus with ch and parmesan", "smoked salmon with baked potatoes"], \
			"contorni": [], \
			"dessert": ["chocolate trilogy", "mascarpone cream with amaretti grains", "cheescake with heart of strawberries and peaches in syrup"], \
			"allergeni": ["cereals containing gluten", "celery and celery-based products", "lupini and lupini-based products", "fish and fish-based products", "shellfish and shellfish-based products"], \
			"bevande": ["water", "wine"], \
			"prezzo": 35.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["19-21"], \
				"sconto": 1 \
			}, {"tipo":"giorno", \
				"valore": ["thursday"], \
				"sconto": 1.50 \
			}] \
		}] \
	}, \
	{ \
		"codice": "circolo-lettori", \
		"nome": "Circolo dei Lettori", \
		"immagine": "images/circolo-lettori.jpg", \
		"tipologia": ["cucina locale", "cucina tradizionale", "carne"], \
		"via": "via Giambattista Bogino, 9", \
		"citta": "Torino", \
		"provincia": "TO", \
		"gps": {"lat": 45.068580, "lng": 7.687763}, \
		"fascia di prezzo": "alta", \
		"posti": 42, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "degustazione piemontese", \
			"antipasti": ["insalata russa", "vitel tunè", "peperone farcito al forno", "acchiughe in salsa d\'avie"], \
			"primi": ["plin della tradizione", "frollino salato ai topinambur con zucchine"], \
			"secondi": ["girello di vitello Fassone con salsa tonnata", "battuta al coltello di vitello Fassone", "anguilla ai ferri con ortaggi marinati"], \
			"contorni": ["carciofi in pastella", "chips croccanti", "purea di patate e ortaggi"], \
			"dessert": ["sorbetto al moscato", "parfait al torrone con salsa ai cachi", "lingue di gatto e crema pasticcera"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "pesce e prodotti a base di pesce"], \
			"bevande": ["acqua", "vino", "caffè vergnano"], \
			"prezzo": 70.00, \
			"sconti": [{"tipo":"giorno", \
				"valore": ["lunedì"], \
				"sconto": 2 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "piedmontese tasting", \
			"antipasti": ["russian salad", "calf with tuna sauce", "stuffed baked peppers", "anchovies in avie sauce"], \
			"primi": ["traditional plin", "savory shortbread with topinambur and zucchini"], \
			"secondi": ["Fassone veal silverside with tuna sauce", "Fassone calf abutment", "grilled eel with marinated vegetables"], \
			"contorni": ["artichokes in batter", "crispy chips", "mashed potatoes and vegetables"], \
			"dessert": ["moscato sorbet", "nougat parfait with persimmon sauce", "cat tongue with custard"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "fish and fish-based products"], \
			"bevande": ["water", "wine", "vergnano coffee"], \
			"prezzo": 70.00, \
			"sconti": [{"tipo":"giorno", \
				"valore": ["monday"], \
				"sconto": 2 \
			}] \
		}] \
	}, \
	{ \
		"codice": "soho", \
		"nome": "Soho", \
		"immagine": "images/soho.jpg", \
		"tipologia": ["pesce", "cucina mediterranea", "cucina sperimentale"], \
		"via": "via al Ponte Calvi, 20/R", \
		"citta": "Genova", \
		"provincia": "GE", \
		"gps": {"lat": 44.411915, "lng": 8.928792}, \
		"fascia di prezzo": "economica", \
		"posti": 30, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "pescato del giorno", \
			"antipasti": ["vongole al vapore con vodka, limone ed erbe aromatiche", "vellutata di verdure con capesante", "insalata di mare"], \
			"primi": ["fettuccine con scampi, vongole, zafferano e pomodori", "trofie al pesto genovese"], \
			"secondi": ["grigliata mista del giorno su verdure al vapore", "zuppa secondo il pescato del giorno", "costata di rombo su crema di patate e piselli"], \
			"contorni": [], \
			"dessert": ["millefoglie al cioccolato bianco e fragole", "creme brulée alla vaniglia", "sorbetto con crema di frutta"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "pesce e prodotti a base di pesce", "crostacei e prodotti a base di crostacei", "molluschi e prodotti a base di molluschi"], \
			"bevande": ["acqua"], \
			"prezzo": 26.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["21 in poi"], \
				"sconto": 1 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "fish of the day", \
			"antipasti": ["steamed clams with vodka, lemon and herbs", "creamed vegetables with scallops", "sea salad"], \
			"primi": ["fettuccine with scampi, clams, saffron and tomatoes", "trofie with genoese pesto"], \
			"secondi": ["mixed grill of the day on steamed vegetables", "soup with the fish caught in the day", "turbot rib on creamed potatoes and vegetables"], \
			"contorni": [], \
			"dessert": ["millefeuille with white chocolate and strawberries", "vanilla creme brulée", "sorbet with creamed fruits"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products", "celery and celery-based products", "fish and fish-based products", "shellfish and shellfish-based products", "mollusc and mollusc-based products"], \
			"bevande": ["water"], \
			"prezzo": 26.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["21 and on"], \
				"sconto": 1 \
			}] \
		}, { \
			"lang": "ita", \
			"menu": "insalatone", \
			"antipasti": ["vellutata di verdure con capesante", "insalata di mare"], \
			"primi": [], \
			"secondi": ["insalata croccante e crouton con filetto di salmone e orata", "insalata con gamberi saltati, arancia e pomodori", "insalata greca"], \
			"contorni": [], \
			"dessert": [], \
			"allergeni": ["latte e prodotti a base di latte", "sedano e prodotti a base di sedano", "pesce e prodotti a base di pesce", "crostacei e prodotti a base di crostacei", "molluschi e prodotti a base di molluschi"], \
			"bevande": ["acqua", "caffè"], \
			"prezzo": 15.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["21 in poi"], \
				"sconto": 2 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "salads", \
			"antipasti": ["creamed vegetables with scallops", "sea salad"], \
			"primi": [], \
			"secondi": ["crunchy salad and crouton with salmon and fillet of sea bream", "salad with sauteed shrimp, orange and tomatoes", "greek salad"], \
			"contorni": [], \
			"dessert": [], \
			"allergeni": ["milk and milk-based products", "celery and celery-based products", "fish and fish-based products", "shellfish and shellfish-based products", "mollusc and mollusc-based products"], \
			"bevande": ["water", "coffee"], \
			"prezzo": 15.00, \
			"sconti": [{"tipo":"orario", \
				"valore": ["21 and on"], \
				"sconto": 2 \
			}] \
		}] \
	}, \
	{ \
		"codice": "pride", \
		"nome": "Pride Pub", \
		"immagine": "images/pride.jpg", \
		"tipologia": ["pizzeria", "carne"], \
		"via": "via Enea, 15", \
		"citta": "Roma", \
		"provincia": "RM", \
		"gps": {"lat": 41.873188, "lng": 12.525950}, \
		"fascia di prezzo": "economica", \
		"posti": 44, \
		"menus": [{ \
			"lang": "ita", \
			"menu": "panini e hamburger", \
			"antipasti": ["bruschette miste", "latticini pugliesi", "olive ascolane"], \
			"primi": [], \
			"secondi": ["hamburger con insalata e pomodoro", "panino a scelta", "piadina a scelta"], \
			"contorni": ["patate fritte", "patate al forno"], \
			"dessert": ["tiramisù", "pannacotta", "cheescake"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte"], \
			"bevande": ["acqua", "birra", "bibita"], \
			"prezzo": 16.00, \
			"sconti": [{ \
				"tipo": "orario", \
				"valore": ["19-21"], \
				"sconto": 1.00 \
			}, { \
				"tipo": "giorno", \
				"valore": ["mercoledì", "giovedì"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "sandwiches and hamburgers", \
			"antipasti": ["mixed garlic bread", "dairy product from Puglia", "stuffed olives"], \
			"primi": [], \
			"secondi": ["hamburger with salad and tomatoes", "choice of sandwiches", "choice of piadinas"], \
			"contorni": ["french fries", "baked potatoes"], \
			"dessert": ["tiramisù", "pannacotta", "cheescake"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products"], \
			"bevande": ["water", "beer", "soft drink"], \
			"prezzo": 16.00, \
			"sconti": [{ \
				"tipo": "orario", \
				"valore": ["19-21"], \
				"sconto": 1.00 \
			}, { \
				"tipo": "giorno", \
				"valore": ["wednesday", "thursday"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "ita", \
			"menu": "pizze a scelta", \
			"antipasti": ["bruschette miste", "olive ascolane"], \
			"primi": [], \
			"secondi": ["pizza a scelta"], \
			"contorni": [], \
			"dessert": ["tiramisù", "pannacotta", "cheescake"], \
			"allergeni": ["cereali contenenti glutine", "latte e prodotti a base di latte"], \
			"bevande": ["acqua", "birra", "bibita"], \
			"prezzo": 14.00, \
			"sconti": [{ \
				"tipo": "orario", \
				"valore": ["19-21"], \
				"sconto": 1.00 \
			}] \
		}, { \
			"lang": "eng", \
			"menu": "pizza choice", \
			"antipasti": ["mixed garlic bread", "stuffed olives"], \
			"primi": [], \
			"secondi": ["pizza choice"], \
			"contorni": [], \
			"dessert": ["tiramisù", "pannacotta", "cheescake"], \
			"allergeni": ["cereals containing gluten", "milk and milk-based products"], \
			"bevande": ["water", "beer", "soft drink"], \
			"prezzo": 14.00, \
			"sconti": [{ \
				"tipo": "orario", \
				"valore": ["19-21"], \
				"sconto": 1.00 \
			}] \
		}] \
	}]';

	window.localStorage.setItem('ristoranti', escapeHtml(datiRistoranti));
}

function escapeHtml(text) {
    return text.replace(/à/g,'&agrave')
    	.replace(/è/g,'&egrave')
    	.replace(/ì/g,'&igrave')
    	.replace(/ò/g,'&ograve')
    	.replace(/ù/g,'&ugrave')
    	.replace(/é/g,'&eacute')
    	.replace(/'/g,'&#39');
}