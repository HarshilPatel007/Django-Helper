const fs = require('fs')
const path = require('path')
const { ElementFlags } = require('typescript')
const vscode = require('vscode')

function serializers() {

    let createSerializersFile = () => {
        vscode.commands.registerCommand(
            'django-helper.create_serializers', (selectedDirPath => {
                vscode.commands.executeCommand('copyFilePath')
                vscode.env.clipboard.readText().then((clipboardText) => {
                    selectedDirPath = clipboardText
                    let finalPath = path.join(selectedDirPath, 'serializers.py')
                    let modelsPath = path.join(selectedDirPath, 'models.py')

                    console.log(modelsPath)

                    // content
                    let content = 'from rest_framework import serializers'

                    /* 
                    regex:
                        class: /(^class\s+[A-Z]+[a-zA-Z]*)(.*:$)/gm
                    */

                    if (!fs.existsSync(finalPath)) {
                        fs.writeFileSync(finalPath, content, (err) => {
                            if (err) throw vscode.window.showErrorMessage(err, ...['Ok'])
                        })
                        vscode.window.showInformationMessage('serializers.py has been created.', ...['Ok'])
                    } else {
                        vscode.window.showInformationMessage('serializers.py already exists.', ...['Ok'])
                    }
                })
            })
        )
    } // create_serializers_file


    let test1 = () => {
        vscode.commands.registerCommand(
            'test.command', async () => {

                // let files = []

                // let modelFiles = vscode.workspace.findFiles("**/models.py")
                // let modelFile = await modelFiles
                // for (var uri in modelFile) {
                //     let filePath = modelFile[uri]['path']
                //     files.push(filePath)
                // }

                // files.push(filePath.toString())

                // for (var uri in files) {
                //     console.log(uri)
                //     // vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", uri)
                //     //     .then((result) => {
                //     //         result.forEach(element => {
                //     //             let classes = element.name
                //     //             console.log(classes)
                //     //         });
                //     //     })
                // }

                // files.forEach(uri => {
                //     // console.log(uri)

                // })
                let modelfilepath = '/django/devsearch/dev_projects/models.py'
                vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", vscode.Uri.file(modelfilepath))
                    .then((result) => {
                        result.forEach(async elements => {
                            // if (elements.kind === vscode.SymbolKind.Class) {
                            //     let className = elements.name
                            //     console.log(className)
                            // }

                            if (elements.kind === 4) {
                                let fields = elements.children.filter(f => f.kind === 12)
                                await Promise.all(fields.map(async (f) => {
                                    let fType = await f.name
                                    console.log(fType)
                                }))
                            }
                        })
                    })
            })



    } // test1

    createSerializersFile()
    test1()

} // serializers

module.exports = {
    serializers: serializers
}
