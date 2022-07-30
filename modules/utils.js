const path = require('path')
const EXEC_HOME = process.cwd()
const child_process = require("child_process");
const fs = require('fs-extra')


/*
*  执行shell命令
* */
function execShellCommand(command = '') {
    return new Promise((resolve, reject) => {
        child_process.exec(command, (err, out, ini) => {
            if (err) reject(err)
            resolve(out)
        })
    })
}

/*
*  时间日期格式化
* */
const dateTimeFormat = (date, fmt) => {
    let o = {
        "M+": date.getMonth() + 1,               //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

let dirInfo = null
/*
*   在执行路径下面创建一个文件夹 用来放巡检相关资料 可能需要截图
* */
function mkdir() {
    if(dirInfo) return dirInfo
    // let time = dateTimeFormat(new Date(), 'yyyy-MM-dd hh.mm.ss')
    let time = dateTimeFormat(new Date(), 'yyyy-MM-dd')
    const dir = path.join(EXEC_HOME, 'output',time)
    fs.ensureDirSync(dir)
    dirInfo = {time,dir}
    return dirInfo
}


function sleep(time = 1) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        },time * 1000)
    })
}

module.exports = {
    execShellCommand,
    dateTimeFormat,
    EXEC_HOME,
    mkdir,
    sleep
}
