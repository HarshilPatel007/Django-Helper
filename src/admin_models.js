const vscode = require('vscode')


function adminModel(){

    let isAdminFile = function(){
        let currentFilePath = vscode.window.activeTextEditor.document.fileName;
        currentFilePath = currentFilePath.split('/') 
        currentFilePath = currentFilePath[currentFilePath.length-1]
        if(currentFilePath == "admin.py") return true
    }

    let hasModelsImports = function(fileText){
        if(fileText.indexOf('from .models import')>0) return true
    }

    let registerAllModels = function(class_name){
        code = `
@admin.register(${class_name})
class ${class_name}Admin(admin.ModelAdmin):
    class Meta:
        model = ${class_name}
        fields = '__all__'\n\n`
        
        return code
    }

    let register_models_command = vscode.commands.registerCommand('django-helper.admin_register_all_models', function () {
        
        let editor = vscode.window.activeTextEditor
        let fileText = editor.document.getText()
        let codeToInject = ""
        let modelString = ""

        if(isAdminFile()){
            if(hasModelsImports(fileText)){
                fileText.splitLines().forEach((e) => {
                    if(e.indexOf('.models')>0){
                        let indexOfImport = e.indexOf('import') + 7
                        modelString = e.substring(indexOfImport, e.length)
                        modelString = modelString.replace(/,+/g, '').split(' ')
                        modelString.forEach((model) => {
                            codeToInject += registerAllModels(model)
                        });
                        let lineCount = editor.document.lineCount
                        let position = new vscode.Position(lineCount, 0)
                        editor.edit(editBuilder => {
                            editBuilder.insert(position, codeToInject)
                        })
                    }
                })
            }
        }

    })
}


module.exports = {
    adminModel: adminModel
}
