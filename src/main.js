function AvrAsmDbg() {
    this.init();
}

AvrAsmDbg.prototype.init = function() {
    this.opcodes = $('#opcodes');
    this.regs = $('#regs');
    for (var i = 0; i < 10; i++) {
        $('<tr><td>&nbsp;</td><td></td><td></td></tr>').appendTo(this.opcodes);
    }
    for (var i = 0; i < 32; i++) {
        $('<tr><td>' + i + '</td><td></td><td></td></tr>').appendTo(this.regs);
    }
}

$(function() {
    avrAsmDbg = new AvrAsmDbg();
});

