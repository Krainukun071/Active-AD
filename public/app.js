document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('user-list');

    function fetchAndDisplayUsers(query = '') {
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                const users = response.data;
                const filteredUsers = users.filter(user =>
                    user.cn.toLowerCase().includes(query.toLowerCase())
                );
                displayUsers(filteredUsers);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }

    function displayUsers(users) {
        userList.innerHTML = ''; // ล้างเนื้อหาทั้งหมดก่อนแสดงผลใหม่
        const userTable = document.createElement('table');
        userTable.className = 'table table-striped';

        // สร้างหัวตาราง
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Name', 'Email', 'User Logon Name', 'Password Last Set'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        userTable.appendChild(thead);

        // สร้างส่วนของข้อมูลในตาราง
        const tbody = document.createElement('tbody');
        users.forEach(user => {
            const userRow = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = user.cn;
            userRow.appendChild(nameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = user.mail || '-';
            userRow.appendChild(emailCell);

            const logonNameCell = document.createElement('td');
            logonNameCell.textContent = user.sAMAccountName || 'N/A';
            userRow.appendChild(logonNameCell);

            const passwordLastSetCell = document.createElement('td');
            const passwordLastSet = user.passwordLastSet ? new Date(user.passwordLastSet).toLocaleString() : 'N/A';
            passwordLastSetCell.textContent = passwordLastSet;
            userRow.appendChild(passwordLastSetCell);

            tbody.appendChild(userRow);
        });

        userTable.appendChild(tbody);
        userList.appendChild(userTable);
    }

    // Event listener สำหรับการค้นหา
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('search-input').value;
        fetchAndDisplayUsers(query);
    });

    // Fetch และแสดงผู้ใช้ทั้งหมดเมื่อโหลดหน้าเว็บ
    fetchAndDisplayUsers();
});
