function TextualConvention(){
  this.mib = "";
  this.oname = "";
  this.hint = "";
  this.syntax = "";
  this.ostatus = "";
  this.odescription = "";
}

TextualConvention.prototype.setName = function(oname){
  this.oname = oname;
}
TextualConvention.prototype.getName = function(){
    return this.oname;
}
TextualConvention.prototype.setHint = function(hint){
  this.hint = hint;
}
TextualConvention.prototype.getHint = function(){
  return this.hint;
}
TextualConvention.prototype.setSyntax = function(syntax){
  this.syntax = syntax;
}
TextualConvention.prototype.getSyntax = function(){
  return this.syntax;
}
TextualConvention.prototype.setStatus = function(ostatus){
  this.ostatus = ostatus;
}
TextualConvention.prototype.getStatus = function(){
  return this.ostatus;
}
TextualConvention.prototype.setDescription = function(odescription){
  this.odescription = odescription.replace(/"/g,"");
}
TextualConvention.prototype.addDescription = function(odescription){
  this.odescription += " " + odescription.replace(/"/g,"");
}
TextualConvention.prototype.getDescription = function(){
  return this.odescription;
}


TextualConvention.prototype.display = function (){
  var ds = '<tr class="oid_row">'
  +'<td class="oid_column_button">';
  if (this.childs.length > 0) {
    ds += '<a class="btn btn-default btn-sm oid_tree_button"  onclick="display_next(\''+this.getOid()+'\')" >'
    +'<i id="i_'+this.getOid()+'" class="fa fa-chevron-circle-right fa-lg"></i>'
    +'</a></td>';
  } else {
    ds += '<a class="btn btn-default btn-sm oid_tree_button" disabled="">'
    +'<i class="fa fa-dot-circle-o fa-lg"></i>'
    +'</a></td>';
  }
  if (this.parameters){
    ds += '<td class)"oid_tree_data">'+this.getOid()+'</br>'
    +'<strong>Name:</strong><span class="oid_name"> '+this.getName()+'</span></br>';
    if (this.parameters.getSyntax() != ""){
    ds+= '<strong>Syntax:</strong><span class="oid_syntax"> '+this.parameters.getSyntax()+'</span></br>';
    }
    if (this.parameters.getIndex() != ""){
      ds += '<strong>Name:</strong><span class="oid_index"> '+this.parameters.getIndex()+'</span></br>';
    }
    ds += '<strong>Description:</strong><span class="oid_description"> '+this.parameters.getDescription()+'</span>'
  } else {
    ds += '<td class="oid_tree_data">'+this.getOid()+'</br><strong>Name:</strong><span class="oid_name"> '+this.getName()+'</span>'
  }
  ds += '<table id="table_'+this.getOid()+'" hidden="hidden" class="table table-condensed next_oid_table" style="margin: 0px;">';
  for (var i in this.childs){
    ds += this.childs[i].getRow();
  }
  ds +='</table>'
    +'</td>'
    +'</tr>\n';
  return ds;
}
