import { normalize, schema } from 'normalizr';

export default function normalizeDatos(myData){

    const zonas = new schema.Entity('zonas', {idAttribute: "id"});

    const mySchemas = [zonas] ;

    return normalize(myData, mySchemas);
}


