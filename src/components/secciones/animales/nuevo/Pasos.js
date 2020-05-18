import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import "../../../../assests/css/Pasos.css";

class Pasos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render(){
        const props = this.props;
        const paso = props.paso;
        const pasoOne = paso === 1 ? 'active' : paso > 1 ? 'done' : '';
        const pasoTwo = paso === 2 ? 'active' :  paso > 2 ? 'done' : '';
        const pasoThree = paso === 3 ? 'active' : paso > 3 ? 'done' : '';
        const pasoFour = paso === 4 ? 'active' : '';
        return(
            <div className="pasos tarjeta-body">
                <div className="checkout-nav">
                    <div className={"step " + pasoOne}>
                        <div className="bullet" onClick={() => props.goToForm(1)}>
                            1
                        </div>
                        <span>Mi mascota</span>
                    </div>
                    <div className={"step " + pasoTwo}>
                        <div className="bullet" onClick={() => props.goToForm(2)}>
                            2
                        </div>
                        <span>Características</span>
                    </div>
                    <div className={"step " + pasoThree}>
                        <div className="bullet" onClick={() => props.goToForm(3)}>
                            3
                        </div>
                        <span>Particularidades</span>
                    </div>
                    <div className={"step " + pasoFour}>
                        <div className="bullet" onClick={() => props.goToForm(4)}>
                            4
                        </div>
                        <span>Datos del dueño</span>
                    </div>
                </div>
            </div>
        )
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
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pasos));