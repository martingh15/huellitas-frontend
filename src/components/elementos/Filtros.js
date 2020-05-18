import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Actions
import { fetchZonasIfNeeded } from "../../actions/ZonaActions";

//Boostrap
import Form from "react-bootstrap/Form";

//CSS
import '../../assests/css/Filtros.css';

//Images
import arrowUp from '../../assests/icon/up-arrow.svg';
import arrowDown from '../../assests/icon/down-arrow.svg';
import loadingBlack from "../../assests/icon/shapes.svg";


class Filtros extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buscando: false,
        }
    }

    componentDidMount() {
        this.props.fetchZonasIfNeeded();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tipo = this.props.match.params.tipo;
        let prevPropsAnimales = null;
        let propsAnimales = null;
        if (tipo === 'perdidos') {
            prevPropsAnimales = prevProps.perdidos;
            propsAnimales = this.props.perdidos;
        } else if (tipo === 'encontrados') {
            prevPropsAnimales = prevProps.encontrados;
            propsAnimales = this.props.encontrados;
        }
        if (prevPropsAnimales.byId.isFetching && !propsAnimales.byId.isFetching) {
            this.setState({
                buscando: false
            });
        }
    }

    changeDirection() {
        var filtros = {};
        filtros.target = {};
        filtros.target.id = "direction";
        filtros.target.value = this.props.filtros.direction === "ASC" ? "DESC" : "ASC";
        this.changeFiltros(filtros);
    }

    changeFiltros(e) {
        this.setState({
            buscando: true
        });
        this.props.onChangeBusqueda(e);
    }

    render() {
        const props = this.props;
        let buscando = this.state.buscando;
        let tipo = this.props.match.params.tipo;
        let textoFecha = tipo === 'perdidos' ? 'Fecha perdido' : 'Fecha encontrado';
        var opcionesZonas = props.zonas.allIds.map((key) => {
            var zona = props.zonas.byId.zonas[key];
            if (zona) {
                return (
                    <option key={zona.id} id={zona.id} value={zona.id}>{zona.nombre}</option>
                )
            }
            return (<span></span>);
        });
        return (
            <Form className="filtros tarjeta-body">
                <div className="order-by">
                    <Form.Group>
                        <Form.Label>Ordenar por:</Form.Label>
                        <Form.Control
                            id="order"
                            as="select"
                            defaultValue=""
                            onChange={(e) => this.changeFiltros(e)}
                            value={props.order}
                        >
                            <option value="fecha">{textoFecha}</option>
                            <option value="animales.nombre">Nombre</option>
                            <option value="animales.tamanio">Tamaño</option>                         
                        </Form.Control>
                    </Form.Group>
                    <img 
                        onClick={() => this.changeDirection()} 
                        className="direccion" src={props.filtros.direction === "ASC" ? arrowUp : arrowDown} 
                        alt="arrow"
                    />
                </div>
                <div className="contenedor-filtros">
                    <Form.Label className="texto-filtrar">Filtrar por:</Form.Label>
                    <div className="filter-by">                       
                        <Form.Group>
                            <Form.Label className="tipo">Tipo</Form.Label>
                            <Form.Control
                                id="tipo"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.changeFiltros(e)}
                                value={props.filtros.tipo}
                            >
                                <option value="">Ambos</option>
                                <option value="perro">Perros</option>
                                <option value="gato">Gatos</option>

                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sexo</Form.Label>
                            <Form.Control
                                id="sexo"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.changeFiltros(e)}
                                value={props.filtros.sexo}
                            >
                                <option value="">Ambos</option>
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
                                onChange={(e) => this.changeFiltros(e)}
                                value={props.filtros.castrado}
                            >
                                <option value="">Ambos</option>
                                <option value={1}>Sí</option>
                                <option value={0}>No</option>

                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="filter-by">
                        <Form.Group>
                            <Form.Label>Zona</Form.Label>
                            <Form.Control
                                id="idZona"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.changeFiltros(e)}
                                value={props.filtros.idZOna}
                            >
                                <option value="">Todas las zonas</option>
                                {opcionesZonas}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tamaño</Form.Label>
                            <Form.Control
                                id="tamanio"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.changeFiltros(e)}
                                value={props.filtros.tamanio}
                            >
                                <option value="">Todas los tamaños</option>
                                <option value={1}>Pequeño</option>
                                <option value={2}>Mediano</option>
                                <option value={3}>Grande</option>
                                
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="filter-by edadAproximada">                        
                        <Form.Group>
                            <Form.Label>Edad</Form.Label>
                            <Form.Control
                                id="edadAproximada"
                                as="select"
                                defaultValue=""
                                onChange={(e) => this.changeFiltros(e)}
                                value={props.filtros.edadAproximada}
                            >
                                <option value="">Todas las edades</option>
                                <option value={1}>45 días a 2 años</option>
                                <option value={2}>2 años a 10 años</option>
                                <option value={3}>10 años o más</option>

                            </Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <img style={{ display: buscando ? "block" : "none" }} className="loading" src={loadingBlack} alt="Loading" />
            </Form>
        );
    }
}

function mapStateToProps(state) {
    return {
        zonas: state.zonas,
        perdidos: state.perdidos,
        encontrados: state.encontrados
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchZonasIfNeeded: () => {
            dispatch(fetchZonasIfNeeded())
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Filtros));
