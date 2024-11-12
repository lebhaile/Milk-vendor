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

        orders.push(newOrder);
        saveOrders(orders);
        displayOrders();
        orderForm.reset();
    });

    displayOrders();
});
