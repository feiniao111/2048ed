import React, { PureComponent } from 'react';
import ChessBoard from './components/chessBoard'
import Cubes from './components/cubes'
import {CHESS_BOARD_LENGTH, ChessValueSystem, APPRAISE} from './conf/config';
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
    // return [ // mock
    //     [{value: '预备班', id: 0},'',{value: '预备班', id: 2},{value: '预备班', id: 3}],
    //     ['',{value: '小学', id: 5},{value: '大学', id: 6},{value: '小学', id: 7}],
    //     [{value: '预备班', id: 8},{value: '博士', id: 9},{value: '小学', id: 10},{value: '幼儿园', id: 11}],
    //     [{value: '预备班', id: 12},{value: '高中', id: 13},{value: '幼儿园', id: 14},{value: '小学', id: 15}]
    // ]
    return arrs;
}

let cmpArrays = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
            return false;
        }
    }
    return true;
}

class Game extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            /**
             * 棋盘所有格子的学历信息，4*4 二维数组, 元素取值有三种：
             * '' ———————— 无学历， 
             * {value: '幼儿园', id: 15} —————— 格子上放置幼儿园
             *  [{value: '幼儿园', id: 13},{value: '幼儿园', id: 14},{value: '预备班', id: 15}] —————— 格子上放置预备班，合并得到
             * */ 
            cubes: initialBlankCubes(CHESS_BOARD_LENGTH), 
            mergedGrids: {}, // 发生合并的格子 一维位置, 比如{15: 1}
            newGrids: {}, // 新出现的格子，一维位置，比如 {0: 1}
            highestEducation: '', // 最高学历
            idPool: _.range(0, CHESS_BOARD_LENGTH * CHESS_BOARD_LENGTH) // id池，只有push和pop操作
        }
    }

    handleMoveRight() {
        let tmpCubes = this.state.cubes.slice(0);
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
                            if (tmpArr[tmpArr.length - 1].value === arr[j].value) {
                                let oldEle = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldEle.value, oldEle.value);
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                let mergeId = this.state.idPool.pop(); // 从id池尾部取一个
                                tmpMergedGrids[mergeId] = 1; 
                                tmpArr.push([oldEle, arr[j], {value: mergeValue, id: mergeId}]);
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
        let tmpCubes = this.state.cubes.slice(0);
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
                            if (tmpArr[tmpArr.length - 1].value === arr[j].value) {
                                let oldEle = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldEle.value, arr[j].value);
                                
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                let mergeId = this.state.idPool.pop(); // 从id池尾部取一个
                                tmpMergedGrids[mergeId] = 1; 
                                tmpArr.push([oldEle, arr[j], {value: mergeValue, id: mergeId}]);
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
        let tmpCubes = this.state.cubes.slice(0);
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
                            if (tmpArr[tmpArr.length - 1].value === arr[j].value) {
                                let oldEle = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldEle.value, arr[j].value);
                                let mergeId = this.state.idPool.pop(); // 从id池尾部取一个
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                tmpMergedGrids[mergeId] = 1; 
                                tmpArr.push([oldEle, arr[j], {value: mergeValue, id: mergeId}]);
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
                            if (tmpArr[tmpArr.length - 1].value === arr[j].value) {
                                let oldEle = tmpArr.pop();
                                let mergeValue = system.chess_merge(oldEle.value, arr[j].value);
                                let mergeId = this.state.idPool.pop(); // 从id池尾部取一个
                                if (!system.eduCompare(tmpHighestEducation, mergeValue)) {
                                    tmpHighestEducation = mergeValue;
                                }
                                isTailMerged = true;
                                // 记录合并的位置
                                tmpMergedGrids[mergeId] = 1; 
                                tmpArr.push([oldEle, arr[j], {value: mergeValue, id: mergeId}]);
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

    componentDidUpdate() {
        console.log(11, this, 22)
    }

    afterMove(isMoved, tmpCubes, tmpMergedGrids, tmpHighestEducation) {
        if (isMoved) {
            // 先展示移动、合并动效
            this.setState({
                mergedGrids: tmpMergedGrids,
                cubes: tmpCubes,
                highestEducation: tmpHighestEducation
            }, () => {
                // 移除合并样式
                setTimeout(() => {
                    let adjCubes = this.rmMergeCube(tmpCubes)
                    this.setState({
                        cubes: adjCubes
                    }, () => {
                        // 再展示新的cube动效
                        let [cubes, newGrids, highestEducation] = this.chooseRandGrid(adjCubes)
                        setTimeout(() => {
                            this.setState({
                                newGrids: newGrids,
                                cubes: cubes,
                                highestEducation: highestEducation > this.state.highestEducation ? highestEducation : this.state.highestEducation
                            }, () => {
                                setTimeout(() => {
                                    // 移除新的cube样式
                                    this.setState({
                                        mergedGrids: {},
                                        newGrids: {}
                                    })

                                    // 如果达到‘博士后’，则游戏结束
                                    if (this.state.highestEducation === '博士后') {
                                        layer.open({
                                            content: '恭喜你获得博士后学位，真的太厉害了，祖国发光发热就靠你了~',
                                            btn: ['学霸请留步', '去炫耀'],
                                            yes: function(index){
                                                layer.open({
                                                    type: 1,
                                                    className : 'invite',
                                                    shade:'background-color: rgba(0,0,0,0)',
                                                    btn: ['再玩一次', '不要'],
                                                    yes: function() {
                                                        location.reload();
                                                    },
                                                    no: function(index) {
                                                        layer.close(index);
                                                    },
                                                    shadeClose: true,
                                                    content: '相信您对教育有很深的认识，对各阶段也有自己的体会，如果可以，传达您的见解，一起丰富内容库，给学生生涯留个纪念吧~'
                                                    ,anim: 'up'
                                                    ,style: 'position:fixed; bottom:0; left:0; width: 100%; height: 180px; padding:10px 0; border:none;'
                                                  });
                                            },
                                            shadeClose: false,
                                            fixed: false,
                                            top: -400
                                        });
                                    }
                                }, 300)
                            })
                        }, 400)
                    })
                }, 0)
            })
        } else {
            let isMovable = this.checkMovable(this.state.cubes);
            if (!isMovable) {
                layer.open({
                    content: '您获得最高学历：' + this.state.highestEducation + '， 太棒了!!',
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

    rmMergeCube(cubes) {
        let self = this;
        let newCubes = cubes.map((row, index) => {
            return row.map((ele, indexy) => {
                if (ele === '') {
                    return ele;
                } else if (ele instanceof Array) {
                    // 返回第三个元素，回收第二、三个元素的id到id池
                    self.state.idPool.push(ele[0].id);
                    self.state.idPool.push(ele[1].id);
                    return ele[2]
                } else if (ele instanceof Object) {
                    return ele;
                } 
            })
        })
        return newCubes;
    }

    /**
     * 在所有空格中随机取一个赋值
     * @param {*} cubes 
     */
    chooseRandGrid(cubes) {
        let blankGrids = this.genBlankGrids(cubes);
        let len = blankGrids.length;
        let rd = _.random(0, len - 1);
        let initvalue = system.parse(_.random(0, 1) ? 2 : 4); // 随机值为幼儿园或者预备班
        let tmpblankGrids = blankGrids.slice(0);
        let grid = tmpblankGrids.splice(rd, 1)[0];
        let gridX = grid.split('-')[0] - 1;
        let gridY = grid.split('-')[1] - 1;
        let tmpCubes = cubes;
        // let tmpCubes = cubes.slice();
        let gridId = this.state.idPool.pop();
        tmpCubes[gridX][gridY] = {value: initvalue, id: gridId};
        let highestEducation = this.state.highestEducation;
        if (!system.eduCompare(highestEducation, initvalue)) {
            highestEducation = initvalue;
        }
        let newGrids = {}
        newGrids[gridId] = 1
        return [tmpCubes, newGrids, highestEducation]
    }

    // 检查是否还可以移动
    checkMovable(cubes) {
        if (cubes.flat().indexOf('') >= 0) {
            return true;
        }
        // 遍历行
        for (let row = 0; row < cubes.length; row++) {
            let index = 0;
            let arr = cubes[row];
            while(index + 1 < arr.length) {
                if (arr[index].value === arr[index + 1].value) {
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
                if (arr[index].value === arr[index + 1].value) {
                    return true;
                }
                index++;
            }
        }
        return false;
    }

    componentDidMount() {
        // 随机在棋盘上生成一个学历
        // mock
        let [cubes, newGrids, highestEducation] = this.chooseRandGrid(this.state.cubes)
        this.setState({
            cubes: cubes,
            newGrids: newGrids,
            highestEducation: highestEducation
        })

        // test
        // layer.open({
        //     content: '恭喜你，获得最高学历：' + '',
        //     btn: ['再挑战一次', '不要'],
        //     yes: function(index){
        //         location.reload();
        //         layer.close(index);
        //     },
        //     shadeClose: false,
        //     fixed: false,
        //     top: -400
        // });

        // if (true) {
        //     layer.open({
        //         content: '恭喜你获得博士后学位，真的太厉害了，祖国发光发热就靠你了~',
        //         btn: ['学霸请留步', '去炫耀'],
        //         yes: function(index){
        //             layer.open({
        //                 type: 1,
        //                 className : 'invite',
        //                 shade:'background-color: rgba(0,0,0,0)',
        //                 btn: ['再玩一次', '不要'],
        //                 yes: function() {
        //                     location.reload();
        //                 },
        //                 no: function(index) {
        //                     layer.close(index);
        //                 },
        //                 shadeClose: true,
        //                 content: '相信您对教育有很深的认识，对各阶段也有自己的体会，如果可以，传达您的见解，一起丰富内容库，给学生生涯留个纪念吧~'
        //                 ,anim: 'up'
        //                 ,style: 'position:fixed; bottom:0; left:0; width: 100%; height: 180px; padding:10px 0; border:none;'
        //               });
        //         },
        //         shadeClose: false,
        //         fixed: false,
        //         top: -400
        //     });
        // }
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
                    {/* <p className="wish-container"><i>学习也是生活，当认真对待</i></p> */}
                    <p className="wish-container"><i>{ APPRAISE[this.state.highestEducation] }</i></p>
                </div>
                
                <div className="game-container">
                    <ChessBoard />
                    <Cubes cubes={this.state.cubes} mergedGrids={this.state.mergedGrids} newGrids={this.state.newGrids} />
                </div>
                <div className="operation">
                    <div><i className="arrow-up blink" onClick={this.handleMoveUp.bind(this)} style={{"marginBottom": "5px"}} ></i></div>
                    <div>
                        <i className="arrow-left blink" onClick={this.handleMoveLeft.bind(this)} style={{"marginRight": "50px"}} ></i>
                        <i className="arrow-right blink" onClick={this.handleMoveRight.bind(this)}></i>
                    </div>
                    <div><i className="arrow-down blink" onClick={this.handleMoveDown.bind(this)} style={{"marginTop": "5px"}} ></i></div>
                </div>
            </div>
        )
    }
}

export default Game;