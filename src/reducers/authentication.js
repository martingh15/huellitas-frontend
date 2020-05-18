import merge from "lodash/merge";
import {
    RECEIVE_LOGIN,
    REQUEST_LOGIN,
    ERROR_LOGIN,
    CHANGE_LOGIN,
    CHANGE_USER,
    RESET_LOGIN,
    LOGOUT_SUCCESS
} from '../actions/AuthenticationActions';
import auth from '../api/authentication';

const assign = Object.assign || require('object.assign');

// The initial application state
const initialState = {
    usuario: {
        email: '',
        password: ''
    },
    errorMessage: null,
    currentlySending: false,
    token: auth.loggedIn(),
    idUsuario: auth.idUsuario(),
    nombre: auth.nombreUsuario(),
    mensajeCorrecto: ""
};

// Takes care of changing the application state
const authentication = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LOGIN:
            return assign({}, state, {
                errorMessage: null,
                usuario: merge({}, state.usuario, action.usuario),
                mensajeCorrecto: ""
            });
        case RECEIVE_LOGIN:
            return assign({}, state, {
                token: action.token,
                errorMessage: null,
                currentlySending: false,
                mensajeCorrecto: action.message
            });
        case REQUEST_LOGIN:
            return assign({}, state, {
                currentlySending: action.sending,
                mensajeCorrecto: action.mensaje,
                errorMessage: null
            });
        case ERROR_LOGIN:
            return assign({}, state, {
                errorMessage: action.error,
                currentlySending: false,
                token: false
            });
        case CHANGE_USER:
            return assign({}, state, {
                idUsuario: action.idUsuario,
                nombre: action.nombre
            });
        case RESET_LOGIN:
            return assign({}, state, {
                usuario: {email: '', password: ''},
                currentlySending: false,
                token: false,
                errorMessage: null,
                idUsuario: null,
                nombre: ""

            });
        case LOGOUT_SUCCESS:
            return assign({}, state, {
                usuario: {email: '', password: ''},
                currentlySending: false,
                token: false,
                errorMessage: null,
                idUsuario: null,
                nombre: ""
            });
        default:
            return state;
    }
};

export default authentication;
