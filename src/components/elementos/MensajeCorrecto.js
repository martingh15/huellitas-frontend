import React from "react";
import SweetAlert from "react-bootstrap-sweetalert"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class MensajeCorrecto extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mostrar: false,
            procesoFinalizado: false,
            mensajes: [],
            titulo: ""
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.mostrar) {
            this.setState({mostrar: true});
            setTimeout(() => this.setState({
                mostrar: false,
                mensajes: []
            }), 8000);
        }

        var procesoFinalizado = false;
        var mensajes = this.state.mensajes;
        var titulo = "";
        Object.entries(this.props.todos).forEach(
            ([key, value]) => {
                var valuePrev = prevProps.todos[key];
                if (valuePrev && value && !value.currentlySending && valuePrev.currentlySending && !value.errorMessage && value.mensajeCorrecto) {
                    mensajes.push(value.mensajeCorrecto);
                    procesoFinalizado = true;
                }
                if (value.create && valuePrev && valuePrev.create && !value.create.isCreating && valuePrev.create.isCreating && !value.create.error && value.create.success) {
                    mensajes.push(value.create.success);
                    procesoFinalizado = true;
                }
                if (value.update && valuePrev && valuePrev.update && !value.update.isUpdating && valuePrev.update.isUpdating && !value.update.error) {
                    key = key.slice(0, key.length - 1);
                    mensajes.push(key.charAt(0).toUpperCase() + key.slice(1) + " actualizado correctamente.");
                    procesoFinalizado = true;
                }
                if (value.delete && valuePrev && valuePrev.delete && !value.delete.isDeleting && valuePrev.delete.isDeleting && !value.delete.error) {
                    mensajes.push(key.toUpperCase() + " borrados correctamente");
                    procesoFinalizado = true;
                }
            }
        );
        if (this.state.mostrar !== procesoFinalizado && procesoFinalizado) {
            this.setState({
                mostrar: procesoFinalizado,
                titulo: titulo
            });
            setTimeout(() => this.setState({mostrar: false, mensajes: []}), 8000);
        }
    }


    render() {
        const {mostrar, titulo, mensajes} = this.state;
        if (mensajes)
            var Mensajes = mensajes.slice(-3).map((mensaje, index) => {
                return (<p key={index}><span className="glyphicon glyphicon-check"
                                             style={{marginTop: "10px", width: "20px"}}/> {mensaje}</p>);
            });
        return (
            <div>
                <SweetAlert title={titulo} success onConfirm={() => {
                    this.setState({mostrar: false, mensajes: []})
                }} show={mostrar}
                            confirmBtnBsStyle="success" confirmBtnText="Aceptar">
                    {Mensajes}
                </SweetAlert>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        todos: state,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {}
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MensajeCorrecto));
