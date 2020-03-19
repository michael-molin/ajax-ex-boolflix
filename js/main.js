$(document).ready(function () {

    var noFilm = false;
    var noSerie = false;
    var source = $("#film-template").html();
    var filmTemplate = Handlebars.compile(source);

    var sourceSerie = $("#serie-template").html();
    var serieTemplate = Handlebars.compile(sourceSerie);

    var sourceErrore = $("#errore-template").html();
    var erroreTemplate = Handlebars.compile(sourceErrore);



    $('#btn-search').click(function() {
        cercaTitolo();
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
        var baseUrl = "https://api.themoviedb.org/3";
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
                    noFilm = true;
                    console.log('no film trovati');
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
                    noFilm = false;
                    }
                }
            },
            error: function () {
                alert('ERRORISSIMO FILM');
            }
        })
        $.ajax({
            url: baseUrl + "/search/tv",
            data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437',
                query: risultatoInput,
                language: 'it-IT'
            },
            success: function (data) {
                $('.serie').remove();
                var series = data.results;
                if (series.length == 0) {
                    console.log('no serie tv trovate');
                    noSerie = true;
                } else {
                for (var i = 0; i < series.length; i++) {
                    // var filmCompleto = films[i];
                    var serie = {
                        titoloSerie: series[i].name,
                        titoloOriginaleSerie: series[i].original_name,
                        linguaSerie: series[i].original_language,
                        // voto: films[i].vote_average
                        votoSerie: setStelle(series[i].vote_average)
                    }
                    var serieCompilata = serieTemplate(serie);
                    $('.container').append(serieCompilata);
                    noSerie = false;
                    }
                }
            },
            error: function () {
                alert('ERRORISSIMO SERIE TV');
            }
        })
        console.log('la variabile No Film è ', noFilm);
        console.log('la variabile No serie tv è ', noSerie);
        if ((noSerie == true) && (noFilm == true)) {
            $('.container').append(erroreTemplate);
        }
        $('#input-bar').val('');
    }

    // function cercaSerie(){
    //     var baseUrl = "https://api.themoviedb.org/3";
    //     var risultatoInput = $('#input-bar').val();
    //     $.ajax({
    //         url: baseUrl + "/search/tv",
    //         data: {
    //             api_key: 'e4a6a0f5b61f8597156e751b684b7437',
    //             query: risultatoInput,
    //             language: 'it-IT'
    //         },
    //         success: function (data) {
    //             $('.serie').remove();
    //             var series = data.results;
    //             if (series.length == 0) {
    //                 console.log('no serie tv trovate');
    //                 noSerie = true;
    //             } else {
    //             for (var i = 0; i < series.length; i++) {
    //                 // var filmCompleto = films[i];
    //                 var serie = {
    //                     titoloSerie: series[i].name,
    //                     titoloOriginaleSerie: series[i].original_name,
    //                     linguaSerie: series[i].original_language,
    //                     // voto: films[i].vote_average
    //                     votoSerie: setStelle(series[i].vote_average)
    //                 }
    //                 var serieCompilata = serieTemplate(serie);
    //                 $('.container').append(serieCompilata);
    //                 noSerie = false;
    //                 }
    //             }
    //         },
    //         error: function () {
    //             alert('ERRORISSIMO SERIE TV');
    //         }
    //     })
    // }

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
});
