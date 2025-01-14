# Exeter Application Tracker (React Version)

Provides a dashboard to track applications to internships and placements.


# Use the application live at [edward-blewitt.uk](http://edward-blewitt.uk)


# Self-hosting

1. Download this repo
2. Download PocketBase from [pocketbase.io](https://pocketbase.io/), run it,  and import the schema from pocketbase_schema.json
3. Import the database schema `pb_schema.json` to PocketBase.
3. Change the variable `BASE_URL` in the `./src/contexts/pocketContext.jsx` file to the host that you are running the PocketBase instance from.
4. Build and run the React app