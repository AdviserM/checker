const puppeteer = require('puppeteer-core')
const {chromePath, loginInfo} = require('./config')

// singleInstance chrome
const lunchChrome = (() => {
    let instance = null
    return async function () {
        if (instance) return instance
        instance = await puppeteer.launch({
            headless: false,
            executablePath: chromePath,
            args: ['--proxy-server=http://127.0.0.1:7890', '--start-maximized'],
            defaultViewport: null,
            ignoreHTTPSErrors:true
        })
        return instance
    }
})()

/*
*   去除 页面多余信息
* */
async function dropPageContent(page) {
    await page.setRequestInterception(true);
    page.on('request', async req => {
        // 根据请求类型过滤
        const resourceType = req.resourceType();
        const blockedResourceTypes = [
            'image',
            'media',
            'font',
            'texttrack',
            'object',
            'stylesheet',
            'sub_frame',
            'beacon',
            'csp_report',
            'imageset',
        ];
        if (blockedResourceTypes.includes(resourceType)) {
            req.abort();
        } else {
            req.continue();
        }
    })
}


// 处理登录页面
function handleLogin(page) {
//    todo
}

/*
*  处理每个页面的onload事件 假如当前是登录页面则执行密码输入
* */
function loginPageEvent(page) {
    page.on('load', (e) => {
        const conditions = ['login']
        const url = page.url()
        // console.log('page load ' + url)
        if (conditions.every(item => url.includes(item))) {
            console.log(`login page load ${url}`)
            handleLogin(page)
        }
    })
}

async function commonPageHandler(page) {
    await dropPageContent(page)
    loginPageEvent(page)
}

module.exports = {
    lunchChrome,
    dropPageContent,
    handleLogin,
    loginPageEvent,
    commonPageHandler
}
