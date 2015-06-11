function OidObject() {
    this.oid = "";
    this.oname = "";
    this.otype = "";
    this.mib = null;
    this.childs = [];
    this.parameters = null;
    this.origin = "";
    this.root = false;
}

OidObject.prototype.setOid = function (oid) {
    this.oid = oid;
};
OidObject.prototype.getOid = function () {
    return this.oid;
};
OidObject.prototype.setType = function (otype) {
    this.otype = otype;
};
OidObject.prototype.getType = function () {
    return this.otype;
};
OidObject.prototype.setName = function (oname) {
    this.oname = oname;
};
OidObject.prototype.getName = function () {
    return this.oname;
};
OidObject.prototype.getChildByOid = function (oid) {
    var child = $.grep(this.childs, function (e) {
        return e.oid == oid;
    });
    return child[0];
};
OidObject.prototype.addChild = function (child) {
    if (this.childs.indexOf(child) < 0) {
        this.childs.push(child);
    }
};
OidObject.prototype.getChilds = function () {
    return this.childs;
};
OidObject.prototype.getChildByOid = function () {
    return this.childs;
};
OidObject.prototype.getChildsNumber = function () {
    return this.childs.length;
};
OidObject.prototype.setParam = function (parameters) {
    this.parameters = parameters;
};
OidObject.prototype.getParam = function () {
    return this.parameters;
};
OidObject.prototype.setOrigin = function (origin) {
    this.origin = origin;
};
OidObject.prototype.getOrigin = function () {
    return this.origin;
};

OidObject.prototype.getRow = function () {
    var ds = '<tr class="oid_row">'
        + '<td class="oid_column_button">';
    if (this.childs.length > 0) {
        ds += '<a class="btn btn-default btn-sm oid_tree_button"  onclick="display_next(\'' + this.getOid() + '\')" >'
            + '<i id="i_' + this.getOid() + '" class="fa fa-chevron-circle-right fa-lg"></i>'
            + '</a></td>';
    } else {
        ds += '<a class="btn btn-default btn-sm oid_tree_button" disabled="">'
            + '<i class="fa fa-dot-circle-o fa-lg"></i>'
            + '</a></td>';
    }
    if (this.parameters) {
        ds += '<td class="oid_tree_data">' + this.getOid() + '</br>'
            + '<strong>Name:</strong><span class="oid_name"> ' + this.getName() + '</span></br>';
        if (this.parameters.getSyntax() != "") {
            var syntax_name = this.parameters.getSyntax();
            var syntax = $.grep(convention_list, function (e) {
                return e.getName() == syntax_name;
            });
            if (syntax.length > 0) {
                ds += '<strong>Syntax: </strong><a onclick="display_detail(\'TEXTUAL-CONVENTION\', \'' + syntax[0].getName() + '\')" class="btn oid_syntax">' + this.parameters.getSyntax() + '</a></br>';
            } else {
                ds += '<strong>Syntax: </strong><span>' + this.parameters.getSyntax() + '</span></br>';
            }
        }
        if (this.parameters.getIndex() != "") {
            ds += '<strong>Name:</strong><span class="oid_index"> ' + this.parameters.getIndex() + '</span></br>';
        }
        ds += '<strong>Description:</strong><span class="oid_description"> ' + this.parameters.getDescription() + '</span>'
    } else {
        ds += '<td class="oid_tree_data">' + this.getOid() + '</br><strong>Name:</strong><span class="oid_name"> ' + this.getName() + '</span>'
    }
    ds += '<table id="table_' + this.getOid() + '" class="table table-condensed next_oid_table" style="margin: 0px; display: none;">';
    for (var i in this.childs) {
        ds += this.childs[i].getRow();
    }
    ds += '</table>'
        + '</td>'
        + '</tr>\n';
    return ds;
};

OidObject.prototype.search_result = function (text) {
    var re;
    var re_text = text.replace(" ", "|");
    re = new RegExp('(' + re_text + ')', "gi");
    var oid = this.getOid().replace(re, "<strong>$1</strong>");
    var oid_name = this.getName().replace(re, "<strong>$1</strong>");
    var ds = "<article style='padding-top:0;'><h5>"
        + oid + ': <span class="oid_name"> ' + oid_name + ' </span>';
    if (this.parameters) {
        if (this.parameters.getSyntax() != "") {
            var syntax_name = this.parameters.getSyntax();
            var syntax = $.grep(convention_list, function (e) {
                return e.getName() == syntax_name;
            });
            if (syntax.length > 0) {
                var oid_syntax = this.parameters.getSyntax().replace(re, "<strong>$1</strong>");
                ds += ' (<a onclick="display_detail(\'TEXTUAL-CONVENTION\', \'' + syntax[0].getName() + '\')" class="btn oid_syntax">' + oid_syntax + '</a>)</h5>';
            } else {
                ds += ' (<span>' + this.parameters.getSyntax() + '</span>)</h5>';
            }
        }
        var oid_description = this.parameters.getDescription().replace(re, "<strong>$1</strong>");
        ds += '<span class="oid_description"> ' + oid_description + '</span>';
    }
    ds += '</article>\n';
    return ds;
};

function OidObjectParam() {
    this.syntax = "";
    this.access = "";
    this.ostatus = "";
    this.odescription = "";
    this.oindex = "";
}


OidObjectParam.prototype.setSyntax = function (syntax) {
    this.syntax = syntax;
};
OidObjectParam.prototype.getSyntax = function () {
    return this.syntax;
};
OidObjectParam.prototype.setAccess = function (access) {
    this.access = access;
};
OidObjectParam.prototype.getAccess = function () {
    return this.access;
};
OidObjectParam.prototype.setStatus = function (ostatus) {
    this.ostatus = ostatus;
};
OidObjectParam.prototype.getStatus = function () {
    return this.ostatus;
};
OidObjectParam.prototype.setDescription = function (odescription) {
    this.odescription = odescription.replace(/"/g, "");
};
OidObjectParam.prototype.addDescription = function (odescription) {
    this.odescription += " " + odescription.replace(/"/g, "");
};
OidObjectParam.prototype.getDescription = function () {
    return this.odescription;
};
OidObjectParam.prototype.setIndex = function (oindex) {
    this.oindex = oindex;
};
OidObjectParam.prototype.getIndex = function () {
    return this.oindex;
};
