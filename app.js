document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.getElementById('orderForm');
    const ordersTableBody = document.getElementById('ordersTable').querySelector('tbody');
    const downloadCSVButton = document.getElementById('downloadCSVButton');
    const downloadPDFButton = document.getElementById('downloadPDFButton');
    const addOrderButton = document.getElementById('addOrderButton');
    const updateOrderButton = document.getElementById('updateOrderButton');

    let orders = loadOrders();
    let editOrderIndex = null;

    // Load orders from local storage
    function loadOrders() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    }

    // Save orders to local storage
    function saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Display orders in the table
    function displayOrders() {
        ordersTableBody.innerHTML = '';
        orders.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.clientName}</td>
                <td>${order.milkType}</td>
                <td>${order.quantity}</td>
                <td>${order.price}</td>
                <td>
                    <button onclick="editOrder(${index})">Edit</button>
                    <button onclick="removeOrder(${index})">Remove</button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    }

    // Add a new order
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const newOrder = {
            clientName: document.getElementById('clientName').value,
            milkType: document.getElementById('milkType').value,
            quantity: parseFloat(document.getElementById('quantity').value), // Parse to ensure it's a decimal
            price: document.getElementById('price').value,
        };

        if (editOrderIndex !== null) {
            // Update existing order
            orders[editOrderIndex] = newOrder;
            editOrderIndex = null;
            addOrderButton.style.display = 'block';
            updateOrderButton.style.display = 'none';
        } else {
            // Add new order
            orders.push(newOrder);
        }

        saveOrders(orders);
        displayOrders();
        orderForm.reset();
    });

    // Edit an existing order
    window.editOrder = function (index) {
        const order = orders[index];
        document.getElementById('clientName').value = order.clientName;
        document.getElementById('milkType').value = order.milkType;
        document.getElementById('quantity').value = order.quantity;
        document.getElementById('price').value = order.price;

        editOrderIndex = index;
        addOrderButton.style.display = 'none';
        updateOrderButton.style.display = 'block';
    };

    // Remove an order
    window.removeOrder = function (index) {
        orders.splice(index, 1);
        saveOrders(orders);
        displayOrders();
    };

    // Download orders as PDF
    downloadPDFButton.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title to the PDF
        doc.setFontSize(18);
        doc.text('Milk Vendor Orders', 14, 20);

        // Create table header
        const headers = [['Client Name', 'Milk Type', 'Quantity', 'Price']];
        const data = orders.map(order => [
            order.clientName,
            order.milkType,
            order.quantity,
            order.price
        ]);

        // Add table to PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30, // Start table after title
            margin: { top: 10, left: 10, right: 10 },
        });

        // Save the PDF file
        doc.save('orders.pdf');
    });

    // Initial display of orders
    displayOrders();
});
