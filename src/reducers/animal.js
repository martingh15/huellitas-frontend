import {combineReducers} from "redux";
import merge from "lodash/merge";
import union from "lodash/union";

//Actions
import {LOGOUT_SUCCESS} from "../actions/AuthenticationActions";
import {
    CREATE_ANIMAL,
    ERROR_ANIMALES, ERROR_CREATE_ANIMAL, ERROR_UPDATE_ANIMAL,
    INVALIDATE_ANIMALES,
    RECEIVE_ANIMALES,
    REQUEST_ANIMALES, REQUEST_CREATE_ANIMAL, REQUEST_UPDATE_ANIMAL,
    RESET_ANIMALES, RESET_CREATE_ANIMAL,
    RESET_UPDATE_ANIMAL, SUCCESS_CREATE_ANIMAL, SUCCESS_UPDATE_ANIMAL,
    UPDATE_ANIMAL
} from "../actions/AnimalActions";

function animalesById(state = {
    isFetching: false,
    isFetchingOne: false,
    didInvalidate: true,
    animales: [],
    success: "",
    error: null,
}, action) {
    switch (action.type) {
        //REQUEST ALL
        case INVALIDATE_ANIMALES:
            return Object.assign({}, state, {
                didInvalidate: true,
                success: "",
                error: null
            });
        case REQUEST_ANIMALES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                success: "",
                error: null
            });
        case RECEIVE_ANIMALES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                animales: merge({}, state.animales, action.animales.entities.animales),
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case ERROR_ANIMALES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                success: "",
                error: action.error
            });
        case RESET_ANIMALES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                animales: [],
                success: "",
                error: null
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                animales: [],
                success: "",
                error: null
            });
        default:
            return state
    }
}

function animalesAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_ANIMALES:
            return union(state, action.animales.result);
        case RESET_ANIMALES:
            return [];
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
        case CREATE_ANIMAL:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                nuevo: merge({}, state.nuevo, action.animal),
                error: null,
            });
        case RESET_CREATE_ANIMAL:
            return Object.assign({}, state, {
                isCreating: false,
                success: "",
                error: null,
                nuevo:{},
            });
        case REQUEST_CREATE_ANIMAL:
            return Object.assign({}, state, {
                isCreating: true,
                success: "",
                error: null,
            });
        case SUCCESS_CREATE_ANIMAL:
            return Object.assign({}, state, {
                isCreating: false,
                success: action.message,
                error: null,
            });
        case ERROR_CREATE_ANIMAL:
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
    switch(action.type) {
        case UPDATE_ANIMAL:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: merge({}, state.activo, action.animal),
                success: "",
                error: null,
            });
        case RESET_UPDATE_ANIMAL:
            return Object.assign({}, state, {
                isUpdating: false,
                activo: {},
                success: "",
                error: null
            });
        case REQUEST_UPDATE_ANIMAL:
            return Object.assign({}, state, {
                isUpdating: true,
                success: "",
                error: null,
            });
        case SUCCESS_UPDATE_ANIMAL:
            return Object.assign({}, state, {
                isUpdating: false,
                success: action.success,
                error: null,
            });
        case ERROR_UPDATE_ANIMAL:
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

const animales = combineReducers({
    allIds: animalesAllIds,
    byId: animalesById,
    create: create,
    update: update
});

export default animales;