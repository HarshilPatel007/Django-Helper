const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

function serializers() {

    let createSerializersFile = () => {
        vscode.commands.registerCommand(
            'django-helper.create_serializers', (selectedDirPath => {
                vscode.commands.executeCommand('copyFilePath')
                vscode.env.clipboard.readText().then((clipboardText) => {
                    selectedDirPath = clipboardText
                    let finalPath = path.join(selectedDirPath, 'serializers.py')

                    // content
                    let content = 'from rest_framework import serializers'

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

                vscode.commands.executeCommand('copyFilePath')
                vscode.env.clipboard.readText().then(async (clipboardText) => {
                    let selectedDirPath = clipboardText
                    let modelsFilePath = await path.join(selectedDirPath, 'models.py')

                    vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", vscode.Uri.file(modelsFilePath))
                        .then((result) => {
                            result.forEach(async elements => {

                                if (elements.kind === 4) {
                                    let fields = elements.children.filter(f => f.kind === 12)
                                    await Promise.all(fields.map(async (f) => {
                                        let fieldsName = await f.name
                                        console.log(fieldsName)
                                    }))
                                }
                            })
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
