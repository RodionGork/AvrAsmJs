function AvrAsmDbg() {
    this.avrasm = new AvrAsm();
    var cmds = new AvrCmds(this.avrasm);
    this.avrasm.cmds = cmds;
    this.avrasm.init();
    this.init();
    this.populateState();
}

AvrAsmDbg.prototype.init = function() {
    this.opcodes = $('#opcodes');
    for (var i = 0; i < this.avrasm.lines.length; i++) {
        this.addCodeLine(i);
    }
    this.regs = $('#regs');
    for (var i = 0; i < 32; i++) {
        this.addRegsLine(i);
    }
    $('#opcodes').editableTableWidget();
    $('#regs').editableTableWidget();
    var self = this;
    $('#regs td').change(function() {self.regsEdit(this)});
    $('#opcodes td').change(function() {self.codeEdit(this)});
}

AvrAsmDbg.prototype.addRegsLine = function(i) {
    $('<tr><td>' + i + '</td><td class="editable"></td><td class="editable"></td></tr>').appendTo(this.regs);
}

AvrAsmDbg.prototype.addCodeLine = function(i) {
    $('<tr><td></td><td class="editable">&nbsp;</td><td class="editable"></td><td></td></tr>').appendTo(this.opcodes);
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
        var row = $(rows.get(i + 1)).find('td+td');
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

AvrAsmDbg.prototype.cellCoords = function(cell) {
    var $tr = cell.parent();
    return {
        y: $tr.parent().children().index($tr) - 1,
        x: $tr.children().index(cell)};
}

AvrAsmDbg.prototype.regsEdit = function(cell) {
    cell = $(cell);
    var pos = this.cellCoords(cell);
    var base, $hex, $dec;
    if (pos.x == 1) {
        base = 16;
        $hex = cell;
        $dec = cell.next();
    } else {
        base = 10;
        $hex = cell.prev();
        $dec = cell;
    }
    var val = parseInt(cell.text(), base);
    if (isNaN(val) || val < 0 || val > 255) {
        val = 0;
    }
    $dec.text(val.toString());
    $hex.text(('00' + val.toString(16) + 'h').substr(-3));
    this.avrasm.regs[pos.y] = val;
}

AvrAsmDbg.prototype.codeEdit = function(cell) {
    cell = $(cell);
    var pos = this.cellCoords(cell);
    if (pos.x == 1) {
        this.labelEdit(cell, pos);
    } else {
        this.commandEdit(cell, pos);
    }
}

AvrAsmDbg.prototype.commandEdit = function(cell, pos) {
    var command = cell.text();
    try {
        var parsed = this.avrasm.parseCommand(command);
        this.avrasm.lines[pos.y] = parsed;
        cell.text(parsed.text);
    } catch (e) {
        cell.text(this.avrasm.lines[pos.y].text);
        console.log(e);
    }
}

AvrAsmDbg.prototype.labelEdit = function(cell, pos) {
    var labelName = cell.text();
    labelName = labelName.replace(/\:$/, '');
    if (!/^[A-Za-z\_][A-Za-z0-9\_]*$/.test(labelName)) {
        cell.text(this.avrasm.label(pos.y));
        return;
    }
    this.avrasm.label(labelName, pos.y);
    cell.text(labelName + ':');
}
