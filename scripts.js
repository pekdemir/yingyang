
class Box
{
    constructor(id, x, y, s, color){
        this.id = id;
        this.pos = createVector(x, y);
        this.s = s;
        this.color = color;
    }

    draw(){
        noStroke();
        fill(this.color);
        square(this.pos.x, this.pos.y, this.s);
    }
}

class Ball
{
    constructor(id, x, y, r, vx, vy, color){
        this.id = id;
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.r = r;
        this.color = color;
    }

    draw()
    {
        noStroke();
        // stroke(0,0,0);
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }

    update()
    {
        this.pos.add(this.vel);
        if(this.pos.x > width - this.r || this.pos.x < this.r)
            this.vel.x *= -1;
        if(this.pos.y > height - this.r || this.pos.y < this.r)
            this.vel.y *= -1;
    }

    hit(box){
        if(this.id != box.id)
            return;
        let cx = this.pos.x;
        let cy = this.pos.y;
        let left = box.pos.x;
        let right = left + box.s;
        let top = box.pos.y;
        let bottom = top + box.s;
        let closestX = (cx < left ? left : (cx > right ? right : cx));
        let closestY = (cy < top ? top : (cy > bottom ? bottom : cy));
        let dx = closestX - cx;
        let dy = closestY - cy;
        let normal = createVector(dx, dy);

        // fill(255, 0, 0);
        // circle(closestX, closestY, 5);

        if( dx * dx + dy * dy  < this.r * this.r){
            let new_vec = p5.Vector.normalize(normal).mult(this.r - normal.mag());
            this.pos.sub(new_vec);
            this.vel.reflect(new_vec);
            box.id = box.id ? 0 : 1;
            box.color = box.id ? color(200, 200, 200) : color(50, 50, 50);
            // line(closestX, closestY, closestX + new_vec.x, closestY + new_vec.y);
        }
    }
}
let white_ball = null;
let black_ball = null;
let boxes = [];

let width = 600;
let height = 600;
let box_size = 30;
let ball_size = 15;

function setup() {
    createCanvas(width, height);
    frameRate(60);
    let white_color = color(200, 200, 200);
    let black_color = color(50, 50, 50);
    let speed = 10;
    // noLoop();
    let angle = random();
    white_ball = new Ball(1, width / 4, height / 2, ball_size, cos(angle) * speed, sin(angle) * speed, white_color);
    angle = random();
    black_ball = new Ball(0, 3 * width / 4, height / 2, ball_size, cos(angle) * speed, sin(angle) * speed, black_color);

    for(let i = 0; i < (width / box_size) / 2; i++){
        for(let j = 0; j < height / box_size; j++){
            boxes.push(new Box(0, i * box_size, j * box_size, box_size, black_color));
        }
    }

    for(let i = 0; i < (width / box_size) / 2; i++){
        for(let j = 0; j < height / box_size; j++){
            boxes.push(new Box(1, width / 2 + i * box_size, j * box_size, box_size, white_color));
        }
    }
    // boxes.push(new Box(1, 200, 100, 50, white_color));
    // boxes.push(new Box(0, 100, 100, 50, black_color));
}

function draw() {
    background(30);
    // fill(0, 0, 0);
    // rect(100, 100, 200, 200);
    for(box of boxes){
        box.draw();
        white_ball.hit(box);
        black_ball.hit(box);
    }
    
    white_ball.draw();
    black_ball.draw();
    
    white_ball.update();
    black_ball.update();
}