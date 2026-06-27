Why React exists (vs Vanilla JS)
Components as building blocks
JSX syntax
Props vs State
Rendering flow
One-way data flow 
Component tree structure
React Hooks
<!-- useEffect() -->
```javascript
const countEl = document.querySelector('#count');
const buttonEl = document.querySelector('#button');
let count = 0;

buttonEl.addEventListener('click', () => {
  count++;
  countEl.innerText = count;        // Manual update
  countEl.style.color = count > 5 ? 'red' : 'black'; // More updates
  
});
```

# ATOMIC -arch for UI
# NextJS - UI 
# formik
# merterial ui
# antd
# redux toolkit 
