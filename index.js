import express from "express";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDcMLgD2UYwxKt3GBSaBN_Hcjl1iZUEhOA",
  authDomain: "fitchain-422e5.firebaseapp.com",
  projectId: "fitchain-422e5",
  storageBucket: "fitchain-422e5.appspot.com",
  messagingSenderId: "885514621323",
  appId: "1:885514621323:web:239edb1071aa7d45f71f8e",
  measurementId: "G-SBS10VJL9P",
  databaseURL: "https://fitchain-422e5-default-rtdb.firebaseio.com",
};

// Initialize Express app
const app = express();

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// Use middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define API routes
app.get("/", (req, res) => {
  res.send("Welcome to the Steps API!");
});

// Store steps count mapped with wallet address
app.post("/steps", (req, res) => {
  const { walletAddress, stepsCount } = req.body;

  set(ref(database, "steps/" + walletAddress), {
    stepsCount,
  });

  const stepsCountRef = ref(database, "steps/" + walletAddress);
  onValue(stepsCountRef, (snapshot) => {
    const steps = snapshot.val();
    res.status(200).send(steps);
  });
});

// Get steps count for a wallet address
app.get("/getSteps", (req, res) => {
    const walletAddress = req.query.walletAddress;
   
    const dbRef = ref(database);
    get(child(dbRef, `steps/${walletAddress}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const steps = snapshot.val();
            res.status(200).send(steps);
        } else {
            res.status(500).send("No data available");
        }
    }).catch((error) => {
        res.status(500).send("Error: "+error);
    });
});

// Start the server
app.listen(`$PORT`, () => {
  console.log("Steps API server listening on port 3000");
});
