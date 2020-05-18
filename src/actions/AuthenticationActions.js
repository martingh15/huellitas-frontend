import auth from "../api/authentication"
import * as errorMessages from '../constants/MessageConstants';
import history from '../history';
import jwt_decode from 'jwt-decode';

import {fetchUsuarioLogueado, resetUsuarioLogueado} from "./UsuarioActions";

//LOGIN
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const ERROR_LOGIN = "ERROR_LOGIN";
export const CHANGE_LOGIN = "CHANGE_LOGIN";
export const CHANGE_USER = "CHANGE_USER";
export const RESET_LOGIN = 'RESET_LOGIN';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';

export function login(usuario, to) {
    return (dispatch) => {
        console.log("login");
        dispatch(sendingRequest(true));
        // If no username or password was specified, throw a field-missing error
        if (anyElementsEmpty(usuario)) {
            dispatch(errorLogin("Completa los campos"));
            dispatch(sendingRequest(false));
            return;
        }
        auth.login(usuario, (success, error) => {
            // When the request is finished, hide the loading indicator
            //dispatch(sendingRequest(false));
            if (success === true) {
                dispatch(receiveLogin(success, ""));
                //guardo usuarios logueado
                var datos = jwt_decode(localStorage.token);
                dispatch(changeUser(datos.idUsuario, datos.nombre));
                dispatch(fetchUsuarioLogueado());
                if (to && to.pathname)
                    history.push(to.pathname);
                else
                    history.push("/");
                dispatch(changeLogin({
                    email: "",
                    password: ""
                }));
            } else {
                switch (error.status) {
                    case 401:
                        dispatch(errorLogin(errorMessages.UNAUTHORIZED_TOKEN));
                        return;
                    default:
                        try {
                            error.json()
                                .then((error) => {
                                    if (error.message !=="")
                                        dispatch(errorLogin(error.message));
                                    else
                                        dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                })
                                .catch((error) => {
                                    dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                        }
                        return;
                }
            }
            // });
        });
    }
}

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: true,
    };
}

export function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false,
    };
}

export function logout() {
    return (dispatch) => {
        dispatch(requestLogout());
        dispatch(resetUsuarioLogueado());
        localStorage.removeItem('token');
        document.cookie = 'id_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        history.push("/login");
        dispatch(receiveLogout());
        //Recargar pantalla?
        // window.location.reload;
    };
}


export function sendingRequest(sending, mensaje) {
    return {type: REQUEST_LOGIN, sending, mensaje};
}

//Cuando el usuarios se loguea
export function changeLogin(usuario) {
    return {type: CHANGE_LOGIN, usuario: usuario};
}

//Cuando se loguea solo recibo el token del servido
export function receiveLogin(token, message) {
    return {type: RECEIVE_LOGIN, token, message};
}

//Con el token cargo los datos en el store
export function changeUser(id, nombre) {
    return {type: CHANGE_USER, id: id, nombre: nombre};
}

export function resetLogin() {
    return {
        type: RESET_LOGIN
    }
}

export function errorLogin(error) {
    return {
        type: ERROR_LOGIN,
        error: error,
    }
}

function anyElementsEmpty(elements) {
    for (let element in elements) {
        if (!elements[element]) {
            return true;
        }
    }
    return false;
}

export function olvideMiPassword(usuario) {
    return (dispatch) => {
        console.log("login");
        dispatch(sendingRequest(true, ""));
        // If no username or password was specified, throw a field-missing error
        if (usuario === "") {
            dispatch(sendingRequest(false));
            dispatch(errorLogin("Debe ingresar su email para iniciar el proceso de recuperación."));
            return;
        }
        auth.olvideMiPassword(usuario, (success, error) => {
            // When the request is finished, hide the loading indicator
            if (success === true) {
                dispatch(sendingRequest(false, "Se ha enviado un link a su email para reiniciar su contraseña. Tiene 24 horas para cambiarla."));
            } else {
                switch (error.status) {
                    case 401:
                        dispatch(errorLogin(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        try {
                            error.json()
                                .then((error) => {
                                    if (error.message !=="")
                                        dispatch(errorLogin(error.message));
                                    else
                                        dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                })
                                .catch((error) => {
                                    dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                        }
                        return;
                }
            }
            // });
        });
    }
}

export function resetPassword(usuario) {
    return (dispatch) => {
        dispatch(sendingRequest(true));
        auth.resetPassword(usuario, (success, error) => {
            if (success === true) {
                dispatch(sendingRequest(false, "La contraseña fue cambiada con éxito, intente ingresar nuevamente."));
                history.replace('/login', null);
            } else {
                switch (error.status) {
                    case 401:
                        dispatch(errorLogin(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        try {
                            error.json()
                                .then((error) => {
                                    if (error.message !=="")
                                        dispatch(errorLogin(error.message));
                                    else
                                        dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                })
                                .catch((error) => {
                                    dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                        }
                        return;
                }
            }
            // });
        });
    }
}

export function validarToken(tipoToken, token) {
    return (dispatch) => {
        dispatch(sendingRequest(true, ""));
        auth.validarToken(tipoToken, token, (success, respuesta) => {
            if (success === true) {
                if (tipoToken === 'reset') {
                    dispatch(sendingRequest(false, ""));
                } else if (respuesta) {
                    respuesta.json()
                        .then((data) => {
                            localStorage.token = data.token;
                            var datos = jwt_decode(data.token);
                            dispatch(changeUser(datos.idUsuario, datos.nombre));
                        })
                        .then(() => {
                            dispatch(fetchUsuarioLogueado());
                            dispatch(sendingRequest(false, "¡Bienvenido! Se ha confirmado su email con éxito."));
                            dispatch(receiveLogin(true, ""));
                        })
                        .then(() => {
                            history.push("/");
                        })
                } else {
                    history.push("/");
                }

            } else {
                switch (respuesta.status) {
                    case 401:
                        dispatch(errorLogin(errorMessages.UNAUTHORIZED_TOKEN));
                        dispatch(logout());
                        return;
                    default:
                        try {
                            respuesta.json()
                                .then((error) => {
                                    if (error.message !=="")
                                        dispatch(errorLogin(error.message));
                                    else
                                        dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                })
                                .catch((error) => {
                                    dispatch(errorLogin(errorMessages.GENERAL_ERROR));
                                });
                        } catch (e) {
                        }
                        return;
                }
            }
            // });
        });
    }
}