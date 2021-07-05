// Cache an expensive function's results by storing them. You may assume
// that the function only takes primitives as arguments.
//
// The function should return a function that, when called, will check if it has
// already computed the result and return that value instead if possible.
//
// Example:
// cacheAdd = myFunction(add);
// add(1,2) = 3
// cacheAdd(1,2) = 3 --> executes add function
// cacheAdd(1,2) = 3 --> returns from cache
// cacheAdd(2,2) = 4--> executes add function
//

function myFunction() {
    const hash = {};
    return sum =(...args) => {
      if (args.length < 1) {
        return 0;
      }
      if (args.length === 1) {
        return args[0];
      }
      const stringifiedVal = args.toString();
      if (hash[stringifiedVal]) {
        return hash[stringifiedVal];
      }
      let result = 0;
      for (let i =0; i < args.length; i++) {
        result += args[i];
      }
      hash[stringifiedVal] = result;
      return result
    }
};
const cacheAdd = myFunction();
cacheAdd(1,2)
cacheAdd(1,2)
cacheAdd(2,2) 