import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {createPerdido} from "../../actions/PerdidoActions";

//Components
import Respuesta from "./Respuesta";

class Pregunta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render(){
        const props = this.props;
        var respuestas = props.respuestas.map((respuesta, index) => {
            return <Respuesta
                key={index}
                id={props.id}
                valor={respuesta[0]}
                valorReal={props.valorReal}
                multiple={props.multiple}
                texto={respuesta[1]}
            />
        });
        return(
            <div className="pregunta">
                <p className="pregunta-sexo">{props.pregunta}</p>
                <div className="contenedor-respuesta">
                    {respuestas}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        usuarios: state.usuarios,
        perdidos: state.perdidos
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPerdido: (perdido) => {
            dispatch(createPerdido(perdido))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pregunta));