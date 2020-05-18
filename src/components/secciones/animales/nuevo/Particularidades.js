import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {createPerdido} from "../../../../actions/PerdidoActions";

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//CSS
import "../../../../assests/css/Particularidades.css";

class Particularidades extends React.Component {
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

    render(){
        const paso = this.props.paso;

        return(
            <div className="caracteristicas" style={{display: paso === 3 ? "block": "none"}}>
                <h2>Particularidades</h2>
                <div>
                    <p>Acá puedes escribir cualquier cosa particular de tu animal que lo distinga</p>
                    <Form.Group controlId="particularidades">
                        <Form.Control as="textarea" rows="3" onChange={(e) => this.onChangeMascota(e)}/>
                    </Form.Group>
                </div>
                <div className="botones">
                    <Button className="boton-submit" variant="primary" onClick={() => this.props.changePaso(2)}>
                        Volver
                    </Button>
                    <Button className="boton-submit" variant="primary" onClick={() => this.props.changePaso(4)}>
                        Continuar
                    </Button>
                </div>
            </div>
        )
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
        createPerdido: (peridido) => {
            dispatch(createPerdido(peridido))
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Particularidades));