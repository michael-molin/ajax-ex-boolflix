$(document).ready(function () {
    var source = $("#card-template").html();
    var template = Handlebars.compile(source);

    var listaGeneriFilm;
    var listaGeneriTv;
    creaLista("movie");
    creaLista("tv");
    var listaGeneriSelect = [];

    $('.select-genere').change(function() {
        var genereSelezionato = $(this).val();
        applicaFiltro(genereSelezionato);
    });

    $('#btn-search').click(function() {
        if($('#input-bar').val().trim().length == 0) {
            alert('Non hai inserito nessuna parola o lettera!');
        } else {
            ricerca();
            riempiFiltro(listaGeneriSelect);
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

    function applicaFiltro(genere) {
        if (genere == "") {
            $('.card').show();
        } else {
            $('.card').each(function(){
                var questaCard = $(this).find('.genere-film').text();
                if (questaCard.includes(genere)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            })
        }
    }

    function noRisultati() {
        if (($(".container-film").is(":empty")) && ($(".container-serie").is(":empty"))) {
            $('.no-risultati').show();
            $('.select-genere').hide();
        } else {
            $('.no-risultati').hide();
            $('.select-genere').show();
        }
    }

    function ricerca(){
        $('.card').remove();
        $(".container-film").empty();
        $(".container-serie").empty();
        var baseUrl = "https://api.themoviedb.org/3";
        var risultatoInput = $('#input-bar').val();
        cercaTitolo("movie", baseUrl, risultatoInput);
        cercaTitolo("tv", baseUrl, risultatoInput);
        $('#input-bar').val('');
    }

    function riempiFiltro(listaGeneri) {
        for (var i = 0; i < listaGeneri.length; i++) {
            $('.select-genere').append('<option value="'+listaGeneri[i] +'">' + listaGeneri[i] + "</option>");
        }
    }

    function svuotaFiltro() {
        $('.select-genere').empty();
        $('.select-genere').append('<option value=""> Seleziona un genere </option>');
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
                        var lista = listaGeneriFilm;
                    } else {
                        var pathTitolo = titoli[i].name;
                        var pathTitoloOriginale = titoli[i].original_name;
                        var lista = listaGeneriTv;
                    }
                    var questoTitolo = {
                        id: titoli[i].id,
                        titolo: pathTitolo,
                        titoloOriginale: pathTitoloOriginale,
                        testo: titoli[i].overview,
                        lingua: setLingua(titoli[i].original_language),
                        voto: setStelle(titoli[i].vote_average),
                        poster: setPoster(titoli[i].poster_path),
                        cast: setCast(titoli[i].id, url, tipo),
                        genere: setGenere(titoli[i].genre_ids, lista)
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
            noRisultati();
            },
            error: function () {
                alert('ERRORE');
            }
        })
    }

    function ritornoAttori(listaAttori, idTitolo) {
        var attoriFilm = "";
        for (var i = 0; i <= 4; i++) {
            if (i < 4) {
                attoriFilm += listaAttori[i].name + ", ";
            } else {
                attoriFilm += listaAttori[i].name + ".";
            }
        }
        $("#"+idTitolo).text(attoriFilm);
    }

    function setCast(idTitolo, baseurl, tipo) {
        $.ajax({
            url: baseurl + "/" + tipo + "/" + idTitolo + "/credits",
            method: "GET",
            data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437'
            },
            success: function(data) {
                ritornoAttori(data.cast, idTitolo);
            },
            error: function() {
                alert('ERRORE CAST');
            }
        })

    }

    function setGenere (idGenere, lista) {
      var genereTitolo = [];
      for (var i = 0; i < idGenere.length; i++) {
        for (var x = 0; x < lista.length; x++) {
          if (idGenere[i] == lista[x].id) {
            genereTitolo.push(" " + lista[x].name);
            listaGeneriSelect.push(lista[x].name);
          }
        }
      }
      svuotaFiltro();
      riempiFiltro(listaGeneriSelect);
      return genereTitolo;
    }

    function creaLista (serieFilm) {
      $.ajax ({
          url: "https://api.themoviedb.org/3/genre/"+serieFilm+"/list",
          method: "GET",
          data: {
                api_key: 'e4a6a0f5b61f8597156e751b684b7437'
          },
          success: function (data) {
            if (serieFilm == "movie") {
              listaGeneriFilm = data.genres;
            } else {
              listaGeneriTv = data.genres;
            }
          },
          error: function() {
            alert('errore genere');
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
