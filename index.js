const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the "public" directory (assuming index.html is there)
app.use(express.static('public'));

// Route to handle GET requests at /submit
app.get('/submit', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;
    const message = req.query.issue;

    // Log the submission data in a JSON file
    const submission = { name, email, issue, timestamp: new Date().toISOString() };

    fs.readFile('submissions.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading submission file.');
        }

        const submissions = JSON.parse(data || '[]');
        submissions.push(submission);

        fs.writeFile('submissions.json', JSON.stringify(submissions, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving submission.');
            }

            // After logging the submission, serve the index.html file
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
    });
});

app.get('/submissions.json', (req, res) => {
    fs.readFile('submissions.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading submissions file.');
        }
        res.header("Content-Type", "application/json");
        res.send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
