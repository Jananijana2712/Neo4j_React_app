const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const path = require('path');


const app = express();
const port = 3000;

app.use(cors());

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('signup', 'janani2712'));

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const session = driver.session();

  try {
    const result = await session.run(
      'CREATE (u:User {username: $username, password: $password}) RETURN u',
      { username, password }
    );

    console.log(result.records[0].get('u'));
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await session.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// ... (previous code)

// Serve React app for all other routes
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
