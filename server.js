const express = require('express');
const ActiveDirectory = require('activedirectory2');
const cors = require('cors');
const path = require('path');

const config = {
    url: 'ldap://dc01.kcscompany.com',
    baseDN: 'dc=kcscompany,dc=com',
    username: 'Administrator@kcscompany.com',
    password: 'P@ssw0rd'
};


const ad = new ActiveDirectory(config);
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ทดสอบการเชื่อมต่อ
ad.authenticate(config.username, config.password, function(err, auth) {
    if (err) {
        console.log('Authentication failed:', err);
    } else {
        console.log('Authenticated:', auth);
    }
});

app.get('/api/users', (req, res) => {
    const query = 'objectClass=user';
    ad.find(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: err });
            return;
        }

        if (!results || results.users.length === 0) {
            console.log('No users found');
            res.status(404).json({ message: 'No users found' });
            return;
        }

        console.log('Users found:', results.users.length);
        res.json(results.users);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));