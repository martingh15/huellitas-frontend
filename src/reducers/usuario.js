import {combineReducers} from 'redux';
import merge from "lodash/merge";
// import union from "lodash/union";

//Actions
import {
    CREATE_USUARIO,
    RESET_CREATE_USUARIO,
    REQUEST_CREATE_USUARIO,
    RECEIVE_CREATE_USUARIO,
    ERROR_CREATE_USUARIO,
    UPDATE_USUARIO,
    RESET_UPDATE_USUARIO,
    REQUEST_UPDATE_USUARIO,
    RECEIVE_UPDATE_USUARIO,
    ERROR_UPDATE_USUARIO,
    INVALIDATE_USUARIO_LOGUEADO,
    REQUEST_USUARIO_LOGUEADO,
    ERROR_USUARIO_LOGUEADO,
    RECEIVE_USUARIO_LOGUEADO, RESET_USUARIO_LOGUEADO

} from '../actions/UsuarioActions';
import {LOGOUT_SUCCESS} from "../actions/AuthenticationActions";

function usuariosById(state = {
    isFetching: false,
    didInvalidate: true,
    usuarios: [],
    error: null,
    success: "",
}, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                usuarios: [],
            });
        default:
            return state
    }
}


function create(state = {
    isCreating: false,
    nuevo: {},
    success: "",
    error: null
}, action) {
    switch (action.type) {
        //REGISTRO
        case CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.usuario),
                error: null,
            });
        case RESET_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo:{},
            });
        case REQUEST_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case RECEIVE_CREATE_USUARIO:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
            });
        case ERROR_CREATE_USUARIO:
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
    isFetchingUsuarioLogueado: false,
    isUpdating: false,
    activo: {},
    success: "",
    error: null
}, action) {
    switch (action.type) {
        case UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.usuario),
                success: "",
                error: null,
            });
        case RESET_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                success: "",
                error: null,
            });
        case REQUEST_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case RECEIVE_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_USUARIO:
            return Object.assign({}, state, {
                isUpdating: false,
                success: "",
                error: action.error
            });
        //USUARIO LOGUEADO
        case INVALIDATE_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                error: null,
                success: "",
            });
        case REQUEST_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: true,
                success: "",
                error: null,
            });
        case ERROR_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: false,
                success: "",
                error: action.error,
            });
        case RECEIVE_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: false,
                activo: action.usuario ? action.usuario.entities.usuarios[action.usuario.result] : {},
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case RESET_USUARIO_LOGUEADO:
            return Object.assign({}, state, {
                isFetchingUsuarioLogueado: false,
                didInvalidate: true,
                activo: {}
            });
        default:
            return state
    }
}

function usuariosAllIds(state = [], action) {
    switch (action.type) {
        // case RECEIVE_USUARIOS:
        //     return union(state, action.usuarios.result);
        // case RESET_USUARIOS:
        //     return [];
        default:
            return state
    }
}


const usuarios = combineReducers({
    allIds: usuariosAllIds,
    byId: usuariosById,
    create: create,
    update: update
});

export default usuarios;