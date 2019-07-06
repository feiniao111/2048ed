import React, { PureComponent } from 'react';
import {CHESS_BOARD_LENGTH} from '../conf/config';
let _ = require('lodash');

class ChessBoard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const rows = _.range(0, CHESS_BOARD_LENGTH)
        const cols = _.range(0, CHESS_BOARD_LENGTH)
        const squares = rows.map((row, index) =>
            <div className="grid-row" key={index}>
                {cols.map(col =>
                    <React.Fragment key={row * 4 + col}>
                        {/* <Cube value={'博士后'} bgColor="green"/> */}
                        <div className="grid-cell"></div>
                    </React.Fragment>
                )}
            </div>
        )
        return (
            <div className="grid-container">
                {squares}
            </div>
        )
    }
}

export default ChessBoard