import React from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

//Boostrap
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

//Librerias
import isObject from "lodash/isObject";
import isString from "lodash/isString";

class MensajeError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mostrar: false, error: null};
    }

    componentDidUpdate(prevProps) {
        let error = null;
        Object.entries(this.props.state).forEach(
            ([key, value]) => {
                var valuePrev = prevProps.state[key];
                if (value.create && valuePrev && valuePrev.create && !value.create.isCreating && valuePrev.create.isCreating && value.create.error) {
                    error = value.create.error;
                }
                if (value.update && valuePrev && valuePrev.update && !value.update.isUpdating && valuePrev.update.isUpdating && value.update.error) {
                    error = value.update.error;
                }
                if (value.delete && valuePrev && valuePrev.delete && !value.delete.isDeleting && valuePrev.delete.isDeleting && value.delete.error) {
                    error = value.delete.error;
                }
                if (value.validate && valuePrev && valuePrev.validate && !value.validate.isValidating && valuePrev.validate.isValidating && value.validate.error) {
                    error = value.validate.error;
                }
                if (value.byId && valuePrev && valuePrev.byId && !value.byId.isCreating && valuePrev.byId.isCreating && value.byId.error) {
                    error = value.byId.error;
                }
                //Authentication
                if (value.errorMessage !== valuePrev.errorMessage) {
                    error = value.errorMessage;
                }
            });
        if (this.state.mostrar !== (error !== null) && error !== null && error.length > 0) {
            this.setState({mostrar: true, error: error});
        }
}


    render() {
        const {mostrar, error} = this.state;

        var msgError = "";

        //if (isObject(error.message) && !isString(error.message)) {
        if (Array.isArray(error) && !isString(error)) {
            msgError = error.map(function(er) {
                return (<li>{er}</li>);
            });
        } else{
            msgError = <p>{error}</p>;
        }

        return (
            <Modal show={mostrar} onHide={() => {
                this.setState({mostrar: false})
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {msgError}
                    <p className="text-warning">
                        <small>Intentelo nuevamente.</small>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="danger" onClick={() => {
                        this.setState({mostrar: false})
                    }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state,
    };
}

// Wrap the component to inject dispatch and state into it
export default withRouter(connect(mapStateToProps)(MensajeError));
