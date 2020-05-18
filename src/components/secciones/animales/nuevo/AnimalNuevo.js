import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

//CSS
import "../../../../assests/css/AnimalesNuevo.css";

//Components
import Caracteristicas from "./Caracteristicas";
import DatosDuenio from "./DatosDuenio";
import MiMascota from "./MiMascota";
import Particularidades from "./Particularidades";
import Pasos from "./Pasos";

//Librerias
import history from '../../../../history';
import Swal from 'sweetalert2';

class AnimalNuevo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paso: 1
        };
    }

    componentDidMount() {
        if (!this.props.authentication.token) {
            Swal.fire({
                title: 'Usuario no logueado',
                icon: 'info',
                html:
                    `Debe estar no logueado para cargar una mascota`,
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: 'Aceptar',
            }).then(() => {
                history.push("/login");
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.authentication.token) {
            Swal.fire({
                title: 'Usuario no logueado',
                icon: 'info',
                html:
                    `Debe estar no logueado para cargar una mascota`,
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: 'Aceptar',
            }).then(() => {
                history.push("/login");
            });
        }
    }

    changePaso(paso) {
        this.setState({
            paso: paso
        });
    }

    validarDatosMiMascota() {
        const perdido = this.props.perdidos.create.nuevo;
        let errores = [];
        if (perdido && perdido.animal) {
            if (perdido.animal.nombre === undefined || perdido.animal.nombre === "") {
                errores.push("Nombre");
            }
            if (perdido.animal.imagenPrincipal === undefined || perdido.animal.imagenPrincipal === "") {
                errores.push("Imagen principal");
            }
            if (perdido.animal.idZona === undefined || perdido.animal.idZona === "") {
                errores.push("Zona");
            }
        }

        if (perdido.fecha === undefined || perdido.fecha === "") {
            errores.push("Fecha");
        }
        return errores;
    }

    validarDatosCaracteristicas() {
        const perdido = this.props.perdidos.create.nuevo;
        const mascota = perdido.animal;
        let errores = [];
        if (perdido && mascota && (mascota.sexo === undefined || mascota.sexo === "")) {
            errores.push("Sexo");
        }
        if (perdido && mascota && (mascota.castrado === undefined || mascota.castrado === "")) {
            errores.push("Castrado");
        }
        if (perdido && mascota && (mascota.tamanio === undefined || mascota.tamanio === "")) {
            errores.push("Tamaño");
        }
        if (perdido && mascota && (mascota.edadAproximada === undefined || mascota.edadAproximada === "")) {
            errores.push("Edad");
        }
        return errores;
    }

    validarDatosDuenio() {
        const perdido = this.props.perdidos.create.nuevo;
        let errores = [];
        if (perdido.celularDuenio === undefined || perdido.celularDuenio === "") {
            errores.push("Celular");
        }
        if (perdido.celularDuenioRepetido === undefined || perdido.celularDuenioRepetido === "") {
            errores.push("Confirmar Celular");
        }
        if (perdido.celularDuenio !== perdido.celularDuenioRepetido) {
            errores.push("No coincide la confirmación del celular");
        }
        return errores;
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

    redirectTo(paso) {
        let erroresPaso1 = this.validarDatosMiMascota();
        let erroresPaso2 = this.validarDatosCaracteristicas();
        switch (paso) {
            case 1:
                this.changePaso(1);
                break;
            case 2:
                if (erroresPaso1.length > 0) {
                    this.changePaso(1);
                    this.showErrores(erroresPaso1);
                } else {
                    this.changePaso(2);
                }
                break;
            case 3:
                if (erroresPaso2.length > 0) {
                    this.redirectTo(2);
                } else {
                    this.changePaso(3);
                }
                break;
            case 4:
                if (erroresPaso2.length > 0) {
                    this.redirectTo(2);
                } else {
                    this.changePaso(4);
                }
                break;
            default:
                this.changePaso(1);
                break;
        }
    }

    render() {
        const {paso} = this.state;
        return (
            <div className="animales-nuevo">
                <Pasos
                    paso={paso}
                    goToForm={(paso) => this.redirectTo(paso)}
                />
                <div className="tarjeta-body">
                    <MiMascota
                        paso={paso}
                        validarCampos={() => this.validarDatosMiMascota()}
                        showErrores={(e) => this.showErrores(e)}
                        changePaso={(paso) => this.changePaso(paso)}
                    />
                    <Caracteristicas
                        paso={paso}
                        validarCampos={() => this.validarDatosCaracteristicas()}
                        showErrores={(e) => this.showErrores(e)}
                        changePaso={(paso) => this.changePaso(paso)}
                    />
                    <Particularidades
                        paso={paso}
                        changePaso={(paso) => this.changePaso(paso)}
                    />
                    <DatosDuenio
                        paso={paso}
                        validarCampos={() => this.validarDatosDuenio()}
                        showErrores={(e) => this.showErrores(e)}
                        changePaso={(paso) => this.changePaso(paso)}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        perdidos: state.perdidos,
        authentication: state.authentication,
        usuarios: state.usuarios
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnimalNuevo));