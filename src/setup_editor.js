import { existsSync, mkdirSync, copyFileSync, constants } from 'fs'
import { join } from 'path'
import * as vscode from 'vscode'


export function setupEditor() {
    let setup_editor_for_django_command = function () {

        vscode.commands.registerCommand('django-helper.setup_editor_for_django_project', function () {

            let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath
            let extensionPath = vscode.extensions.getExtension('harshil patel.django-helper').extensionPath

            const dotvscodePath = join(workspaceFolder, ".vscode")
            const extensionTemplatesPath = join(extensionPath, "templates")

            const EXT_TEMPLATE_FILES = ["tasks.json"]


            //check if workspace folder is opened or not.
            if (vscode.workspace.workspaceFolders) {
                /*
                check if .vscode directory is exists or not.
                if not then, create .vscode directory.
                */
                if (!existsSync(dotvscodePath)) {
                    mkdirSync(dotvscodePath)
                    vscode.window.showInformationMessage(`${dotvscodePath} has been created.`, ...["Ok"])
                } else {
                    return vscode.window.showInformationMessage(`${dotvscodePath} already exists.`, ...["Ok"])
                }
            } else {
                return vscode.window.showErrorMessage("Please open workspace folder first.", ...["Ok"])
            }

            /*
            check if setup files are exists or not in .vscode directory.
            if not then, create the setup files in .vscode directory.
            */
            EXT_TEMPLATE_FILES.forEach((filename) => {

                const extensionTemplateFilePath = join(extensionTemplatesPath, filename)
                const vscodeTemplateFilePath = join(dotvscodePath, filename)

                if (!existsSync(vscodeTemplateFilePath)) {
                    copyFileSync(extensionTemplateFilePath, vscodeTemplateFilePath, constants.COPYFILE_EXCL)
                    vscode.window.showInformationMessage(`${vscodeTemplateFilePath} created.`, ...["Ok"])
                } else {
                    return vscode.window.showInformationMessage(`${vscodeTemplateFilePath} already exists.`, ...["Ok"])
                }
            })

        })

    } // setup_editor_for_django_command

    setup_editor_for_django_command()

} // setupEditor
