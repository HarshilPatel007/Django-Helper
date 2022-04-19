import { setupEditor as _setupEditor } from './setup_editor'
import { adminModel } from './admin_models'

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {

	console.log('Congratulations, extension "django-helper" is now activated!')

	let django_helper = () => console.log("")

	_setupEditor()
	adminModel()

	context.subscriptions.push(django_helper)
}

// this method is called when your extension is deactivated
export function deactivate() { }
