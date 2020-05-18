import c from "../constants/constants";
import $ from "jquery";
require('isomorphic-fetch');

var encontrados = {

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
        return fetch(c.BASE_URL + '/encontrados?' + query, defaultOptions);
    },

    saveCreate(encontrado) {
        var formData = new FormData();
        formData.append("encontrado", JSON.stringify(encontrado));
        formData.append("imagenPrincipal", encontrado.mascota.imagenPrincipal);
        if (encontrado.mascota.imagenSecundaria) {
            formData.append("imagenSecundaria", encontrado.mascota.imagenSecundaria);
        }

        return $.ajax({
            url: c.BASE_URL + '/encontrados',
            //dataType: 'json',
            data: formData,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader('authorization', "Bearer " + localStorage.token);
            },
            contentType: false,
            type: 'POST',
            // cache: false,
            processData: false,
            enctype: 'multipart/form-data',
        });
    },

    saveUpdate(animal) {
        let defaultOptions = {
            url: '',
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            // cache: false,
            dataType: 'json',
            body: JSON.stringify(animal)
        };
        return fetch(c.BASE_URL + '/encontrados/' + animal.id, defaultOptions);
    }
}

export default encontrados;