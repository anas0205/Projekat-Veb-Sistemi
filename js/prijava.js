$(function() {
    $('#forma').on('submit', function(e) {
        e.preventDefault();
        
        let greska = $('#provera_registracija');
        let form = {
            email: $('#email').val(),
            password: $('#lozinka').val(),
            apitoken: $('meta[name="apitoken"]').attr('content')
        };

        if (!form.email || !form.password) {
            greska.html('Molimo vas da popunite sva polja.');
            greska.show();
            return;
        }

        $.ajax({
            url: "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/login",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded" 
            },
            data: form,
            dataType: "json",
            success: function(response) {
                if (response.error) {
                    greska.html(response.error);
                    greska.show();
                    $('#lozinka').val('');
                } else {
                    console.log(response);
                    localStorage.setItem('apitoken', response.apitoken);
                    localStorage.setItem('type', response.type);
                    
                    switch (localStorage.getItem("type")) {
                        case 'администратор':
                            window.location = 'administrator.html';
                            break;
                        case 'благајник':
                            window.location = 'blagajnik.html';
                            break;
                        case 'регистровани корисник':
                            window.location = 'korisnik.html';
                            break;
                        default:
                            greska.html('Nepoznat korisnik.');
                            greska.show();
                            break;
                    }
                }
            },
            error: function(response) {
                if (response.responseJSON && response.responseJSON.error) {
                    greska.html(response.responseJSON.error);
                } else {
                    greska.html('Došlo je do greške.');
                }
                greska.show();
                $('#lozinka').val('');
                console.error('Server Error:', response);
            }
        });
    });
});
