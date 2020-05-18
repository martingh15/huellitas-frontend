import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//Acions
import { fetchPerdidosIfNeeded, updatePerdido, saveUpdatePerdido } from "../../../../actions/PerdidoActions";
import { fetchEncontradosIfNeeded, updateEncontrado, saveUpdateEncontrado } from "../../../../actions/EncontradoActions";
import { fetchBarriosIfNeeded } from "../../../../actions/BarrioActions";
import { fetchZonasIfNeeded } from "../../../../actions/ZonaActions";

//Boostrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Components
import ArchivoImagen from "../../../elementos/ArchivoImagen";
import Multiselect from "../../../elementos/Multiselect";

//Constants
import c from "../../../../constants/constants";

//CSS
import "../../../../assests/css/AnimalEditar.css";

//Images
import emptyAnimal from "../../../../assests/img/empty-animal.png";

//Librerias
import Swal from 'sweetalert2';
var moment = require('moment');

class AnimalEditar extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            imagenGrande: null,
            imagenSeleccionada: 1,
            miniImagen1: null,
            miniImagen2: null,
            textoImagen1: "",
            textoImagen2: ""
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        let tipo = this.props.match.params.tipo;
        if (tipo === 'perdidos') {
            this.props.fetchPerdidosIfNeeded({ id: id });
        } else if (tipo === 'encontrados') {
            this.props.fetchEncontradosIfNeeded({ id: id });
        }
        this.props.fetchBarriosIfNeeded();
        this.props.fetchZonasIfNeeded();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tipo = this.props.match.params.tipo;
        let animal = null;
        let prevAnimal  = null;
        if (tipo === 'encontrados') {
            prevAnimal = prevProps.encontrados.update.activo;
            animal = this.props.encontrados.update.activo;
        } else if (tipo === 'perdidos') {
            prevAnimal = prevProps.perdidos.update.activo;
            animal = this.props.perdidos.update.activo;
        }
        if (prevAnimal !== animal && animal.id && this.state.imagenGrande === null) {
            this.cargarImagenes(animal);
        }
        
    }

    cargarImagenes(animal) {
        let imagenGrande = null;
        let imagenSecundaria = null;
        let textoImagen2 = "";
        if (this.state.imagenGrande === null && animal && animal.animal && animal.animal.imagenPrincipal) {
            try {
                imagenGrande = c.BASE_PUBLIC + "img/animales/" + animal.animal.imagenPrincipal;
                if (animal.animal.imagenSecundaria) {
                    imagenSecundaria = c.BASE_PUBLIC + "img/animales/" + animal.animal.imagenSecundaria;
                    textoImagen2 = animal.animal.fileImagenSecundaria;
                }
            } catch (e) {
            }
            this.setState({
                imagenGrande: imagenGrande,
                textoImagen1: animal.animal.fileImagenPrincipal,
                textoImagen2: textoImagen2,
                miniImagen1: imagenGrande,
                miniImagen2: imagenSecundaria
            });
        } else if (this.state.imagenGrande === null) {
            this.setState({
                imagenGrande: emptyAnimal,
                miniImagen1: emptyAnimal
            });
        }
    }

    getEdad(edad) {
        if (edad === ',0,1,2,') {
            return "45 días a 2 años";
        } else if (edad === ',2,3,4,5,6,7,8,9,10,') {
            return "2 a 10 años";
        } else if (edad === ',10,*,') {
            return "10 años o más"
        } else if (edad === "1") {
            return edad + " año";
        } else if (edad !== '') {
            return edad + " años";
        } else {
            return '';
        }
    }

    onChangeMascota(e, esAnimal) {
        var cambio = {};
        if (esAnimal) {
            cambio.animal = {};
            cambio.animal[e.target.id] = e.target.value;
        } else {
            cambio[e.target.id] = e.target.value;
        }
        this.changeDatos(cambio);
    }

    changeImagen(e) {
        let imagen = URL.createObjectURL(e.target.files[0]);
        if (e.target.id === 'imagenPrincipal')
            this.setState({ 
                miniImagen1: imagen, 
                imagenGrande: imagen,
                textoImagen1: e.target.files[0].name
            });
        if (e.target.id === 'imagenSecundaria')
            this.setState({ 
                miniImagen2: imagen,
                textoImagen2: e.target.files[0].name
            });

        var file = e.target.files[0];
        var reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
        }
        var ev = {};
        ev.target = {};
        ev.target.id =  e.target.id;
        ev.target.value = file;
        this.onChangeMascota(ev, true);
    }

    changeDatos(cambio) {
        let tipo = this.props.match.params.tipo;
        if (tipo === 'perdidos') {
            this.props.updatePerdido(cambio);
        } else if (tipo === 'encontrados') {
            this.props.updateEncontrado(cambio);
        }
    }

    validarDatos(animal) {
        let errores = [];
        let datosAnimal = animal ? animal.animal : null;
        if (datosAnimal) {
            if (datosAnimal.nombre === undefined || datosAnimal.nombre === "") {
                animal.push("Nombre");
            }
            if (datosAnimal.imagenPrincipal === undefined || datosAnimal.imagenPrincipal === "") {
                errores.push("Imagen principal");
            }
            if (datosAnimal.idZona === undefined || datosAnimal.idZona === "") {
                errores.push("Zona");
            }
            if (datosAnimal.sexo === undefined || datosAnimal.sexo === "") {
                errores.push("Sexo");
            }
            if (datosAnimal.castrado === undefined || datosAnimal.castrado === "") {
                errores.push("Castrado");
            }
            if (datosAnimal.tamanio === undefined || datosAnimal.tamanio === "") {
                errores.push("Tamaño");
            }
            if (datosAnimal.edadAproximada === undefined || datosAnimal.edadAproximada === "") {
                errores.push("Edad");
            }            
        }

        if (animal.fecha === undefined || animal.fecha === "") {
            errores.push("Fecha");
        }
        
        if (animal.celularDuenio === undefined || animal.celularDuenio === "") {
            errores.push("Celular");
        }
        if (errores.length > 0) {
            this.showErrores(errores);
            return false;
        } else {
            return true;
        }
    }

    showErrores(errores) {
        let texto = "";
        errores.map((e) => {
            texto = texto + `<li style="width: fit-content;text-align: initial;">${e}</li>`;
            return true;
        });
        Swal.fire({
            title: 'Faltan completar campos',
            icon: 'info',
            html:
                `Le ha faltado completar los siguientes campos,` +
                `<ul style="margin-left: 30px;">${texto}</ul>`,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aceptar',
        });
    }

    guardarAnimal() {
        let accion = this.props.match.params.accion;
        let tipo = this.props.match.params.tipo;
        let animal = null;
        if (accion === 'editar' && tipo === 'perdidos') {
            animal = this.props.perdidos.update.activo;
            if (this.validarDatos(animal)) {
                this.props.saveUpdatePerdido(animal);  
            }                          
        } else if (accion === 'editar' && tipo === 'encontrados') {
            animal = this.props.encontrados.update.activo;
            if (this.validarDatos(animal)) {
                this.props.saveUpdateEncontrado(animal);
            }
        }
    }

    render() {
        const { imagenSeleccionada, imagenGrande, miniImagen1, miniImagen2, textoImagen1, textoImagen2} = this.state;
        let animal = null;
        let tipo = this.props.match.params.tipo;
        let accion = this.props.match.params.accion;
        let titulo = accion === 'editar' ? "Editar " : accion === "visualizar" ? "Datos" : "";
       
        if (tipo === 'perdidos') {
            animal = this.props.perdidos.update.activo;
            titulo = titulo + "datos de mi mascota perdida";
        } else if (tipo === 'encontrados') {
            animal = this.props.encontrados.update.activo;
            titulo = titulo + "datos de la mascota encontrada";
        }
        let buscando = false;
        if (tipo === 'perdidos') {
            buscando = this.props.perdidos.byId.isFetching;
        } else if (tipo === 'encontrados') {
            buscando = this.props.encontrados.byId.isFetching;
        }
        let datosAnimal = animal ? animal.animal : null;

        var opcionesZonas = this.props.zonas.allIds.map((key) => {
            var zona = this.props.zonas.byId.zonas[key];
            if (zona) {
                return (
                    <option key={zona.id} id={zona.id} value={zona.id}>{zona.nombre}</option>
                )
            }
            return (<span></span>);
        });

        var opcionesBarrios = this.props.barrios.allIds.map((key) => {
            var barrio = this.props.barrios.byId.barrios[key];
            if (barrio) {
                return (
                    <option key={barrio.id} id={barrio.id} value={barrio.id}>{barrio.nombre}</option>
                )
            }
            return (<span></span>);
        });

        var tamanios = [
            {
                id: 1,
                nombre: 'Pequeño'
            },
            {
                id: 2,
                nombre: 'Mediano'
            },
            {
                id: 3,
                nombre: 'Grande'
            },
        ];
        return(
            <div className="animal-editar tarjeta-body">
                <h2>{titulo}</h2>
                <div className="contenedor-animal">
                    <div className="columna">
                        <div className="contenedor-fotos">
                            <img className="imagenPrincipal" src={imagenGrande} alt="Imagen datosAnimal"/>
                            <div className="mini-imagenes">                            
                                <div 
                                    className="mini-imagen"
                                    onClick={() => this.setState({ imagenGrande: miniImagen1, imagenSeleccionada: 1})}
                                >
                                    <img
                                        src={miniImagen1}
                                        alt="Imagen animal"
                                        title="Imagen animal"

                                    />
                                    <div 
                                        className="imagen-background" 
                                        style={{
                                            backgroundColor: imagenSeleccionada === 1 ? "#060606a6" : "transparent",
                                            border: imagenSeleccionada === 1 ? "2px solid green" : "1px solid grey",
                                            cursor: miniImagen2 ? "pointer" : "auto"
                                        }}
                                    >
                                    </div>
                                </div>
                                <div 
                                    className="mini-imagen"
                                    onClick={() => 
                                        this.setState({ 
                                            imagenGrande: miniImagen2 ? miniImagen2 : imagenGrande,
                                            imagenSeleccionada: miniImagen2 ? 2 : imagenSeleccionada
                                        })}
                                >
                                    <p style={{ display: miniImagen2 ? "none" : "block" }}>
                                        Sin imagen secundaria
                                    </p>
                                    <img
                                        src={miniImagen2}
                                        style={{display: miniImagen2 ? "block" : "none"}}
                                        alt="Imagen datosAnimal"
                                        title="Imagen datosAnimal"

                                    />
                                    <div
                                        className="imagen-background"
                                        style={{ 
                                            backgroundColor: imagenSeleccionada === 2 ? "#060606a6" : "transparent",
                                            border: imagenSeleccionada === 2 ? "2px solid green" : "1px solid grey",
                                            cursor: miniImagen2 ? "pointer" : "auto"
                                        }}
                                    >
                                    </div>
                                </div>
                            </div>
                            <Form.Group>
                                <Form.Label>Celular</Form.Label>
                                <Form.Control
                                    id="celularDuenio"
                                    type="number"
                                    min={0}
                                    value={animal ? animal.celularDuenio : ""}
                                    placeholder="(Cod. Area - Num. Tel.)"
                                    onChange={(e) => this.onChangeMascota(e, false)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Celular secundario (opcional)</Form.Label>
                                <Form.Control
                                    id="celularSecundario"
                                    type="number"
                                    value={animal ? animal.celularSecundario : ""}
                                    min={0}
                                    placeholder="(Cod. Area - Num. Tel.)"
                                    onChange={(e) => this.onChangeMascota(e, false)}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="columna contenedor-datos">
                        <Form className="formulario">
                            <div className="fila">                            
                                <Form.Group
                                    className="form-animal" 
                                    style={{display: tipo === 'perdidos' ? "block" : "none"}}
                                >
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        id="nombre"
                                        type="name"
                                        value={datosAnimal && datosAnimal.nombre ? datosAnimal.nombre : ""}
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        placeholder="Nombre"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Tipo de animal</Form.Label>
                                    <Form.Control
                                        id="tipo"
                                        as="select"
                                        defaultValue=""
                                        className="form-animal"
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        value={datosAnimal ? datosAnimal.tipo : ""}
                                    >
                                        <option value="perro">Perro/a</option>
                                        <option value="gato">Gato/a</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="fila">
                                <Form.Group>
                                    <Form.Label>Sexo</Form.Label>
                                    <Form.Control
                                        id="sexo"
                                        as="select"
                                        defaultValue=""
                                        className="form-animal"
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        value={datosAnimal ? datosAnimal.sexo : ""}
                                    >
                                        <option value={1}>Macho</option>
                                        <option value={0}>Hembra</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Castrado</Form.Label>
                                    <Form.Control
                                        id="castrado"
                                        as="select"
                                        defaultValue=""
                                        className="form-animal"
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        value={datosAnimal ? datosAnimal.castrado : ""}
                                    >
                                        <option value={1}>Si</option>
                                        <option value={0}>No</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="fila">
                                <Form.Group>
                                    <Form.Label>Edad aproximada</Form.Label>
                                    <Form.Control
                                        id="edadAproximada"
                                        as="select"
                                        className="form-animal"
                                        defaultValue=""
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        value={datosAnimal ? datosAnimal.edadAproximada : ""}
                                    >
                                        <option value="" disabled>Seleccione una edad</option>
                                        <option value={1}>45 días a 2 años</option>
                                        <option value={2}>2 años a 10 años</option>
                                        <option value={2}>10 años o más</option>
                                    </Form.Control>
                                </Form.Group> 
                                <Multiselect
                                    className="multiselect-tamanio"
                                    valores={tamanios}
                                    respuestas={datosAnimal ? datosAnimal.tamanio : []}
                                    placeHolder="Tamaño"
                                    id={"tamanio"}
                                    campo={"Tamaño"}
                                    onChangeBusqueda={(e) => this.onChangeMascota(e, true)}
                                />
                            
                            </div>
                            <div className="fila" style={{ height: "100px" }}>
                                <Form.Group
                                    className="form-animal fecha"
                                >
                                    <Form.Label>Fecha en la que se {tipo === 'perdidos' ? 'perdió' : 'encontró'}</Form.Label>
                                    <Form.Control
                                        id="fecha"
                                        type="date"
                                        max={moment().format("YYYY-MM-DD")}
                                        value={animal && animal.fecha ? moment(animal.fecha).format("YYYY-MM-DD") : ""}
                                        onChange={(e) => this.onChangeMascota(e, false)}
                                        placeholder="Fecha"
                                    />
                                </Form.Group>                                
                            </div>
                            <div className="fila">
                                <Form.Group>
                                    <Form.Label>Zona</Form.Label>
                                    <Form.Control
                                        id="idZona"
                                        as="select"
                                        className="form-select-zona"
                                        defaultValue=""
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        value={datosAnimal ? datosAnimal.idZona : ""}
                                    >
                                        <option value="" disabled>Seleccione una zona</option>
                                        {opcionesZonas}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Barrio (opcional)</Form.Label>
                                    <Form.Control
                                        id="idBarrio"
                                        as="select"
                                        className="form-animal"
                                        defaultValue=""
                                        onChange={(e) => this.onChangeMascota(e, true)}
                                        value={datosAnimal ? datosAnimal.idBarrio : ""}
                                    >
                                        <option value="" disabled>Seleccione un barrio</option>
                                        {opcionesBarrios}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="fila">
                                    <Form.Group>
                                        <Form.Label>Imagen principal</Form.Label>
                                        <ArchivoImagen
                                            id={"imagenPrincipal"}
                                            show={false}
                                            imagen={null}
                                            texto={textoImagen1}
                                            changeImagen={(evento) => this.changeImagen(evento)}
                                        />
                                        <Form.Text className="text-muted">
                                            La imagen tiene que ser nítida y estar centrada.
                                        </Form.Text>
                                    </Form.Group>                                   
                            </div>
                            <div className="fila">
                                <Form.Group>
                                    <Form.Label>Imagen secundaria</Form.Label>
                                    <ArchivoImagen
                                        id={"imagenSecundaria"}
                                        show={false}
                                        imagen={null}
                                        texto={textoImagen2}
                                        changeImagen={(evento) => this.changeImagen(evento)}
                                    />
                                </Form.Group>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="contenedor-particularidades">
                    <p>Aquí puedes describir cualquier particularidad de tu animal que lo distinga del resto</p>
                    <p className="ejemplo">Ejemplo: Cola cortada, ciego, sordo, cicatrices, etc </p>
                    <Form.Group controlId="particularidades">
                        <Form.Control
                            as="textarea"
                            className="form-select"
                            rows="3"
                            onChange={(e) => this.onChangeMascota(e, true)}
                            value={datosAnimal ? datosAnimal.particularidades : ""}
                        />
                    </Form.Group>
                </div>
                <Button 
                    style={{display: accion === "editar" ? "block" : "none"}} 
                    className="boton-guardar"
                    onClick={() => this.guardarAnimal()}
                >
                    Guardar cambios
                </Button>
            </div>
        )
    }
    
}

function mapStateToProps(state) {
    return {
        perdidos: state.perdidos,
        encontrados: state.encontrados,
        zonas: state.zonas,
        barrios: state.barrios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPerdidosIfNeeded: (filtros) => {
            dispatch(fetchPerdidosIfNeeded(filtros))
        },
        fetchEncontradosIfNeeded: (filtros) => {
            dispatch(fetchEncontradosIfNeeded(filtros))
        },
        updatePerdido: (cambio) => {
            dispatch(updatePerdido(cambio))
        },
        updateEncontrado: (cambio) => {
            dispatch(updateEncontrado(cambio))
        },
        fetchBarriosIfNeeded: () => {
            dispatch(fetchBarriosIfNeeded())
        },
        fetchZonasIfNeeded: () => {
            dispatch(fetchZonasIfNeeded())
        },
        saveUpdatePerdido: (update) => {
            dispatch(saveUpdatePerdido(update))
        },
        saveUpdateEncontrado: (update) => {
            dispatch(saveUpdateEncontrado(update))
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnimalEditar));