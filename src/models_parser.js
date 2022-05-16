const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

function modelsParser() {

    function insertModelFields() {
        vscode.commands.registerCommand(
            'django-helper.insert_model_fields', async () => {

                vscode.commands.executeCommand('copyFilePath')
                vscode.env.clipboard.readText().then((clipboardText) => {
                    let editor = vscode.window.activeTextEditor
                    let selectedDirPath = clipboardText
                    let modelsFilePath = path.join(selectedDirPath, 'models.py')
                    let pathUri = vscode.Uri.file(modelsFilePath)
                    let exeCmd = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', pathUri)

                    let modelClass = []
                    let modelFields = []
                    let modelClassFields = []

                    if (fs.existsSync(modelsFilePath)) {
                        exeCmd.then((result) => {
                            result.forEach((elements) => {
                                if (elements.kind === 4) {
                                    modelClass.push(elements.name)
                                    let fields = elements.children.filter(f => f.kind === 12)
                                    fields.forEach((field) => {
                                        let classFields = elements.name + ':' + field.name
                                        modelClassFields.push(classFields)
                                    })
                                }
                            })
                            vscode.window.showQuickPick(modelClass).then((selectedCls) => {
                                modelClassFields.forEach((classFields) => {
                                    if (classFields.includes(selectedCls) === true) {
                                        let cls = selectedCls + ':'
                                        let fields = classFields.replace(cls, '')
                                        fields = '"' + fields + '"'
                                        modelFields.push(fields)
                                    }
                                })
                                let finalModelFields = modelFields.join(',')
                                editor.edit((e) => {
                                    e.insert(editor.selection.active, finalModelFields)
                                })
                            })
                        })
                    } else {
                        vscode.window.showErrorMessage('models.py not found. select app folder and then execute command.', ...['Ok'])
                    }
                })
            })
    } // insert_model_fields

    return {
        insertModelFields: insertModelFields
    }

} // models_parser

module.exports = {
    modelsParser: modelsParser
}
