import { useEffect, useState } from 'react'
import './App.css'
import Counter from './components/counter';
import TodoApp from './components/todo';

function ProductCard({ productData }) {
  return (
    <div className="card">
      <h3>{productData.title}</h3>
      <p>Price: ${productData.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

// Use it many times
function Store() {
  const productData={
    title:"laptop",
    price:100
  }
  return (
    <div>
      <ProductCard productData={productData} />
      {/* <ProductCard /> */}
      {/* <ProductCard /> */}
      {/* <ProductCard title="Tablet" price={399} /> */}

    </div>
  );
}
function App() {
  const [count, setCount] = useState(0)

  // useEffect(()=>{
  //   setCount(count+1);
  // })
  console.log('hi ')
  // const [variable, variableStateAction]=useState(initialValue)

  return (
    <>
      <Store />
      <Counter/>
      <TodoApp/>
      {/* <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button> */}
    </>
  )
}

export default App
