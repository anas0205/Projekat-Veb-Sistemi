$(function(){
    $('#imeprezime').on('blur', function() {
        let vrednost = $(this).val();
        let imeprezime = $('#provera_imeprezime');
        let sablon_imeprezime = /(?=^.{5,180}$)^[А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšžљњшђчћжџ]+(?:[\s-][А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšžљњшђчћжџ]+)+$|^[A-ZŠĐŽČĆ][a-zčćžđšž]+(?:[\s-][A-ZŠĐŽČĆ][a-zčćžđšž]+)+$/;

        if (sablon_imeprezime.test(vrednost)) {
            $(this).css('outline', 'none');
            imeprezime.hide();
        }
        else {
            $(this).css('outline', '3px solid orange');
            imeprezime.html("Ime ili prezime nije pravilno napisano" + '<br><br>')
            imeprezime.show();
        }
    });



    $('#telefon').on('blur', function () {
        let vrednost = $(this).val();
        let telefon = $('#provera_telefon')
        let sablon_broj = /^[+][1-9][0-9][0-9]{7,12}$/;

        if (sablon_broj.test(vrednost) || $('#broj').val() === '') {
            $(this).css('outline', 'none');
            telefon.hide();
        }
        else {
            $(this).css('outline', '3px solid orange');
            telefon.html("Broj telefona nije ispravan" + '<br><br>')
            telefon.show();
        }
    });
    $('#email').on('blur', function () {
        if ($('#email').val() !=='') {
            $(this).css('outline', 'none');
            $('#provera_email').hide();
        }
    });
    $('#lozinka').on('blur', function () {
        let vrednost = $(this).val();
        let lozinka = $('#provera_lozinka')
        let sablon_lozinka = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,}$/;

        if (sablon_lozinka.test(vrednost)) {
            $(this).css('outline', 'none');
            lozinka.hide();
        }
        else {
            $(this).css('outline', '3px solid orange');
            lozinka.html("Lozinka nije dovoljno jaka" + '<br><br>')
            lozinka.show();
        }
    });

    $('#ponovljenalozinka').on('blur', function () {
        let ponovnalozinka = $('#ponovljenalozinka')
        let ponovljenalozinka = $('#provera_ponovljenalozinka')
        let lozinka = $('#lozinka')

        if (ponovnalozinka.val() === lozinka.val()) {
            $(this).css('outline', 'none');
        }
        else {
            $(this).css('outline', '3px solid orange');
            ponovljenalozinka.html("Lozinke nisu iste" + '<br><br>')
            ponovljenalozinka.show();
        }
    });
    let lista_uloga = {
        "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/uloga" + $('meta[name="apitoken"]').attr('content'),
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("apitoken")
        },
    };

    $.ajax(lista_uloga).done(function (response){
        response.forEach((element, niz) => {
            $('#uloge').append('<option value="' + element.id + '">' + element.naziv + '</option>')
        })
    });

    let lista_lokacija = {
        "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/uloga" + $('meta[name="apitoken"]').attr('content'),
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("apitoken")
        },
    };

    $.ajax(lista_lokacija).done(function (response){
        console.log(response);
        response.forEach((element, niz) => {
            $('lokacije').append('<option value="' + element.id + '">' + element.naziv + '</option>')
        })
    });

    $('#uloge').on('change', function (){

        if($(this).val() === '2') {
            $('#lokacije').show();
        }
        else {
            $('#lokacije').hide();
        }
    });
    $('#uloge').on('click', function(e){
        if($('#uloge').val() === $('#blagajnik').val()){
            $('#lokacije').show();
            console.log('izabran');
        }else{
            $('#lokacije').hide();
        }
    });

    $('#forma').on('submit', function (e){
        e.preventDefault();
        let email = $('#email');
        let provera_email = $('#provera_email');
        let greska = $('#provera_registracija');
        if(email.val() === ''){
            email.css('outline', '3px solid orange');
            provera_email.html("Nije unet e-mail" + '<br>')
            provera_email.show();
        }
        let form = new FormData();
        form.append("name", $('#imeprezime').val());
        form.append("email", email.val());
        form.append("phone", $('#telefon').val());
        form.append("password", $('#lozinka').val());
        form.append("userRoleId", $('#uloge').val());
        form.append("locationId", $('#lokacije').val());
        form.append("apitoken", $('meta[name="apitoken"]').attr('content'));

        let settings = {
            "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("apitoken")
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            'dataType':'json',
            'success': function(response){
                if(response.error !== undefined){
                    greska.html(response.responseJSON.message);
                    greska.show();
                    $('#email').val('');
                    console.log(response);
                }
                else {
                    console.log(response);
                }
            },
            'error': function(response){

                greska.html(response.responseJSON.message);
                greska.show();
                $('#email').val('');
            }
        };
        $.ajax(settings)
    })
});