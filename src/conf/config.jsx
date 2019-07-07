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

const APPRAISE = {
    '': '学习也是生活，当认真对待',
    '幼儿园': '懵懂而无知,从哭哭闹闹不爱去到不舍得回，爱拿小红花',
    '预备班': '入门阶段，开始学习中文发音和文法：啊哦呃衣唔迂...',
    '小学': '最开心快乐的阶段,整天校园间穿梭嬉笑打闹，打篮球、踢毽子',
    '初中': '开始有了晚自习，有了寄宿，朦胧的爱情也在发芽...', 
    '高中': '最刻苦、最难忘的阶段，积累的友谊很深刻',
    '大学': '思想放开，自主意识全面提高，成长很快，堕落也是，总之很精彩',
    '硕士': '继续深造，开始专研某一领域，社团活动减少，更多三点一线',
    '博士': '专研之路深、精、尖，多培养高校人才,毕业要求很高，请静下心来',
    '博士后': '教育之路的王者，无法评价，太棒了'
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
    ChessValueSystem,
    APPRAISE
}