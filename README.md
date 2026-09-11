# liberated-land

Public curiosity MapLibre site showing **airport access flips & residual waterfront buildability**.

**Not a brokerage product. Not a PM-tracked business.** This is exploratory research for Carl Lippert.

🗺️ [View live site](#) (add your domain after deployment)

## What This Shows

### Airport EV/AV Candidates
Places where autonomous vehicle curb access exists or is emerging near major airports. 

**Important:** AV service area ≠ metro geofence. Many airports remain outside permitted zones. Each point includes sourced WHY and reference URLs.

### Waterfront Residual Candidates
Ferry-served or marine-access locations that survive NFHL flood map and CBRS filters.

**Thesis 2 honesty:** Flood zones, CBRS designations, and insurance costs dominate waterfront buildability. Robots don't erase coastal hazards. Risk ratings (L/M/R) reflect NFHL/CBRS/insurance reality.

## Local Development

This is a static site—no build step required for basic development:

```bash
# Option 1: Use a simple HTTP server
npx serve .

# Option 2: Python 3
python3 -m http.server 8000

# Option 3: Python 2
python -m SimpleHTTPServer 8000

# Then open http://localhost:8000 (or the port shown)
```

For a more robust development experience with hot reload:

```bash
# Using Vite
npm install -g vite
vite
```

## Stack

- **MapLibre GL JS** v4.5.2 - Open-source map library
- **OpenFreeMap** - Free basemap tiles (no API key required)
- **Static HTML/CSS/JS** - No framework, no build step, deployable anywhere
- **GeoJSON** - Point data with sourced research

## Deployment

Deploys to Hetzner via GitHub Actions using rsync over SSH (same pattern as [carllippert/mhs-directory](https://github.com/carllippert/mhs-directory)).

### Required Secrets

Set these in your GitHub repository settings (Settings → Secrets and variables → Actions):

- `SSH_HOST` - Your Hetzner server hostname or IP
- `SSH_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key for authentication
- `SSH_PORT` - (Optional) SSH port, defaults to 22

### Deployment Workflow

On push to `main` branch:

1. **Prepare** - Copies static files to `dist/` directory
2. **Deploy** - Rsyncs to `/srv/apps/liberated-land/releases/{GITHUB_SHA}/`
3. **Activate** - Updates symlink `/srv/apps/liberated-land/current` → latest release
4. **Cleanup** - Keeps only 5 most recent releases

### Nginx Configuration

Point your nginx vhost root to `/srv/apps/liberated-land/current`.

Example configuration provided in [`deploy/nginx.liberated-land.conf.example`](deploy/nginx.liberated-land.conf.example).

```bash
# Quick setup
sudo cp deploy/nginx.liberated-land.conf.example /etc/nginx/sites-available/liberated-land.conf
# Edit domain name in the config
sudo nano /etc/nginx/sites-available/liberated-land.conf
# Enable and reload
sudo ln -s /etc/nginx/sites-available/liberated-land.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

For SSL with Let's Encrypt:

```bash
sudo certbot --nginx -d your-domain.com
```

## Data Sources

All map points include:
- **name** - Location identifier
- **thesis** - Either `airport` or `waterfront`
- **why** - Sourced explanation (no invented metrics)
- **urls** - Reference links where available
- **risk** - (Waterfront only) L/M/R rating based on NFHL/CBRS/insurance

### Airport Candidates

Key sources:
- [Waymo Service Areas](https://support.google.com/waymo/answer/14298153)
- [Zoox Las Vegas Launch](https://techcrunch.com/2026/09/03/amazons-zoox-expands-its-robotaxi-service-to-las-vegas-airport/)
- [GetRideWise Airport Access Guide](https://getridewise.com/blog/robotaxi-airport-access-us-airports)

### Waterfront Candidates

Post-NFHL/CBRS filter:
- Marine access communities (Maine islands, etc.)
- Ferry-served islands (Nantucket, Martha's Vineyard, Catalina, San Juan Islands)
- Alaska Marine Highway towns
- Great Lakes islands (Beaver Island)

**Critical filters applied:**
- NFHL (National Flood Hazard Layer) - Flood zones
- CBRS (Coastal Barrier Resources System) - Federal flood insurance restrictions
- Insurance availability and cost

## Product Rules

Hard constraints baked into this site:

1. **Never** label places "liberated land" in the map UI
2. Tooltips/popups show **sourced WHY + URLs only** - no invented metrics, no buy recommendations
3. **AV curb ≠ metro geofence** - explicitly stated in about copy
4. **Waterfront honesty** - flood/CBRS/insurance dominate; robots don't erase that
5. Show residual candidates with L/M/R honesty
6. Mark CBRS as anti-candidate where relevant

## File Structure

```
.
├── index.html              # Main page
├── style.css               # Styles
├── app.js                  # MapLibre initialization & interaction
├── data/
│   ├── airports.geojson    # Airport candidate points
│   └── waterfront.geojson  # Waterfront candidate points
├── deploy/
│   └── nginx.liberated-land.conf.example
├── .github/
│   └── workflows/
│       └── deploy.yml      # Hetzner deployment workflow
├── LICENSE
└── README.md
```

## No API Keys

This site uses OpenFreeMap which requires no API key. If you want to use a different basemap provider:

- **Protomaps** - Free tier available, self-hostable
- **Maptiler** - Free tier with API key
- **Mapbox** - Requires API key (not used here)

## Contributing

This is a personal research project for Carl Lippert. If you have sourced corrections or additions:

1. Ensure you have credible sources (URLs)
2. No invented metrics or recommendations
3. Follow the thesis honesty rules (especially for waterfront/CBRS)

## License

MIT License - See [LICENSE](LICENSE) file.

## Disclaimer

This is exploratory research, not investment advice. Coastal flood zones, CBRS designations, and insurance availability dominate waterfront buildability decisions. Autonomous vehicle service areas are highly restricted and subject to change. Always verify current permits, geofences, and regulatory status.
