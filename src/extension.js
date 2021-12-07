const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, extension "django-helper" is now activated!')

	let setup_vscode_for_django_command = vscode.commands.registerCommand('django-helper.setupVSCodeForDjangoProject', function () {

		let workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath
		let extensionPath = context.extensionPath
		
		const dotvscodePath = path.join(workspaceFolder, ".vscode")
		const extensionTemplatesPath = path.join(extensionPath, "templates")
		
		const EXT_TEMPLATE_FILES = ["tasks.json", "test.txt", "test2.txt"]



		//check if workspace folder is opened or not.
		if(!vscode.workspace.workspaceFolders){
			return vscode.window.showErrorMessage("Please open workspace folder first.")
		}

		/*
		check if .vscode directory is exists or not.
		if not then, create .vscode directory.
		*/
		if(!fs.existsSync(dotvscodePath)){
			fs.mkdirSync(dotvscodePath)
			vscode.window.showInformationMessage(`${dotvscodePath} has been created.`, ...["Ok"])
		}else{
			vscode.window.showInformationMessage(`${dotvscodePath} already exists.`, ...["Ok"])
		}


		/*
		check if setup files are exists or not in .vscode/ directory.
		if not then, create the setup files in .vscode/ directory.
		*/
		EXT_TEMPLATE_FILES.forEach((filename) => {
			
			const extensionTemplateFilePath = path.join(extensionTemplatesPath, filename)
			const vscodeTemplateFilePath = path.join(dotvscodePath, filename)
			
			if(!fs.existsSync(vscodeTemplateFilePath)){
				fs.copyFileSync(extensionTemplateFilePath, vscodeTemplateFilePath, fs.constants.COPYFILE_EXCL)
				vscode.window.showInformationMessage(`${vscodeTemplateFilePath} created.`, ...["Ok"])
			}else{
				vscode.window.showInformationMessage(`${vscodeTemplateFilePath} already exists.`, ...["Ok"])
			}
		})

	})

	context.subscriptions.push(setup_vscode_for_django_command)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
