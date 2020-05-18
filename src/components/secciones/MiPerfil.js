import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Components
import TarjetaMenu from "../elementos/TarjetaMenu";

//CSS
import "../../assests/css/MiPerfil.css"

//Images
import misPerdidos from "../../assests/img/animales-perdidos.svg";
import misEncontrados from "../../assests/img/animales-encontrados.svg";
import datosUsuario from "../../assests/img/datos-usuario.svg";
import solicitudesPerdidos from "../../assests/img/solicitudes.svg";
import solicitudesEncontrados from "../../assests/img/solicitudes2.png";

//Librerias
import history from "../../history";

class MiPerfil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <div className="mi-perfil">
                <TarjetaMenu
                    titulo={"Mis datos"}
                    descripcion={"Aquí puedes modificar tus datos"}
                    img={datosUsuario}
                    alt={"Imagen Perdidos"}
                    title={"Imagen Perdidos"}
                    click={() => history.push('/perfil/datos-usuario')}
                />
                <TarjetaMenu
                    titulo={"Mis animales perdidos"}
                    descripcion={"Aquí se encuentran tus animales perdidos"}
                    img={misPerdidos}
                    alt={"Imagen Perdidos"}
                    title={"Imagen Perdidos"}
                    click={() => history.push('/perfil/perdidos/listar')}
                />
                <TarjetaMenu
                    titulo={"Mis animales encontrados"}
                    descripcion={"Aqui se encuentran tus animales encontrados"}
                    img={misEncontrados}
                    alt={"Imagen Encontrados"}
                    title={"Imagen Encontrados"}
                    click={() => history.push('/perfil/encontrados/listar')}
                />
                <TarjetaMenu
                    titulo={"Solicitudes - Perdidos"}
                    descripcion={"Gestionar solicitudes de animales perdidos"}
                    img={solicitudesPerdidos}
                    alt={"Solicitudes perdidos"}
                    title={"Solicitudes perdidos"}
                    click={() => history.push('/encontrados/listarn')}
                />
                <TarjetaMenu
                    titulo={"Solicitudes - Encontrados"}
                    descripcion={"Gestionar solicitudes de animales encontrados"}
                    img={solicitudesEncontrados}
                    alt={"Solicitudes encontrados"}
                    title={"Solicitudes encontrados"}
                    click={() => history.push('/encontrados/listarn')}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MiPerfil));