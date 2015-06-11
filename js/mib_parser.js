function MibParser(fname, text){
  this.mib = new Mib(fname);

  this.line = "";
  this.lines = text.split('\n');
  this.line_number = 0;

  for(this.line_number; this.line_number < this.lines.length; this.line_number++){
    this.line = this.lines[this.line_number];
    var li = this.line;
    if (/^\w/.test(this.line)) {
      if (this.line.indexOf("DEFINITIONS ::= BEGIN")>0){
        this.mib.mib_name = this.line.replace("DEFINITIONS ::= BEGIN", "").trim();
      } else if (this.line.startsWith('IMPORTS')){
        this.parse_import(name);
      } else if (this.line.indexOf("MODULE-IDENTITY")>0){
        this.parse_moduleIdentity(name);
      } else if (/^END$/.test(this.line.trim())) {
        break;
      } else {
        var name = null;
        if (/^\w*$/.test(this.line.trim())) {
          name = this.line.trim();
          this.next_line();
        }
        if (this.line.indexOf("OBJECT-TYPE")>0){
          this.parse_object(name);
        } else if (this.line.indexOf("OBJECT-GROUP")>0){
          this.parse_object(name);
        } else if (this.line.indexOf("OBJECT IDENTIFIER")>0){
          this.parse_objectIdentifier(name);
        } else if (this.line.indexOf("SEQUENCE")>0){
          this.parse_sequence(name);
        } else if (this.line.indexOf('TEXTUAL-CONVENTION')>0){
          this.parse_textualConvention();
        } else if (this.line.indexOf('NOTIFICATION-TYPE')>0){
          //TODO
          this.next_line();
        }
      }
//        this.parse_textualConvention();
 /*else if (this.line.indexOf("::=")>0){
        var name = this.lines[this.line_number].replace("::=","").trim();
        this.next_line();
        if (this.line.indexOf("SEQUENCE")>0){
          if (this.line.trim().endsWith('{')){
            this.next_line();
          }
          this.parse_sequence(name);
        }
      } else {
        var name = this.lines[this.line_number].replace("::=","").trim();
        this.next_line();
        if (this.line.indexOf("OBJECT IDENTIFIER")>0){
          this.parse_objectIdentifier(name);
        }
      }*/
    }
  }
  return this.mib;
}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}
String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

MibParser.prototype.next_line = function(){
  this.line_number++;
  this.line = this.lines[this.line_number];
  while ((/^( )*$/.test(this.line)) && (this.line_number < this.lines.length)) {
    this.line_number++;
    this.line = this.lines[this.line_number];
  }
}
MibParser.prototype.parse_import = function(){
  if (this.line.match(/IMPORTS +[^ ]+/i)){
    this.line = this.line.replace("IMPORTS ", "");
  } else {
    this.next_line();
  }
  while (true){
    var imported_oid = [];
    var from_mib = "";
    while (true){

      if (this.line.indexOf("FROM")>0){
        for (var i in this.line.split('FROM')[0].split(',')){
          if (!/^( )*$/.test(this.line.split('FROM')[0].split(',')[i].trim())){
            imported_oid.push(this.line.split('FROM')[0].split(',')[i].trim());
          }
        }
        from_mib = this.line.split("FROM")[1].replace(";", "").trim();
        break;
      } else {
        for (var i in this.line.split(',')){
          if (!/^( )*$/.test(this.line.split('FROM')[0].split(',')[i].trim())){
            imported_oid.push(this.line.split('FROM')[0].split(',')[i].trim());
          }        }
        this.next_line();
      }
    }
    for (var i in imported_oid){
      this.mib.import_mibs.push(new import_mibs(imported_oid[i], from_mib));
    }
    if (this.line.indexOf(';')>0){
      break;
    } else {
      this.next_line();
    }
  }
}

MibParser.prototype.parse_moduleIdentity = function(){
  var oid_object = new OidObject();
  this.mib.mib_root = this.line.replace("MODULE-IDENTITY", "").trim();
  oid_object.setName(this.mib.mib_root);
  while (true){
    this.next_line();
    if (this.line.indexOf("LAST-UPDATED")>0){
        this.mib.last_updated = this.line.split('LAST-UPDATED')[1].trim();
    } else if (this.line.indexOf("ORGANIZATION")>0){
        this.mib.organization = this.line.split('ORGANIZATION')[1].trim();
        this.mib.organization = this.mib.organization.replace(/"/g,"");
    } else if (this.line.indexOf("DESCRIPTION")>0){
      this.mib.mib_description = this.parse_description();
    } else if (this.line.indexOf("::=")>=0){
        this.mib.origin = this.line.substring(this.line.indexOf('{')+1, this.line.indexOf('}')).trim();
        oid_object.setOrigin(this.mib.origin);
        break;
    }
  }
  oid_object.mib = this.mib;
  this.mib.oid_object.push(oid_object);
  oid_list.push(oid_object);
}

MibParser.prototype.parse_object = function(){
  var oid_object = new OidObject();
  var oid_param = new OidObjectParam();
  oid_object.setParam(oid_param);
  if (this.line.indexOf("OBJECT-TYPE")>0){
    oid_object.setName(this.line.replace("OBJECT-TYPE", "").trim());
    oid_object.setType("OBJECT-TYPE");
  } else if (this.line.indexOf("OBJECT-GROUP")>0){
    oid_object.setName(this.line.replace("OBJECT-GROUP", "").trim());
    oid_object.setType("OBJECT-GROUP");
  }
  while (true){
    this.next_line();
    if (this.line.indexOf('SYNTAX')>0){
      oid_param.setSyntax(this.line.replace('SYNTAX', "").trim());
    } else if (this.line.indexOf('MAX-ACCESS')>0){
      oid_param.setAccess(this.line.replace('MAX-ACCESS', "").trim());
    } else if (this.line.indexOf("STATUS")>0){
      oid_param.setStatus(this.line.replace("STATUS", "").trim());
    } else if (this.line.indexOf("INDEX")>0){
      oid_param.setIndex(this.line.replace("INDEX", "").substring(this.line.indexOf('{')+1, this.line.indexOf('}')).trim());
    } else if (this.line.indexOf('DESCRIPTION')>0){
      oid_param.setDescription(this.parse_description());
    } else if (this.line.indexOf("::=")>0){
        oid_object.setOrigin(this.line.substring(this.line.indexOf('{')+1, this.line.indexOf('}')).trim());
        break;
    }
  }
  oid_object.mib = this.mib;
  this.mib.oid_object.push(oid_object);
  oid_list.push(oid_object);
}


MibParser.prototype.parse_sequence = function(sequence_name){
  var sequence_name ="";
  var sequence_objects = [];
  if (sequence_name == null){
      sequence_name = this.line.split('::=')[0].trim();
  }
  while (true){
    var temp_name = "";
    var temp_type = "";
    this.next_line();
    if (this.line.indexOf("}")<0){
      temp_name = this.line.trim().split(' ')[0];
      temp_object = this.line.replace(temp_name, "").trim().replace(",","");
      sequence_objects[temp_name]=temp_object;
    } else {
      break;
    }
  }
  this.mib.sequence.push(new Sequence(sequence_name, sequence_objects));
}

MibParser.prototype.parse_textualConvention = function(){
  var convention = new TextualConvention();
  convention.setName(this.line.split("::=")[0].trim());

  while (true){
    this.next_line();
    if (this.line.indexOf("DISPLAY-HINT")>0){
      convention.setHint(this.line.replace("DISPLAY-HINT", "").trim());
    } else if (this.line.indexOf("STATUS")>0){
      convention.setStatus(this.line.replace("STATUS", "").trim());
    } else if (this.line.indexOf('DESCRIPTION')>0){
      convention.setDescription(this.parse_description());
    } else if (this.line.indexOf('SYNTAX')>0){
      convention.setSyntax(this.line.replace('SYNTAX', "").trim());
      break;
    }
  }
  convention.mib = this.mib;
  this.mib.textual_convetion.push(convention);
  convention_list.push(convention);
}

MibParser.prototype.parse_objectIdentifier = function(name){
  var oid_object = new OidObject();
  var line_split = this.line.split("OBJECT IDENTIFIER");
  if (line_split[0].trim()!="OBJECT IDENTIFIER"){
    if (name == null){
      oid_object.setName(line_split[0].trim());
    } else {
      oid_object.setName(name);
    }
    oid_object.setType("OBJECT IDENTIFIER");
    oid_object.mib = this.mib;
    oid_object.setOrigin(line_split[1].substring(line_split[1].indexOf('{')+1, line_split[1].indexOf('}')).trim());
    this.mib.oid_object.push(oid_object);
    oid_list.push(oid_object);
  }
}

MibParser.prototype.parse_description = function (){
  var desc = "";
  if (this.line.indexOf('"')<0){
    this.next_line();
    desc += this.line.trim();
  } else {
    this.line = this.line.replace("DESCRIPTION", "").trim();
    desc += (this.line.trim());
  }
  while (!this.line.trim().endsWith('"')){
    this.next_line();
    desc += (this.line.trim());
  }
  return desc;
}
