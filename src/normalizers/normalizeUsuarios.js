import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
    const usuario = new schema.Entity('usuarios',{idAttribute: "id"});

    const mySchema = usuario ;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const usuarios = new schema.Entity('usuarios', {idAttribute: "id"});

    const mySchemas = [usuarios] ;

    return normalize(myData, mySchemas);
}


