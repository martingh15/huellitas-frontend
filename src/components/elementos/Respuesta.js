import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//Actions
import { createPerdido } from "../../actions/PerdidoActions";

//Librerias
import clone from 'lodash/clone';
import union from 'lodash/union';

class Respuesta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onChangeCaracteristicas() {
        var cambio = {};
        cambio.animal = {};
        cambio.animal[this.props.id] = this.props.valor;
        if (this.props.id === 'edadAproximada') {
            cambio.animal.rangoEdad = 1;
            this.props.createPerdido(cambio);
        } else if (this.props.id !== 'tamanio') {
            this.props.createPerdido(cambio);
        } else {
            this.changeTamanio();
        }
    }

    changeTamanio() {
        var cambio = {};
        cambio.animal = {};
        const perdido = clone(this.props.perdidos.create.nuevo);
        let tamanio = perdido && perdido.animal && perdido.animal.tamanio ? perdido.animal.tamanio : [];
        switch (this.props.valor) {
            case 1:
                tamanio = tamanio.filter(w => w !== 3);
                if (tamanio.filter(element => element === 1).length === 0) {
                    tamanio = union(tamanio, [1]);
                } else {
                    tamanio = tamanio.filter(w => w !== 1);
                }
                break;
            case 2:
                if (tamanio.filter(element => element === 2).length === 0) {
                    tamanio = union(tamanio, [2]);
                } else {
                    tamanio = tamanio.filter(w => w !== 2);
                }
                break;
            case 3:
                tamanio = tamanio.filter(w => w !== 1);
                if (tamanio.filter(element => element === 3).length === 0) {
                    tamanio = union(tamanio, [3]);
                } else {
                    tamanio = tamanio.filter(w => w !== 3);
                }
                break;
            default:
                tamanio = [];
                break;
        }
        cambio.animal[this.props.id] = tamanio;
        this.props.createPerdido(cambio);

    }

    render() {
        const props = this.props;
        let checkeado = props.valor === props.valorReal;
        if (props.multiple && Array.isArray(props.valorReal)) {
            let array = props.valorReal.filter(x => x === props.valor);
            checkeado = array.length > 0;
        }
        return (
            <div className="form-check respuesta"
                style={{
                    backgroundColor: checkeado ? "rgb(6, 185, 6)" : "white",
                    color: checkeado ? "white" : "black"
                }}
                onClick={() => this.onChangeCaracteristicas()}
            >
                <input
                    className="form-check-input"
                    type="radio"
                    readOnly
                    checked={checkeado}
                />
                <label className="form-check-label texto-respuesta">
                    {props.texto}
                </label>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Respuesta));