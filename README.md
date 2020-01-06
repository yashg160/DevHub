# Reactora React-Front

The front end for Reactora, Quora clone created using React.js and Material UI. 

## Working of Home and Dashboard redirection

On opening the home page, the app checks for two conditions, executing different logic on each.

1. It checks if 'code' parameter exists in the url of the page. If it does, that means that the user was redirected from Github authentication and is just logging in. In this case, it save the login Code as a cookie and moves to the Dashboard

2. The app checks if the 'CODE' cookies already exists. If it does, then that means that the user has already logged in and then straightaway redirects to the Dashboard.

The Dashboard screen takes the value of Code from the cookie 'CODE' and makes an API call to the backend on the branch 'Backend', to get the user data from Github. Data is saved into state for later use.

This has the advantage that the user does not need to log in over and over again. On logging in once, when the user opens the homepage in the future again, they are automatically redirected to the Dashboard.

To change this behaviour, a simple 'Remember Me' checkbox can be added to control the saving of the 'CODE' cookie.