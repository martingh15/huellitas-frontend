import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Action
import {createPerdido} from "../../../../actions/PerdidoActions";
import {fetchBarriosIfNeeded} from "../../../../actions/BarrioActions";
import {fetchZonasIfNeeded} from "../../../../actions/ZonaActions";

//Boostrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

//Components
import ArchivoImagen from "../../../elementos/ArchivoImagen";

//CSS
import "../../../../assests/css/MiMascota.css";

//Images
import emptyImg from "../../../../assests/img/emptyImg.jpg";

//Librerias
import bsCustomFileInput from 'bs-custom-file-input';
var moment = require('moment');

class MiMascota extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagenPrincipal: emptyImg,
            imagenSecundaria: emptyImg,
        }
    }

    componentDidMount() {
        window.scrollTo(0,0);
        bsCustomFileInput.init();
        this.props.fetchBarriosIfNeeded();
        this.props.fetchZonasIfNeeded();
    }

    onChangePerdido(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        this.props.createPerdido(cambio);
    }

    onChangeMascota(e, mascota) {
        var cambio = {};
        cambio.animal = {};
        if (mascota) {
            cambio.animal = mascota;
        } else {
            cambio.animal[e.target.id] = e.target.value;
        }
        this.props.createPerdido(cambio);
    }

    changeImagen(e) {
        let imagen = URL.createObjectURL(e.target.files[0]);
        if (e.target.id === 'imagenPrincipal')
            this.setState({ imagenPrincipal: imagen});
        if (e.target.id === 'imagenSecundaria')
            this.setState({ imagenSecundaria: imagen});

        var file = e.target.files[0];
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }
        var cambio = {};
        cambio[e.target.id] = file;
        this.onChangeMascota(e, cambio);
    }

    submitPasoUno(e) {
        e.preventDefault();
        let errores = this.props.validarCampos();
        if (errores.length > 0) {
            this.props.showErrores(errores);
        } else {
            this.props.changePaso(2);
        }
    }

    render(){
        const props = this.props;
        const perdido = props.perdidos.create.nuevo;
        const mascota = perdido ? perdido.animal : null;
        const paso = props.paso;

        var opcionesZonas = props.zonas.allIds.map((key) => {
            var zona = props.zonas.byId.zonas[key];
            if (zona) {
                return (
                    <option  key={zona.id} id={zona.id} value={zona.id}>{zona.nombre}</option>
                )
            }
            return (<span></span>);
        });

        var opcionesBarrios = props.barrios.allIds.map((key) => {
            var barrio = props.barrios.byId.barrios[key];
            if(barrio){
                return (
                    <option key={barrio.id} id={barrio.id} value={barrio.id}>{barrio.nombre}</option>
                )
            }
            return (<span></span>);
        });

        return(
            <Form
                id="form-mi-mascota"
                className="mi-mascota"
                style={{display: paso === 1 ? "block": "none"}}
                onSubmit={(e) => this.submitPasoUno(e)}
            >
                <h2>Mi Mascota</h2>
                <div className="fila">
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre"
                            type="name"
                            className="form-control-mascota"
                            value={mascota ? mascota.nombre : ""}
                            onChange={(e) => this.onChangeMascota(e, null)}
                            placeholder="Nombre de mascota"
                        />
                    </Form.Group>
                </div>
                <div className="fila">
                    <Form.Group>
                        <Form.Label>Tipo de animal</Form.Label>
                        <Form.Control
                            id="tipo"
                            as="select"
                            defaultValue=""
                            onChange={(e) => this.onChangeMascota(e, null)}
                            value={mascota ? mascota.tipo : ""}
                        >
                            <option value="perro">Perro/a</option>
                            <option value="gato">Gato/a</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fecha perdido</Form.Label>
                        <input
                            id="fecha"
                            className="form-control form-fecha"
                            type="date"
                            max={moment().format("YYYY-MM-DD")}
                            value={perdido ? perdido.fecha : ""}
                            onChange={(e) => this.onChangePerdido(e)}
                            placeholder="Fecha en que se perdió"
                        />
                    </Form.Group>
                </div>
                <div className="fila">
                    <Form.Group>
                        <Form.Label>Imagen principal</Form.Label>
                        <ArchivoImagen
                            id={"imagenPrincipal"}
                            imagen={this.state.imagenPrincipal}
                            texto={perdido && perdido.animal && perdido.animal.imagenPrincipal ? perdido.animal.imagenPrincipal.name : ""}
                            changeImagen={(evento) => this.changeImagen(evento)}
                        />
                        <Form.Text className="text-muted">
                            La imagen tiene que ser nítida y estar centrada.
                        </Form.Text>
                    </Form.Group>
                </div>
                <div className="fila">
                    <Form.Group>
                        <Form.Label>Imagen secundaria (opcional)</Form.Label>
                        <ArchivoImagen
                            id={"imagenSecundaria"}
                            imagen={this.state.imagenSecundaria}
                            texto={perdido && perdido.animal && perdido.animal.imagenSecundaria ? perdido.animal.imagenSecundaria.name : ""}
                            changeImagen={(evento) => this.changeImagen(evento)}
                        />
                    </Form.Group>
                </div>
                <div className="fila">
                    <Form.Group>
                        <Form.Label>Zona</Form.Label>
                        <Form.Control
                            id="idZona"
                            as="select"
                            defaultValue=""
                            className="form-control-select"
                            onChange={(e) => this.onChangeMascota(e, null)}
                            value={perdido ? perdido.zona : ""}
                        >
                            <option value="" disabled>Seleccione una zona</option>
                            {opcionesZonas}
                        </Form.Control>
                    </Form.Group>
                </div>
                <div className="fila">
                    <Form.Group>
                        <Form.Label>Barrio (opcional)</Form.Label>
                        <Form.Control
                            id="idBarrio"
                            as="select"
                            defaultValue=""
                            className="form-control-select"
                            onChange={(e) => this.onChangeMascota(e, null)}
                            value={perdido ? perdido.idBarrio : ""}
                        >
                            <option value="" disabled>Seleccione un barrio</option>
                            {opcionesBarrios}
                        </Form.Control>
                    </Form.Group>
                </div>
                <Button
                    className="boton-submit"
                    variant="primary"
                    type="submit"
                >
                    Continuar
                </Button>
            </Form>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        usuarios: state.usuarios,
        perdidos: state.perdidos,
        barrios: state.barrios,
        zonas: state.zonas
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        createPerdido: (perdido) => {
            dispatch(createPerdido(perdido))
        },
        fetchBarriosIfNeeded: () => {
            dispatch(fetchBarriosIfNeeded())
        },
        fetchZonasIfNeeded: () => {
            dispatch(fetchZonasIfNeeded())
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MiMascota));