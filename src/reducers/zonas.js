import {combineReducers} from "redux";
import merge from "lodash/merge";
import union from "lodash/union";

//Actions
import {LOGOUT_SUCCESS} from "../actions/AuthenticationActions";
import {
    ERROR_ZONAS,
    INVALIDATE_ZONAS,
    RECEIVE_ZONAS,
    REQUEST_ZONAS,
    RESET_ZONAS,

} from "../actions/ZonaActions";

function zonasById(state = {
    isFetching: false,
    isFetchingOne: false,
    didInvalidate: true,
    zonas: [],
    success: "",
    error: null,
}, action) {
    switch (action.type) {
        //REQUEST ALL
        case INVALIDATE_ZONAS:
            return Object.assign({}, state, {
                didInvalidate: true,
                success: "",
                error: null
            });
        case REQUEST_ZONAS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                success: "",
                error: null
            });
        case RECEIVE_ZONAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                zonas: merge({}, state.zonas, action.zonas.entities.zonas),
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case ERROR_ZONAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                success: "",
                error: action.error
            });
        case RESET_ZONAS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                zonas: [],
                success: "",
                error: null
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                zonas: [],
                success: "",
                error: null
            });
        default:
            return state
    }
}

function zonasAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_ZONAS:
            return union(state, action.zonas.result);
        case RESET_ZONAS:
            return [];
        default:
            return state
    }
}

const zonas = combineReducers({
    allIds: zonasAllIds,
    byId: zonasById
});

export default zonas;