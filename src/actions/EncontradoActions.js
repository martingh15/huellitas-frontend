import encontrados from "../api/encontrados";
import { normalizeDatos } from "../normalizers/normalizeEncontrados";
import * as errorMessages from '../constants/MessageConstants';

//Actioms
import { logout } from "./AuthenticationActions";

//Librerias
import history from "../history";

//ENCONTRADOS
export const REQUEST_ENCONTRADOS = 'REQUEST_ENCONTRADOS';
export const RECEIVE_ENCONTRADOS = 'RECEIVE_ENCONTRADOS';
export const INVALIDATE_ENCONTRADOS = 'INVALIDATE_ENCONTRADOS';
export const ERROR_ENCONTRADOS = "ERROR_ENCONTRADOS";
export const RESET_ENCONTRADOS = "RESET_ENCONTRADOS";

export function invalidateEncontrados() {
    return {
        type: INVALIDATE_ENCONTRADOS
    }
}

function requestEncontrados() {
    return {
        type: REQUEST_ENCONTRADOS,
    }
}

function receiveEncontrados(json) {
    return {
        type: RECEIVE_ENCONTRADOS,
        encontrados: json,
        receivedAt: Date.now()
    }
}

function errorEncontrados(error) {
    return {
        type: ERROR_ENCONTRADOS,
        error: error,
    }
}

function fetchEncontrados(filtros) {
    return dispatch => {
        dispatch(requestEncontrados());
        return encontrados.getAll(filtros)
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
                dispatch(receiveEncontrados(data));
                //Si se busco por id, lo cargo al update
                if (filtros.id)
                    dispatch(updateEncontrado(data.entities.encontrados[Object.keys(data.entities.encontrados)]));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorEncontrados(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorEncontrados(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchEncontrados(state, filtros) {
    const encontrados = state.encontrados.byId;

    if (!encontrados) {
        return true;
    } else if (filtros && filtros.id) {
        return true
    } else if (encontrados.isFetching) {
        return false;
    } else {
        return encontrados.didInvalidate;
    }
}

export function fetchEncontradosIfNeeded(filtros) {
    return (dispatch, getState) => {
        if (shouldFetchEncontrados(getState(), filtros)) {
            return dispatch(fetchEncontrados(filtros))
        }
    }
}

export function resetEncontrados() {
    return {
        type: RESET_ENCONTRADOS
    }
}

//UPDATE ENCONTRADO
export const UPDATE_ENCONTRADO = 'UPDATE_ENCONTRADO';
export const REQUEST_UPDATE_ENCONTRADO = "REQUEST_UPDATE_ENCONTRADO";
export const SUCCESS_UPDATE_ENCONTRADO = "SUCCESS_UPDATE_ENCONTRADO";
export const ERROR_UPDATE_ENCONTRADO = "ERROR_UPDATE_ENCONTRADO";
export const RESET_UPDATE_ENCONTRADO = "RESET_UPDATE_ENCONTRADO";

function requestUpdateEncontrado() {
    return {
        type: REQUEST_UPDATE_ENCONTRADO,
    }
}

function receiveUpdateEncontrado() {
    return {
        type: SUCCESS_UPDATE_ENCONTRADO,
        receivedAt: Date.now()
    }
}

function errorUpdateEncontrado(error) {
    return {
        type: ERROR_UPDATE_ENCONTRADO,
        error: error,
    }
}

export function resetUpdateEncontrado() {
    return {
        type: RESET_UPDATE_ENCONTRADO,
    }
}

export function updateEncontrado(encontrado, idEncontrado) {
    return {
        type: UPDATE_ENCONTRADO,
        encontrado: encontrado,
        idEncontrado
    }
}

export function saveUpdateEncontrado(encontrado) {
    return (dispatch, getState) => {
        dispatch(requestUpdateEncontrado());
        dispatch(updateEncontrado(encontrado, encontrado.id));
        return encontrados.saveUpdate(encontrado)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    dispatch(receiveUpdateEncontrado());
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateEncontrado(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorUpdateEncontrado(error.message));
                                else
                                    dispatch(errorUpdateEncontrado(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorUpdateEncontrado(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//CREATE ENCONTRADO
export const CREATE_ENCONTRADO = 'CREATE_ENCONTRADO';
export const REQUEST_CREATE_ENCONTRADO = "REQUEST_CREATE_ENCONTRADO";
export const SUCCESS_CREATE_ENCONTRADO = "SUCCESS_CREATE_ENCONTRADO";
export const ERROR_CREATE_ENCONTRADO = "ERROR_CREATE_ENCONTRADO";
export const RESET_CREATE_ENCONTRADO = "RESET_CREATE_ENCONTRADO";

function requestCreateEncontrado() {
    return {
        type: REQUEST_CREATE_ENCONTRADO,
    }
}

function receiveCreateEncontrado(success) {
    return {
        type: SUCCESS_CREATE_ENCONTRADO,
        success: success,
        receivedAt: Date.now()
    }
}

function errorCreateEncontrado(error) {
    return {
        type: ERROR_CREATE_ENCONTRADO,
        error: error,
    }
}

export function resetCreateEncontrado(error) {
    return {
        type: RESET_CREATE_ENCONTRADO,
        error: error,
    }
}

export function createEncontrado(encontrado) {
    return {
        type: CREATE_ENCONTRADO,
        encontrado
    }
}

export function saveCreateEncontrado() {
    return (dispatch, getState) => {
        dispatch(requestCreateEncontrado());
        return encontrados.saveCreate(getState().encontrados.create.nuevo)
            .then(function (response) {
                //Refresco token
                //auth.addToken(response.headers);
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    return true;
                }
            })
            .then(function (encontrado) {
                dispatch(invalidateEncontrados());
                dispatch(receiveCreateEncontrado("Se ha registrado la mascota con éxito, una vez que su publicacón sea revisada será subida a la página"));
                history.push('/encontrados/listar');

            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorCreateEncontrado(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        if (error.responseJSON !== "")
                            dispatch(errorCreateEncontrado(error.responseJSON.message));
                        else
                            dispatch(errorCreateEncontrado(errorMessages.GENERAL_ERROR));
                        return;
                }
            }
            );
    }
}