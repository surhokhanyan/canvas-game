const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

const bgImg = document.createElement("img");
bgImg.src = "https://thumbs.dreamstime.com/b/forest-game-background-d-application-vector-design-tileable-horizontally-size-ready-parallax-effect-73706218.jpg";
const heroImg = document.createElement("img");
heroImg.src = "https://www.pngmart.com/files/15/Hero-PNG-Transparent-Image.png";
const fireImg = document.createElement("img");
fireImg.src = "https://pngimg.com/uploads/bullets/bullets_PNG35597.png";
const audio = document.createElement("audio");
audio.src = "http://www.slspencer.com/Sounds/Various/gunshot-1.mp3";
const rabbitImg = document.createElement("img");
rabbitImg.src = "https://opengameart.org/sites/default/files/skeleton%20pv_2.png";
const stabAudio = document.createElement("audio");
stabAudio.src = "http://www.slspencer.com/Sounds/Various/WatchingYou.mp3";
let date = {
    hero:{
        xDelta:0,
        yDelta:0,
        x:15,
        y:90,
        width:50,
        height:40
    },
    fire:[],
    rabbits:[]

};
function intersect(rect1, rect2){
    const x = Math.max(rect1.x, rect2.x),
        num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
        y = Math.max(rect1.y, rect2.y),
        num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
    return (num1 >= x && num2 >= y);
}
function update(){
    date.hero.x += date.hero.xDelta;
    date.hero.y += date.hero.yDelta;

    date.fire.forEach(function(fires){
        date.rabbits.forEach(function (rabbit){
            if (intersect(rabbit, fires)){
                stabAudio.currentTime = 0;
                stabAudio.play();
                fires.deleteMe = true;
                rabbit.deleteMe = true;
            }
        })
    });
    date.fire = date.fire.filter(function (fires){
        return fires.deleteMe !== true;
    })
    date.rabbits = date.rabbits.filter(function (rabbit){
        return rabbit.deleteMe !== true;
    })
    date.fire.forEach(function (fires){
        fires.x += fires.xDelta;
    });
    date.fire = date.fire.filter(function(fires){
        if (fires.x > canvas.width){
            return false;
        }else{
            return true;
        }
    });
    date.rabbits.forEach(function(rabbit){
       rabbit.x += rabbit.xDelta;
    });
    if (date.rabbits.length === 0){
        date.rabbits.push({
            xDelta: -0.5,
            x: canvas.width,
            y: date.hero.y,
            width:30,
            height:40,
        })
    }
}
function draw(){
    context.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    context.drawImage(heroImg, date.hero.x, date.hero.y, date.hero.width, date.hero.height);
    date.fire.forEach(function(fires){
        context.drawImage(fireImg, fires.x, fires.y, fires.width, fires.height)
    })
    date.rabbits.forEach(function (rabbit){
        context.drawImage(rabbitImg, rabbit.x, rabbit.y, rabbit.width, rabbit.height)
    })
}
function loop(){
    requestAnimationFrame(loop);
    update();
    draw();
}
loop();
document.addEventListener("keydown", function (event){
    if (event.code === "ArrowRight"){
        date.hero.xDelta = 0.5;
    }else if(event.code === "ArrowLeft"){
        date.hero.xDelta = -0.5;
    }else if(event.code === "ArrowUp"){
        date.hero.yDelta = -0.5;
    }else if(event.code === "ArrowDown"){
        date.hero.yDelta = 0.5;
    }
    else if(event.code === "Space"){
        audio.currentTime = 0;
        audio.play();
        date.fire.push({
            xDelta:5,
            x:date.hero.x + date.hero.width,
            y:date.hero.y + date.hero.height/30,
            width: 20,
            height: 10
        })
    }
});
document.addEventListener("keyup", function (event){
    date.hero.xDelta = 0;
    date.hero.yDelta = 0;
})