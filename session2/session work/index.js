// console.log("HI")
// console.log("HI2")
// console.log("H3")
// console.log("H4")


// ==========================================
// USER REGISTRATION
// ==========================================
// Flow:
// 1. Check email availability
// 2. Create user account
// 3. Generate welcome email
// 4. Send notification
function run1() {

    function checkEmail() { console.log("Checking if email exists"); }
    function createUser() { console.log("Creating user account"); }
    function sendWelcomeEmail() { console.log("Sending welcome email"); }
    function sendNotification() { console.log("Sending mobile notification"); }

    checkEmail();
    createUser();
    sendWelcomeEmail();
    sendNotification();

    console.log("Other API requests handled")
}

// run1()

function run2() {

    function checkEmail() {
        setTimeout(() => {
            console.log("Checking email");
        }, 3000)
    }
    function createUser() {
        setTimeout(() => { console.log("Creating user"); }, 1000);
    }

    function sendWelcomeEmail() {
        setTimeout(() => { console.log("Sending welcome email"); }, 2000);
    }
    function sendNotification() {
        setTimeout(() => { console.log("Sending notification "); }, 4000);
    }

    checkEmail();
    createUser();
    sendWelcomeEmail();
    sendNotification();
}

// run2()

function run3() {

    function checkEmail(callback) {
        setTimeout(() => {
            console.log("Checking email");
            callback();
        }, 3000)
    }
    function createUser(callback) {
        setTimeout(() => {
            console.log("Creating user");
            callback()
        }, 1000);
    }

    function sendWelcomeEmail(callback) {
        setTimeout(() => {
            console.log("Sending welcome email");
            const val = 100;
            callback(error, val)
        }, 2000);
    }
    function sendNotification() {
        setTimeout(() => {
            console.log("Sending notification ");
            // callback()
        }, 4000);
    }

    checkEmail(() => {
        createUser(() => {
            sendWelcomeEmail((err, val) => {
                // if(err){

                // }
                sendNotification()
            });
        });
    });
}

// run3()


function run4() {

    function checkEmail() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Email checked");
                resolve({ available: true });
            }, 2000);
        });
    }
    function createUser() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("User created");
                resolve({ id: 101, name: "Alex" });
            }, 1000);
        });
    }

    function sendWelcomeEmail() {
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
    // .catch(error => {
    //   console.log("Error:", error.message);
    // });
}

// run4()


function run5() {

    function checkEmail() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Email checked");
                resolve({ available: true });
            }, 2000);
        });
    }
    function createUser() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("User created");
                resolve({ id: 101, name: "Alex" });
            }, 1000);
        });
    }

    function sendWelcomeEmail() {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log("Welcome email sent");
                resolve();
            }, 1500);
        });
    }

    async function registerUser() {
        try {
            const available = await checkEmail();
            if (!available) {
                throw new Error("Email already exists");
            }
            const user = await createUser();
            console.log("Created:", user);

            await sendWelcomeEmail();
            console.log("Registration successful");
        } catch (error) {
            console.log("Registration failed:", error.message);
        }
    }

    registerUser();
}

run5()