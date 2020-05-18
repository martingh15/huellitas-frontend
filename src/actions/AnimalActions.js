import animales from "../api/animales";
import * as errorMessages  from '../constants/MessageConstants';
import {normalizeDatos, normalizeDato} from "../normalizers/normalizeAnimales";

//Actions
import {logout} from "./AuthenticationActions";

//ANIMALES
export const REQUEST_ANIMALES = 'REQUEST_ANIMALES';
export const RECEIVE_ANIMALES = 'RECEIVE_ANIMALES';
export const INVALIDATE_ANIMALES = 'INVALIDATE_ANIMALES';
export const RESET_ANIMALES= "RESET_ANIMALES";
export const ERROR_ANIMALES= "ERROR_ANIMALES";

export function invalidateAnimales() {
    return {
        type: INVALIDATE_ANIMALES
    }
}

function requestAnimales() {
    return {
        type: REQUEST_ANIMALES,
    }
}

function resetAnimales() {
    return {
        type: RESET_ANIMALES,
    }
}

function receiveAnimales(json) {
    return {
        type: RECEIVE_ANIMALES,
        animales: json,
        receivedAt: Date.now()
    }
}

function errorAnimales(error) {
    return {
        type: ERROR_ANIMALES,
        error: error,
    }
}

function fetchAnimales() {
    return dispatch => {
        dispatch(requestAnimales());
        return animales.getAll()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                }
                else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                let normalizedData = normalizeDatos(data);
                dispatch(receiveAnimales(normalizedData));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorAnimales(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorAnimales(error.message));
                                else
                                    dispatch(errorAnimales(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorAnimales(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

function shouldFetchAnimales(state) {
    const animales = state.animales.byId;
    if (!animales) {
        return true
    } else if (animales.isFetching) {
        return false
    } else {
        return animales.didInvalidate;
    }
}

export function fetchAnimalesIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchAnimales(getState())) {
            return dispatch(fetchAnimales())
        }
    }
}

//ANIMAL REQUEST
export const REQUEST_ANIMAL = 'REQUEST_ANIMAL';
export const RECEIVE_ANIMAL = 'RECEIVE_ANIMAL';
export const INVALIDATE_ANIMAL = 'INVALIDATE_ANIMAL';
export const ERROR_ANIMAL = "ERROR_ANIMAL";

export function invalidateAnimal() {
    return {
        type: INVALIDATE_ANIMAL,
    }
}

function requestAnimal() {
    return {
        type: REQUEST_ANIMAL,
    }
}

function receiveAnimal(json) {
    return {
        type: RECEIVE_ANIMAL,
        animal: normalizeDato(json),
        receivedAt: Date.now()
    }
}

function errorAnimal(error) {
    return {
        type: ERROR_ANIMAL,
        error: error,
    }
}

export function fetchAnimal(id) {
    return (dispatch) => {
        dispatch(requestAnimal());
        return animales.getOne(id)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                } else {
                    var data = response.json();
                    return data;
                }
            })
            .then(function (data) {
                dispatch(receiveAnimal(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorAnimal(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorAnimal(error.message));
                                else
                                    dispatch(errorAnimal(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorAnimal(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}

//todo verificar que no este en allIds y byId
function shouldFetchAnimal(state, id) {
    const animales = state.animales.byId;
    if (!animales) {
        return true
    } else if (!animales.animales[id]) {
        return true
    } else if(animales.isFetchingAnimal) {
        return false
    } else {
        return animales.didInvalidate;
    }
}

export function fetchAnimalIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchAnimal(getState(), id)) {
            return dispatch(fetchAnimal(id))
        }
    }
}

//CREATE ANIMAL
export const CREATE_ANIMAL = 'CREATE_ANIMAL';
export const REQUEST_CREATE_ANIMAL = "REQUEST_CREATE_ANIMAL";
export const SUCCESS_CREATE_ANIMAL = "SUCCESS_CREATE_ANIMAL";
export const ERROR_CREATE_ANIMAL = "ERROR_CREATE_ANIMAL";
export const RESET_CREATE_ANIMAL = "RESET_CREATE_ANIMAL";

function requestCreateAnimal() {
    return {
        type: REQUEST_CREATE_ANIMAL,
    }
}

function receiveCreateAnimal(success) {
    return {
        type: SUCCESS_CREATE_ANIMAL,
        success: success,
        receivedAt: Date.now()
    }
}

function errorCreateAnimal(error) {
    return {
        type: ERROR_CREATE_ANIMAL,
        error: error,
    }
}

export function resetCreateAnimal(error) {
    return {
        type: RESET_CREATE_ANIMAL,
        error: error,
    }
}

export function createAnimal(animal) {
    return {
        type: CREATE_ANIMAL,
        animal
    }
}

export function saveCreateAnimal() {
    return (dispatch, getState) => {
        dispatch(requestCreateAnimal());
        return animales.saveCreate(getState().animales.create.nuevo)
            .then(function (response) {
                //Refresco token
                //auth.addToken(response.headers);
                if (response.status >= 400) {
                    return Promise.reject(response);
                }
                else {
                    return response.json();
                }
            })
            .then(function (animal) {
                dispatch(receiveCreateAnimal("¡Se ha registrado la mascota con éxito!"));
            })
            .catch(function (error) {
                    switch (error.status) {
                        case 401:
                            dispatch(errorCreateAnimal(errorMessages.UNAUTHORIZED_TOKEN));
                            dispatch(logout());
                            return;
                        default:
                            error.json()
                                .then((error) => {
                                    if (error.message !== "")
                                        dispatch(errorCreateAnimal(error.message));
                                    else
                                        dispatch(errorCreateAnimal(errorMessages.GENERAL_ERROR));
                                })
                                .catch((error) => {
                                    dispatch(errorCreateAnimal(errorMessages.GENERAL_ERROR));
                                });
                            return;
                    }
                }
            );
    }
}

//UPDATE ANIMALES
export const UPDATE_ANIMAL = 'UPDATE_ANIMAL';
export const REQUEST_UPDATE_ANIMAL = "REQUEST_UPDATE_ANIMAL";
export const SUCCESS_UPDATE_ANIMAL = "SUCCESS_UPDATE_ANIMAL";
export const ERROR_UPDATE_ANIMAL = "ERROR_UPDATE_ANIMAL";
export const RESET_UPDATE_ANIMAL = "RESET_UPDATE_ANIMAL";

function requestUpdateAnimal() {
    return {
        type: REQUEST_UPDATE_ANIMAL,
    }
}

function receiveUpdateAnimal(success) {
    return {
        type: SUCCESS_UPDATE_ANIMAL,
        success: success,
        receivedAt: Date.now()
    }
}

function errorUpdateAnimal(error) {
    return {
        type: ERROR_UPDATE_ANIMAL,
        error: error,
    }
}

export function resetUpdateAnimal() {
    return {
        type: RESET_UPDATE_ANIMAL,
    }
}

export function updateAnimal(animal, idAnimal) {
    return {
        type: UPDATE_ANIMAL,
        animal: animal,
        idAnimal
    }
}

export function saveUpdateAnimal(animal) {
    return (dispatch, getState) => {
        dispatch(requestUpdateAnimal());
        dispatch(updateAnimal(animal, animal.id));
        return animales.saveUpdate(animal)
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                }
                else {
                    dispatch(receiveUpdateAnimal("Se ha actualizado la mascota con éxito"));
                }
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorUpdateAnimal(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        error.json()
                            .then(error => {
                                if (error.message !== "")
                                    dispatch(errorUpdateAnimal(error.message));
                                else
                                    dispatch(errorUpdateAnimal(errorMessages.GENERAL_ERROR));
                            })
                            .catch(error => {
                                dispatch(errorUpdateAnimal(errorMessages.GENERAL_ERROR));
                            });
                        return;
                }
            });
    }
}
