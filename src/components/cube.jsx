// 方格
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { ChessValueSystem } from '../conf/config'

let system = new ChessValueSystem('edu')

class Cube extends PureComponent {
    constructor(props) {
        super(props)
    }
    getClass() {
        let numValue = system.parse(this.props.value)
        let classname = "cube cube-" + numValue + ' cube-position-' + this.props.locate;
        if (this.props.isMerge) {
            classname += ' cube-merged';
        }
        if (this.props.isNew) {
            classname += ' cube-new';
        }
        return classname;
    }
    render() {
        let className = "cube-inner";
        return (
        <div className={this.getClass()}>
            <div className="cube-inner">
                {this.props.value}
            </div>
        </div>)
    }
}

export default Cube;