import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//Actions
import { updatePerdido } from "../../actions/PerdidoActions";
import { updateEncontrado} from "../../actions/EncontradoActions";

//Constants
import c from "../../constants/constants";

//CSS
import "../../assests/css/AnimalPerdido.css";

//Images
import emptyAnimal from "../../assests/img/empty-animal.png";
import mars from "../../assests/icon/mars.svg";
import venus from "../../assests/icon/venus.svg";
import dog from "../../assests/icon/dog.svg";
import cat from "../../assests/icon/cat.svg";
import loading from "../../assests/icon/rotate.svg";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import history from '../../history';

var moment = require('moment');

class AnimalPerdido extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tipo = this.props.match.params.tipo;
        if (prevProps.match.params.tipo !== tipo
            && (tipo === 'perdidos' || tipo === 'encontrados')) {
            this.setState({ tipo: tipo });
        }
    }

    getEdad(edad) {
        if (edad === 1) {
            return "45 días a 2 años";
        } else if (edad === 2) {
            return "2 a 10 años";
        } else if (edad === 3) {
            return "10 años o más"
        } else {
            return '';
        }
    }

    detalleAnimal(animal) {
        let tipo = this.props.match.params.tipo;
        if (tipo === 'perdidos') {
            this.props.updatePerdido(animal);
        } else if (tipo === 'encontrados') {
            this.props.updateEncontrado(animal);
        }
        //Si es mio es editar, sino es ver
        history.push("/animales/" + tipo + "/editar/" + animal.id);
    }

    render() {
        let props = this.props;
        let tipo = this.props.match.params.tipo;
        let animalPerdido = props.animal;
        let buscando = false;
        if (tipo === 'perdidos') {
            buscando = this.props.perdidos.byId.isFetching;
        } else if (tipo === 'encontrados') {
            buscando = this.props.encontrados.byId.isFetching;
        }
        let fecha = animalPerdido && animalPerdido.fecha ? animalPerdido.fecha : "";
        let animal = animalPerdido ? animalPerdido.animal : null;
        let sexo = animal ? parseInt(animal.sexo) : 1;
        let tipoAnimal = animal ? animal.tipo : "";
        let castrado = animal ? parseInt(animal.castrado) : 0;
        let edadBD = animal ? animal.edadAproximada : "";
        let edad = this.getEdad(edadBD);
        let path = emptyAnimal;
        let smallActivo = animal ? animal.tamanio.indexOf('1') !== -1 : false;
        let mediumActivo = animal ? animal.tamanio.indexOf('2') !== -1 : false;
        let bigActivo = animal ? animal.tamanio.indexOf('3') !== -1 : false;
        let color = tipo === 'perdidos' ? "red" :  "blue";
        if (animalPerdido && animalPerdido.animal && animalPerdido.animal.imagenPrincipal) {
            try {
                path = c.BASE_PUBLIC + "img/animales/" + animalPerdido.animal.imagenPrincipal;
            } catch (e) {
            }
        }
        return (
            <div 
                key={animalPerdido.id} 
                onClick={() => this.detalleAnimal(animalPerdido)}
                className="animal-perdido tarjeta-body hvr-grow"
                style={{ backgroundColor: !buscando ? "white" :"grey !important"}}>
                <img style={{display: buscando ? "block" : "none"}} className="loading" src={loading} alt="Loading"/>
                <div className="top">
                    <img className="imgTop" src={path} onError={(e) => e.target.src = emptyAnimal} alt="Imagen de animal" />
                    <div className="estado" style={{ backgroundColor: color}}>
                        {tipo === 'perdidos' ? 'Perdido' : 'Encontrado'}
                    </div>
                </div>
                <div className="detalles-animal">
                    <div className="nombre">
                        <img 
                            style={{ dislay: tipo !== "" ? "block" : "none" }} 
                            className="tipo-animal" 
                            src={tipo === 'perro' ? dog : cat}
                            alt="Tipo de animal"
                        />
                        <p>Me llamo {animal ? animal.nombre : ""}</p>
                    </div>
                    <div>
                        <p>{tipo === 'perdidos' ? 'Me perdí ' : 'Me encontaron '} {'el ' + moment(fecha).format("DD-MM-YYYY")}</p>
                    </div>
                    <div className="castrado">
                        <p>
                            {castrado === 1 ? 'Estoy' : 'No estoy'}
                            {sexo === 1 ? ' castrado' : ' castrada'}
                        </p>
                    </div>
                    <div className="sexo">
                        <img 
                            className="genero" 
                            src={sexo === 1 ? mars : venus}
                            alt="Sexo del animal"
                        />
                        <p>{sexo === 1 ? 'Macho' : 'Hembra'}</p>
                    </div>
                    <div className="edad">
                        <p>{edad !== '' ? 'Tengo ' + edad : "No se mi edad"}</p>
                    </div>
                    <div className="tamanio">
                        <FontAwesomeIcon 
                            icon={tipoAnimal === "perro" ? "dog" : "cat"} 
                            style={{
                                color: smallActivo ? "black" : "#cccccc"
                            }}
                        />
                        <FontAwesomeIcon 
                            icon={tipoAnimal === "perro" ? "dog" : "cat"} 
                            style={{ 
                                fontSize: "25px",
                                color: mediumActivo ? "black" : "#cccccc"
                            }} 
                        />
                        <FontAwesomeIcon 
                            icon={tipoAnimal === "perro" ? "dog" : "cat"} 
                            style={{ 
                                fontSize: "32px",
                                color: bigActivo ? "black" : "#cccccc"
                            }} 
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        perdidos: state.perdidos,
        encontrados: state.encontrados
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatePerdido: (perdido) => {
            dispatch(updatePerdido(perdido))
        },
        updateEncontrado: (encontrado) => {
            dispatch(updateEncontrado(encontrado))
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnimalPerdido));