function SearchEngine() {
    this.oid_search_object_name = [];
    this.oid_search_object_description = [];
    this.oid_search_syntax_name = [];
    this.oid_search_oid = [];
}


SearchEngine.prototype.search_mib = function (text) {
    var result = [];
    var score = 0;
    var oid_object;
    var text_splitted = text.split(' ');
    for (var i in text_splitted) {
        if (text_splitted.hasOwnProperty(i)) {
            for (var j in oid_list) {
                if (oid_list.hasOwnProperty(j)) {
                    score = 0;
                    oid_object = oid_list[j];
                    score = this.search_oid_object(text_splitted[i].trim(), oid_object);
                    if (score > 0) {
                        if (result.hasOwnProperty(oid_object)) {
                            result[oid_object.getOid()] = result[oid_object.getOid()] + score;
                        } else {
                            result[oid_object.getOid()] = score;
                        }
                    }
                }
            }
        }
    }
    return result;
};

SearchEngine.prototype.add_oid_object = function (oid_object) {
    if ($.grep(this.oid_search_object_name, function (e) {
            return e == oid_object.getName();
        }).length == 0) {
        this.oid_search_object_name.push(oid_object.getName());
    }
    if ($.grep(this.oid_search_oid, function (e) {
            return e == oid_object.getOid();
        }).length == 0) {
        this.oid_search_oid.push(oid_object.getOid());
    }
    if (oid_object.getParam()) {
        var odesc = oid_object.getDescription();
        for (var i in odesc) {
            if (odesc.hasOwnProperty(i)) {
                if ((odesc[i].length >= 3) && ($.grep(this.oid_search_object_description, function (e) {
                        return e == odesc[i];
                    }).length == 0 )) {
                    this.oid_search_object_description.push[odesc[i]];
                }
            }
        }
        if ($.grep(this.oid_search_syntax_name, function (e) {
                return e == oid_object.getSyntax();
            }).length == 0) {
            this.oid_search_syntax_name.push(oid_object.getSyntax());
        }
    }
};

SearchEngine.prototype.search_oid_object = function (text, oid_object) {
    var score = 0;
    var re = new RegExp(text, 'i');
    if (oid_object.getOid().indexOf(text) >= 0) {
        score += 10;
    }
    if (re.test(oid_object.getName())) {
        score += 5;
    }
    if (oid_object.getParam()) {
        if (re.test(oid_object.getParam().syntax.getType())) {
            score += 3;
        }
        if (re.test(oid_object.getParam().getStatus())) {
            score += 2;
        }
        if (re.test(oid_object.getParam().getDescription())) {
            score += 4;
        }
        if (re.test(oid_object.getParam().getIndex())) {
            score += 3;
        }
    }
    return score;
};
