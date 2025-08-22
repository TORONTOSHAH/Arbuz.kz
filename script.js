document.addEventListener('DOMContentLoaded', function () {

    const gardenData = [
        { row: 1, place: 1, weight: 2.5, status: "ripe", available: true },
        { row: 1, place: 2, weight: 3.0, status: "unripe", available: false },
        { row: 1, place: 3, weight: 4.0, status: "picked", available: true },
        { row: 1, place: 4, weight: 2.0, status: "ripe", available: false },
        { row: 1, place: 5, weight: 3.5, status: "unripe", available: true },
        { row: 2, place: 1, weight: 4.5, status: "picked", available: true },
        { row: 2, place: 2, weight: 2.8, status: "ripe", available: false },
        { row: 2, place: 3, weight: 3.2, status: "unripe", available: true },
        { row: 2, place: 4, weight: 4.0, status: "ripe", available: true },
        { row: 2, place: 5, weight: 2.5, status: "picked", available: false }
    ];

    const watermelonPrices = [
        { minWeight: 0, maxWeight: 2, pricePerKg: 215 },
        { minWeight: 2.1, maxWeight: 4, pricePerKg: 195 },
        { minWeight: 4.1, maxWeight: 10, pricePerKg: 175 }
    ];

    function calculateOrderPrice(watermelonWeight, numberOfWatermelons, shouldCut) {
        let pricePerKilogram = 215;
        for (let index = 0; index < watermelonPrices.length; index++) {
            if (watermelonWeight >= watermelonPrices[index].minWeight &&
                watermelonWeight <= watermelonPrices[index].maxWeight) {
                pricePerKilogram = watermelonPrices[index].pricePerKg;
                break;
            }
        }
        let extraCostForCutting = shouldCut ? 100 : 0;
        let totalWeightInKg = watermelonWeight * numberOfWatermelons;
        return Math.round(totalWeightInKg * pricePerKilogram + extraCostForCutting);
    }

    
    const gardenGrid = document.getElementById('garden-grid');
    const rows = [...new Set(gardenData.map(w => w.row))];
    const maxPlaces = Math.max(...gardenData.map(w => w.place));

    function renderGardenGrid() {
        gardenGrid.innerHTML = '';
        for (let row of rows) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'garden-row';
            for (let place = 1; place <= maxPlaces; place++) {
                const spot = gardenData.find(w => w.row === row && w.place === place);
                const spotDiv = document.createElement('div');
                spotDiv.className = `garden-spot ${spot && !spot.available ? 'unavailable' : ''}`;
                if (spot && spot.available) {
                    spotDiv.dataset.row = row;
                    spotDiv.dataset.place = place;
                    spotDiv.textContent = `${row}-${place}`;
                    spotDiv.addEventListener('click', function() {
                        document.getElementById('row').value = this.dataset.row;
                        document.getElementById('place').value = this.dataset.place;
                        document.getElementById('weight').value = spot.weight;
                        document.getElementById('status').value = spot.status;
                    });
                } else {
                    spotDiv.textContent = 'X';
                }
                rowDiv.appendChild(spotDiv);
            }
            gardenGrid.appendChild(rowDiv);
        }
    }

    renderGardenGrid();

    const orderForm = document.querySelector('.order-form');
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
       
        document.getElementById('quantity-error').classList.remove('active');
        document.getElementById('address-error').classList.remove('active');
        document.getElementById('phone-error').classList.remove('active');
        document.getElementById('delivery-date-error').classList.remove('active');
        document.getElementById('quantity-error').textContent = '';
        document.getElementById('address-error').textContent = '';
        document.getElementById('phone-error').textContent = '';
        document.getElementById('delivery-date-error').textContent = '';

        const errors = [];

        
        const allFields = {
            rowNumber: document.getElementById('row').value.trim(),
            placeNumber: document.getElementById('place').value.trim(),
            watermelonStatus: document.getElementById('status').value.trim(),
            watermelonWeight: parseFloat(document.getElementById('weight').value) || 0,
            numberOfWatermelons: parseInt(document.getElementById('quantity').value) || 0,
            deliveryAddress: document.getElementById('address').value.trim(),
            phoneNumber: document.getElementById('phone').value.trim(),
            deliveryDateTime: new Date(document.getElementById('delivery-date').value)
        };

     
        if (!allFields.rowNumber) errors.push('Ряд на грядке не заполнен');
        if (!allFields.placeNumber) errors.push('Место на грядке не заполнено');
        if (!allFields.watermelonStatus) errors.push('Статус не заполнен');
        if (!allFields.watermelonWeight || isNaN(allFields.watermelonWeight)) errors.push('Вес не заполнен или некорректно');
        if (!allFields.numberOfWatermelons || isNaN(allFields.numberOfWatermelons)) {
            errors.push('Количество не заполнено или некорректно');
            document.getElementById('quantity-error').textContent = 'Количество не заполнено или некорректно';
            document.getElementById('quantity-error').classList.add('active');
        }
        if (!allFields.deliveryAddress) {
            errors.push('Адрес доставки не заполнен');
            document.getElementById('address-error').textContent = 'Адрес доставки не заполнен';
            document.getElementById('address-error').classList.add('active');
        }
        if (!allFields.phoneNumber) {
            errors.push('Телефон не заполнен');
            document.getElementById('phone-error').textContent = 'Телефон не заполнен';
            document.getElementById('phone-error').classList.add('active');
        }
        if (isNaN(allFields.deliveryDateTime.getTime())) {
            errors.push('Дата и время доставки не заполнены');
            document.getElementById('delivery-date-error').textContent = 'Дата и время доставки не заполнены';
            document.getElementById('delivery-date-error').classList.add('active');
        }

        if (allFields.phoneNumber && allFields.phoneNumber.length !== 10) {
            errors.push('Телефон должен содержать ровно 10 цифр');
            document.getElementById('phone-error').textContent = 'Телефон должен содержать ровно 10 цифр';
            document.getElementById('phone-error').classList.add('active');
        } else if (allFields.phoneNumber) {
            for (let i = 0; i < allFields.phoneNumber.length; i++) {
                if (allFields.phoneNumber[i] < '0' || allFields.phoneNumber[i] > '9') {
                    errors.push('Телефон должен содержать только цифры');
                    document.getElementById('phone-error').textContent = 'Телефон должен содержать только цифры';
                    document.getElementById('phone-error').classList.add('active');
                    break;
                }
            }
        }

        const today = new Date();
        const maxDeliveryDate = new Date(today);
        maxDeliveryDate.setDate(today.getDate() + 9);
        if (allFields.deliveryDateTime && (allFields.deliveryDateTime < today || allFields.deliveryDateTime > maxDeliveryDate)) {
            errors.push('Дата доставки должна быть в пределах 9 дней от сегодня');
            document.getElementById('delivery-date-error').textContent = 'Дата доставки должна быть в пределах 9 дней от сегодня';
            document.getElementById('delivery-date-error').classList.add('active');
        }

        if (allFields.numberOfWatermelons < 1 || allFields.numberOfWatermelons > 3) {
            errors.push('Количество арбузов должно быть от 1 до 3');
            document.getElementById('quantity-error').textContent = 'Количество арбузов должно быть от 1 до 3';
            document.getElementById('quantity-error').classList.add('active');
        }

        
        if (errors.length > 0) {
            return;
        }

        
        const totalOrderPrice = calculateOrderPrice(allFields.watermelonWeight, allFields.numberOfWatermelons, document.getElementById('cut').checked);
        document.getElementById('total-price').textContent = totalOrderPrice;

        const newOrder = {
            row: allFields.rowNumber,
            place: allFields.placeNumber,
            status: allFields.watermelonStatus,
            weight: allFields.watermelonWeight,
            quantity: allFields.numberOfWatermelons,
            address: allFields.deliveryAddress,
            phone: allFields.phoneNumber,
            deliveryDate: allFields.deliveryDateTime.toISOString(),
            isCut: document.getElementById('cut').checked,
            price: totalOrderPrice,
            orderTime: new Date().toISOString()
        };

        
        let allOrders = JSON.parse(localStorage.getItem('arbuzOrders') || '[]');
        if (allOrders.length >= 10) {
            document.getElementById('error-message').textContent = 'Максимум 10 заказов';
            document.getElementById('error-message').style.display = 'block';
            return;
        }

        allOrders.push(newOrder);
        localStorage.setItem('arbuzOrders', JSON.stringify(allOrders));

        
        const selectedSpot = gardenData.find(w => w.row == allFields.rowNumber && w.place == allFields.placeNumber);
        if (selectedSpot) selectedSpot.available = false;
        renderGardenGrid();

        alert('Заказ сохранён! Цена: ' + totalOrderPrice + ' тенге');
        this.reset();
      
        document.getElementById('quantity-error').classList.remove('active');
        document.getElementById('address-error').classList.remove('active');
        document.getElementById('phone-error').classList.remove('active');
        document.getElementById('delivery-date-error').classList.remove('active');
    });

  
    const dateInput = document.getElementById('delivery-date');
    if (dateInput) {
        const todayDate = new Date();
        const maxDate = new Date(todayDate);
        maxDate.setDate(todayDate.getDate() + 9);
        dateInput.min = todayDate.toISOString().slice(0, 16);
        dateInput.max = maxDate.toISOString().slice(0, 16);
    }

    function showOrderHistory() {
        const orderList = document.getElementById('orders-list');
        orderList.innerHTML = '';
        let orders = JSON.parse(localStorage.getItem('arbuzOrders') || '[]');
        for (let i = 0; i < orders.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = `Заказ ${i + 1}: ${orders[i].weight} кг, Цена: ${orders[i].price} тенге`;
            orderList.appendChild(listItem);
        }
    }

    showOrderHistory();
    document.getElementById('refresh-orders').addEventListener('click', showOrderHistory);

    document.getElementById('delete-order').addEventListener('click', function() {
        let orders = JSON.parse(localStorage.getItem('arbuzOrders') || '[]');
        if (orders.length > 0) {
            orders.pop();
            localStorage.setItem('arbuzOrders', JSON.stringify(orders));
            showOrderHistory();
        } else {
            alert('Нет заказов для удаления');
        }
    });
});