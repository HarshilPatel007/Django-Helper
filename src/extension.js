const setupEditor = require('./setup_editor')
const adminModelFields = require('./admin_models')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, extension "django-helper" is now activated!')

	let djangoHelper = () => console.log('')

	setupEditor.setupEditor()
	adminModelFields.adminModel()

	context.subscriptions.push(djangoHelper)
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
