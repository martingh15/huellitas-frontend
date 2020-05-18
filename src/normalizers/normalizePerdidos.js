import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
    const perdido = new schema.Entity('perdido',{idAttribute: "id"});

    const mySchema = perdido;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const perdidos = new schema.Entity('perdidos', {idAttribute: "id"});

    const mySchemas = [perdidos] ;

    return normalize(myData, mySchemas);
}


