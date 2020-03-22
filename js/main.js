$(document).ready(function () {
    var noFilm = false;
    var noSerie = false;

    var sourceFilm = $("#card-template").html();
    var filmTemplate = Handlebars.compile(sourceFilm);

    var sourceSerie = $("#card-template").html();
    var serieTemplate = Handlebars.compile(sourceSerie);

    var sourceErrore = $("#errore-template").html();
    var erroreTemplate = Handlebars.compile(sourceErrore);



    $('#btn-search').click(function() {
        if($('#input-bar').val().trim().length == 0) {
            alert('Non hai inserito nessuna parola o lettera!');
        } else {
            cercaTitolo();
        }
    });


    $('#input-bar').keypress(function(event) {
        if(event.key == "Enter") {
            if($('#input-bar').val().trim().length == 0) {
                alert('Non hai inserito nessuna parola o lettera!');
            } else {
                cercaTitolo();
            }
        }
    });


    function cercaTitolo(){
        $('.card').remove();
        var baseUrl = "https://api.themoviedb.org/3";
        var risultatoInput = $('#input-bar').val();
        cercaFilm(baseUrl, risultatoInput);
        cercaSerie(baseUrl, risultatoInput);
        $('#input-bar').val('');

    }

    function cercaFilm(url, input) {
        $.ajax({
            url: url + "/search/movie",
            data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437',
                query: input,
                language: 'it-IT'
            },
            success: function (data) {
                var films = data.results;
                for (var i = 0; i < films.length; i++) {
                    var film = {
                        titolo: films[i].title,
                        titoloOriginale: films[i].original_title,
                        lingua: setLingua(films[i].original_language),
                        voto: setStelle(films[i].vote_average),
                        poster: films[i].poster_path
                    }
                    var filmCompilato = filmTemplate(film);
                    $('.container-film').append(filmCompilato);
                    noFilm = false;
                    }
            },
            error: function () {
                alert('ERRORISSIMO FILM');
            }
        })
    }

    function cercaSerie(url, input){
        $.ajax({
            url: url + "/search/tv",
            data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437',
                query: input,
                language: 'it-IT'
            },
            success: function (data) {
                var series = data.results;
                for (var i = 0; i < series.length; i++) {
                    var serie = {
                        titolo: series[i].name,
                        titoloOriginale: series[i].original_name,
                        lingua: setLingua(series[i].original_language),
                        voto: setStelle(series[i].vote_average),
                        poster: series[i].poster_path
                    }
                    var serieCompilata = serieTemplate(serie);
                    $('.container-serie').append(serieCompilata);
                    noSerie = false;
                    }
            },
            error: function () {
                alert('ERRORISSIMO SERIE TV');
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
});
