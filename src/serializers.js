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
                    let content = 'file content'


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

    createSerializersFile()

} // serializers

module.exports = {
    serializers: serializers
}
