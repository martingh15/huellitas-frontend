import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

//Actions
import { invalidatePerdidos, fetchPerdidosIfNeeded, resetPerdidos} from "../../../actions/PerdidoActions";
import { invalidateEncontrados, fetchEncontradosIfNeeded, resetEncontrados } from "../../../actions/EncontradoActions";

//Components
import AnimalPerdido from "../../elementos/AnimalPerdido";
import Filtros from "../../elementos/Filtros";

//CSS
import "../../../assests/css/AnimalesListar.css";

//Librerias
import $ from "jquery";
import history from '../../../history';

class AnimalesListar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtros: {
                order: 'fecha',
                direction: 'ASC',
                tipo: '',
                castrado: '',
                sexo: '',
                idZona: '',
                edadAproximada: '',
                tamanio: '',
                registros: 0,
                hayMasAnimales: true,
                noHayAnimales: false,
            }
        };

        this.getMoreAnimales = this.getMoreAnimales.bind(this);
        this.buscarAnimales = this.buscarAnimales.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.getMoreAnimales);
        let tipo = this.props.match.params.tipo;
        let filtros = this.state.filtros;
        if (tipo !== 'perdidos' && tipo !== 'encontrados') {
            history.push("/");
        }
        this.setState({
            tipo: tipo
        }, () => {                
            this.buscarAnimales(filtros);
        });        
        
        //Refresco cada 2 minutos la lista de animales
        let intervalId = setInterval(
            () => {
                this.buscarAnimales(filtros);
            }, 120000
        );
        //se guarda el id del setInterval para poder pararlo cuando se desmonta
        this.setState({ 
            intervalId: intervalId
        });
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
        if (prevPropsAnimales.byId.isFetching && !propsAnimales.byId.isFetching && prevPropsAnimales.allIds.length === propsAnimales.allIds.length) {
            this.setState({ hayMasAnimales: false });
            if (propsAnimales.allIds.length === 0) {
                this.setState({
                    noHayAnimales: true,
                })
            }
        }
        if (prevProps.match.params.tipo !== tipo
            && (tipo === 'perdidos' || tipo === 'encontrados')) {
            this.props.invalidatePerdidos();
            this.props.resetPerdidos();
            this.props.invalidateEncontrados();
            this.props.resetEncontrados();
            this.setState({
                tipo: tipo,
                filtros: {
                    order: 'fecha',
                    direction: 'ASC',
                    tipo: '',
                    castrado: '',
                    sexo: '',
                    idZona: '',
                    edadAproximada: '',
                    tamanio: 0,
                    registros: 0,
                    hayMasAnimales: true,
                    noHayAnimales: false,
                }
            }, () => {
                    this.buscarAnimales(this.state.filtros);
            });
        } else if (typeof tipo === "string" && tipo !== 'perdidos' && tipo !== 'encontrados') {
            history.push("/");
        }
    }

    componentWillUnmount() {
        //Paro el setInterval que refresca la lista de pedidos
        clearInterval(this.state.intervalId);
        this.setState({
            intervalId: null,
        });
        
        window.removeEventListener('scroll', this.getMoreAnimales);
    }

    onChangeBusqueda(e) {
        let filtros = this.state.filtros;
        filtros[e.target.id] = e.target.value;
        this.setState({
            filtros: filtros,
        });
        this.buscarAnimales(filtros);
    }

    buscarAnimales(filtros) {
        if (this.state.tipo === 'perdidos') {
            this.props.invalidatePerdidos();
            this.props.resetPerdidos();
            this.props.fetchPerdidosIfNeeded({
                order: filtros.order,
                direction: filtros.direction,
                tipo: filtros.tipo,
                sexo: filtros.sexo,
                tamanio: filtros.tamanio,
                edadAproximada: filtros.edadAproximada,
                idZona: filtros.idZona,
                castrado: filtros.castrado,
                registros: filtros.registros,
            });
        } else {
            this.props.invalidateEncontrados();
            this.props.resetEncontrados();
            this.props.fetchEncontradosIfNeeded({
                order: filtros.order,
                direction: filtros.direction,
                tipo: filtros.tipo,
                sexo: filtros.sexo,
                tamanio: filtros.tamanio,
                edadAproximada: filtros.edadAproximada,
                idZona: filtros.idZona,
                castrado: filtros.castrado,
                registros: filtros.registros,
            });
        }
        
    }

    getMoreAnimales() {
        if ($(window).scrollTop() + $(window).height() === $(document).height()) {
            let filtros = this.state.filtros;
            if (this.state.tipo === 'perdidos') {
                this.props.invalidatePerdidos();
                this.props.fetchPerdidosIfNeeded({
                    order: filtros.order,
                    direction: filtros.direction,
                    tipo: filtros.tipo,
                    sexo: filtros.sexo,
                    tamanio: filtros.tamanio,
                    edadAproximada: filtros.edadAproximada,
                    idZona: filtros.idZona,
                    castrado: filtros.castrado,
                    registros: this.props.perdidos.allIds.length
                });
            } else {
                this.props.invalidateEncontrados();
                this.props.fetchEncontradosIfNeeded({
                    order: filtros.order,
                    direction: filtros.direction,
                    tipo: filtros.tipo,
                    sexo: filtros.sexo,
                    tamanio: filtros.tamanio,
                    edadAproximada: filtros.edadAproximada,
                    idZona: filtros.idZona,
                    castrado: filtros.castrado,
                    rregistros: this.props.encontrados.allIds.length
                });
            }
        }
    }

    render() {
        let tipo = this.state.tipo;
        let animales = null;
        let fetching = false;
        if (tipo === 'perdidos') {
            animales = this.props.perdidos
            fetching = this.props.perdidos.byId.isFetching;
        } else if (tipo === 'encontrados') {
            animales = this.props.encontrados
            fetching = this.props.encontrados.byId.isFetching;
        }
        const tarjetasAnimales = animales ? animales.allIds.map((key) => {
            let animal = null;
            if (tipo === 'perdidos') {
                animal = animales.byId.perdidos[key];
            } else if (tipo === 'encontrados') {
                animal = animales.byId.encontrados[key];
            }            
            if (animal) {
                return (
                    <AnimalPerdido key={animal.id} animal={animal} />
                );
            }
            return "";
        }) : [];

        return (
            <div className="animales-listar">
                <Filtros 
                    filtros={this.state.filtros}
                    onChangeBusqueda={(e) => this.onChangeBusqueda(e)}
                />
                <div 
                    className="lista" 
                    style={{ 
                        display: tarjetasAnimales.length > 0 ? "grid" : "none",

                    }}
                >
                    {tarjetasAnimales}
                </div>
                <div style={{ display: !fetching && tarjetasAnimales.length === 0 && this.state.noHayAnimales ? "block" : "none"}} className="no-hay-animales tarjeta-body">
                   <h1>No hay animales para estos filtros</h1>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
        perdidos: state.perdidos,
        encontrados: state.encontrados
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPerdidosIfNeeded: (filtros) => {
            dispatch(fetchPerdidosIfNeeded(filtros))
        },
        invalidatePerdidos: () => {
            dispatch(invalidatePerdidos())
        },
        resetPerdidos: () => {
            dispatch(resetPerdidos())
        },
        fetchEncontradosIfNeeded: (filtros) => {
            dispatch(fetchEncontradosIfNeeded(filtros))
        },
        invalidateEncontrados: () => {
            dispatch(invalidateEncontrados())
        },
        resetEncontrados: () => {
            dispatch(resetEncontrados())
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnimalesListar));