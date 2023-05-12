import { MongoClient } from 'mongodb';

const url = "mongodb+srv://ritchiepark6:fAtSRU5cWmMCgd7b@pet.fypiyjz.mongodb.net/?retryWrites=true&w=majority";;


// Create a connection pool
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to connect to the database
async function connect() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Select the database

    // Return the database connection
    return client
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
}

// Export the connect function
export default connect;