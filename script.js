// control a canvas element with a script
context = document.getElementById('canvas').getContext('2d');
context.canvas.width  = window.innerWidth;
context.canvas.height = window.innerHeight;

middleOfViewPortX = window.innerWidth/2;
middleOfViewPortY = window.innerHeight/2;

class Branch {
    constructor(length, angle, parentBranch, energy){
        this.length = length;
        this.angle = angle;
        this.parentBranch = parentBranch;
        this.energy = energy;
    }

    rootX (){
        if(this.parentBranch == null){
            return 0;
        } else {
            return this.parentBranch.leafX()
        }
    }

    rootY (){
        if(this.parentBranch == null){
            return 0;
        } else {
            return this.parentBranch.leafY()
        }
    }

    leafX (){
        var parentAngle = 0;
        if(this.parentBranch != null){
            parentAngle = this.parentBranch.angle;
        }
        return this.rootX() + this.length * Math.cos(this.absoluteAngle());
    }

    leafY (){
        return this.rootY() - this.length * Math.sin(this.absoluteAngle());
    }

    absoluteAngle(){
        if(this.parentBranch == null){
            return this.angle;
        }else{
            return this.angle + this.parentBranch.absoluteAngle();
        }
    }
}

function randomAroundZero(factor){
    return Math.random() * factor - factor / 2;
}

function randomPositive(factor){
    return Math.random() * factor;
}

function randomNegative(factor){
    return -Math.random() * factor;
}

function randomBoolean(){
    return Math.random() > 0.5;
}

energy_flow = 0.3;
function threshold_to_split(){
    return 10 + Math.random() * 5;
}

increase_length = 0.3;
energy_consumption_to_increase = 0.1;

mainBranch = new Branch(0,0, null, 0);

branches = [mainBranch];
branches_to_add = [];

maxTime = 10;

function growBranch(branch){
    branch.energy += energy_flow;
    if(branch.energy > threshold_to_split()){
        branch.energy = 0;
        if(randomBoolean()){
            branches_to_add.push(new Branch(0, Math.PI/4 + randomAroundZero(1), branch, 0));
        }
        if(randomBoolean()){
            branches_to_add.push(new Branch(0, -Math.PI/4 - randomAroundZero(1), branch, 0));
        }
        if(randomBoolean()){
            branches_to_add.push(new Branch(0, randomAroundZero(1), branch, 0));
        }
    }else{
        branch.length += increase_length;
        branch.energy -= energy_consumption_to_increase;
    }
}


initialTime = Date.now();

function loop(){
    elapsedTime = Date.now() - initialTime;
    if(elapsedTime < maxTime * 1000){
        window.requestAnimationFrame(loop);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for(var i = 0; i < branches.length; i++){
            drawBranch(branches[i]);
            growBranch(branches[i]);
        }
        branches = branches.concat(branches_to_add);
        branches_to_add = [];
    }else{
        console.log(branches);
    }
}

loop();

function rotateCoordinates(x, y, angle){
    return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
}

// draw branches
function drawBranch(branch){
    alpha = branch.length > 100 ? 1 : branch.length / 100;
    context.strokeStyle = 'rgba(255, 0, 0,' + alpha + ')';
    context.lineWidth = 1;
    context.beginPath();
    x1 = branch.rootX();
    y1 = branch.rootY();
    x2 = branch.leafX();
    y2 = branch.leafY();

    [x1, y1] = rotateCoordinates(x1, y1, -Math.PI/2);
    [x2, y2] = rotateCoordinates(x2, y2, -Math.PI/2);

    context.moveTo(x1 + middleOfViewPortX, y1 + 4 * middleOfViewPortY / 3);
    context.lineTo(x2 + middleOfViewPortX, y2 + 4 * middleOfViewPortY / 3);

    context.a
    context.stroke();
}
