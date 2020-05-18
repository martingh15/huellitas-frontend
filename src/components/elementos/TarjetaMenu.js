import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "../../assests/css/TarjetaMenu.css";

class TarjetaMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const props = this.props;
        return (
            <div className="tarjeta-menu">
                <div className={"tarjeta hvr-grow"} onClick={props.click}>
                    <h2>{props.titulo}</h2>
                    <img src={props.img} alt={props.alt} title={props.title} />
                    <p>{props.descripcion}</p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TarjetaMenu));