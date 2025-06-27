![Application tracker dashboard](./frontend/public/Long%20Logo.png)


The ultimate dashboard for tracking applications to jobs, internships and placements. Designed for studnets who are applying to multiple schemes, stay on top of your applications, store documents and never miss a deadline.

<br>

### Use the application live at [exeter-tracker.com](http://#)

<br>

![Application tracker dashboard](./frontend/public/dashboard.png)



## Features

- **Application Tracking**: Keep a record of all applications, including company details, application status, and key dates.
- **Deadline Reminders**: Never miss a deadline with our reminders about upcoming application submissions.
- **Document Management**: Store and organize different versions of CV and cover letters.
- **Analytics**: Gain insights into your application trends and manage your overall performance.

## Database Schema
![Pocketbase database schema](./frontend/public/pb_diagram.png)

  

## Running in Development

1. Start ngrok: `ngrok start --all --config ngrok.yml`
2. Edit frontend `frontend/.env` file `REACT_APP_BACKEND_URL` with ngrok url to backend
3. Start the frontend with `npm start`


## Self-hosting Instructions

1. Download this repo
2. Download PocketBase from [pocketbase.io](https://pocketbase.io/), run it,  and import the schema from pocketbase_schema.json
3. Import the database schema `pb_schema.json` to PocketBase.
3. Change the variable `BASE_URL` in the `./src/contexts/pocketContext.jsx` file to the host that you are running the PocketBase instance from.
4. Build and run the React app
