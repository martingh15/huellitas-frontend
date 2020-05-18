/**
 * Created by martingh15 on 21/04/2020.
 */

//localhost
let BASE_URL = "";
let BASE_PUBLIC = "";
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_ENVI) {
    BASE_URL = "http://localhost:8888/api";
    BASE_PUBLIC = "http://localhost:8888/";
}


//testing
if (process.env.REACT_APP_ENVI === 'develop') {
    BASE_URL = "http://test.huellitasenelespacio.com/hueBE/api";
    BASE_PUBLIC = "http://test.huellitasenelespacio.com/hueBE/";
}


//Produccion
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_ENVI) {
    BASE_URL = "http://www.huellitasenelespacio.com/hueBE/api";
    BASE_PUBLIC = "http://www.huellitasenelespacio.com/hueBE/";
}

export default {
    BASE_URL: BASE_URL,
    BASE_PUBLIC: BASE_PUBLIC
}