const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

function adminModel() {
    let isAdminFile = () => {
        let currentFilePath = vscode.window.activeTextEditor.document.fileName
        currentFilePath = currentFilePath.split('/')
        currentFilePath = currentFilePath[currentFilePath.length - 1]
        if (currentFilePath === 'admin.py') return true
    }

    let hasModelsImports = (fileText) => {
        let searchImport = new RegExp(`(?:^|\w*)from .models import(?:$|\w*)`)
        if (searchImport.test(fileText) === true) {
            return true
        }
    }

    let registerModels = (className) => {
        let code = `
@admin.register(${className})
class ${className}Admin(admin.ModelAdmin):
    class Meta:
        model = ${className}
        fields = "__all__"
        # exclude = ["fields_to_exclude"]\n\n`

        return code
    }

    let registerAllModelsCommand = () => {

        vscode.commands.registerCommand(
            'django-helper.admin_register_all_models', () => {
                let editor = vscode.window.activeTextEditor
                let fileText = editor.document.lineAt(editor.selection.active.line)
                let codeToInject = ''
                let modelString = ''

                if (isAdminFile()) {
                    if (hasModelsImports(fileText['_text']) === true) {
                        fileText['_text'].splitLines().forEach((e) => {
                            if (e.indexOf('.models') > 0) {
                                let indexOfImport = e.indexOf('import') + 7
                                modelString = e.substring(indexOfImport, e.length)
                                modelString = modelString.replace(/,+/g, '').split(' ')
                                modelString.forEach((model) => {
                                    codeToInject += registerModels(model)
                                })
                                let lineCount = editor.document.lineCount
                                let position = new vscode.Position(lineCount, 0)
                                editor.edit((editBuilder) => {
                                    editBuilder.insert(position, codeToInject)
                                })
                            }
                        })
                    } else {
                        return vscode.window.showErrorMessage('Place cursor at the model import statement', ...['Ok'])
                    }
                } else {
                    return vscode.window.showErrorMessage('This action can only performed in admin.py', ...['Ok'])
                }
            }
        )
    } // register_all_models_command

    let registerSelectedModelsCommand = () => {

        vscode.commands.registerCommand(
            'django-helper.admin_register_selected_models', () => {
                let editor = vscode.window.activeTextEditor
                let selection = editor.selection
                let className = editor.document.getText(selection)
                let codeToInject = ''
                let modelString = ''

                if (isAdminFile()) {
                    if (className) {
                        if (className.includes(',')) {
                            modelString = className.split(',')
                            modelString.forEach(classes => {
                                let className = classes.replace(/\s+/g, '').replace(',', '')
                                codeToInject += registerModels(className)
                            })
                            let lineCount = editor.document.lineCount
                            let position = new vscode.Position(lineCount, 0)
                            editor.edit(editBuilder => {
                                editBuilder.insert(position, codeToInject)
                            })
                        } else {
                            codeToInject = registerModels(className)
                            let lineCount = editor.document.lineCount
                            let position = new vscode.Position(lineCount, 0)
                            editor.edit(editBuilder => {
                                editBuilder.insert(position, codeToInject)
                            })
                        }
                    } else {
                        return vscode.window.showErrorMessage('Please select model class first', ...['Ok'])
                    }
                } else {
                    return vscode.window.showErrorMessage('This action can only performed in admin.py', ...['Ok'])
                }
            }
        )
    } // register_selected_models_command


    let get_model_class = () => {
        vscode.commands.registerCommand(
            'sssss', (selectedDirPath => {
                vscode.commands.executeCommand('copyFilePath')
                vscode.env.clipboard.readText().then((clipboardText) => {
                    selectedDirPath = clipboardText
                    console.log(selectedDirPath)
                })
            })
        )
    }

    registerAllModelsCommand()
    registerSelectedModelsCommand()
    get_model_class()

} // adminModel

module.exports = {
    adminModel: adminModel
}
