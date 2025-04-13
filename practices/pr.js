//loop
for (let i=0; i<=5; i++){
   if (i%2==0){
       console.log(i + " is even")
   } else {
       console.log(i + " is odd")
   }
}

// refactory functions
 const circleArea = (radius) => {
    const area = Math.PI * radius * radius;
    return {
        area,
        draw() {
            console.log("Drawing a circle with radius: " + radius)
        }
    }
}

const circlePerimeter = (radius) => {
    const perimeter = 2 * Math.PI * radius;
    return {
        perimeter,
        draw() {
            console.log("Drawing a circle with radius: " + radius)
        }
    }
}

const radius = 5;

const area = circleArea(radius);
console.log("Area of circle with radius " + radius + " is: " + area);

const perimeter = circlePerimeter(radius);
console.log("Perimeter of circle with radius " + radius + " is: " + perimeter);

//NOTE
/* 
Summary
You're returning an object → { area, draw() {...} }

Logging the whole object as a string gives [object Object]

Use console.log(myObject) or console.log(myObject.property) to see actual content
............................................
const result = circleArea(5);
console.log(result);          // Shows the actual object in dev tools
console.log(result.area);     // Logs the number (area)
result.draw();                // Calls the draw method

............................................
console.log(circleArea(5).area);  // Correct way to see just the area
circleArea(5).draw();             // Correct way to run the draw method
*/

//CORRECTED CODE LOGGING FOR CORRECT OUTPUT
const circle = circleArea(radius);
console.log("Area of circle with radius " + radius + " is: " + circle.area);



//WHAT TO REVISE
/* 
Mathematical functions
- Radius: r
- Circle Area: A = πr²
- Circle Perimeter: P = 2πr
- Circle Diameter: D = 2r
- Circle Circumference: C = 2πr
- Circle Volume: V = (4/3)πr³
- Circle Surface Area: SA = 4πr²
- Circle Sector Area: SA = (θ/360)πr²
- Circle Arc Length: L = (θ/360)2πr
- Circle Chord Length: L = 2r * sin(θ/2)
- Circle Segment Area: SA = (r²/2)(θ - sin(θ))
- Circle Annulus Area: A = π(R² - r²)
- Circle Inscribed Square Area: A = 2r²
- Circle Circumscribed Square Area: A = 4r²


//also
math PI and Math.PI in JS
*/

