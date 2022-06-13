const { setupEditor } = require('./setup_editor')
const { adminModels } = require('./admin_models')
const { serializers } = require('./serializers')
const { modelsParser } = require('./models_parser')

function setup() {
  setupEditor().setupEditorForDjango()

  let adminModel = adminModels()
  adminModel.registerAllModels()
  adminModel.registerSelectedModels()

  serializers().createSerializersFile()
  modelsParser().insertModelFields()
}

function activate(context) {
  console.log('Congratulations, extension "django-helper" is now activated!')

  function djangoHelper() {
    return console.log('')
  }

  setup()

  context.subscriptions.push(djangoHelper)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
