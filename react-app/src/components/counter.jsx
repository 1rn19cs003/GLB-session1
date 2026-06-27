import { useState } from 'react'
export default function Counter() {
    // const [currentValue, functionToUpdateIt] = useState(initialValue)
    const [count, setCount] = useState(0);
    const handleInc = () => {
        setCount(count + 1)
    }
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={handleInc}>
                Increment
            </button>
            <button onClick={() => setCount(count - 1)}>
                Decrement
            </button>
        </div>
    );
}