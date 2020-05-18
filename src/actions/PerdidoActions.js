import perdidos from "../api/perdidos";
import { normalizeDatos } from "../normalizers/normalizePerdidos";
import * as errorMessages from '../constants/MessageConstants';

//Actioms
import { logout } from "./AuthenticationActions";

//Librerias
import history from "../history";

//PERDIDOS
export const REQUEST_PERDIDOS = 'REQUEST_PERDIDOS';
export const RECEIVE_PERDIDOS = 'RECEIVE_PERDIDOS';
export const INVALIDATE_PERDIDOS = 'INVALIDATE_PERDIDOS';
export const ERROR_PERDIDOS = "ERROR_PERDIDOS";
export const RESET_PERDIDOS = "RESET_PERDIDOS";

export function invalidatePerdidos() {
    return {
        type: INVALIDATE_PERDIDOS
    }
}

function requestPerdidos() {
    return {
        type: REQUEST_PERDIDOS,
    }
}

function receivePerdidos(json) {
    return {
        type: RECEIVE_PERDIDOS,
        perdidos: json,
        receivedAt: Date.now()
    }
}

function errorPerdidos(error) {
    return {
        type: ERROR_PERDIDOS,
        error: error,
    }
}

function fetchPerdidos(filtros) {
    return dispatch => {
        dispatch(requestPerdidos());
        return perdidos.getAll(filtros)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    //Refresco token
                    // auth.addToken(response.headers);
                    return data;
                }
            })
            .then(function (data) {
                data = normalizeDatos(data);
                dispatch(receivePerdidos(data));
                //Si se busco por id, lo cargo al update
                if (filtros.id) {
                    dispatch(updatePerdido(data.entities.perdidos[Object.keys(data.entities.perdidos)]));
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPerdidos(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorPerdidos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchPerdidos(state, filtros) {
    const perdidos = state.perdidos.byId;

    if (!perdidos) {
        return true;
    } else if (filtros && filtros.id) {
        return true
    } else if (perdidos.isFetching) {
        return false;
    } else {
        return perdidos.didInvalidate;
    }
}

export function fetchPerdidosIfNeeded(filtros) {
    return (dispatch, getState) => {
        if (shouldFetchPerdidos(getState(), filtros)) {
            return dispatch(fetchPerdidos(filtros))
        }
    }
}

export function resetPerdidos() {
    return {
        type: RESET_PERDIDOS
    }
}

//UPDATE PERDIDO
export const UPDATE_PERDIDO = 'UPDATE_PERDIDO';
export const REQUEST_UPDATE_PERDIDO = "REQUEST_UPDATE_PERDIDO";
export const SUCCESS_UPDATE_PERDIDO = "SUCCESS_UPDATE_PERDIDO";
export const ERROR_UPDATE_PERDIDO = "ERROR_UPDATE_PERDIDO";
export const RESET_UPDATE_PERDIDO = "RESET_UPDATE_PERDIDO";

function requestUpdatePerdido() {
    return {
        type: REQUEST_UPDATE_PERDIDO,
    }
}

function receiveUpdatePerdido() {
    return {
        type: SUCCESS_UPDATE_PERDIDO,
        receivedAt: Date.now()
    }
}

function errorUpdatePerdido(error) {
    return {
        type: ERROR_UPDATE_PERDIDO,
        error: error,
    }
}

export function resetUpdatePerdido() {
    return {
        type: RESET_UPDATE_PERDIDO,
    }
}

export function updatePerdido(perdido, idPerdido) {
    return {
        type: UPDATE_PERDIDO,
        perdido: perdido,
        idPerdido
    }
}

export function saveUpdatePerdido(perdido) {
    return (dispatch, getState) => {
        dispatch(requestUpdatePerdido());
        return perdidos.saveUpdate(perdido)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    dispatch(receiveUpdatePerdido());
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorPerdidos(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorPerdidos(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

//CREATE PERDIDO
export const CREATE_PERDIDO = 'CREATE_PERDIDO';
export const REQUEST_CREATE_PERDIDO = "REQUEST_CREATE_PERDIDO";
export const SUCCESS_CREATE_PERDIDO = "SUCCESS_CREATE_PERDIDO";
export const ERROR_CREATE_PERDIDO = "ERROR_CREATE_PERDIDO";
export const RESET_CREATE_PERDIDO = "RESET_CREATE_PERDIDO";

function requestCreatePerdido() {
    return {
        type: REQUEST_CREATE_PERDIDO,
    }
}

function receiveCreatePerdido(success) {
    return {
        type: SUCCESS_CREATE_PERDIDO,
        success: success,
        receivedAt: Date.now()
    }
}

function errorCreatePerdido(error) {
    return {
        type: ERROR_CREATE_PERDIDO,
        error: error,
    }
}

export function resetCreatePerdido(error) {
    return {
        type: RESET_CREATE_PERDIDO,
        error: error,
    }
}

export function createPerdido(perdido) {
    return {
        type: CREATE_PERDIDO,
        perdido
    }
}

export function saveCreatePerdido() {
    return (dispatch, getState) => {
        dispatch(requestCreatePerdido());
        return perdidos.saveCreate(getState().perdidos.create.nuevo)
            .then(function (response) {
                //Refresco token
                //auth.addToken(response.headers);
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return true;
                }
            })
            .then(function (perdido) {
                dispatch(invalidatePerdidos());
                dispatch(receiveCreatePerdido("Se ha registrado la mascota con éxito, una vez que su publicacón sea revisada será subida a la página"));
                history.push('/animales/perdidos/listar');

            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreatePerdido(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        if (error.responseJSON !== "")
                            dispatch(errorCreatePerdido(error.responseJSON.message));
                        else
                            dispatch(errorCreatePerdido(errorMessages.GENERAL_ERROR));
                        return;
                }
            }
            );
    }
}