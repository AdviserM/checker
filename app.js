const LimitPromise = require("limit-promise");
const events = require('events');
const path = require('path');
const {taskLimit,timeout} = require('./modules/config')
const tasks = require('./modules/tasks')
const {lunchChrome} = require("./modules/puppeteer");
const {sleep, mkdir, dateTimeFormat} = require("./modules/utils");
const {outPutExcel} = require("./modules/xlsx");

const TaskLimitControler = new LimitPromise(taskLimit)
let resultArr = []
let count = tasks.length
let current = 0
const eventCenter = new events.EventEmitter()

const nameMap = {
    index: '序号',
    title: '标题',
    type:'类型',
    standard:'标准',
    result:'结果'
}

// 任务结束 导出excel
eventCenter.on('finish', async () => {
    console.log('任务结束')
    const chrome =  await lunchChrome()
    await chrome.close()
    // 排序
    resultArr.sort(({index:a}, {index:b}) => {
        if (a < b ) {     // 按某种排序标准进行比较，a 小于 b
            return -1;
        }
        if (a > b ) {
            return 1;
        }
        // a must be equal to b
        return 0;
    })

    // 字段替换
    resultArr = resultArr.map(item => {
        let newItem = {}
        for (const [key,value] of Object.entries(item)) {
            newItem[nameMap[key]] = value
        }
        return newItem
    })

    // 导出excel
    console.log(resultArr)
    let {dir} = mkdir()
    let time = dateTimeFormat(new Date(), 'yyyy-MM-dd hh：mm：ss')
    let outputPath = path.join(dir,`结果-${time}.xlsx`)
    await outPutExcel(resultArr,outputPath)
    process.exit()
})


async function taskWarpper(task,index) {
    const {handler, check, title, ...remain} = task
    const inner = async () => {
        try {
            await sleep(timeout)
            console.log(`正在执行任务:${index}/${count} ${title}`)
            // console.log(resultArr)
            let result = await handler()
            resultArr.push({...remain,title,result})
            ++current
            console.log(`任务:${index}/${count} ${title} 执行成功`)
            if (current === count) {
                eventCenter.emit('finish')
            }
        } catch (e) {
            console.log(e)
            console.log(`任务${index}/${count} ${title}失败 重新启动`)
            await inner()
        }
    }
    await inner()
}

(async () => {
    console.log(`共${count}个任务 任务速率限制为${taskLimit}个任务并行 任务重试间隔时间${timeout}s`)
    tasks.forEach((task,index) => {
        TaskLimitControler.call(taskWarpper, task,index+1)
    })
})()
