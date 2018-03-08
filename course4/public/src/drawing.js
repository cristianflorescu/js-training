// TODO 1. Create more shapes. EG: Square, Line, Arc, Text
// TODO 2. Extend the objects with a method that validates the input parameters and prompts the user
// 3. Load the objects from the "database"
// TODO 4. Save the objects in the "database"
let canvas = document.getElementById('drawing');
let canvasDiv = document.getElementById('drawingCnt');
function resize() {
  canvas.width = canvasDiv.offsetWidth * (2/3);
  canvas.height = canvas.width * (2/3);
}
resize();

let ctx = canvas.getContext('2d');

// Shape "constructor"
function Shape(x, y, fill = 'rgba(0, 0, 200, 0.5)') {
  this.x = x;
  this.y = y;
  this.fill = fill;
};
// the function that draws the shape
Shape.prototype.draw = function() {
  window.requestAnimationFrame(() => this.drawFrame());
};
// extend the drawFrame
Shape.prototype.drawFrame = function() {
  // actual drawing logic
  // to be implemented in each shape type
  throw new Error('Implement this function in your shape type');
};

// Circle "constructor"
function Circle(x, y, r, fill = 'rgba(0, 0, 200, 0.5)') {
  // call the shape constructor
  Shape.call(this, x, y);
  this.r = r;
};
// Circle extends Shape
Circle.prototype = Object.create(Shape.prototype);
// extend the drawFrame
Circle.prototype.drawFrame = function () {
  // fill with a blue color, 50% opacity
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  // an arc starting at x/y position, "r"px radius, start at 0, end at PI*2 (end of the circle)
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); // Outer circle
  ctx.fill();
};

// Arc constructor
function Arc(x, y, r, startAngle, endAngle, counterClockwise, lineWidth = 10, strokeStyle = 'blue') {
  Shape.call(this, x, y);
  this.r = r;
  this.startAngle = startAngle * (Math.PI/180);
  this.endAngle = endAngle * (Math.PI/180);
  this.counterClockWise = counterClockwise;
};
// Arc extends Shape
Arc.prototype = Object.create(Shape.prototype);
//extend the drawFrame
Arc.prototype.drawFrame = function() {
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.arcR, this.startAngle, this.endAngle, this.counterClockWise);
  ctx.lineWidth = this.lineWidth;
  ctx.strokeStyle = this.strokeStyle;
  ctx.stroke();
}

// Rectangle "constructor"
function Rectangle(x, y, width, height, fill = 'rgba(0, 0, 200, 0.5)') {
  // call the shape constructor
  Shape.call(this, x, y, fill);
  this.width = width;
  this.height = height;
};
// Circle extends Shape
Rectangle.prototype = Object.create(Shape.prototype);
// extend the drawFrame
Rectangle.prototype.drawFrame = function () {
  // fill with a blue color, 50% opacity
  ctx.fillStyle = this.fill;
  ctx.beginPath();
  // a rectangle starting at x/y position, with width/height
  ctx.rect(this.x, this.y, this.width, this.height); // Outer circle
  ctx.fill();
};

// Square "constructor"
function Square(x, y, size, fill = 'rgba(0, 0, 200, 0.5)') {
  // call the shape constructor
  Rectangle.call(this, x, y, size, size, fill);
};
// Square extends Rectangle
Square.prototype = Object.create(Rectangle.prototype);


function Line(x1, y1, x2, y2, lineWidth, fill = 'rgba(0, 0, 200, 0.5)') {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.lineWidth = lineWidth;
  this.fill = fill;
};

Line.prototype = Object.create(Shape.prototype);

Line.prototype.drawFrame = function() {
  ctx.beginPath();

  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.strokeStyle = this.fill;
  ctx.lineWidth = this.lineWidth;

  ctx.stroke();
}

// factory
function createShape(shape) {
  switch (shape.type) {
    case 'Circle':
      return new Circle(shape.x, shape.y, shape.r);
    case 'Arc':
      return new Arc(shape.x, shape.y, shape.r, shape.startAngle, shape.endAngle, shape.counterClockWise);
    case 'Rectangle':
      return new Rectangle(shape.x, shape.y, shape.width, shape.height);
    case 'Square':
      return new Square(shape.x, shape.y, shape.size);
    case 'Line':
      return new Line(shape.x1, shape.y1, shape.x2, shape.y2, shape.lineWidth);
    default:
      throw new Error(`Shape type '${shape.type}' constructor not handled in factory`);
  }
}

function retrieveAllTheShapes(success, error) {
  console.log('2');
  axios
    .get('/data')
    .then(function ({ data, status }) {
      if (200 === status) {
        success(data);
      } else {
        error('Could not retrieve data');
      }
    });
};

let drawAllTheShapes = function() {
  // show progress bar
  toggleProgress(true);
  let doneCallback = function(shapes) {
    console.log('3');
    shapes.forEach(shape => {
      let shapeObject = createShape(shape);
      shapeObject.draw();
    });
    // hide progress bar
    toggleProgress(false);
  };
  console.log('1');
  retrieveAllTheShapes(doneCallback, (myError) => {
    alert(myError);
  });
}

drawAllTheShapes();

// add window resize listener
window.addEventListener('resize', () => {
  // this will update the canvas with/heightt, which will also redraw it, so we need to redraw all the shapes
  resize();
  drawAllTheShapes();
}, false);

function toggleProgress(show) {
  document.getElementById('loading').classList.toggle('d-none', !show);
}

let addShapeBtn = document.getElementById('addShape');
// add event listener on the select type
let shapeTypeSelect = document.getElementById('type');
shapeTypeSelect.addEventListener('change', function() {
  // hide all "attr" rows
  let allAttrs = document.querySelectorAll('.attr');
  for (let item of allAttrs) {
    item.classList.add('d-none');
  }
  // show the selected one
  let shapeAttr = document.getElementById(`attr${this.value}`);
  if (shapeAttr) {
    shapeAttr.classList.remove('d-none');
    addShapeBtn.classList.remove('d-none');
  } else {
    addShapeBtn.classList.add('d-none');
  }
}, false);

// add event listener on the button
addShapeBtn.addEventListener('click', function() {
  // read the shape position
  let x = document.getElementById('x').value;
  let y = document.getElementById('y').value;
  switch (shapeTypeSelect.value) {
    case 'Circle':
      // circle also has a radius
      let r = document.getElementById('circleR').value;
      // create and draw the shape
      let circle = createShape({
        type: shapeTypeSelect.value,
        x,
        y,
        r
      });
      circle.draw();
      break;
      case 'Arc':
          // circle also has a radius
          let arcR = document.getElementById('arcR').value;
          let startAngle = document.getElementById('startAngle').value;
          let endAngle = document.getElementById('endAngle').value;
          // create and draw the shape
          let arc = createShape({
              type: shapeTypeSelect.value,
              x,
              y,
              r:arcR,
              startAngle,
              endAngle,
              counterClockWise:"false"
          });
          arc.draw();
          break;
    case 'Rectangle':
      // rectangle has width and height
      let width = document.getElementById('rectWidth').value;
      let height = document.getElementById('rectHeight').value;
      // create and draw the shape
      let rectangle = createShape({
        type: shapeTypeSelect.value,
        x,
        y,
        width,
        height
      });
      rectangle.draw();
      break;
    case 'Square':
      // rectangle has width and height
      let size = document.getElementById('sqSize').value;
      // create and draw the shape
      let square = createShape({
        type: shapeTypeSelect.value,
        x,
        y,
        size
      });
      square.draw();
      break;
    case 'Line':
      // rectangle has width and height
      let x2 = document.getElementById('lineX2').value;
      let y2 = document.getElementById('lineY2').value;
      let lineWidth = document.getElementById('lineWidth').value;
      // create and draw the shape
      let line = createShape({
        type: shapeTypeSelect.value,
        x1: x,
        y1: y,
        x2,
        y2,
        lineWidth
      });
      line.draw();
      break;
    default:
  }
}, false);

let clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}, false);
