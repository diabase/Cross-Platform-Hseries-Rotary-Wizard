module.exports = {
  createButton: function(name, text){
    const button = new QPushButton();
    button.setText(text);
    button.setObjectName(name);
    return button;
  }

}