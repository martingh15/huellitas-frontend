import { normalize, schema } from 'normalizr';

export function normalizeDato(myData) {
    const encontrado = new schema.Entity('encontrado', { idAttribute: "id" });

    const mySchema = encontrado;

    return normalize(myData, mySchema);
}

export function normalizeDatos(myData) {

    const encontrados = new schema.Entity('encontrados', { idAttribute: "id" });

    const mySchemas = [encontrados];

    return normalize(myData, mySchemas);
}


