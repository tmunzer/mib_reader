var mib_list = [];
var oid_list = [];
var convention_list = [];
var countdown = 0;
var root = [];
var search_engine = new SearchEngine();
var oid_autocomplete = [];

function read_file(file, callback) {
    var textType = /text.*/;
    if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                //TODO: if relead same file
                var contents = e.target.result;
                var mib = new MibParser(file.name, contents);
                mib_list.push(mib);
                callback();
            };
        })(file);
        reader.readAsText(file);
    } else {
        fileDisplayArea.innerText = "File not supported!";
        callback();
    }
}

function display_file() {
    countdown--;
    if (countdown == 0) {
        generateOid(mib_list);
        for (var i in mib_list) {
            if (mib_list.hasOwnProperty(i)){
                $('#mib_details').append(mib_list[i].displayMibDetails());
            }
        }
        var ds = "<article style='padding-top:0;'>";
        if (mib_list.length > 0) {
            ds += '<table class="table table-condensed mib_display_table">'
                + '<tbody id="mib_display_body">';
            for (var j in root) {
                if (root.hasOwnProperty(j)){
                    ds += root[j].getRow();
                }
            }
            ds += '</tbody></table>';
        } else {
            ds = '<span>Nothing to display</span>';
        }
        ds += "</article>";
        $("#mib_preview").html(ds);
        $("#entries_number").text(oid_list.length);
        $('#autocomplete').autocomplete({
            lookup: oid_autocomplete.sort(),
            onSelect: function (){
                document.getElementById("autocomplete").focus();
            },
            lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                return suggestion.value.toLowerCase().indexOf(queryLowerCase) == 0;
            }
        });
    }
}


function display_mib_search() {
    var ds = "";
    var text = $('#search_text').val();
    if (text.trim() != "") {
        var search_all= $('#scbox_all').is(":checked");
        var search_oid= $('#scbox_oid').is(":checked");
        var search_name= $('#scbox_name').is(":checked");
        var search_syntax= $('#scbox_syntax').is(":checked");
        var search_index= $('#scbox_index').is(":checked");
        var search_description= $('#scbox_desc').is(":checked");
        search_engine.searchFields(search_all, search_oid, search_name, search_syntax, search_index, search_description);
        var result = search_engine.searchMib(text);
        result = result.sort(function (a, b) {
            return b.score - a.score;
        });
        var oid_object;

        for (var i in result) {
            if (result.hasOwnProperty(i)) {

                oid_object = $.grep(oid_list, function (e) {
                    return e.getOid() == result[i].oid;
                })[0];
                ds += oid_object.search_result(text, search_all, search_oid, search_name, search_syntax, search_index, search_description);
            }
        }
    }
    $('#mib_search').html(ds);
}

