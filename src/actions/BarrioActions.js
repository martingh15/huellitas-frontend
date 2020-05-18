import barrios from "../api/barrios";
import normalizeDatos from "../normalizers/normalizeBarrios";
import * as errorMessages from '../constants/MessageConstants';

//Actioms
import {logout} from "./AuthenticationActions";

//BARRIOS
export const REQUEST_BARRIOS = 'REQUEST_BARRIOS';
export const RECEIVE_BARRIOS = 'RECEIVE_BARRIOS';
export const INVALIDATE_BARRIOS = 'INVALIDATE_BARRIOS';
export const ERROR_BARRIOS = "ERROR_BARRIOS";
export const RESET_BARRIOS = "RESET_BARRIOS";

export function invalidateBarrios() {
    return {
        type: INVALIDATE_BARRIOS
    }
}

function requestBarrios() {
    return {
        type: REQUEST_BARRIOS,
    }
}

function receiveBarrios(json) {
    return {
        type: RECEIVE_BARRIOS,
        barrios: json,
        receivedAt: Date.now()
    }
}

function errorBarrios(error) {
    return {
        type: ERROR_BARRIOS,
        error: error,
    }
}

function fetchBarrios() {
    return dispatch => {
        dispatch(requestBarrios());
        return barrios.getAll()
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
                dispatch(receiveBarrios(data));
            })
            .catch(function (error) {
                switch (error.status) {
                    case 401:
                        dispatch(errorBarrios(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        dispatch(errorBarrios(errorMessages.GENERAL_ERROR));
                        return;
                }
            });
    }
}

function shouldFetchBarrios(state) {
    const barrios = state.barrios.byId;
    if (!barrios) {
        return true;
    } else if (barrios.isFetching) {
        return false;
    } else {
        return barrios.didInvalidate;
    }
}

export function fetchBarriosIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchBarrios(getState(), )) {
            return dispatch(fetchBarrios())
        }
    }
}

export function resetBarrios() {
    return {
        type: RESET_BARRIOS
    }
}