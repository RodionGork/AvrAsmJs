function AvrAsm() {
    this.lines = [];
    this.labels = [];
    this.regs = [];
}

AvrAsm.prototype.init = function() {
    this.loadCommandsData();
    for (var i = 0; i < 32; i++) {
        this.regs[i] = 0;
    }
    this.label('main', 0);
    this.lines[0] = this.parseCommand('rjmp main');
    for (var j = 1; j < 10; j++) {
        this.lines[j] = this.parseCommand('nop');
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

AvrAsm.prototype.parseCommand = function(cmd) {
    cmd = cmd.trim().toLowerCase();
    var splitted = cmd.split(/\s+/, 2);
    var type = splitted[0];
    var parser = this.cmds[type];
    if (typeof(parser) == 'undefined') {
        throw 'Unknown opcode: ' + type;
    }
    return this.cmds[type](splitted[1]);
}

AvrAsm.prototype.label = function(labelName, line) {
    if (typeof(line) == 'undefined') {
        if (typeof(this.labels[labelName]) != 'undefined') {
            return this.labels[labelName];
        } else {
            return typeof(labelName) == 'number' ? '' : -1;
        }
    }
    this.labels[labelName] = line;
    this.labels[line] = labelName;
}
