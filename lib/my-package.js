'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'my-package:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      myPackageViewState: this.myPackageView.serialize()
    };
  },

  toggle() {

  function getFileName(){
    const editor = atom.workspace.getActiveTextEditor()
    filename = editor.buffer.file.path.split("/")
    if (filename.length <= 0)
      return (null);
    return(filename[filename.length - 1].split(".")[0]);
  }

  function getFileExtention(){
    fileextention = editor.buffer.file.path.split(".")
    if (fileextention.length <= 0)
      return (null);
    return (fileextention[fileextention.length - 1]);
  }

  function strcmp(str1, str2){
    if (str1.length != str2.length || str1 == 0 || str2 == 0)
      return (-1);
    for (var i = 0; i < str1.length; i++)
      if (str1[i] != str2[i])
        return (str1[i] - str2[i])
    return (0);
  }

  function writeDotCpp(filename, editor){
    fileExtention = editor.buffer.file.path.split("/")
    fileExtention = fileExtention[fileExtention.length - 1]
    fileExtention = fileExtention.split(".")
    extradots = ""
    for (var i = 1; i < fileExtention.length - 1; i++) {
      extradots += "." + fileExtention[i];
    }
    includes = '#include "' + filename + extradots +'.hpp"\n#include <iostream>\n#include <string>\n\n'
    comment = "\n/*\n** CANONICAL FUNCS\n*/\n"
    constructor = filename + "::" + filename + "(void){\n\treturn;\n}\n\n"
    copyconstructor = filename + "::" + filename + "(" + filename + " const & src){\n\t*this = src;\n\treturn;\n}\n\n"
    destructor = filename + "::~" + filename + "(void){\n\treturn;\n}\n\n"
    assignationoverload = filename + " &\t" + filename + "::operator=(" + filename+ " const & rhs){\n\treturn *this;\n}\n\n"
    editor.insertText(includes + comment + constructor + copyconstructor + assignationoverload + destructor)
  }

  function writeDotHpp(filename, editor){
    fileExtention = editor.buffer.file.path.split("/")
    fileExtention = fileExtention[fileExtention.length - 1]
    fileExtention = fileExtention.split(".")
    extradots = ""
    for (var i = 1; i < fileExtention.length - 1; i++) {
      extradots += "_" + fileExtention[i].toUpperCase();
    }
    test = ""
    protection = "#ifndef " +  filename.toUpperCase() + extradots + "_H\n# define " + filename.toUpperCase() + extradots +"_H\n\n"
    includes = '#include <iostream>\n#include <string>\n\n'
    classDeclaration = 'class ' + filename + '{\n\npublic:\n'
    comment = "\n\t/*\n\t** CANONICAL FUNCS\n\t*/\n"
    constructor = "\t" + filename + "(void);\n"
    copyconstructor = "\t" + filename + "(" + filename + " const & src);\n"
    destructor = "\t~" + filename + "(void);\n"
    assignationOverload = "\t" + filename + " & " + "operator=(" + filename+ " const & rhs);\n\n"
    endOfClass = "private:\n\n};\n\n#endif"
    editor.insertText(test + protection + includes + classDeclaration + comment + constructor + copyconstructor + destructor + assignationOverload + endOfClass)
  }

  const editor = atom.workspace.getActiveTextEditor()
  if (editor.buffer.file == null)
    return
  fileName = getFileName()
  if (!editor || !fileName)
    return
  fileExtention = getFileExtention();
  if (strcmp(fileExtention, "cpp") == 0)
    writeDotCpp(fileName, editor)
  else if (strcmp(fileExtention, "hpp") == 0)
    writeDotHpp(fileName, editor)
}

};
