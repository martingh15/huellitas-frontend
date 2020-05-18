import React from 'react';

//CSS
import '../../assests/css/NotFound.css';

//Librerias
import history from "../../history";

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.setState({
            timeout: setTimeout(() => {
                history.push('/');
            }, 4000)
        })
    }

    componentWillUnmount() {
        clearTimeout(this.state.timeout);
    }

    render() {
        return (
            <div className="not-found">
                <div className="tarjeta-body">
                    <h4>Página no encontrada, será redirigido en unos instantes</h4>
                </div>
            </div>
        );
    }
}

export default NotFound;
