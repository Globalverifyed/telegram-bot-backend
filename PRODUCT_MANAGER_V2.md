# Product Manager V2

Admin command: `/admin`

Use **Product Manager** to:
- Manage existing product groups and packages
- Edit existing product name/package/price override
- Add/remove/set exact stock
- Enable or disable an existing package
- Add a new product without editing code
- Edit, stock, disable, or delete admin-added products

Admin-added products appear under:
`Main Menu > Others > More Products`

Persistent data:
- `data/stock.json` — existing stock
- `data/catalog.json` — product overrides and admin-added products

Both files are runtime data and must be preserved on VPS deployments. The deploy script does not delete the data folder.

Google Sheet:
Product add/edit/stock/toggle/delete actions are sent with `type: product` when `GOOGLE_SCRIPT_URL` supports that payload.
