// ============================================================
// WINDOW OBJECT
// ============================================================
console.dir(window);        // prints entire Window object
console.log(window);        // prints it as a string
window.alert("Hello!");     // same as alert("Hello!")
window.prompt("Enter:");    // same as prompt("Enter:")

// ============================================================
// ACCESSING THE DOCUMENT OBJECT
// ============================================================
console.log(document);           // prints full HTML
console.dir(document);           // prints document object with all methods
console.log(window.document);    // same as above
console.log(document.body);      // prints body HTML
console.dir(document.body);      // prints body as JS object

// ============================================================
// changeing things on screen
// ============================================================
document.body.style.background='green'
document.body.childNodes[1].innerText='abcd'

let heading = document.getElementById("header");
console.log(heading)
// ============================================================
// 1. GET BY ID — returns single element or null
// ============================================================
let heading = document.getElementById("heading");
console.dir(heading);
// Output: h1#heading.my-class (with all properties)

// If ID doesn't exist:
let notFound = document.getElementById("nonexistent");
console.log(notFound);  // null

// ============================================================
// 2. GET BY CLASS NAME — returns HTMLCollection
// ============================================================
let headings = document.getElementsByClassName("my-class");
console.dir(headings);
// Output: HTMLCollection(2) [h1#heading.my-class, h4.my-class]
//         length: 2, 0: h1, 1: h4

// Wrong class name:
let empty = document.getElementsByClassName("nothing");
console.log(empty.length);  // 0  (empty HTMLCollection, not null)

// ============================================================
// 3. GET BY TAG NAME — returns HTMLCollection
// ============================================================
let paras = document.getElementsByTagName("p");
console.dir(paras);
// Output: HTMLCollection(2) [p, p]

console.log(paras[0].innerText);  // "Let's learn about DOM concepts in detail"
console.log(paras[1].innerText);  // "Second paragraph"

// ============================================================
// 4a. QUERY SELECTOR — returns FIRST matching element
// ============================================================
let firstPara = document.querySelector("p");       // by tag
let byClass   = document.querySelector(".my-class"); // by class (dot prefix)
let byId      = document.querySelector("#my-id");    // by id (hash prefix)

console.dir(firstPara);  // first <p> element

// ============================================================
// 4b. QUERY SELECTOR ALL — returns NodeList (all matches)
// ============================================================
let allParas = document.querySelectorAll("p");
console.dir(allParas);
// Output: NodeList(2) [p, p]

let allBoxes = document.querySelectorAll(".box");
console.dir(allBoxes);
// Output: NodeList(3) [div.box, div.box, div.box]

// ============================================================
// READING PROPERTIES (Get)
// ============================================================

// tagName
let btn = document.querySelector("#my-id");
console.log(btn.tagName);    // "BUTTON"

let p = document.querySelector("p");
console.log(p.tagName);      // "P"

// innerText vs innerHTML vs textContent
let div = document.querySelector("div");
console.log(div.innerText);    // visible text only, newline-separated
console.log(div.innerHTML);    // full HTML string including tags like <i>, <b>
console.log(div.textContent);  // text including hidden elements

// ============================================================
// CHANGING PROPERTIES (Set) — Dynamic DOM Manipulation!
// ============================================================

// Change text
let h1 = document.querySelector("h1");
h1.innerText = "New Heading!";
// Page now shows: "New Heading!" instead of the original

// Append to existing text (string concatenation)
h1.innerText = h1.innerText + " — from Apna College Students";
// Result: "New Heading! — from Apna College Students"

// Set innerHTML (adds real HTML tags)
h1.innerHTML = "<u><b>New Heading!</b></u>";
// Result: underlined + bold text on page

// Change CSS via JS
document.body.style.background = "green";
// Page background turns green

// ============================================================
// NAVIGATION — parent, child, sibling
// ============================================================

let body = document.body;
console.log(body.firstChild);   // Text node (whitespace) — not the div!
console.log(body.children);     // HTMLCollection of element children only
console.log(body.childNodes);   // NodeList including text nodes

// Access children like an array:
let allDivs = document.querySelectorAll(".box");
console.log(allDivs[0]);  // first div
console.log(allDivs[1]);  // second div
console.log(allDivs[2]);  // third div

// ============================================================
// PRACTICE Q1: Change h2 text + append more text
// ============================================================
// HTML: <h2>Hello JavaScript</h2>
let h2 = document.querySelector("h2");
h2.innerText = h2.innerText + " from Apna College Students";
// Result: "Hello JavaScript from Apna College Students"

// ============================================================
// PRACTICE Q2: Access 3 divs and add unique text — BEGINNER way
// ============================================================
let divs = document.querySelectorAll(".box");
divs[0].innerText = "New Unique Value 1";
divs[1].innerText = "New Unique Value 2";
divs[2].innerText = "New Unique Value 3";

// ============================================================
// PRACTICE Q2: BETTER way using a loop (scales to 100 divs!)
// ============================================================
let idx = 1;
for (let div of divs) {
  div.innerText = `New Unique Value ${idx}`;
  idx++;
}
// Output on page:
// Box 1: "New Unique Value 1"
// Box 2: "New Unique Value 2"
// Box 3: "New Unique Value 3"

// ============================================================
// TEXTCONTENT vs INNERTEXT — hidden elements
// ============================================================
// Given: <h1 style="visibility: hidden">Old Heading</h1>
let hiddenH1 = document.querySelector("h1");
console.log(hiddenH1.innerText);    // ""  (empty — element is hidden)
console.log(hiddenH1.textContent);  // "Old Heading"  (shows even if hidden!)