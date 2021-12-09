const vscode = require('vscode')


function adminModel() {
    let isAdminFile = function () {
        let currentFilePath = vscode.window.activeTextEditor.document.fileName
        currentFilePath = currentFilePath.split("/")
        currentFilePath = currentFilePath[currentFilePath.length - 1]
        if (currentFilePath == "admin.py") return true
    }

    let hasModelsImports = function (fileText) {
        if (fileText.indexOf("from .models import") > 0) return true
    }

    let registerAllModels = function (class_name) {
        let code = `
@admin.register(${class_name})
class ${class_name}Admin(admin.ModelAdmin):
    class Meta:
        model = ${class_name}
        fields = '__all__'\n\n`

        return code
    }

    let registerSelectedModel = function (class_name) {
        let code = `
@admin.register(${class_name})
class ${class_name}Admin(admin.ModelAdmin):
    class Meta:
        model = ${class_name}
        fields = '__all__'\n\n`

        return code
    }

    let register_all_models_command = function () {

        vscode.commands.registerCommand(
            "django-helper.admin_register_all_models",
            function () {
                let editor = vscode.window.activeTextEditor
                let fileText = editor.document.getText()
                let codeToInject = ""
                let modelString = ""

                if (isAdminFile()) {
                    if (hasModelsImports(fileText)) {
                        fileText.splitLines().forEach((e) => {
                            if (e.indexOf(".models") > 0) {
                                let indexOfImport = e.indexOf("import") + 7
                                modelString = e.substring(indexOfImport, e.length)
                                modelString = modelString.replace(/,+/g, "").split(" ")
                                modelString.forEach((model) => {
                                    codeToInject += registerAllModels(model)
                                })
                                let lineCount = editor.document.lineCount
                                let position = new vscode.Position(lineCount, 0)
                                editor.edit((editBuilder) => {
                                    editBuilder.insert(position, codeToInject)
                                })
                            }
                        })
                    }
                } else {
                    return vscode.window.showErrorMessage("This action can only performed in admin.py.")
                }
            }
        )
    } // register_all_models_command

    let register_selected_model_command = function () {

        vscode.commands.registerCommand(
            "django-helper.admin_register_selected_model",
            function () {
                let editor = vscode.window.activeTextEditor
                let selection = editor.selection
                let class_name = editor.document.getText(selection)

                if (isAdminFile()) {
                    if (class_name) {
                        let lineCount = editor.document.lineCount
                        let position = new vscode.Position(lineCount, 0)
                        editor.edit(editBuilder => {
                            editBuilder.insert(position, registerSelectedModel(class_name))
                        })
                    } else {
                        return vscode.window.showErrorMessage("Please select Model Class first.")
                    }
                } else {
                    return vscode.window.showErrorMessage("This action can only performed in admin.py.")
                }
            }
        )
    } // register_selected_model_command

    register_all_models_command()
    register_selected_model_command()

} // adminModel


module.exports = {
    adminModel: adminModel
}
