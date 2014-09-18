function AvrAsmDbg() {
    this.avrasm = new AvrAsm();
    this.init();
    this.populateState();
}

AvrAsmDbg.prototype.init = function() {
    this.opcodes = $('#opcodes');
    for (var i = 0; i < 16; i++) {
        this.addCodeLine(i);
    }
    this.regs = $('#regs');
    for (var i = 0; i < 32; i++) {
        this.addRegsLine(i);
    }
    $('#opcodes').editableTableWidget();
    $('#regs').editableTableWidget();
    $('#regs td').change(this.regsEdit);
}

AvrAsmDbg.prototype.addRegsLine = function(i) {
    $('<tr><td>' + i + '</td><td class="editable"></td><td class="editable"></td></tr>').appendTo(this.regs);
}

AvrAsmDbg.prototype.addCodeLine = function(i) {
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

AvrAsmDbg.prototype.toHex = function(v, d) {
    var s = '00000000' + v.toString(16);
    return s.substr(s.length - d).toUpperCase();
}

$(function() {
    avrAsmDbg = new AvrAsmDbg();
});

AvrAsmDbg.prototype.regsEdit = function() {
    var $this = $(this);
    var $tr = $this.parent();
    var row = $tr.parent().children().index($tr) - 1;
    var col = $tr.children().index($this);
    var base, $hex, $dec;
    if (col == 1) {
        base = 16;
        $hex = $this;
        $dec = $this.next();
    } else {
        base = 10;
        $hex = $this.prev();
        $dec = $this;
    }
    var val = parseInt($this.text(), base);
    if (isNaN(val) || val < 0 || val > 255) {
        val = 0;
    }
    $dec.text(val.toString());
    $hex.text(('00' + val.toString(16) + 'h').substr(-3));
}
