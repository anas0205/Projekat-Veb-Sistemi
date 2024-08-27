$(function() {
    let settings = {
        "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik?apitoken=GrGPqaYnq6wCyOSRG4LwwN3M8bnkct4dAG10FhJza0VvL0ytk9nycPfhqCzWLJGjcENzxH63Wp47BEXJJ56ZwZuxNF",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("apitoken")
        },
        'success': function(response) {
            console.log(response);

            let tableHTML = '<table><thead><tr>' +
                '<th>ID</th>' +
                '<th>Име и презиме</th>' +
                '<th>Е-пошта</th>' +
                '<th>Телефон</th>' +
                '<th>Локација</th>' +
                '<th>Улога</th>' +
                '<th>Акције</th>' +
                '</tr></thead><tbody></tbody></table>';

            $('#table').html(tableHTML);


            response.forEach((element, index) => {
                $('#table tbody').append('<tr>' +
                    '<td>' + element.id + '</td>' +
                    '<td>' + element.imeprezime + '</td>' +
                    '<td>' + element.email + '</td>' +
                    '<td>' + element.telefon + '</td>' +
                    '<td>' + (element.lokacija ? element.lokacija.naziv : 'N/A') + '</td>' + 
                    '<td>' + element.uloga.naziv + '</td>' +
                    '<td>' +
                    '<button class="izmeni" data-id="' + element.id + '" data-imeiprezime="' + element.imeprezime + '" data-email="' + element.email + '" data-telefon="' + element.telefon + '" data-uloganaziv="' + element.uloga.id + '">Измени</button>' +
                    '<button class="obrisi" data-id="' + element.id + '" data-imeiprezime="' + element.imeprezime + '" data-email="' + element.email + '" data-telefon="' + element.telefon + '" data-uloganaziv="' + element.uloga.id + '">Обриши</button>' +
                    '</td>' +
                    '</tr>');
            });
        
            $('.izmeni').on('click', function(e) {
                localStorage.setItem('userid', $(this).attr('data-id'));
                localStorage.setItem('userName', $(this).attr('data-imeiprezime'));
                localStorage.setItem('useremail', $(this).attr('data-email'));
                localStorage.setItem('userphone', $(this).attr('data-telefon'));
                localStorage.setItem('userroleid', $(this).attr('data-uloganaziv'));
                window.location = 'korisnikid.html';
            });

            $('.obrisi').on('click', function(e) {
                let form = new FormData();
                form.append("name", $(this).attr('data-imeiprezime'));
                form.append("email", $(this).attr('data-email'));
                form.append("phone", $(this).attr('data-telefon'));
                form.append("id", $(this).attr('data-id'));
                form.append("apitoken", $('meta[name="apitoken"]').attr('content'));

                let settings2 = {
                    "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/?apitoken=" + $('meta[name="apitoken"]').attr('content'),
                    "method": "DELETE",
                    "timeout": 0,
                    "headers": {
                        "Accept": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("apitoken")
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    "dataType": "json"
                };

                $.ajax(settings2).done(function(response) {
                    console.log(response);
                    location.reload();
                }).fail(function(response) {
                    console.error("Greška pri brisanju korisnika:", response);
                });
            });
        },
        'error': function(response) {
            console.error("Greška pri učitavanju:", response);
        }
    };

    $.ajax(settings);
});
