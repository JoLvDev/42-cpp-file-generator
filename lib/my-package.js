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
      fileName = editor.buffer.file.path.split("/")
      if (fileName.length <= 0)
        return (NULL);
      return(fileName[fileName.length - 1].split(".")[0]);
    }

    function getFileExtention(){
      fileExtention = editor.buffer.file.path.split(".")
      if (fileExtention.length <= 0)
        return (NULL);
      return (fileExtention[fileExtention.length - 1]);
    }

    function strcmp(str1, str2){
      if (str1.length != str2.length || str1 == 0 || str2 == 0)
        return (-1);
      for (var i = 0; i < str1.length; i++)
        if (str1[i] != str2[i])
          return (str1[i] - str2[i])
      return (0);
    }

    function writeDotCpp(fileName, editor){
      includes = '#include "' + fileName + '.hpp"\n#include <iostream>\n#include <string>\n\n'
      constructor = fileName + "::" + fileName + "(void){\n\treturn;\n}\n\n"
      copyConstructor = fileName + "::" + fileName + "(" + fileName+ " const & src){\n\t*this->src = src;\n\treturn;\n}\n\n"
      destructor = fileName + "::~" + fileName + "(void){\n\treturn;\n}\n\n"
      assignationOverload = fileName + " &\t" + fileName + "::operator=(" + fileName+ " const & rhs){\n\treturn *this;\n}\n\n"
      editor.insertText(includes + constructor + copyConstructor + assignationOverload + destructor)
    }

    const editor = atom.workspace.getActiveTextEditor()
    fileName = getFileName()
    if (!editor || !fileName)
      return ;
    fileExtention = getFileExtention();
    if (!strcmp(fileExtention, "cpp"))
    {
      writeDotCpp(fileName, editor);
    }
  }

};
