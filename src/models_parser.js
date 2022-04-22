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

                    if (fs.existsSync(modelsFilePath)) {
                        vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', pathUri)
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
