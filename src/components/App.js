import React from 'react';
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import { Switch } from "react-router";

//Actions
import { fetchUsuarioLogueadoIfNeeded } from "../actions/UsuarioActions";

//Api
import auth from "../api/authentication";

//Components
import CambiarPassword from "./secciones/CambiarPassword";
import DatosUsuario from './secciones/DatosUsuario';
import Inicio from "./secciones/Inicio";
import Login from "./secciones/Login";
import MiPerfil from "./secciones/MiPerfil";
import NotFound from "./secciones/NotFound";
import Animales from "./secciones/animales/Animales";
import Registro from "./secciones/Registro";
import ValidarEmail from "./secciones/ValidarEmail"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDog } from '@fortawesome/free-solid-svg-icons'
import { faCat } from '@fortawesome/free-solid-svg-icons'

library.add(faDog, faCat)

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        window.scroll(0, 0);
        if (auth.idUsuario())
            this.props.fetchUsuarioLogueadoIfNeeded();
    }

    render() {
        return (
            <Switch>
                <Route path="/" exact component={Inicio} />
                <Route path="/login" exact component={Login} />
                <Route path="/registro" exact component={Registro} />
                <Route path="/perfil" exact component={MiPerfil} />
                <Route path="/perfil/datos-usuario" exact component={DatosUsuario} />
                <Route path="/resetPassword/:token" exact component={CambiarPassword} />
                <Route path="/validarEmail/:token" exact component={ValidarEmail} />
                <Route path={[
                    "/animales/:tipo/listar", 
                    "/animales/:tipo/nuevo", 
                    "/animales/:tipo/editar/:id" ]}exact component={Animales} />
                <Route path="*" component={NotFound} />
            </Switch>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsuarioLogueadoIfNeeded: () => {
            dispatch(fetchUsuarioLogueadoIfNeeded())
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
