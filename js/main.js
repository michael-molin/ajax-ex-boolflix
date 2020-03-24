$(document).ready(function () {
    var source = $("#card-template").html();
    var template = Handlebars.compile(source);

    $('#btn-search').click(function() {
        if($('#input-bar').val().trim().length == 0) {
            alert('Non hai inserito nessuna parola o lettera!');
        } else {
            ricerca();
        }
    });

    $('#input-bar').keypress(function(event) {
        if(event.key == "Enter") {
            if($('#input-bar').val().trim().length == 0) {
                alert('Non hai inserito nessuna parola o lettera!');
            } else {
                ricerca();
            }
        }
    });

    function ricerca(){
        $('.card').remove();
        var baseUrl = "https://api.themoviedb.org/3";
        var risultatoInput = $('#input-bar').val();
        cercaTitolo("movie", baseUrl, risultatoInput);
        cercaTitolo("tv", baseUrl, risultatoInput);
        $('#input-bar').val('');
    }

    function cercaTitolo(tipo, url, input) {
        $.ajax({
            url: url + "/search/" + tipo,
            data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437',
                query: input,
                language: 'it-IT'
            },
            success: function (data) {
                var titoli = data.results;
                for (var i = 0; i < titoli.length; i++) {
                    if (tipo == "movie") {
                        var pathTitolo = titoli[i].title;
                        var pathTitoloOriginale = titoli[i].original_title;
                    } else {
                        var pathTitolo = titoli[i].name;
                        var pathTitoloOriginale = titoli[i].original_name;
                    }
                    var questoTitolo = {
                        titolo: pathTitolo,
                        titoloOriginale: pathTitoloOriginale,
                        testo: titoli[i].overview,
                        lingua: setLingua(titoli[i].original_language),
                        voto: setStelle(titoli[i].vote_average),
                        poster: setPoster(titoli[i].poster_path)
                    }

                    if (questoTitolo.titolo == questoTitolo.titoloOriginale) {
                        delete questoTitolo.titoloOriginale;
                    }
                    var titoloCompilato = template(questoTitolo);
                    if (tipo == "movie") {
                        $('.container-film').append(titoloCompilato);
                    } else {
                        $('.container-serie').append(titoloCompilato);
                    }
                }
            },
            error: function () {
                alert('ERRORE');
            }
        })
    }

    function setStelle (filmVoto) {
        var voto = Math.ceil(filmVoto/2);
        var stelle = "";

        for (var i = 1; i <= 5; i++) {
            if (i <= voto) {
                stelle += '<i id="stella-piena" class="fas fa-star"></i>';
            } else {
                stelle += '<i id="stella-piena" class="far fa-star"></i>';
            }
        }
        return stelle;
    }

    function setLingua (lingua) {
        var flag = [
        {
            linguaggio: "it",
            bandiera: '<img src="https://www.countryflags.io/IT/shiny/64.png">'
        },
        {
            linguaggio: "en",
            bandiera: '<img src="https://www.countryflags.io/GB/shiny/64.png">'
        },
        {
            linguaggio: "fr",
            bandiera: '<img src="https://www.countryflags.io/FR/shiny/64.png">'
        },
        {
            linguaggio: "de",
            bandiera: '<img src="https://www.countryflags.io/DE/shiny/64.png">'
        }
    ];
        for (var i = 0; i < flag.length; i++) {
            if(lingua == flag[i].linguaggio) {
                return flag[i].bandiera;
            }
        }
        return lingua;
    }

    function setPoster (poster) {
        if (poster != null) {
            return "https://image.tmdb.org/t/p/w342/" + poster
        } else {
            return "https://www.2queue.com/2queue/wp-content/uploads/sites/6/tdomf/4299/movie-poster-coming-soon.png"
        }
    }
});
