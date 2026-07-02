const express = require("express");
const app = express();
const routes = require("./routes/index.route");
// const rateLimit = require('express-rate-limit');

const speedLimiter = require('express-slow-down');
// const rateLimiter = require("./middlewares/rateLimiter.middleware");
app.use(express.json());

// app.use(cors({ origin: 'https://my-app.com' }));

// const rateLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 3,
//   message: 'Too many requests from this IP, please try again after 2 minutes',
// })
// throtling vs rate limiting
// throtling
// const limiter = speedLimiter({
//   windowMs: 1 * 60 * 1000, 
//   delayAfter: 2, 
//   delayMs: (hits) => (hits - 10) * 5000, 
//   maxDelayMs: 5000 
// });

// app.use(rateLimiter);
// app.use(limiter);

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});
