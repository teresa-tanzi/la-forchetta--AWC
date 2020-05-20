$(document).ready(function() {
	var listaRistornti=JSON.parse(window.localStorage.getItem("ristoranti"));

	listaRistornti.forEach(function (entry, index) {
		//se l'indice è 0, 2... pari allora apro la riga
		if (index%2==0) {
			$("#lista-ristoranti").append('<div class="row">');
		}

		$("#lista-ristoranti").append('<div class="col-lg-6 col-md-6"> \
			<form action="dettagli_ristorante.html" method="GET" class="image"> \
				<input type="hidden" name="nome" value="'+entry["codice"]+'"> \
				<button type="submit" class="image-submit"> \
					<div class="thumbnail ristorante"> \
						<img src="'+entry["immagine"]+'"/> \
						<div class="post-content"> \
							<h3>'+entry["nome"]+'</h3> \
							<p>'+entry["citta"]+" ("+entry["provincia"]+')</p> \
						</div> \
					</div> \
				</button> \
			</form> \
		</div>');
		//la class "image" del form serve solo per ingrandirlo (così le immagini sono più grandi e meglio visibili)
		//la class "image-submit" del submit button serve per nascondere il bordo del bottone (non voglio si capisca che è un form)
		//la class "thumbnail" serve per nascondere margin, paddin e border (rendo la pagina più pulita e le immagini più grandi)
		//la class "post-content" indica l'etichetta, in particolare come posizionarla e l'animazione

		//se l'indice è 1, 3... dispari allora chiudo la riga
		if (index%2==1) {
			$("#lista-ristoranti").append('</div>');
		}
	})
})