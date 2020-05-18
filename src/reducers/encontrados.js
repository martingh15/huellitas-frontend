import { combineReducers } from "redux";
import merge from "lodash/merge";
import union from "lodash/union";

//Actions
import { LOGOUT_SUCCESS } from "../actions/AuthenticationActions";
import {
    CREATE_ENCONTRADO,
    ERROR_CREATE_ENCONTRADO,
    ERROR_ENCONTRADOS, ERROR_UPDATE_ENCONTRADO,
    INVALIDATE_ENCONTRADOS,
    RECEIVE_ENCONTRADOS, REQUEST_CREATE_ENCONTRADO,
    REQUEST_ENCONTRADOS, REQUEST_UPDATE_ENCONTRADO, RESET_CREATE_ENCONTRADO,
    RESET_ENCONTRADOS,
    RESET_UPDATE_ENCONTRADO, SUCCESS_CREATE_ENCONTRADO, SUCCESS_UPDATE_ENCONTRADO,
    UPDATE_ENCONTRADO
} from "../actions/EncontradoActions";

function encontradosById(state = {
    isFetching: false,
    isFetchingOne: false,
    didInvalidate: true,
    encontrados: [],
    success: "",
    error: null,
}, action) {
    switch (action.type) {
        //REQUEST ALL
        case INVALIDATE_ENCONTRADOS:
            return Object.assign({}, state, {
                didInvalidate: true,
                success: "",
                error: null
            });
        case REQUEST_ENCONTRADOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                success: "",
                error: null
            });
        case RECEIVE_ENCONTRADOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                encontrados: merge({}, state.encontrados, action.encontrados.entities.encontrados),
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case ERROR_ENCONTRADOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                success: "",
                error: action.error
            });
        case RESET_ENCONTRADOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                encontrados: [],
                success: "",
                error: null
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                encontrados: [],
                success: "",
                error: null
            });
        default:
            return state
    }
}

function encontradosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_ENCONTRADOS:
            return union(state, action.encontrados.result);
        case RESET_ENCONTRADOS:
            return [];
        default:
            return state
    }
}

function create(state = {
    isCreating: false,
    nuevo: {
        fecha: "",
        mascota: {
            nombre: "",
            imagenPrincipal: "",
            idZona: "",
            sexo: "",
            castrado: "",
            tamanio: "",
            edadAproximada: "",
            rangoEdad: 0,
            tipo: 'perro'
        }
    },
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case CREATE_ENCONTRADO:
            if (action.encontrado.mascota && action.encontrado.mascota.tamanio) {
                state.nuevo.mascota.tamanio = [];
            }
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.encontrado),
                error: null,
            });
        case RESET_CREATE_ENCONTRADO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo: {},
            });
        case REQUEST_CREATE_ENCONTRADO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case SUCCESS_CREATE_ENCONTRADO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.success,
                error: null,
            });
        case ERROR_CREATE_ENCONTRADO:
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
        case UPDATE_ENCONTRADO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.encontrado),
                success: "",
                error: null,
            });
        case RESET_UPDATE_ENCONTRADO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                success: "",
                error: null
            });
        case REQUEST_UPDATE_ENCONTRADO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case SUCCESS_UPDATE_ENCONTRADO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_ENCONTRADO:
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

const encontrados = combineReducers({
    allIds: encontradosAllIds,
    byId: encontradosById,
    create: create,
    update: update
});

export default encontrados;