import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { logout } from "../../actions/AuthenticationActions";

//Constants
import c from "../../constants/constants";
//CSS
import '../../assests/css/Navegador.css';

//Images
import logo from "../../assests/img/pet.svg";
import history from "../../history";

class Navegador extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: ''
        }
    }

    componentDidMount() {
        if (this.props.usuarios.update.activo.nombre) {
            this.setNombreUsuarioLogueado();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.usuarios.update.activo.nombre !== this.props.usuarios.update.activo.nombre
            && (this.state.nombre === "" || this.state.nombre !== this.props.usuarios.update.activo.nombre)) {
            this.setNombreUsuarioLogueado();
        }
    }

    setNombreUsuarioLogueado() {
        let nombre = this.props.usuarios.update ? this.props.usuarios.update.activo.nombre : "";
        this.setState({
            nombre: nombre ? nombre.trim() : ""
        });
    }

    redirectTo(ruta) {
        if (!this.props.authentication.currentlySending && ruta === "/logout") {
            this.props.logout();
        } else if(!this.props.authentication.currentlySending) {
            history.push(ruta);
        }
        
    }

    render() {
        const { nombre } = this.state;
        const ItemMenu = props => (
            <a 
                href={props.ruta}
                className={props.grow ? "itemMenu hvr-grow" : "itemMenu"}
                onClick={() => this.redirectTo(props.ruta)}
            >
                {props.texto}
            </a>
        );
        return (
            <div className="navegador">
                <div className="izquierda">
                    <img className="logo" src={logo}
                        onClick={() => this.redirectTo('/')}
                        alt="Logo huellitas"
                        title="Logo huellitas"
                    />
                    <ItemMenu
                        grow={true}
                        texto={"Perdidos"}
                        ruta={"/animales/perdidos/listar"}
                    />
                    <ItemMenu
                        grow={true}
                        texto={"Encontrados"}
                        ruta={"/animales/encontrados/listar"}
                    />
                </div>
                {
                    !this.props.authentication.token ?
                        (
                            <div className="acordion-ingreso">
                                <ItemMenu
                                    grow={true}
                                    texto={"Login"}
                                    ruta={"/login"}
                                />
                                <ItemMenu
                                    grow={false}
                                    texto={"Registro"}
                                    ruta={"/registro"}
                                />
                            </div>
                        )
                        : (
                            <div className="acordion-ingreso">
                                <ItemMenu
                                    grow={true}
                                    texto={nombre !== "" ? "Hola " + nombre + "!" : ""}
                                    ruta={"/"}
                                />
                                <ItemMenu
                                    grow={true}
                                    texto={"Mi perfil"}
                                    ruta={"/perfil"}
                                />
                                <ItemMenu
                                    grow={true}
                                    texto={"Salir"}
                                    ruta={"/logout"}
                                />
                            </div>
                        )
                }
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
        logout: () => {
            dispatch(logout())
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navegador));
