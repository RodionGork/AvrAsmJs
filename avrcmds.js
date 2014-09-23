function AvrCmds(avrasm) {
    this.avrasm = avrasm;
}

AvrCmds.prototype['rjmp'] = function(s) {
    if (this.avrasm.label(s) < 0) {
        throw 'Unknown label: ' + s;
    }
    return {code: 'rjmp', text: 'rjmp ' + s, label: s};
};

AvrCmds.prototype['nop'] = function(s) {
    return {text: 'nop', code: 'nop'};
}

