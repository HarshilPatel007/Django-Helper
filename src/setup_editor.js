const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

function setupEditor() {

    function setupEditorForDjango() {

        vscode.commands.registerCommand(
            'django-helper.setup_editor_for_django_project', () => {

                let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath
                let extensionPath = vscode.extensions.getExtension('harshil patel.django-helper').extensionPath

                const dotvscodePath = path.join(workspaceFolder, '.vscode')
                const extensionTemplatesPath = path.join(extensionPath, 'templates')

                const EXT_TEMPLATE_FILES = ['tasks.json']


                //check if workspace folder is opened or not.
                if (vscode.workspace.workspaceFolders) {
                    /*
                    check if .vscode directory is exists or not.
                    if not then, create .vscode directory.
                    */
                    if (!fs.existsSync(dotvscodePath)) {
                        fs.mkdirSync(dotvscodePath)
                        vscode.window.showInformationMessage(`${dotvscodePath} has been created.`, ...['Ok'])
                    } else {
                        return vscode.window.showInformationMessage(`${dotvscodePath} already exists.`, ...['Ok'])
                    }
                } else {
                    return vscode.window.showErrorMessage('Please open workspace folder first.', ...['Ok'])
                }

                /*
                check if setup files are exists or not in .vscode directory.
                if not then, create the setup files in .vscode directory.
                */
                EXT_TEMPLATE_FILES.forEach((filename) => {

                    const extensionTemplateFilePath = path.join(extensionTemplatesPath, filename)
                    const vscodeTemplateFilePath = path.join(dotvscodePath, filename)

                    if (!fs.existsSync(vscodeTemplateFilePath)) {
                        fs.copyFileSync(extensionTemplateFilePath, vscodeTemplateFilePath, fs.constants.COPYFILE_EXCL)
                        vscode.window.showInformationMessage(`${vscodeTemplateFilePath} created.`, ...['Ok'])
                    } else {
                        return vscode.window.showInformationMessage(`${vscodeTemplateFilePath} already exists.`, ...['Ok'])
                    }
                })

            })

    } // setup_editor_for_django

    return {
        setupEditorForDjango: setupEditorForDjango
    }

} // setupEditor

module.exports = {
    setupEditor: setupEditor
}
