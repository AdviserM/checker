const {chromePath, loginInfo} = require('./config')
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// singleInstance chrome
let lunchChrome = (() => {
    let instance = null
    return async function () {
        if (instance) return instance
        instance = await puppeteer.launch({
            headless: false, // 使用有头模式防止检测
            executablePath: chromePath,
            //-disable-web-security	禁用同源策略(允许跨域)
            // --proxy-server=127.0.0.1:1080	设置代理
            // --proxy-server='direct://'	禁用代理
            // --proxy-bypass-list=*	不走代理的链接
            // --no-sandbox	禁用沙箱
            // --disable-gpu	禁用GUP
            // --ignore-certificate-errors	忽略证书错误
            // --auto-open-devtools-for-tabs	自动打开调试工具
            // --remote-debugging-port=9222	开启远程调试
            // --disable-translate	禁用翻译提示
            // --disable-background-timer-throttling	禁用后台标签性能限制
            // --disable-site-isolation-trials	禁用网站隔离
            // --disable-renderer-backgrounding	禁止降低后台网页进程的渲染优先级
            // --headless	无头模式启动
            // --user-data-dir=./karma-chrome	设置用户资料的储存位置
            //  window-size=1920,1080	窗口尺寸,相当于设置window.outerWidth/outerHeight
            // 注: chromium的窗口分辨率存在限制,在非无头模式下,不能大于浏览器实际分辨率
            args: ['--proxy-server=http://127.0.0.1:7890', '--start-maximized','--disable-web-security','--ignore-certificate-errors','--incognito','--disable-blink-features=AutomationControlled','--inPrivate'],
            ignoreDefaultArgs: ["--enable-automation"], // --enable-automation 防检测
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
        console.log('load1')
        const url = page.url()
        // console.log('page load ' + url)
        if (conditions.every(item => url.includes(item))) {
            console.log(`login page load ${url}`)
            handleLogin(page)
        }
    })
    // 可以添加多个事件监听函数
    page.on('load', (e) => {
        console.log('load2')
    })
}

async function commonPageHandler(page) {
    await dropPageContent(page)
    loginPageEvent(page)
}

function setPageViewport(page) {
   return page.setViewport({width:1920,height:1080})
}

async function destoryChrome() {
    const chrome = await lunchChrome()
    const pages = await chrome.pages()
    for (const page of pages) {
        await page.close()
    }
    await chrome.close()
}

module.exports = {
    lunchChrome,
    dropPageContent,
    handleLogin,
    loginPageEvent,
    commonPageHandler,
    setPageViewport,
    destoryChrome
}
