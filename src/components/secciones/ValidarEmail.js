import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

//Actions
import {validarToken} from "../../actions/AuthenticationActions";

//Components
import Loader from "../../components/elementos/Loader";

//CSS
import "../../assests/css/ValidarEmail.css";

//Librerias
import history from "../../history";

class ValidarEmail extends React.Component {
    constructor(props) {
        super(props);
       this.state = {

       };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.match.params.token) {
            this.props.validarToken('email', this.props.match.params.token);
        } else if (!this.props.authentication.token) {
            history.push("/login");
        } else {
            history.push("/");
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.authentication.errorMessage) {
            setTimeout(() => history.push('/login'), 5000);
        }
    }

    render() {
        return (
            <div className="validar-email">
                <p className="texto">Estamos habilitando tu cuenta, espera un momento...</p>
                <Loader display={true}/>
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
        validarToken: (tipoToken, token) => {
            dispatch(validarToken(tipoToken, token))
        }
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ValidarEmail));