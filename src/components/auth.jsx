import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset } from "../features/authSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Redux Counter</h1>
      <h2>{count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button 
      onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}

export default Counter;
