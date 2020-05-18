import { combineReducers } from 'redux'
import authentication from "./authentication";
import usuarios from './usuario';
import animales from './animal';
import perdidos from "./perdidos";
import encontrados from "./encontrados";
import barrios from "./barrios";
import zonas from "./zonas";

const appReducers = combineReducers({
    authentication,
    usuarios,
    animales,
    perdidos,
    encontrados,
    barrios,
    zonas
});

export default appReducers;