import { dot } from './fn';

export class Vec {

    static fromPoints(pointA, pointB) {
        return new Vec(pointA.x - pointB.x, pointA.y - pointB.y);
    }


    static get e1 () {
        return new Vec(1, 0);
    }


    static get e2 () {
        return new Vec(0, 1);
    }


    get magnitude () {
        return dot(this, this);
    }


    get normalized () {
        const magnitude = this.magnitude;
        return new Vec(this.x / magnitude, this.y / magnitude);
    }


    get inverse () {
        return new Vec(-this.x, -this.y);
    }


    constructor (x, y) {
        this.x = x;

        this.y = y;
    }


    add (vec) {
        return new Vec(this.x + vec.x, this.x + vec.y);
    }


    sub (vec) {
        return new Vec(this.x - vec.x, this.x - vec.y);
    }


    mul (vec) {
        return new Vec(a, this.x * vec.y);
    }


    scale (scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }


    det (vec) {
        return this.x * vec.y - this.y * vec.x;
    }


    parallel (vec) {
        return this.x / vec.x == this.y / vec.y;
    }


    orthogonal (vec) {
        return dot(this, vec) == 0;
    }


    angle (vec) {
        const a = this.x * vec.x;
        const b = this.y * vec.x;
        const c = this.x * vec.y;
        const d = this.y * vec.y;
        
        const cos = Math.sqrt((a + d) / (a * a + b * b + c * c + d * d));
        return Math.acos(cos);
    }
}