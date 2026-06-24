// ==========================================
// USER REGISTRATION
// ==========================================
// Flow:
// 1. Check email availability
// 2. Create user account
// 3. Generate welcome email
// 4. Send notification
//
// Run one step at a time from bottom
// ==========================================

// ------------------------------------------------------------------
// STEP 1: Synchronous Code (The problem)
// ------------------------------------------------------------------
function runStep1() {
  console.log("--- STEP 1: Sync Registration ---");

  function checkEmail() { console.log("Checking if email exists"); }
  function createUser() { console.log("Creating user account"); }
  function sendWelcomeEmail() { console.log("Sending welcome email"); }
  function sendNotification() { console.log("Sending mobile notification"); }

  checkEmail();
  createUser();
  sendWelcomeEmail();
  sendNotification();

  console.log("Other API requests handled");
}

// ------------------------------------------------------------------
// STEP 2: Async using setTimeout (Problem)
// ------------------------------------------------------------------
function runStep2() {
  console.log("--- STEP 2: Async Problem ---");

  function checkEmail() {
    setTimeout(() => { console.log("Checking email"); }, 3000);
  }

  function createUser() {
    setTimeout(() => { console.log("Creating user"); }, 1000);
  }

  function sendWelcomeEmail() {
    setTimeout(() => { console.log("Sending welcome email"); }, 2000);
  }

  checkEmail();
  createUser();
  sendWelcomeEmail();

  console.log("Application is still running");
}

// ------------------------------------------------------------------
// STEP 3: Callback Solution
// ------------------------------------------------------------------
function runStep3() {
  console.log("--- STEP 3: Callback ---");

  function checkEmail(callback){
    setTimeout(() => {
      console.log("Email available");
      callback();
    }, 3000);
  }

  function createUser(callback){
    setTimeout(() => {
      console.log("User created");
      callback();
    }, 1000);
  }

  function sendWelcomeEmail(callback){
    setTimeout(() => {
      console.log("Welcome email sent");
      callback();
    }, 2000);
  }

  function sendNotification(){
    setTimeout(() => {
      console.log("Notification sent");
    }, 500);
  }

  checkEmail(() => {
    createUser(() => {
      sendWelcomeEmail(() => {
        sendNotification();
      });
    });
  });

  console.log("Other tasks continue");
}

// ------------------------------------------------------------------
// STEP 4: Callback Error Handling
// ------------------------------------------------------------------
function runStep4() {
  console.log("--- STEP 4: Callback Error ---");

  function checkEmail(callback){
    setTimeout(() => {
      const emailExists = true;
      if(emailExists){
        callback(new Error("Email already registered"), null);
      } else {
        callback(null, "email available");
      }
    }, 2000);
  }

  checkEmail((error, result) => {
    if(error){
      console.log("Registration failed:", error.message);
      return;
    }
    console.log(result);
  });
}

// ------------------------------------------------------------------
// STEP 5: Promise Version
// ------------------------------------------------------------------
function runStep5() {
  console.log("--- STEP 5: Promise ---");

  function checkEmail(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Email checked");
        resolve({ available: true });
      }, 2000);
    });
  }

  function createUser(){
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("User created");
        resolve({ id: 101, name: "Alex" });
      }, 1000);
    });
  }

  function sendWelcomeEmail(){
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Welcome email sent");
        resolve();
      }, 1500);
    });
  }

  checkEmail()
    .then((data) => {
      console.log("Email status:", data.available);
      return createUser();
    })
    .then((user) => {
      console.log("User id:", user.id);
      return sendWelcomeEmail();
    })
    .then(() => {
      console.log("Registration completed");
    })
    .catch(error => {
      console.log("Error:", error.message);
    });
}

// ------------------------------------------------------------------
// STEP 6: Async Await Modern Way
// ------------------------------------------------------------------
function runStep6() {
  console.log("--- STEP 6: Async Await ---");

  function checkEmail(){
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Checking email");
        resolve(true);
      }, 2000);
    });
  }

  function createUser(){
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Creating user");
        resolve({ id: 101, role: "student" });
      }, 1000);
    });
  }

  function sendWelcomeEmail(){
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Sending welcome mail");
        resolve();
      }, 1500);
    });
  }

  async function registerUser(){
    try {
      const available = await checkEmail();
      if(!available){
        throw new Error("Email already exists");
      }
      
      const user = await createUser();
      console.log("Created:", user);
      
      await sendWelcomeEmail();
      console.log("Registration successful");
    } catch(error) {
      console.log("Registration failed:", error.message);
    }
  }

  registerUser();
  console.log("Server handling other requests");
}

// ==========================================
// RUN
// ==========================================
// runStep1();
// runStep2();
// runStep3();
// runStep4();
// runStep5();
// runStep6();