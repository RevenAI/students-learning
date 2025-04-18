import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const MAX_LIMIT = 10;

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  const decrement = () => {
    setCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="counter-container">
      <h1>Click Counter</h1>
      <div className="counter-display">
        <span className={count >= MAX_LIMIT ? 'limit-reached' : ''}>
          {count}
        </span>
      </div>
      
      {count >= MAX_LIMIT && (
        <p className="limit-message">You've reached the limit!</p>
      )}
      
      <div className="button-group">
        <button 
          onClick={increment} 
          disabled={count >= MAX_LIMIT}
          className="btn increment"
        >
          Increase
        </button>
        <button 
          onClick={decrement} 
          disabled={count === 0}
          className="btn decrement"
        >
          Decrease
        </button>
        <button 
          onClick={reset} 
          className="btn reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;