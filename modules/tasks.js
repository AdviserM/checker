const {lunchChrome, dropPageContent, loginPageEvent, setPageViewport} = require("./puppeteer");
const {mkdir, dateTimeFormat} = require("./utils");
const {dir} = mkdir()
const path = require('path')

/*
*  页面预处理
* */
async function pagePrepare() {
    const chrome = await lunchChrome()
    const page = await chrome.newPage()
    // await dropPageContent(page)
    loginPageEvent(page)
    /*反爬*/
    // await page.evaluateOnNewDocument(() => {
    //     Object.defineProperty(navigator, 'webdriver', {
    //         get: () => false,
    //     });
    // })
    // await page.evaluate(
    //     () => {
    //         Object.defineProperties(navigator, {
    //             webdriver: {
    //                 get: () => false
    //             }
    //         })
    //     }
    // )
    return page
}

module.exports = [
    {
        index: 2,
        type: '',
        title: 'xxx不合格 是否异常',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            const time = dateTimeFormat(new Date(), 'yyyy-MM-dd hh：mm：ss')
            const pngPath = path.join(dir, `探针-${time}.png`)
            await page.goto('https://bot.sannysoft.com/', {waitUntil: 'load'})
            // await setPageViewport(page)

            await page.screenshot({
                type: 'png',
                path: pngPath,
                fullPage: true,
            })
            // await page.close()
            // page.$eval   //获取选择器中的dom元素
            // page.$$eval  //获取选择器中的dom元素合集
            // page.evaluate() // 获得页面执行上下文 执行操作dom
            // page.waitFor 设置等待时间
            // page.waitForSelector()
            // 处理完记得关闭
            return pngPath
        },
    },
    {
        index: 456,
        type: '',
        title: '是否异常3',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            await page.goto('https://www.google.com')
            // await page.close()
            return 4
        },
    },
    {
        index: 4,
        type: '',
        title: '探针测试页',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            await page.goto('https://bot.sannysoft.com/')
            // await page.close()
        },
    },
]
