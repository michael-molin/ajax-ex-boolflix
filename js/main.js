$(document).ready(function () {
    var baseUrl = "https://api.themoviedb.org/3";

    var source = $("#film-template").html();
    var filmTemplate = Handlebars.compile(source);

    var sourceErrore = $("#errore-template").html();
    var erroreTemplate = Handlebars.compile(sourceErrore);



    $('#btn-search').click(function() {
        cercaTitolo();

    });

    $('#input-bar').keypress(function(event) {
        console.log('tasto premuto');
        if(event.key == "Enter") {
            if($('#input-bar').val().trim().length == 0) {
                alert('Non hai inserito nessuna parola o lettera!');
            } else {
                cercaTitolo();
            }
        }
    });


    function cercaTitolo(){
        var risultatoInput = $('#input-bar').val();
        $.ajax({
            url: baseUrl + "/search/movie",
            data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437',
                query: risultatoInput,
                language: 'it-IT'
            },
            success: function (data) {
                $('.film').remove();
                var films = data.results;
                if (films.length == 0) {
                    // alert('nessun risultato disponibile');
                    $('.container').append(erroreTemplate);
                } else {
                for (var i = 0; i < films.length; i++) {
                    // var filmCompleto = films[i];
                    var film = {
                        titolo: films[i].title,
                        titoloOriginale: films[i].original_title,
                        lingua: films[i].original_language,
                        // voto: films[i].vote_average
                        voto: setStelle(films[i].vote_average)
                    }
                    var filmCompilato = filmTemplate(film);
                    $('.container').append(filmCompilato);
                    }
                }
            },
            error: function () {
                alert('ERRORISSIMO');
            }
        })
        $('#input-bar').val('');
    }

    function setStelle (filmVoto) {
        var voto = Math.ceil(filmVoto/2);
        var stelle = "";

        console.log('il voto è', voto);
        for (var i = 1; i <= 5; i++) {
            console.log(i);
            if (i <= voto) {
                console.log('metto stella piena');
                stelle += '<i id="stella-piena" class="fas fa-star"></i>';
            } else {
                console.log('metto stella vuota');
                stelle += '<i id="stella-piena" class="far fa-star"></i>';
            }
        }
        return stelle;
    }
});
