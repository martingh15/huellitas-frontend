import { combineReducers } from "redux";
import merge from "lodash/merge";
import union from "lodash/union";

//Actions
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions";
import {
    CREATE_PERDIDO,
    ERROR_CREATE_PERDIDO,
    ERROR_PERDIDOS, ERROR_UPDATE_PERDIDO,
    INVALIDATE_PERDIDOS,
    RECEIVE_PERDIDOS, REQUEST_CREATE_PERDIDO,
    REQUEST_PERDIDOS, REQUEST_UPDATE_PERDIDO, RESET_CREATE_PERDIDO,
    RESET_PERDIDOS,
    RESET_UPDATE_PERDIDO, SUCCESS_CREATE_PERDIDO, SUCCESS_UPDATE_PERDIDO,
    UPDATE_PERDIDO
} from "../actions/PerdidoActions";

function perdidosById(state = {
    isFetching: false,
    isFetchingOne: false,
    didInvalidate: true,
    perdidos: [],
    success: "",
    error: null,
}, action) {
    switch (action.type) {
        //REQUEST ALL
        case INVALIDATE_PERDIDOS:
            return Object.assign({}, state, {
                didInvalidate: true,
                success: "",
                error: null
            });
        case REQUEST_PERDIDOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                success: "",
                error: null
            });
        case RECEIVE_PERDIDOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                perdidos: merge({}, state.perdidos, action.perdidos.entities.perdidos),
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case ERROR_PERDIDOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                success: "",
                error: action.error
            });
        case RESET_PERDIDOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                perdidos: [],
                success: "",
                error: null
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                perdidos: [],
                success: "",
                error: null
            });
        default:
            return state
    }
}

function perdidosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_PERDIDOS:
            return union(state, action.perdidos.result);
        case RESET_PERDIDOS:
            return [];
        default:
            return state
    }
}

function create(state = {
    isCreating: false,
    nuevo: {
        fecha: "",
        animal: {
            nombre: "",
            imagenPrincipal: "",
            idZona: "",
            sexo: "",
            castrado: "",
            tamanio: "",
            edadAproximada: "",
            tipo: 'perro'
        }
    },
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case CREATE_PERDIDO:
            if (action.perdido.mascota && action.perdido.mascota.tamanio) {
                state.nuevo.mascota.tamanio = [];
            }
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.perdido),
                error: null,
            });
        case RESET_CREATE_PERDIDO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo: {},
            });
        case REQUEST_CREATE_PERDIDO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case SUCCESS_CREATE_PERDIDO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.success,
                error: null,
            });
        case ERROR_CREATE_PERDIDO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: action.error
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: "",
                nuevo: {}
            });
        default:
            return state
    }
}

function update(state = {
    isUpdating: false,
    activo: {},
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case UPDATE_PERDIDO:
            if (action.perdido && action.perdido.fecha && action.perdido.fecha.length > 10) {
                action.perdido.fecha = action.perdido.fecha.substring(0,10);
            }
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.perdido),
                success: "",
                error: null,
            });
        case RESET_UPDATE_PERDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                success: "",
                error: null
            });
        case REQUEST_UPDATE_PERDIDO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case SUCCESS_UPDATE_PERDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_PERDIDO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                success: "",
                error: null
            });
        default:
            return state
    }
}

const perdidos = combineReducers({
    allIds: perdidosAllIds,
    byId: perdidosById,
    create: create,
    update: update
});

export default perdidos;