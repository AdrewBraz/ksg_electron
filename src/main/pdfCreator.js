//@ts-check
import pdf from 'html-pdf'
import phantom from 'phantomjs'

export default async (list, path) => {
    const generatePdf = async (text, file) => {
        const promis = new Promise((resolve, rej) => {
            pdf.create(`<html><body><h1>>TEEEEEEST</h1></body></html>`, {phantomPath: __dirname + "/pathToNodeModules/phantomjs/bin/phantomjs",}).toFile(`C:\\Users\\User\\Desktop\\html\\1974\\test.pdf`, (err, res) =>{
            if(err){
                console.log(err)
                rej(err)
            }
            resolve(res.filename);
        })
      })
      return promis
    }
    await generatePdf()
    // for(const item of list){
    //     await generatePdf(item.HTML_TEXT, item.FIO)
    // }
}