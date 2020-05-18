import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//CSS
import '../../assests/css/Multiselect.css';

//Images
import arrow from '../../assests/icon/arrow-down.svg';
import tickVerde from '../../assests/icon/tickVerde.svg';

class Multiselect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandir: false,
            respuestas: [],
            placeHolder: ''
        }

        this.timer = null;
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.changePlaceHolder(this.props.respuestas);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let respuestas = this.props.respuestas;
        if (prevProps.respuestas !== respuestas) {
            this.changePlaceHolder(respuestas);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        clearInterval(this.timer);
        this.timer = null;
    }

    changePlaceHolder(respuestas) {
        let placeHolder = "";
        if (respuestas.indexOf(1) !== -1) {
            placeHolder = 'Pequeño,';
        }
        if (respuestas.indexOf(2) !== -1) {
            placeHolder = placeHolder + ' Mediano,';
        }
        if (respuestas.indexOf(3) !== -1) {
            placeHolder = placeHolder + ' Grande,';
        }
        if (placeHolder.length === 0) {
            placeHolder = "Tamaño";
        } else {
            placeHolder = placeHolder.substring(0, placeHolder.length - 1);
        }
        this.setState({
            placeHolder: placeHolder
        });
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
           this.setState({
               expandir: false
           });
        }
    }

    expandir() {
        this.setState(prevState => ({
            expandir: !prevState.expandir,
        }));
    }

    onChangeCheck(id) {
        let respuestas = this.props.respuestas;        
        var encontrado = respuestas.indexOf(id);
        if (encontrado !== -1) {
            let cambio = id + ",";
            respuestas = respuestas.replace(cambio, "");
        } else {            
            if (id === 1) {
                respuestas = respuestas.replace("3,", "");
            } else if (id === 3) {
                respuestas = respuestas.replace("1,", "");
            }
            respuestas = respuestas + id + ",";
        }
        this.setState({
            respuestas: respuestas
        });
        var e = {};
        e.target = {};
        e.target.id = this.props.id;
        e.target.value = respuestas;
        this.props.onChangeBusqueda(e, true);
    }

    render() {
        const { placeHolder } = this.state;
        const props = this.props;
        let respuestas = this.props.respuestas;
        const valores = props.valores.map((valor) => {
            var indexOf = respuestas.indexOf(valor.id.toString());
            var encontrado = indexOf !== -1;
            return (
                <div 
                    style={{ 
                        backgroundColor: encontrado ? "#007bff" : "white",
                        color: encontrado  ? "white" : "black"
                    }} className="opcion-valor" onClick={() => this.onChangeCheck(valor.id)}>
                    <p>{valor.nombre}</p>
                </div>
            );
        });
        return(
            <div className="contenedor-multiple" ref={this.setWrapperRef}>
                <div className="contenedor-valor">
                    <label>{props.campo}</label>
                    <div className="contenedor-todos-valores">
                        <div className="contenedor-placeholder" onClick={() => this.expandir()}>
                            <p>{placeHolder}</p>
                            <img className={this.state.expandir ? "rotar" : ""} src={arrow} alt="Arrow"/>
                        </div>
                        <div className={this.state.expandir ? "contenedor-valores expandir" : "contenedor-valores"}>
                            {valores}
                        </div>                        
                    </div>                    
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
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Multiselect));