# Cross It Off the List 

## What is it?

This is a to-do and shopping-list app with full functionality but minimal bells and whistles, for people who just want a plain list app.  I built in order to use it myself since I was frustrated with the shopping-list app I was using - it kept trying to automatically put my list items into categories, it had trouble synching automatically, and it offered a cluttered assortment of unneeded features.  My goal was to make something uncomplicated and easy to use.

The app is built in React with a web interface, using a REST API built with Django and Django REST Framework.  

## Features and implementation

By default there are three levels of lists - broad categories (e.g. shopping, to-do), groups of specific lists (e.g. groceries, garden supplies), and individual lists of items.  

This structure can be "flattened" to two levels for users who just want to see an uncategorized display of all their lists.

Items within each list can be reordered using drag and drop.  I used a package called dnd-kit for this.

Most internal state is handled by context and reducer hooks, but without Redux.  (The data didn't seem complex enough to warrant the use of Redux.)  

## Authentication and authorization

User authentication and authorization are handled by the Django authentication system, and autentication tokens are kept in local storage so that users don't need to log in each time.  (This seems safe enough for a list app, but perhaps a future enhancement would be to give users a choice of disabling local storage from within the app settings if they wish.)

For new user registration, I've implemented a feature to check whether a requested username is available, in real time as the username is being typed, rather than waiting to submit all the new-user data.  To do this I created a username-checking endpoint in the Django API that accepts a username and returns true or false depending on whether it already exists, and debounced the keyboard input. 

[More technical details here](./details.md).

## Deployment (demo mode)

This repository is the code for a web-based front end, built in React.

Since I started out the React side of the project using internal sample data, I've kept it and set up a "demo" option, in case the server is offline for maintenance.  Adjust variables in the .env file accordingly.

- Copy file .env.template to file .env

- ```yarn```

- ```yarn start```


