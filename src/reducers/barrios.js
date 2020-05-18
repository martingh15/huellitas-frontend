import {combineReducers} from "redux";
import merge from "lodash/merge";
import union from "lodash/union";

//Actions
import {LOGOUT_SUCCESS} from "../actions/AuthenticationActions";
import {
    ERROR_BARRIOS,
    INVALIDATE_BARRIOS,
    RECEIVE_BARRIOS,
    REQUEST_BARRIOS,
    RESET_BARRIOS,

} from "../actions/BarrioActions";

function barriosById(state = {
    isFetching: false,
    isFetchingOne: false,
    didInvalidate: true,
    barrios: [],
    success: "",
    error: null,
}, action) {
    switch (action.type) {
        //REQUEST ALL
        case INVALIDATE_BARRIOS:
            return Object.assign({}, state, {
                didInvalidate: true,
                success: "",
                error: null
            });
        case REQUEST_BARRIOS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                success: "",
                error: null
            });
        case RECEIVE_BARRIOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                barrios: merge({}, state.barrios, action.barrios.entities.barrios),
                lastUpdated: action.receivedAt,
                success: action.message,
                error: null
            });
        case ERROR_BARRIOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                success: "",
                error: action.error
            });
        case RESET_BARRIOS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                barrios: [],
                success: "",
                error: null
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: true,
                barrios: [],
                success: "",
                error: null
            });
        default:
            return state
    }
}

function barriosAllIds(state = [], action) {
    switch (action.type) {
        case RECEIVE_BARRIOS:
            return union(state, action.barrios.result);
        case RESET_BARRIOS:
            return [];
        default:
            return state
    }
}

const barrios = combineReducers({
    allIds: barriosAllIds,
    byId: barriosById
});

export default barrios;