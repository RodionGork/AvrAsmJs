function AvrAsm() {
    this.lines = [];
    this.labels = [];
    this.regs = [];
    
    this.init();
}

AvrAsm.prototype.init = function() {
    this.loadCommandsData();
    for (var i = 0; i < 32; i++) {
        this.regs[i] = 0;
    }
    this.label('main', 0);
    this.lines[0] = this.addCommand('rjmp main');
    for (var j = 1; j < 10; j++) {
        this.lines[j] = this.addCommand('nop');
    }
}

AvrAsm.prototype.loadCommandsData = function() {
    this.commands = {
        'rjmp': {size: 1},
        'ldi': {size: 1},
        'mov': {size: 1},
        'in': {size: 1},
        'out': {size: 1},
        'nop': {size: 1},
    };
}

AvrAsm.prototype.addCommand = function(cmd) {
    cmd = cmd.trim().toLowerCase();
    var type = cmd.split(' ')[0];
    var cmdData = this.commands[type];
    if (typeof(cmdData) == 'undefined') {
        throw 'Unknown opcode: ' + type;
    }
    return {text: cmd, hex: 0, size: cmdData.size};
}

AvrAsm.prototype.label = function(name, line) {
    this.labels[name] = line;
    this.labels[line] = name;
}
