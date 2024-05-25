const functions = require('firebase-functions');
const express = require('express');
const ActiveDirectory = require('activedirectory2');
const ExcelJS = require('exceljs');

// กำหนดค่า Active Directory
const adConfig = {
    url: 'ldap://dc01.kcscompany.com',
    baseDN: 'dc=kcscompany,dc=com',
    username: 'natdanai.k@kcscompany.com',
    password: 'K_k28012539'
};
const ad = new ActiveDirectory(adConfig);

const app = express();

app.get('/users', (req, res) => {
    ad.findUsers((err, users) => {
        if (err) {
            console.error('Error retrieving users:', err);
            res.status(500).send('Error retrieving users');
            return;
        }
        res.json(users);
    });
});

app.get('/export-excel', (req, res) => {
    ad.findUsers((err, users) => {
        if (err) {
            console.error('Error retrieving users:', err);
            res.status(500).send('Error retrieving users');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');
        
        worksheet.columns = [
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Email', key: 'email', width: 40 }
        ];

        users.forEach(user => {
            worksheet.addRow({
                username: user.sAMAccountName,
                email: user.mail
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        workbook.xlsx.write(res)
            .then(() => {
                res.end();
            })
            .catch(err => {
                console.error('Error exporting to Excel:', err);
                res.status(500).send('Error exporting to Excel');
            });
    });
});

exports.app = functions.https.onRequest(app);
