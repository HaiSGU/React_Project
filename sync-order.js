// 🚀 SYNC MOBILE ORDER LÊN SERVER - PASTE VÀO CONSOLE

async function syncOrderToServer(orderId) {
    console.log(`🔍 Syncing order ${orderId}...`);

    // 1. Lấy order từ localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '{"dangGiao":[]}');
    const order = orders.dangGiao.find(o => String(o.id) === String(orderId));

    if (!order) {
        console.error(`❌ Order ${orderId} not found in localStorage`);
        return false;
    }

    console.log('📦 Found order:', order);

    // 2. Tạo order trên server
    try {
        const res = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        if (res.ok) {
            const created = await res.json();
            console.log('✅ Order synced to server:', created);
            alert(`✅ Đã sync đơn #${orderId} lên server!\nBây giờ có thể xác nhận.`);
            return true;
        } else {
            console.error('❌ Server error:', await res.text());
            return false;
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        return false;
    }
}

// 🎯 SYNC ORDER BỊ LỖI
syncOrderToServer(1763815026004);
