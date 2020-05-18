import c from "../constants/constants";
require('isomorphic-fetch');

var animales = {

    getAll() {
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: 'json',
        };
        return fetch(c.BASE_URL + '/animales', defaultOptions);
    },
    getOne(id) {
        let defaultOptions = {
            url: '',
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json;charset=UTF-8"
            },
            // cache: false,
            dataType: 'json',
        };
        return fetch(c.BASE_URL + '/animales/' + id, defaultOptions);
    },
}

export default animales;