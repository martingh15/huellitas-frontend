import zonas from "../api/zonas";
import normalizeDatos from "../normalizers/normalizeZonas";
import * as errorMessages from '../constants/MessageConstants';

//Actioms
import {logout} from "./AuthenticationActions";

//ZONAS
export const REQUEST_ZONAS = 'REQUEST_ZONAS';
export const RECEIVE_ZONAS = 'RECEIVE_ZONAS';
export const INVALIDATE_ZONAS = 'INVALIDATE_ZONAS';
export const ERROR_ZONAS = "ERROR_ZONAS";
export const RESET_ZONAS = "RESET_ZONAS";

export function invalidateZonas() {
    return {
        type: INVALIDATE_ZONAS
    }
}

function requestZonas() {
    return {
        type: REQUEST_ZONAS,
    }
}

function receiveZonas(json) {
    return {
        type: RECEIVE_ZONAS,
        zonas: json,
        receivedAt: Date.now()
    }
}

function errorZonas(error) {
    return {
        type: ERROR_ZONAS,
        error: error,
    }
}

function fetchZonas() {
    return dispatch => {
        dispatch(requestZonas());
        return zonas.getAll()
            .then(function (response) {
                if (response.status >= 400) {
                    return Promise.reject(response);
                }
                else {
                    var data = response.json();
                    //Refresco token
                    // auth.addToken(response.headers);
                    return data;
                }
            })
            .then(function (data) {
                data = normalizeDatos(data);
                dispatch(receiveZonas(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorZonas(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorZonas(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchZonas(state) {
    const zonas = state.zonas.byId;
    if (!zonas) {
        return true;
    } else if (zonas.isFetching) {
        return false;
    } else {
        return zonas.didInvalidate;
    }
}

export function fetchZonasIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchZonas(getState(), )) {
            return dispatch(fetchZonas())
        }
    }
}

export function resetZonas() {
    return {
        type: RESET_ZONAS
    }
}