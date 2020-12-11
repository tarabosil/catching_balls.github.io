class FallingBall {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
     display() {
         noStroke();
         fill(255, 178, 78);
         ellipse(this.x, this.y, this.r, this.r); 
     }

     move() {
         this.y += random(0, 1);
     }

     getX(){
         return this.x;
     }

     getY() {
         return this.y;
     }

     dead() {
     }
}