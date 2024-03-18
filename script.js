document.addEventListener('DOMContentLoaded', function() {
    const moneyForm = document.getElementById('moneyForm');
    const moneyTableBody = document.getElementById('moneyTableBody');
    const totalRemaining = document.getElementById('totalRemaining');

    const aboutLink = document.getElementById('aboutLink');
    const aboutTab = document.getElementById('aboutTab');
    const closeBtn = document.getElementById('closeBtn');

    aboutLink.addEventListener('click', function(event) {
        event.preventDefault();
        aboutTab.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        aboutTab.style.display = 'none';
    });

    moneyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const receiverName = document.getElementById('receiverName').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const amountReturned = parseFloat(document.getElementById('amountReturned').value);

        const entry = {
            receiverName: receiverName,
            amountGiven: amount,
            amountReturnedByUser: amountReturned
        };

        saveEntry(entry);
        displayEntries();

        moneyForm.reset();
    });

    function saveEntry(entry) {
        let entries = JSON.parse(localStorage.getItem('moneyEntries')) || [];
        entries.push(entry);
        localStorage.setItem('moneyEntries', JSON.stringify(entries));
    }

    function displayEntries() {
        moneyTableBody.innerHTML = '';
        const entries = JSON.parse(localStorage.getItem('moneyEntries')) || [];
        const receiverData = {};
        let totalGiven = 0;
        let totalReturned = 0;

        // Calculate total amount given and returned by each receiver
        entries.forEach(entry => {
            if (!receiverData[entry.receiverName]) {
                receiverData[entry.receiverName] = {
                    totalGiven: 0,
                    totalReturned: 0
                };
            }
            receiverData[entry.receiverName].totalGiven += entry.amountGiven;
            receiverData[entry.receiverName].totalReturned += entry.amountReturnedByUser;
            totalGiven += entry.amountGiven;
            totalReturned += entry.amountReturnedByUser;
        });

        // Display entries and remaining amount for each receiver
        entries.forEach((entry, index) => {
            const remainingAmount = receiverData[entry.receiverName].totalGiven - receiverData[entry.receiverName].totalReturned;
            const row = moneyTableBody.insertRow();
            row.innerHTML = `
                <td>${entry.receiverName}</td>
                <td>₹${entry.amountGiven}</td>
                <td>₹${receiverData[entry.receiverName].totalReturned}</td>
                <td>₹${entry.amountReturnedByUser}</td>
                <td>₹${remainingAmount}</td>
                <td class="delete-row" onclick="deleteEntry(${index})">Delete</td>
            `;
        });

        // Update total remaining amount in the footer
        totalRemaining.textContent = `₹${totalGiven - totalReturned}`;
    }

    window.deleteEntry = function(index) {
        let entries = JSON.parse(localStorage.getItem('moneyEntries')) || [];
        entries.splice(index, 1);
        localStorage.setItem('moneyEntries', JSON.stringify(entries));
        displayEntries();
    };

    displayEntries();
});
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');

    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });
});

function deleteAllEntries() {
    if (confirm("Are you sure you want to delete all table data?")) {
        localStorage.removeItem('moneyEntries');
        displayEntries();
    }
}

