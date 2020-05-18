import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

//Components
import TarjetaMenu from "../../components/elementos/TarjetaMenu";

//CSS
import "../../assests/css/Inicio.css";

//Imagenes
import foundAnimals from "../../assests/img/found-dogs.jpg";
import lostAnimals from "../../assests/img/lost-dog.jpg";

//Librerias
import history from "../../history";

class Inicio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="inicio">
                <TarjetaMenu
                    titulo={"Perdidos"}
                    descripcion={"Aqui se encuentra los animales perdidos"}
                    img={lostAnimals}
                    alt={"Imagen Perdidos"}
                    title={"Imagen Perdidos"}
                    click={() => history.push('/animales/perdidos/listar')}
                />
                <TarjetaMenu
                    titulo={"Encontrados"}
                    descripcion={"Aqui se encuentra los animales encontrados por otras personas"}
                    img={foundAnimals}
                    alt={"Imagen Encontrados"}
                    title={"Imagen Encontrados"}
                    click={() => history.push('/animales/encontrados/listar')}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Inicio));