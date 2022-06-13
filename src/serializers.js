const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

function serializers() {
  function createSerializersFile() {
    vscode.commands.registerCommand(
      'django-helper.create_serializers',
      (selectedDirPath) => {
        vscode.commands.executeCommand('copyFilePath')
        vscode.env.clipboard.readText().then((clipboardText) => {
          selectedDirPath = clipboardText
          let serializersPath = path.join(selectedDirPath, 'serializers.py')

          // content
          let content = 'from rest_framework import serializers'

          if (!fs.existsSync(serializersPath)) {
            fs.writeFileSync(serializersPath, content, (err) => {
              if (err) throw vscode.window.showErrorMessage(err, ...['Ok'])
            })
            vscode.window.showInformationMessage(
              'serializers.py has been created.',
              ...['Ok']
            )
          } else {
            vscode.window.showInformationMessage(
              'serializers.py already exists.',
              ...['Ok']
            )
          }
        })
      }
    )
  } // create_serializers_file

  return {
    createSerializersFile: createSerializersFile,
  }
} // serializers

module.exports = {
  serializers: serializers,
}
