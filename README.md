# Oceanic Slapshot League Website
[![Netlify Status](https://api.netlify.com/api/v1/badges/e7966536-4763-42f0-ac5d-2f765cb90390/deploy-status)](https://app.netlify.com/sites/slapshot-oce/deploys)

## Run Dev
There are a few steps that need to be set up being you can run the website on your local machine or docker (not available as of yet). To run the project it is assumed you have npm installed and are familiar with some basic commands.

1. Clone the Repository and run the following to install and dependencies.
    ```bash
    npm install
    ```

2. In the root creat a file called `.env.development` and add the following variables.
    ```env
    DISCORD_CLIENT_ID=""
    DISCORD_CLIENT_SECRET=""
    DISCORD_REDIRECT_URI="http://localhost:4321/auth/discord/callback"
    PUBLIC_DISCORD_AUTH_URI= ""
    ```
    *Note: To get the discord client ID, secret and auth uri you will need register a new application with discord, or you could use a current one you might already have.*

3. After that you can run the following command, and bish bosh you should be able to view the website on [localhost:4321](http://www.localhost:4321)
    ```ENV
    npm run dev
    ```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


## Development Dependencies

Various request calls are made to the backend API currently in development. A local instance of the SRLM docker image will need to be running.  
[Slapshot: Rebound League Manager](https://github.com/Haelnorr/srlm/tree/dev-0.8)  
You will need to pull the latest version from the dev branch to ensure all functionality works. (Current version required - 0.8.3)
Add the following environment variables:
<pre>SRLM_API_URI="http://localhost:8000/api"
SRLM_API_APP_KEY="app-key (ask Haelnorr for key)"</pre>