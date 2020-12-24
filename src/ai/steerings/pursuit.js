import Steering from "./steering.js";
import Vector2 from 'phaser/src/math/Vector2'
import Npc from "../../characters/npc.js";

export default class Pursuit extends Steering {

    constructor (owner, target, force = 1, ownerSpeed= 80, targetSpeed = 100, stopDistance = 20) {
        super(owner, [target], force);
        this.target = target;
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed
        this.stopDistance = stopDistance;
    }

    static seek(owner, target, maxSpeed) {
        const desiredVelocity = new Vector2(target.x - owner.x, target.y-owner.y)
        .normalize().scale(maxSpeed);
        const prevVelocity = new Vector2(owner.body.x-owner.body.prev.x, owner.body.y-owner.body.prev.y);
        return desiredVelocity.subtract(prevVelocity);
    }

    calculateImpulse () {
        
        // console.log(this.objects[0])
        // console.log(this.objects[0].Steering.objects[0])
        // ev = 5;
        const target = this.target //this.objects[0];

        let pursuitMen = this.owner;
        /*if (target instanceof Npc)
            pursuitMen = this.objects[0].steering.objects[0];
        else    
            pursuitMen = this.owner.evader;
        */
        const searcherDirection = pursuitMen.body.velocity;        
        const targetPos = new Vector2(target.x, target.y);
        if(target.body == undefined)
            return new Vector2(0, 0);
        const targetDirection = target.body.velocity;
        const toTarget = new Vector2(pursuitMen.x - target.x, pursuitMen.y - target.y);

        const relativeHeading = searcherDirection.dot(targetDirection);

        if (Math.abs(target.x - pursuitMen.x) < this.stopDistance && Math.abs(target.y - pursuitMen.y) < this.stopDistance)
            return  new Vector2(0, 0);


        if (Math.abs(target.x - pursuitMen.x) < this.stopDistance && Math.abs(target.y - pursuitMen.y) < this.stopDistance)
            return  new Vector2(0, 0);

        if (toTarget.dot(targetDirection) < 0 || relativeHeading > -0.95)
            return Pursuit.seek(pursuitMen, targetPos, this.ownerSpeed);

        const lookAheadTime = toTarget.length / (this.ownerSpeed + this.targetSpeed)
        
        return Pursuit.seek(pursuitMen,
            targetPos.add(target.body.velocity.clone().scale(lookAheadTime)), 
            this.ownerSpeed);
    }
}