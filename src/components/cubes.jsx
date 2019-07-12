import React, { PureComponent } from 'react'
import Cube from './cube'

class Cubes extends PureComponent {
    //你在父组件里面改变props传值的时候触发的函数
	componentWillReceiveProps(){
		console.log('父子组件传值，父组件里面改变了props的值触发的方法')
    }
    componentDidUpdate() {
        console.log(11, this, 22)
    }
    render() {
        // let flatCubes = this.props.cubes.flat()
        // const cubes = flatCubes.map((item, index) =>
        //     <Cube value={item} locate={ (index % 4 + 1) + '-' + (parseInt(index / 4) + 1) } 
        //         key={(index % 4 + 1) + '-' + (parseInt(index / 4) + 1)}
        //         isMerge={this.props.mergedGrids[index]} 
        //         isNew={this.props.newGrids[index]} />

        // )
        let self = this;
        const renderItems = function(item, index, indexy) {
            if (item != '') {
                if (item instanceof Array)  {
                    return item.map((aitem, indexz) => {
                        return (<Cube value={aitem.value} locate={ (indexy + 1) + '-' + (index + 1) } 
                            key={aitem.id}
                            isMerge={self.props.mergedGrids[item.id]} 
                            isNew={self.props.newGrids[item.id]} />)
                    })
                }
                else {
                    return (<Cube value={item.value} locate={ (indexy + 1) + '-' + (index + 1) } 
                        key={item.id}
                        isMerge={self.props.mergedGrids[item.id]} 
                        isNew={self.props.newGrids[item.id]} />)
                }
            }
        }

        const cubes = this.props.cubes.map((row, index) => 
            row.map((item, indexy) => {
                return (renderItems(item, index, indexy))
            })
        )

        return (
            <div className="cube-container">
                {cubes}
            </div>
        )
    }
}

export default Cubes;