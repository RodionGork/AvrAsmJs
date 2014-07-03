function AvrAsmDbg() {
    this.avrasm = new AvrAsm();
    this.init();
    this.populateState();
}

AvrAsmDbg.prototype.init = function() {
    this.opcodes = $('#opcodes');
    this.regs = $('#regs');
    for (var i = 0; i < 32; i++) {
        $('<tr><td>' + i + '</td><td class="editable"></td><td class="editable"></td></tr>').appendTo(this.regs);
    }
    $('#opcodes').editableTableWidget();
    $('#regs').editableTableWidget();
}

AvrAsmDbg.prototype.addCodeLine = function() {
    $('<tr><td class="editable">&nbsp;</td><td class="editable"></td><td></td><td></td></tr>').appendTo(this.opcodes);
}

AvrAsmDbg.prototype.populateState = function() {
    this.populateRegs();
    this.populateCode();
}

AvrAsmDbg.prototype.populateRegs = function() {
    var regs = this.avrasm.regs;
    var rows = this.regs.find('tr');
    for (var i in regs) {
        var cells = $(rows.get(i * 1 + 1)).find('td+td');
        var value = regs[i];
        cells.first().text(this.toHex(value, 2) + 'h');
        cells.last().text(value);
    }
}

AvrAsmDbg.prototype.populateCode = function() {
    var labels = this.avrasm.labels;
    var lines = this.avrasm.lines;
    var rows = this.opcodes.find('tr');
    var n = lines.length;
    if (rows.size() - 1 < n) {
        var toAdd = n - rows.size() - 1;
        for (var j = 0; j < toAdd; j++) {
            this.addCodeLine();
        }
        rows = this.opcodes.find('tr');
    }
    for (var i = 0; i < n; i++) {
        var row = $(rows.get(i + 1)).find('td');
        var label = labels[i];
        if (typeof(label) != 'undefined') {
            $(row.get(0)).text(label + ':');
        }
        var line = lines[i];
        if (typeof(line) != 'undefined') {
            $(row.get(1)).text(line.text);
        }
    }
}

AvrAsmDbg.prototype.toHex  = function(v, d) {
    var s = '00000000' + v.toString(16);
    return s.substr(s.length - d).toUpperCase();
}

$(function() {
    avrAsmDbg = new AvrAsmDbg();
});

