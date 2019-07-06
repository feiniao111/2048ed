let _ = require('lodash');

const CHESS_BOARD_LENGTH = 4  // 棋盘边长

const EductionLevel = {
    '幼儿园': 2, 
    '预备班': 4,
    '小学': 8,
    '初中': 16, 
    '高中': 32,
    '大学': 64,
    '硕士': 128,
    '博士': 256,
    '博士后': 512,
    2: '幼儿园',
    4: '预备班',
    8: '小学',
    16: '初中',
    32: '高中',
    64: '大学',
    128: '硕士',
    256: '博士',
    512: '博士后'
}

const VALUE_SYSTEMS = {
    'base': [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048], // 1<<11
    'edu': ['幼儿园', '预备班', '小学', '初中', '高中', '大学', '硕士', '博士', '博士后'] // 1<<9
}

// 值计算系统
class ChessValueSystem {
    constructor(type) {
        this.type = type ? type : 'base';
        this.values = VALUE_SYSTEMS[this.type]
    }
    setType(type) {
        this.type = type;
    }
    genRandValue() {
        let len = this.values.length;
        let rd = _.random(0, len);
        return this.values[rd];
    }
    parse(value) {
        return EductionLevel[value] ? EductionLevel[value] : 0;
    }
    eduCompare(edu1, edu2) {
        if (edu1 === '') {
            return false;
        }
        return EductionLevel[edu1] >= EductionLevel[edu2]; 
    }
    chess_merge(x, y) {
        if (x !== y) {
            return false;
        }
        if (x === this.values[this.values.length - 1 ]) {
            return true;
        }
        if (this.type === 'base') {
            return x + y;
        } else if(this.type === 'edu') {
            return EductionLevel[EductionLevel[x] + EductionLevel[y]];
        } else {
            return false;
        }
    }
}

export {
    CHESS_BOARD_LENGTH,
    VALUE_SYSTEMS,
    ChessValueSystem
}