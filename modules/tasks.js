const {lunchChrome, dropPageContent, loginPageEvent} = require("./puppeteer");

/*
*  页面预处理
* */
async function pagePrepare() {
    const chrome = await lunchChrome()
    const page = await chrome.newPage()
    await dropPageContent(page)
    loginPageEvent(page)
    return page
}

module.exports = [
    {
        index: 100,
        type: 'xxx不合格',
        title: '',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            await page.goto('https://www.baidu.com')
            await page.close()
            // page.$eval   //获取选择器中的dom元素
            // page.$$eval  //获取选择器中的dom元素合集
            // 处理完记得关闭
            return 2
        },
        check: () => {

        }
    },
    {
        index: 2,
        type: '',
        title: 'xxx不合格 是否异常',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            await page.goto('https://www.google.com')
            await page.close()
            // page.$eval   //获取选择器中的dom元素
            // page.$$eval  //获取选择器中的dom元素合集
            // 处理完记得关闭
            return 3
        },
    },
    {
        index: 3,
        type: '',
        title: '是否异常3',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            await page.goto('https://www.youtube.com')
            await page.close()
            // page.$eval   //获取选择器中的dom元素
            // page.$$eval  //获取选择器中的dom元素合集
            // 处理完记得关闭
            return 4
        },
    },
    {
        index: 4,
        type: '',
        title: '是否异常4',
        standard: '',
        handler: async () => {
            const page = await pagePrepare()
            try {
                await page.goto('https://www.qq.com')
                await page.close()
                // page.$eval   //获取选择器中的dom元素
                // page.$$eval  //获取选择器中的dom元素合集
                // 处理完记得关闭
            } catch (e) {
                await page.close()
                throw e
            }
        },
    },
]
