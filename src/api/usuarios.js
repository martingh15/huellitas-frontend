import c from "../constants/constants";
require('isomorphic-fetch');

var usuarios = {

    saveCreate(usuario) {
        let defaultOptions = {
            url: '',
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: 'json',
            body: JSON.stringify(usuario)
        };

        return fetch(c.BASE_URL + '/registro', defaultOptions);
    },

    getLogueado() {
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + localStorage.token
            },
            // cache: false,
            dataType: 'json',
        };
        return fetch(c.BASE_URL + '/usuarios/create', defaultOptions);
    },

    saveUpdate(usuario) {

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
            body: JSON.stringify(usuario)
        };

        return fetch(c.BASE_URL + '/usuarios/' + usuario.id, defaultOptions);
    }
};

export default usuarios;