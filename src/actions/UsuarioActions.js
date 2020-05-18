import * as errorMessages from '../constants/MessageConstants';
import history from '../history';
// import isEmpty from 'lodash/isEmpty';

//Actions
import { logout, changeLogin } from "../actions/AuthenticationActions";

//api
import usuarios from "../api/usuarios";

//normalizer
import { normalizeDato, normalizeDatos } from "../normalizers/normalizeUsuarios";

//USUARIOLOGUEADO CREATE
export const CREATE_USUARIO = 'CREATE_USUARIO';
export const RESET_CREATE_USUARIO = "RESET_CREATE_USUARIO";
export const REQUEST_CREATE_USUARIO = "REQUEST_CREATE_USUARIO";
export const RECEIVE_CREATE_USUARIO = "RECEIVE_CREATE_USUARIO";
export const ERROR_CREATE_USUARIO = "ERROR_CREATE_USUARIO";

//USUARIOLOGUEADO CREATE
function requestCreateUsuario() {
    return {
        type: REQUEST_CREATE_USUARIO,
    }
}

function reveiceCreateUsuario(message) {
    return {
        type: RECEIVE_CREATE_USUARIO,
        message: message,
        receivedAt: Date.now(),
        nuevo: {}
    }
}

export function errorCreateUsuario(error) {
    return {
        type: ERROR_CREATE_USUARIO,
        error: error,
    }
}

export function resetCreateUsuario() {
    return {
        type: RESET_CREATE_USUARIO
    }
}

export function createUsuario(usuario) {
    return {
        type: CREATE_USUARIO,
        usuario
    }
}

export function saveCreateUsuario() {
    return (dispatch, getState) => {
        dispatch(requestCreateUsuario());
        return usuarios.saveCreate(getState().usuarios.create.nuevo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    history.push("/login");
                    dispatch(reveiceCreateUsuario("¡Se ha registro con éxito! Para poder ingresar debe validar su email ingresando al link que le enviamos a su correo."));
                    return response.json();
                }
            })
            .then(function () {
                dispatch(changeLogin({
                    email: "",
                    password: ""
                }));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateUsuario(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then((error) => {
                                console.log(error);
                                if (error.message !== "")
                                    dispatch(errorCreateUsuario(error.message));
                                else
                                    dispatch(errorCreateUsuario(errorMessages.GENERAL_ERROR));
                            })
                            .catch((error) => {
                                dispatch(errorCreateUsuario(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//USUARIO UPDATE
export const UPDATE_USUARIO = 'UPDATE_USUARIO';
export const RESET_UPDATE_USUARIO = "RESET_UPDATE_USUARIO";
export const REQUEST_UPDATE_USUARIO = "REQUEST_UPDATE_USUARIO";
export const RECEIVE_UPDATE_USUARIO = "RECEIVE_UPDATE_USUARIO";
export const ERROR_UPDATE_USUARIO = "ERROR_UPDATE_USUARIO";
function requestUpdateUsuario() {
    return {
        type: REQUEST_UPDATE_USUARIO,
    }
}

function receiveUpdateUsuario() {
    return {
        type: RECEIVE_UPDATE_USUARIO,
        receivedAt: Date.now()
    }
}

function errorUpdateUsuario(error) {
    return {
        type: ERROR_UPDATE_USUARIO,
        error: error,
    }
}

export function resetUpdateUsuario() {
    return {
        type: RESET_UPDATE_USUARIO
    }
}

export function updateUsuario(usuario) {
    return {
        type: UPDATE_USUARIO,
        usuario
    }
}

export function saveUpdateUsuario() {
    return (dispatch, getState) => {
        dispatch(requestUpdateUsuario());
        return usuarios.saveUpdate(getState().usuarios.update.activo)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    dispatch(receiveUpdateUsuario());
                    return response.json();
                }
            })
            .then((respuesta) => {
                let usuario = respuesta.usuario;
                dispatch(resetUpdateUsuario());
                dispatch(updateUsuario(usuario));
                history.push('/');
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateUsuario(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return Promise.reject(error);
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorUpdateUsuario(error.message));
                                else
                                    dispatch(errorUpdateUsuario(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorUpdateUsuario(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//USUARIO LOGUEADO
export const INVALIDATE_USUARIO_LOGUEADO = 'INVALIDATE_USUARIO_LOGUEADO';
export const REQUEST_USUARIO_LOGUEADO = "REQUEST_USUARIO_LOGUEADO";
export const RECEIVE_USUARIO_LOGUEADO = "RECEIVE_USUARIO_LOGUEADO";
export const ERROR_USUARIO_LOGUEADO = "ERROR_USUARIO_LOGUEADO";
export const RESET_USUARIO_LOGUEADO = "RECET_USUARIO_LOGUEADO";

export function invalidateUsuarioLogueado() {
    return {
        type: INVALIDATE_USUARIO_LOGUEADO,
    }
}

export function resetUsuarioLogueado() {
    return {
        type: RESET_USUARIO_LOGUEADO
    }
}

function requestUsuarioLogueado() {
    return {
        type: REQUEST_USUARIO_LOGUEADO,
    }
}

function receiveUsuarioLogueado(json) {
    return {
        type: RECEIVE_USUARIO_LOGUEADO,
        usuario: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorUsuarioLogueado(error) {
    return {
        type: ERROR_USUARIO_LOGUEADO,
        error: error,
    }
}

export function fetchUsuarioLogueado() {
    return dispatch => {
        dispatch(requestUsuarioLogueado());
        return usuarios.getLogueado()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveUsuarioLogueado(data));
            })
            .catch(function (error) {
                dispatch(logout());
                switch (error.status) {
                    case 401:
                        dispatch(errorUsuarioLogueado(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        dispatch(errorUsuarioLogueado(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchUsuarioLogueado(state) {
    const usuarios = state.usuarios.update;
    if (usuarios.isFetchingUsuarioLogueado) {
        return false
    } else if (!usuarios.activo.id && state.authentication.token) {
        return true
    } else {
        return usuarios.didInvalidate;
    }
}

export function fetchUsuarioLogueadoIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchUsuarioLogueado(getState())) {
            return dispatch(fetchUsuarioLogueado())
        }
    }
}