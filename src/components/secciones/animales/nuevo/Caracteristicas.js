import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { createPerdido } from "../../../../actions/PerdidoActions";

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Components
import Pregunta from "../../../elementos/Pregunta";

//CSS
import "../../../../assests/css/Caracteristicas.css";

class Caracteristicas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onChangeMascota(e) {
        var cambio = {};
        cambio.animal = {};
        cambio.animal[e.target.id] = e.target.value;
        this.props.createPerdido(cambio);
    }

    crearObjeto(id, value) {
        var e = {};
        e.target = {};
        e.target.id = id;
        e.target.value = value;
        return e;
    }

    submitPasoDos(e) {
        e.preventDefault();
        let errores = this.props.validarCampos();
        if (errores && errores.length > 0) {
            this.props.showErrores(errores);
        } else {
            this.props.changePaso(3);
        }
    }

    render() {
        const props = this.props;
        const paso = props.paso;
        const perdido = props.perdidos.create.nuevo;
        const mascota = perdido.animal;

        return (
            <Form
                className="caracteristicas"
                ref={props.form}
                style={{ display: paso === 2 ? "block" : "none" }}
                onSubmit={(e) => this.submitPasoDos(e)}
            >
                <h2>Características</h2>
                <div>
                    <Pregunta
                        id={'sexo'}
                        pregunta={'Indica el sexo de tu mascota'}
                        respuestas={[[1, 'Macho'], [0, 'Hembra']]}
                        valorReal={perdido && mascota ? mascota.sexo : undefined}
                    />
                    <Pregunta
                        id={'castrado'}
                        pregunta={'¿Está castrado?'}
                        respuestas={[[1, 'Si'], [2, 'No']]}
                        valorReal={perdido && mascota ? mascota.castrado : undefined}
                    />
                    <Pregunta
                        id={'tamanio'}
                        pregunta={'Elija el tamaño'}
                        multiple={true}
                        respuestas={[[1, 'Chico'], [2, 'Mediano'], [3, 'Grande']]}
                        valorReal={perdido && mascota ? mascota.tamanio : undefined}
                    />
                </div>
                <Pregunta
                    id={'edadAproximada'}
                    pregunta={'Edad aproximada'}
                    respuestas={[[1, '45 días a 2 años'], [2, '2 años a 10 años'], [3, '10 años o más']]}
                    valorReal={perdido && mascota ? mascota.edadAproximada : undefined}
                />

                <div className="botones">
                    <Button className="boton-submit" variant="primary" onClick={() => this.props.changePaso(1)}>
                        Volver
                    </Button>
                    <Button className="boton-submit" variant="primary" type="submit">
                        Continuar
                    </Button>
                </div>
            </Form>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Caracteristicas));