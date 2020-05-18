import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {saveUpdateUsuario, updateUsuario} from "../../actions/UsuarioActions";

//Boostrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loader from "../elementos/Loader";

//CSS
import "../../assests/css/DatosUsuario.css";

//Librerias
import history from "../../history";

class DatosUsuario extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fueModificado: false,
        }

        this.confirmaPass = React.createRef();
    }

    componentDidMount() {
        if (this.props.usuarios.update.activo.nombre_modificado === undefined) {
            var usuario = [];
            usuario['nombre_modificado'] = this.props.usuarios.update.activo.nombre;
            this.props.updateUsuario(usuario);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.usuarios.update.activo.nombre !== this.props.usuarios.update.activo.nombre) {
           var usuario = [];
           usuario['nombre_modificado'] = this.props.usuarios.update.activo.nombre;
           this.props.updateUsuario(usuario);
        }
    }

    componentWillUnmount() {
        var cambio = {};
        cambio['password'] = "";
        cambio['password_confirmation'] = "";
        cambio['confirmaPass'] = "";
        this.props.updateUsuario(cambio);
    }

    onChangeUsuario(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        if (e.target.id === "confirmaPass") {
            cambio["password_confirmation"] = e.target.value;
        }
        this.props.updateUsuario(cambio);
        let error = "";
        if ((e.target.id === "password" && this.props.usuarios.update.activo.confirmaPass !== e.target.value)
            || (e.target.id === "confirmaPass" && this.props.usuarios.update.activo.password !== e.target.value)) {
            error = "Las contraseñas no coinciden";
        }
        this.confirmaPass.current.setCustomValidity(error);
        if (!this.state.fueModificado) {
            this.setState({
                fueModificado: true
            });
        }
    }

    submitForm(e) {
        e.preventDefault();
        if (this.props.usuarios.update.activo.confirmaPass === this.props.usuarios.update.activo.password) {
            this.props.saveUpdateUsuario();
        }
    }

    render() {
        const usuarioLogueado = this.props.usuarios.update.activo;
        const {fueModificado} = this.state;
        const passwordVacias =
            (usuarioLogueado.password === "" || usuarioLogueado.password === undefined)
            || (usuarioLogueado.password_confirmation === "" || usuarioLogueado.password_confirmation === undefined);

        return (
            <div className="datos-usuario">
                <Form className="tarjeta-body" onSubmit={(e) => {
                    this.submitForm(e)
                }}>
                    <h4>Mis datos</h4>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre_modificado"
                            type="nombre"
                            value={usuarioLogueado ? usuarioLogueado.nombre_modificado : ""}
                            onChange={(e) => this.onChangeUsuario(e)}
                            placeholder="Nombre de usuarios"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            id="email"
                            type="email"
                            value={usuarioLogueado ? usuarioLogueado.email : ""}
                            onChange={(e) => this.onChangeUsuario(e)}
                            placeholder="Email"
                            disabled={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contraseña</Form.Label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            onChange={(e) => this.onChangeUsuario(e)}
                            value={usuarioLogueado ? usuarioLogueado.password : ""}
                            required={!passwordVacias}
                            autoComplete={"new-password"}
                            placeholder="Contraseña"
                            minLength="8"
                        />
                        <Form.Text className="text-muted">
                            Si no desea cambiar la contraseña deje los campos de contraseña vacíos.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contraseña</Form.Label>
                        <input
                            id="confirmaPass"
                            ref={this.confirmaPass}
                            className="form-control"
                            type="password"
                            onChange={(e) => this.onChangeUsuario(e)}
                            value={usuarioLogueado ? usuarioLogueado.confirmaPass : ""}
                            required={!passwordVacias}
                            autoComplete={"new-password"}
                            placeholder="Confirmar Contraseña"
                            minLength="8"
                        />
                    </Form.Group>
                    <Loader display={this.props.usuarios.update.isUpdating}/>
                    <div className="botones" style={{ display: this.props.usuarios.update.isUpdating ? "none" : "flex" }}>
                        <Button 
                            className="boton-submit" variant="primary" type="submit"
                            disabled={!fueModificado}>
                            Actualizar datos
                        </Button>
                        <Button
                                onClick={ () => history.push('/perfil')}
                                className="boton-submit" variant="info" type="submit">
                            Volver
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUsuario: (usuario) => {
            dispatch(updateUsuario(usuario))
        },
        saveUpdateUsuario: () => {
            dispatch(saveUpdateUsuario())
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DatosUsuario));