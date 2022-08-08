//@ts-check
import { BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'


const generateHtml = async (item) => {
    await fs.writeFileSync(path.join('C:/Users/User/Desktop/html/', `${item.FIO}.html`), `<html><body>${item.HTML_TEXT}</body></html>`, { encoding: 'utf-8'})
}

export default async (list, pathName) => {
    const win  = new BrowserWindow({show: false})
    const generatePdf = async (name) => {
        console.log(name)
        const promis = new Promise((resolve, rej) => {
        if(rej){
            rej("something went wrong")
        }
        win.loadURL(`C:/Users/User/Desktop/html/${name}.html`)
        win.webContents.printToPDF({}).then(data => {
            fs.writeFileSync(`C:/Users/User/Desktop/html/${name}.pdf`, data)
        })
        resolve('fininsh')
    })
    return promis
}
    for(const item of list){
        await generateHtml(item)
        await generatePdf(item.FIO)
    }
}