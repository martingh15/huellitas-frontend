import c from "../constants/constants";
import $ from "jquery";
require('isomorphic-fetch');

var perdidos = {

    getAll(filtros) {
        var esc = encodeURIComponent;
        var query = "";
        if (filtros)
            query = Object.keys(filtros)
                .map(k => esc(k) + '=' + esc(filtros[k]))
                .join('&');

        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8"
            },
            // cache: false,
            dataType: 'json'
        };
        return fetch(c.BASE_URL + '/perdidos?' + query, defaultOptions);
    },

    saveCreate(perdido) {
        var formData = new FormData();
        formData.append("perdido", JSON.stringify(perdido));
        formData.append("imagenPrincipal", perdido.animal.imagenPrincipal);
        if (perdido.animal.imagenSecundaria) {
            formData.append("imagenSecundaria", perdido.animal.imagenSecundaria);
        }

        return $.ajax({
            url: c.BASE_URL+'/perdidos',
            //dataType: 'json',
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader('authorization', "Bearer "+localStorage.token);
            },
            contentType: false,
            type: 'POST',
            // cache: false,
            processData: false,
            enctype: 'multipart/form-data',
        });
    },

    saveUpdate(perdido) {
        console.log(perdido)
        var formData = new FormData();
        formData.append("perdido", JSON.stringify(perdido));
        if (typeof perdido.animal.imagenPrincipal !== "string" && perdido.animal.imagenPrincipal !== null)
            formData.append("imagenPrincipal", perdido.animal.imagenPrincipal);
        if (typeof perdido.animal.imagenSecundaria !== "string" && perdido.animal.imagenSecundaria !== null)
            formData.append("imagenSecundaria", perdido.animal.imagenSecundaria);

        return $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader('authorization', "Bearer " + localStorage.token);
            },
            url: c.BASE_URL + '/update-perdido/' + perdido.id,
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST'            
        });
    }
}

export default perdidos;