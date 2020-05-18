import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';
import {Switch} from "react-router";

//Components
import AnimalNuevo from "./nuevo/AnimalNuevo";
import AnimalesListar from "./AnimalesListar";
import AnimalEditar from "./editar/AnimalEditar";

//Librerias
import history from '../../../history';

class Animales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tipo = this.props.match.params.tipo;
        if (prevProps.match.params.tipo !== tipo && tipo !== 'perdidos' && tipo !== 'encontrados') {
            history.push("/");
        }
    }

    render() {
        return (
            <Switch>
                <Route path="/animales/:tipo/listar" exact component={AnimalesListar}/>
                <Route path="/animales/:tipo/nuevo" exact component={AnimalNuevo}/>     
                <Route path="/animales/:tipo/:accion/:id" component={AnimalEditar} />          
            </Switch>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Animales));