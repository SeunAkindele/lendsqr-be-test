import app from './app';

// Root route to respond to GET requests at the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the MVP wallet service');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
