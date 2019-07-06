import React, { PureComponent } from 'react'
import Cube from './cube'

class Cubes extends PureComponent {
    render() {
        let flatCubes = this.props.cubes.flat()
        const cubes = flatCubes.map((item, index) =>
            <Cube value={item} locate={ (index % 4 + 1) + '-' + (parseInt(index / 4) + 1) } 
                key={(index % 4 + 1) + '-' + (parseInt(index / 4) + 1)}
                isMerge={this.props.mergedGrids[index]} 
                isNew={this.props.newGrids[index]} />

        )

        // const cubes = this.props.cubes.map((row, index) => 
        //     row.map((item, indexy) => 
        //         <Cube value={item} locate={ (indexy + 1) + '-' + (index + 1) } 
        //             key={(indexy + 1) + '-' + (index + 1)}
        //             isMerge={this.props.mergedGrids[index * 4 + indexy]} 
        //             isNew={this.props.newGrids[index * 4 + indexy]} />
        //     )
        // )

        return (
            <div className="cube-container">
                {cubes}
            </div>
        )
    }
}

export default Cubes;