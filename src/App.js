import React, { PureComponent } from 'react';
import ChessBoard from './components/chessBoard'
import Cubes from './components/cubes'
import {CHESS_BOARD_LENGTH, ChessValueSystem} from './conf/config';
let _ = require('lodash');
import './App.css'

const system = new ChessValueSystem('edu')
const layer = window.layer || {}

/**
 * [ 
 *   ['', '', '', ''],
 *   ['', '', '', ''],
 *   ['', '', '', ''],
 *   ['', '', '', ''] 
 * ]
 * @param {*} len 
 */
let initialBlankCubes = function(len) { 
    if (len <= 0) {
        return null;
    }
    let arrs = Array(len)
    for(let i = 0; i < len; i++) {
        arrs[i] = []
        let arr = arrs[i]
        for (let j = 0; j < len; j++) {
            arr.push('')
        }
    }
    return arrs;
}

let cmpArrays = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

class Game extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            cubes: initialBlankCubes(CHESS_BOARD_LENGTH),
            mergedGrids: {},
            newGrids: {},
            highestEducation: ''
        }
    }

    handleMoveRight() {
        let tmpCubes = this.state.cubes;
        // let tmpCubes = this.state.cubes.slice(0);
        let tmpMergedGrids = {};
        let tmpHighestEducation = this.state.highestEducation;
        let len = tmpCubes.length;
        let isMoved = false; // 是否有格子发生移动
        for (let row = 0; row < len; row++) {
            let tmpArr = []; // 存放移动、合并后的数据
            let arr = tmpCubes[row];
            
            let isTailMerged = false; // tmpArr的尾部是否发生合并
            for (let j = arr.length - 1; j >= 0; j--) {
                if (arr[j] !== '') {
                    if (tmpArr.length === 0) {
                        tmpArr.push(arr[j]);
                    } else {
                        if (!isTailMerged) {
                            if (tmpArr[tmpArr.length - 1] === arr[j]) {
                                let oldVal = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldVal, arr[j]);
                                tmpArr.push(mergeValue);
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                // 记录合并的位置
                                tmpMergedGrids[row * arr.length + arr.length - tmpArr.length] = 1; // 因为tmpArr翻转过来，，才是改行移动、合并的数据
                            } else {
                                tmpArr.push(arr[j]);
                            }
                        } else {
                            tmpArr.push(arr[j]);
                            isTailMerged = false;
                        }
                    }
                }
            }
            // tmpArr的末尾填上空格
            for (let k = tmpArr.length; k < arr.length; k++) {
                tmpArr.push('');
            }
            tmpArr = tmpArr.reverse(); // 这是移动、合并后的数据
            if (cmpArrays(arr, tmpArr) === false) {
                isMoved = true;
                tmpCubes[row] = tmpArr;
            }
        }

        // 如果有发生移动，则随机在一处空白格子生成新的值
        this.afterMove(isMoved, tmpCubes, tmpMergedGrids, tmpHighestEducation);
    }

    handleMoveLeft() {
        let tmpCubes = this.state.cubes;
        // let tmpCubes = this.state.cubes.slice(0);
        let tmpMergedGrids = {};
        let tmpHighestEducation = this.state.highestEducation;
        let len = tmpCubes.length;
        let isMoved = false; // 是否有格子发生移动
        for (let row = 0; row < len; row++) {
            let tmpArr = []; // 存放移动、合并后的数据
            let arr = tmpCubes[row];
            
            let isTailMerged = false; // tmpArr的尾部是否发生合并
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] !== '') {
                    if (tmpArr.length === 0) {
                        tmpArr.push(arr[j]);
                    } else {
                        if (!isTailMerged) {
                            if (tmpArr[tmpArr.length - 1] === arr[j]) {
                                let oldVal = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldVal, arr[j]);
                                tmpArr.push(mergeValue);
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                // 记录合并的位置
                                tmpMergedGrids[row * arr.length + tmpArr.length - 1] = 1; 
                            } else {
                                tmpArr.push(arr[j]);
                            }
                        } else {
                            tmpArr.push(arr[j]);
                            isTailMerged = false;
                        }
                    }
                }
            }
            // tmpArr的末尾填上空格
            for (let k = tmpArr.length; k < arr.length; k++) {
                tmpArr.push('');
            }
            if (cmpArrays(arr, tmpArr) === false) {
                isMoved = true;
                tmpCubes[row] = tmpArr;
            }
        }

        // 如果有发生移动，则随机在一处空白格子生成新的值
        this.afterMove(isMoved, tmpCubes, tmpMergedGrids, tmpHighestEducation);
    }

    handleMoveUp() {
        let tmpCubes = this.state.cubes;
        // let tmpCubes = this.state.cubes.slice(0);
        let tmpMergedGrids = {};
        let tmpHighestEducation = this.state.highestEducation;
        let len = tmpCubes.length;
        let isMoved = false; // 是否有格子发生移动
        for (let col = 0; col < len; col++) {
            let tmpArr = []; // 存放移动、合并后的数据
            let arr = tmpCubes.map(arr => arr[col]);
            
            let isTailMerged = false; // tmpArr的尾部是否发生合并
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] !== '') {
                    if (tmpArr.length === 0) {
                        tmpArr.push(arr[j]);
                    } else {
                        if (!isTailMerged) {
                            if (tmpArr[tmpArr.length - 1] === arr[j]) {
                                let oldVal = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldVal, arr[j]);
                                tmpArr.push(mergeValue);
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                // 记录合并的位置
                                tmpMergedGrids[(tmpArr.length - 1) * arr.length + col] = 1; 
                            } else {
                                tmpArr.push(arr[j]);
                            }
                        } else {
                            tmpArr.push(arr[j]);
                            isTailMerged = false;
                        }
                    }
                }
            }
            // tmpArr的末尾填上空格
            for (let k = tmpArr.length; k < arr.length; k++) {
                tmpArr.push('');
            }
            if (cmpArrays(arr, tmpArr) === false) {
                isMoved = true;
                for (let row = 0; row < arr.length; row++) {
                    tmpCubes[row][col] = tmpArr[row];
                }
            }
        }

        // 如果有发生移动，则随机在一处空白格子生成新的值
        this.afterMove(isMoved, tmpCubes, tmpMergedGrids, tmpHighestEducation);
    }

    handleMoveDown() {
        let tmpCubes = this.state.cubes;
        // let tmpCubes = this.state.cubes.slice(0);
        let tmpMergedGrids = {};
        let tmpHighestEducation = this.state.highestEducation;
        let len = tmpCubes.length;
        let isMoved = false; // 是否有格子发生移动
        for (let col = 0; col < len; col++) {
            let tmpArr = []; // 存放移动、合并后的数据
            let arr = tmpCubes.map(arr => arr[col]);
            
            let isTailMerged = false; // tmpArr的尾部是否发生合并
            for (let j = arr.length - 1; j >= 0; j--) {
                if (arr[j] !== '') {
                    if (tmpArr.length === 0) {
                        tmpArr.push(arr[j]);
                    } else {
                        if (!isTailMerged) {
                            if (tmpArr[tmpArr.length - 1] === arr[j]) {
                                let oldVal = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldVal, arr[j]);
                                tmpArr.push(mergeValue);
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                // 记录合并的位置
                                tmpMergedGrids[(arr.length - tmpArr.length) * arr.length + col] = 1; 
                            } else {
                                tmpArr.push(arr[j]);
                            }
                        } else {
                            tmpArr.push(arr[j]);
                            isTailMerged = false;
                        }
                    }
                }
            }
            // tmpArr的末尾填上空格
            for (let k = tmpArr.length; k < arr.length; k++) {
                tmpArr.push('');
            }
            tmpArr = tmpArr.reverse()
            if (cmpArrays(arr, tmpArr) === false) {
                isMoved = true;
                for (let row = 0; row < arr.length; row++) {
                    tmpCubes[row][col] = tmpArr[row];
                }
            }
        }

        // 如果有发生移动，则随机在一处空白格子生成新的值
        this.afterMove(isMoved, tmpCubes, tmpMergedGrids, tmpHighestEducation);
    }

    afterMove(isMoved, tmpCubes, tmpMergedGrids, tmpHighestEducation) {
        if (isMoved) {
            // 先展示合并动效
            this.setState({
                cubes: tmpCubes,
                mergedGrids: tmpMergedGrids,
                highestEducation: tmpHighestEducation
            }, () => {
                // 再展示新的cube动效
                let [cubes, newGrids, highestEducation] = this.chooseRandGid(tmpCubes)
                setTimeout(() => {
                    this.setState({
                        cubes: cubes,
                        mergedGrids: {},
                        newGrids: newGrids,
                        highestEducation: highestEducation > this.state.highestEducation ? highestEducation : this.state.highestEducation
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                newGrids: {}
                            })
                        }, 200)
                    })
                }, 200)
            })
        } else {
            let isMovable = this.checkMovable(this.state.cubes);
            if (!isMovable) {
                layer.open({
                    content: '恭喜你，获得最高学历：' + this.state.highestEducation,
                    btn: ['再挑战一次', '不要'],
                    yes: function(index){
                        location.reload();
                        layer.close(index);
                    },
                    shadeClose: false,
                    fixed: false,
					top: -400
                });
            }
        }
    }

    chooseRandGid(cubes) {
        let blankGrids = this.genBlankGrids(cubes);
        let len = blankGrids.length;
        let rd = _.random(0, len - 1);
        let initvalue = _.random(0, 1) ? 2 : 4;
        let tmpblankGrids = blankGrids.slice(0);
        let gid = tmpblankGrids.splice(rd, 1)[0];
        let gidX = gid.split('-')[0] - 1;
        let gidY = gid.split('-')[1] - 1;
        let tmpCubes = cubes;
        // let tmpCubes = cubes.slice();
        tmpCubes[gidX][gidY] = system.parse(initvalue);
        let highestEducation = this.state.highestEducation;
        if (!system.eduCompare(highestEducation, tmpCubes[gidX][gidY])) {
            highestEducation = tmpCubes[gidX][gidY];
        }
        let newGrids = {}
        newGrids[gidX * cubes.length + gidY] = 1
        return [tmpCubes, newGrids, highestEducation]
    }

    // 检查是否还可以移动
    checkMovable(cubes) {
        if (cubes.flat().indexOf('') > 0) {
            return true;
        }
        // 遍历行
        for (let row = 0; row < cubes.length; row++) {
            let index = 0;
            let arr = cubes[row];
            while(index + 1 < arr.length) {
                if (arr[index] === arr[index + 1]) {
                    return true;
                }
                index++;
            }
        }

        // 遍历列
        for (let col = 0; col < cubes.length; col++) {
            let index = 0;
            let arr = cubes.map(row => row[col]);
            while(index + 1 < arr.length) {
                if (arr[index] === arr[index + 1]) {
                    return true;
                }
                index++;
            }
        }
        return false;
    }

    isOver() {
        if (this.state.cubes.flat().indexOf('') >= 0)
        return false;
    }

    componentDidMount() {
        let [cubes, newGrids, highestEducation] = this.chooseRandGid(this.state.cubes)
        this.setState({
            cubes: cubes,
            newGrids: newGrids,
            highestEducation: highestEducation
        })
    }

    genBlankGrids(cubes) {
        let tmp = [];
        for (let i = 0; i < cubes.length; i++) {
            for (let j = 0; j < cubes[i].length; j++) {
                if (cubes[i][j] === '') {
                    tmp.push((i+1) + '-' + (j+1));
                }
            }
        }
        return tmp;
    }

    render() {
        return  (
            <div className="container">
                <div className="heading">
                    <div className="best-container">{this.state.highestEducation}</div>
                    <p className="wish-container"><i>学习也是生活，当认真对待</i></p>
                </div>
                
                <div className="game-container">
                    <ChessBoard />
                    <Cubes cubes={this.state.cubes} mergedGrids={this.state.mergedGrids} newGrids={this.state.newGrids} />
                </div>
                <div className="operation">
                    <div><i className="arrow-up" onClick={this.handleMoveUp.bind(this)}></i></div>
                    <div>
                        <i className="arrow-left" onClick={this.handleMoveLeft.bind(this)} style={{"marginRight": "40px"}} ></i>
                        <i className="arrow-right" onClick={this.handleMoveRight.bind(this)}></i>
                    </div>
                    <div><i className="arrow-down" onClick={this.handleMoveDown.bind(this)}></i></div>
                </div>
            </div>
        )
    }
}

export default Game;