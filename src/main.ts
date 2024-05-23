// Node imports
import path from "path";
// Library imports
import express, { Express, NextFunction, Request, Response } from "express";
// App imports
import {GameMaster} from "./gameMaster";
import {User} from "./types";

const app: Express = express();
const port = 80;

let game = new GameMaster;
const amountOfPlayers = 4;

const registeredUsers: User[] = [];
let registeredUsersSaved: User[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Handle registration page
app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/registration.html'));
});

// Handle login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Handle registration POST request
app.post('/register', (req, res) => {
  const { username, password, spot } = req.body;

  if (!username || !password || !spot) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (spot > 4 || spot < 0) {
    return res.status(400).json({ error: 'Not a valid spot' });
  }
  // Check for duplicate username 
  if (registeredUsers.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Check for duplicate spot
  if (registeredUsers.some(user => user.spot === spot)) {
    return res.status(400).json({ error: 'Spot is already taken' });
  }

  // Registration logic
  const newUser: User = {...req.body};
  registeredUsers.push(newUser);

  console.log(`Registration: Username - ${username}, Spot - ${spot}, Password - ${password}`);

  // Respond with a success message
  res.json({ message: 'Registration successful' });
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Perform login logic (validate credentials, check against database, etc.)
  // For simplicity, let's just check if the user is registered
  const user = registeredUsers.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  console.log(`Login: Username - ${username}, Password - ${password}`);

  // Respond with a success message
  res.json({ message: 'Login successful' });
});

// Handle JSON in request bodies.
app.use(express.json());

// Serve the client
app.use("/", express.static(path.join(__dirname, "../../dist/client")))

// Enable CORS so that we can call the API from anywhere
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});

// start spillet stokk og del ut kort
app.post("/start", async (req, res) => {

  if (registeredUsers.length != amountOfPlayers) {
    return res.status(400).json({ error: `Not enough players to start game. you need ${amountOfPlayers - registeredUsers.length} more.`});
  }
    registeredUsersSaved = registeredUsers;
    game.start(registeredUsersSaved);
    console.log("Cards are dealt.");
    res.send("Cards are dealt.");
});

// Få hånd til spiller
// eksempel input curl -X GET localhost/deck/Nora
app.get("/deck/:name", async (req, res) => {
    res.send(game.showHand(req.params.name));
});

//start bids
app.post("/startbidding", async (req, res) => {
    console.log("Bidding round has started")
    res.send(game.startBidding());
});

//bid f.eks curl -X GET localhost/bid/Nora/5
app.post("/bid/:name/:number", async (req, res) => {
  try {
    const result = await game.bid(req.params.number, req.params.name);
    res.send(result);
    console.log(result)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/startplaying", async (req, res) => {
  res.send(game.startPlaying());
});

app.post("/play/:name/:suit/:rank", async (req, res) => {
  res.send(game.playCard(req.params.name, req.params.suit, req.params.rank));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});