
var mib_list = [];
var oid_list = [];
var convention_list = [];
var countdown = 0;
var root = [];

function read_file(file, callback){
  var textType = /text.*/;
  if (file.type.match(textType)) {
    var reader = new FileReader();
    reader.onload = (function(file) {
      return function(e) {
        //TODO: if relead same file
        var contents = e.target.result;
        var mib = new MibParser(file.name, contents);
        mib_list.push(mib);
        callback();
      };
    })(file);
    reader.readAsText(file);
  } else {
    fileDisplayArea.innerText = "File not supported!"
    callback();
  }
}

function display_file(){
  countdown --;
  if (countdown == 0){
    generateOid(mib_list);
    for (var i in mib_list){
      $('#mib_details').append(mib_list[i].displayMibDetails());
    }
    var ds = "<article style='padding-top:0px;'>";
    if (mib_list.length > 0){
      ds += '<table class="table table-condensed mib_display_table">'
        + '<tbody id="mib_display_body">';
      for (var i in root){
        ds += root[i].getRow();
      }
      ds += '</tbody></table>';
    } else {
      ds = '<span>Nothing to display</span>';
    }
    ds += "</article>"
    $("#mib_preview").html(ds);
    $("#entries_number").text(oid_list.length);
  }
}
