const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

function modelsParser() {

    let getModelFields = () => {
        vscode.commands.registerCommand(
            'get_model_fields.command', async () => {

                vscode.commands.executeCommand('copyFilePath')
                vscode.env.clipboard.readText().then((clipboardText) => {
                    let selectedDirPath = clipboardText
                    let modelsFilePath = path.join(selectedDirPath, 'models.py')
                    let pathUri = vscode.Uri.file(modelsFilePath)
                    let exeCmd = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', pathUri)

                    let modelClass = []
                    let modelFields = []

                    if (fs.existsSync(modelsFilePath)) {
                        exeCmd.then((result) => {
                            result.forEach((elements) => {
                                if (elements.kind === 4) {
                                    modelClass.push(elements.name)
                                    // console.log(elements.children)
                                    let fields = elements.children.filter(f => f.kind === 12)
                                    fields.forEach((f) => {
                                        let classFields = elements.name + ':' + f.name
                                        modelFields.push(classFields)
                                    })
                                }
                            })
                            vscode.window.showQuickPick(modelClass).then((selectedCls) => {
                                modelFields.forEach(fc => {
                                    if (fc.includes(selectedCls) === true) {
                                        let cls = selectedCls + ':'
                                        let fields = fc.replace(cls, '')
                                        console.log(fields)
                                    }
                                })
                            })
                        })
                    } else {
                        vscode.window.showErrorMessage('models.py not found. select app folder and then execute command.', ...['Ok'])
                    }
                })
            })
    } // get_model_fields

    getModelFields()

} // models_parser

module.exports = {
    modelsParser: modelsParser
}
