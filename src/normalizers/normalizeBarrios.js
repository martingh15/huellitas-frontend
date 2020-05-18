import { normalize, schema } from 'normalizr';

export default function normalizeDatos(myData){

    const barrios = new schema.Entity('barrios', {idAttribute: "id"});

    const mySchemas = [barrios] ;

    return normalize(myData, mySchemas);
}


