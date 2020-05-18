import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

//Actions
import {changeLogin, login, olvideMiPassword} from "../../actions/AuthenticationActions";

//CSS
import '../../assests/css/Login.css';

//Boostrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Loader from "../elementos/Loader";

//Librerias
import history from "../../history";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.email = React.createRef();
    }

    componentDidMount() {
        if (this.props.authentication.token) {
            history.push('/');
        }
    }

    onChangeUsuario(e) {
        var cambio = {};
        cambio[e.target.id] = e.target.value;
        this.props.changeLogin(cambio);
        if (e.target.id === 'email') {
            this.setState({
                validarEmail: ''
            });
        }
    }

    submitForm(e) {
        e.preventDefault();
        this.props.login(this.props.authentication.usuario);
    }

    olvideMiPassword(e) {
        e.preventDefault();
        if (this.email.current.value !== "" && this.email.current.checkValidity()) {
            this.setState({
                validarEmail: ''
            });
            this.props.olvideMiPassword(this.props.authentication.usuario);
        } else {
            this.setState({
                validarEmail: 'El campo email no debe estar vacío y debe tener formato de email'
            })
        }

    }

    render() {
        const nuevoUsuario = this.props.usuarios.create.nuevo;
        return (
            <div className="login">
                <Form className="tarjeta-body" onSubmit={(e) => {this.submitForm(e)}}>
                    <h4>Ingreso</h4>
                    <Form.Group>
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            id="email"
                            ref={this.email}
                            type="email"
                            value={nuevoUsuario ? nuevoUsuario.email : ""}
                            onChange={(e) => this.onChangeUsuario(e)}
                            placeholder="Ingresar email"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contraseña</Form.Label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                                value={nuevoUsuario ? nuevoUsuario.password : ""}
                            onChange={(e) => this.onChangeUsuario(e)}
                            placeholder="Contraseña"
                            minLength="8"
                        />
                    </Form.Group>
                    <span className="olvide-password" onClick={(e) => this.olvideMiPassword(e)}>
                        Olvide mi contraseña
                    </span>
                    <p className="email-valido">{this.state.validarEmail}</p>
                    {
                        this.props.authentication.currentlySending ?
                            <Loader display={true} />
                            :
                            <Button className="boton-submit" variant="primary" type="submit">
                                Iniciar sesión
                            </Button>
                    }
                </Form>
            </div>
        );
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
        changeLogin: (usuario) => {
            dispatch(changeLogin(usuario))
        },
        login: (usuario, to) => {
            dispatch(login(usuario, to))
        },
        olvideMiPassword: (usuario) => {
            dispatch(olvideMiPassword(usuario))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

