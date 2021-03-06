function Import_mibs(import_name, mib) {
    this.import_name = import_name;
    this.mib = mib;
}

function Mib(fname) {
    this.file_name = fname;
    this.mib_name = "";
    this.mib_root = "";
    this.import_mibs = [];
    this.last_updated = "";
    this.organization = "";
    this.mib_description = "";
    this.origin = "";

    this.oid_object = [];
    this.sequence = [];
    this.textual_convetion = [];

}

Mib.prototype.displayMibDetails = function () {
    var ds = "<article id='" + this.mib_name + "'><h4>" + this.mib_name + "</h4>"
        + "<div style='display:flex;'>"
        + "<div style='width:50%'>"
        + "<strong>File :</strong> " + this.file_name + "</br>"
        + "<strong>Last Update:</strong> " + this.last_updated + "</br>"
        + "<strong>Organization:</strong> " + this.organization + "</br>"
        + "<strong>Description:</strong> " + this.mib_description + "</br>"
        + "<strong>MIB Origin:</strong> " + this.origin + "</br>"
        + "</div><div style='width:50%'>"
        + "<strong>Dependencies:</strong>"
        + "<table class='table table-condensed'>"
        + "<thead><tr><th>Object</th><th>From MIB</th></tr></thead>"
        + "<tbody>";
    for (var i in this.import_mibs) {
        ds += "<tr><td>" + this.import_mibs[i].import_name + "</td><td>" + this.import_mibs[i].mib + "</td></tr>";
    }
    ds += "</tbody></table></div></div></article>";
    return ds;
};
