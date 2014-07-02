function AvrAsm() {
    this.lines = [];
    this.labels = [];
    this.regs = [];
    
    this.init();
}

AvrAsm.prototype.init = function() {
    for (var i = 0; i < 32; i++) {
        this.regs[i] = 0;
    }
    this.label('main', 0);
    this.lines[0] = this.compileCommand('rjmp main');
    for (var j = 1; j < 10; j++) {
        this.lines[j] = this.compileCommand('nop');
    }
}

AvrAsm.prototype.compileCommand = function(cmd) {
    return {text: cmd, hex: 0};
}

AvrAsm.prototype.label = function(name, line) {
    this.labels[name] = line;
    this.labels[line] = name;
}