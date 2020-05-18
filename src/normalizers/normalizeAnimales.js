import { normalize, schema } from 'normalizr';

export function normalizeDato(myData){
    const animal = new schema.Entity('animales',{idAttribute: "id"});

    const mySchema = animal;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData){

    const animales = new schema.Entity('animales', {idAttribute: "id"});

    const mySchemas = [animales] ;

    return normalize(myData, mySchemas);
}


