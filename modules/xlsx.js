const xlsx = require('xlsx');

// 获取表格数据
function getXlsxData(filePath, sheetIndex = 0) {
    let workbook = xlsx.readFile(filePath)
    let sheetNames = workbook.SheetNames;
    let tableData = workbook.Sheets[sheetNames[sheetIndex]]
    return xlsx.utils.sheet_to_json(tableData)
}

// 输出excel
function outPutExcel(data, outputPath = '', sheetName = 'sheet1') {
    return new Promise(resolve => {
        let sheetData = xlsx.utils.json_to_sheet(data);
        let workbook = { //定义操作文档
            SheetNames: [sheetName], //定义表名
            Sheets: {
                [sheetName]: Object.assign({}, sheetData), //表对象[注意表名]
            },
        }
        xlsx.writeFile(workbook, outputPath);
        resolve()
    })
}
module.exports = {
    getXlsxData,
    outPutExcel
}

