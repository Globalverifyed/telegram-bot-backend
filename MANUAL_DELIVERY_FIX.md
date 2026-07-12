# Manual Delivery Fix

## What changed

- Orders are never sent to the customer automatically.
- After payment confirmation, an order is saved as `pending` in `data/orders.json`.
- Pending and delivered orders survive bot/PM2/VPS restarts.
- Admin delivery sessions also survive restarts.
- Admin presses `Delivery Done` / `Deliver This Order` and then sends text, photo, or a document.
- Only after that message is successfully sent to the customer is the order marked delivered.
- Delivery handling has priority over Product Manager text handling.

## Admin delivery flow

1. Customer completes payment and uploads screenshot.
2. Admin receives the order with a Delivery button.
3. Admin presses the Delivery button.
4. Bot shows the selected order and asks for product/account details.
5. Admin sends text, photo, or document.
6. Customer receives it and the order becomes delivered.

## Runtime files

`data/orders.json` is created automatically and is ignored by Git. Keep the VPS `data` directory during deployment.
