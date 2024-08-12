//Create a class to model an object
class Example {
    constructor(param1, param2) {
        this.param1 = param1;
        this.param2 = param2;
    }

    myMethod(attr = 'Example') {
        console.log(`Code to Execute: ${attr}`);
    }
}

//Create new instance of object class
const myClassVar = new Example('1', 1)

//Call methods of instance
myClassVar.myMethod()
