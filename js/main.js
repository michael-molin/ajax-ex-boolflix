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
                        voto: films[i].vote_average
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

});
