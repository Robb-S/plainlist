# Cross It Off the List 

## What is it?

This is a to-do and shopping-list app with full functionality but minimal bells and whistles, for people who just want a plain list app.  I built in order to use it myself since I was frustrated with the shopping-list app I was using, which kept adding useless features while getting more and more complicated.  My goal was to make something uncomplicated and easy to use.

The app is built in React with a web interface, using a REST API.  

## Features and implementation

By default there are three levels of data - broad categories (e.g. shopping, to-do), specific lists (e.g. groceries, garden supplies), and individual items.  

This structure can be flattened to two levels for users who just want to see an uncategorized display of all their lists.  The app will keep track of the last list that was edited and automatically go there on startup, but this feature can be turned off.

Items within each list can be reordered using drag and drop, either with a mouse or a finger on a touch device.  I used a package called dnd-kit to implement this.

Most internal state is handled by context and reducer hooks, but without Redux.  (The data didn't seem complex enough to warrant the use of Redux.)  

## Authentication and authorization

User authentication and authorization are handled by the back-end authentication system, and authentication tokens are kept in local storage so that users don't need to log in each time.  (This seems safe enough for a list app, but perhaps a future enhancement would be to give users a choice of disabling local storage from within the app settings if they wish.)

For new user registration, I've implemented a feature to check whether a requested username is available, in real time as the username is being typed, rather than waiting to submit all the new-user data.  To do this I created a username-checking endpoint in the API that accepts a potential username and returns true or false depending on whether it already exists.  I've debounced the keyboard input so it doesn't jump around too much.

[More technical details here](./details.md).

## Deployment

This repository is the code for a web-based front end, built in React.  Please ask me for the URL of the test site if you want to try it out.

If you want to build it yourself, follow these steps: 

- Copy file .env.template to file .env

- ```yarn```

- ```yarn start```

[More technical details here](./details.md).

