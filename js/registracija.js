$(function() {
    $('#imeprezime').on('blur', function() {
        let vrednost = $(this).val();
        let imeprezime = $('#provera_imeprezime');
        let sablon_imeprezime = /(?=^.{5,180}$)^[А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšžљњшђчћжџ]+(?:[\s-][А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšžљњшђчћжџ]+)+$|^[A-ZŠĐŽČĆ][a-zčćžđšž]+(?:[\s-][A-ZŠĐŽČĆ][a-zčćžđšž]+)+$/;

        if (sablon_imeprezime.test(vrednost)) {
            $(this).css('outline', 'none');
            imeprezime.hide();
        } else {
            $(this).css('outline', '3px solid orange');
            imeprezime.html("Ime ili prezime nije napisano po pravilu" + '<br><br>').show();
        }
    });

    $('#telefon').on('blur', function() {
        let vrednost = $(this).val();
        let telefon = $('#provera_telefon');
        let sablon_broj = /^[+][1-9][0-9][0-9]{7,12}$/;

        if (sablon_broj.test(vrednost) || vrednost === '') {
            $(this).css('outline', 'none');
            telefon.hide();
        } else {
            $(this).css('outline', '3px solid orange');
            telefon.html("Broj telefona nije pravilno unešen" + '<br><br>').show();
        }
    });

    $('#email').on('blur', function() {
        if ($(this).val() !== '') {
            $(this).css('outline', 'none');
            $('#provera_email').hide();
        }
    });

    $('#lozinka').on('blur', function() {
        let vrednost = $(this).val();
        let lozinka = $('#provera_lozinka');
        let sablon_lozinka = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,}$/;

        if (sablon_lozinka.test(vrednost)) {
            $(this).css('outline', 'none');
            lozinka.hide();
        } else {
            $(this).css('outline', '3px solid orange');
            lozinka.html("Lozinka nije dovoljno jaka" + '<br><br>').show();
        }
    });

    $('#ponovljenalozinka').on('blur', function() {
        let ponovljenalozinka = $('#ponovljenalozinka');
        let provera_ponovljenalozinka = $('#provera_ponovljenalozinka');
        let lozinka = $('#lozinka');

        if (ponovljenalozinka.val() === lozinka.val()) {
            $(this).css('outline', 'none');
            provera_ponovljenalozinka.hide();
        } else {
            $(this).css('outline', '3px solid orange');
            provera_ponovljenalozinka.html("Lozinke nisu iste" + '<br><br>').show();
        }
    });

    $('#forma').on('submit', function(e) {
        e.preventDefault();
        let email = $('#email');
        let provera_email = $('#provera_email');
        let greska = $('#provera_registracija');

        if (email.val() === '') {
            email.css('outline', '3px solid orange');
            provera_email.html("Niste uneli e-mail" + '<br><br>').show();
            return;
        }

        let formData = {
            name: $('#imeprezime').val(),
            email: email.val(),
            phone: $('#telefon').val(),
            password: $('#lozinka').val(),
            apitoken: $('meta[name="apitoken"]').attr('content')
        };

        $.ajax({
            url: "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/register",
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.error) {
                    greska.html(response.error).show();
                    $('#email').val('');
                } else {
                    window.location = 'prijava.html';
                }
            },
            error: function(response) {
                greska.html('Došlo je do greške').show();
                $('#email').val('');
                console.error('Server Error:', response);
            }
        });
    });
});
