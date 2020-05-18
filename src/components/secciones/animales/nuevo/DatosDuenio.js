import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {createPerdido, saveCreatePerdido} from "../../../../actions/PerdidoActions";

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Componentes
import Loader from "../../../elementos/Loader";

class DatosDuenio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onChangeDuenio(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        this.props.createPerdido(cambio);
    }

    submitNuevoPerdido(e) {
        let  errores = this.props.validarCampos();
        if (errores.length > 0) {
            this.props.showErrores(errores);
        } else {
            this.props.saveCreatePerdido();
        }
    }

    render(){
        const saving = this.props.perdidos.create.isCreating;
        const paso = this.props.paso;
        return(
            <div style={{display: paso === 4 ? "block": "none"}}>
                <h2>Datos del dueño</h2>
                <Form.Group>
                    <Form.Label>Celular</Form.Label>
                    <Form.Control
                        id="celularDuenio"
                        type="number"
                        min={0}
                        placeholder="(Cod. Area - Num. Tel.)"
                        onChange={(e) => this.onChangeDuenio(e)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Repetir Celular</Form.Label>
                    <Form.Control
                        id="celularDuenioRepetido"
                        type="number"
                        min={0}
                        placeholder="(Cod. Area - Num. Tel.)"
                        onChange={(e) => this.onChangeDuenio(e)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Celular secundario (opcional)</Form.Label>
                    <Form.Control
                        id="celularSecundario"
                        type="number"
                        min={0}
                        placeholder="(Cod. Area - Num. Tel.)"
                        onChange={(e) => this.onChangeDuenio(e)}
                    />
                </Form.Group>
                {
                    saving ?
                        <Loader display={true} />
                        :
                        (   <div className="botones">
                                <Button
                                    className="boton-submit"
                                    variant="primary"
                                    onClick={() => this.props.changePaso(3)}
                                >
                                    Volver
                                </Button>
                                <Button
                                    className="boton-submit"
                                    variant="primary"
                                    onClick={(e) => this.submitNuevoPerdido(e)}
                                >
                                    Guardar mascota
                                </Button>
                            </div>
                        )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        perdidos: state.perdidos
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPerdido: (perdido) => {
            dispatch(createPerdido(perdido))
        },
        saveCreatePerdido: () => {
            dispatch(saveCreatePerdido())
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DatosDuenio));