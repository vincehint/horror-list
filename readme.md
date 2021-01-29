# Horror List

~Horror list is a database site that allows you to search horror films, and add them to your own personal Horror List, for favorites and to watch. 

## Why?

~I've been a huge horror geek my entire life, but finding horror flicks to watch and keeping 
a running list of them has always been done with pen and paper, which I would ultimately lose. To solve this problem I decided I needed a saveable way to keep track of the movies that I love and wanted to watch.

## MVP

~The minimum vialable product for this was to connect to a database, in this case TMDB, and
be able to pull movies and their information and add them to a user database.

## How?

~Horror List uses HTML, CSS, Javascript, Node, Express, and PostgreSQL. To start the database TMDB was connected using a movie table that stored all the data for the movies. Then a user database was made storing a username, userid, and log in info. Then, a join table was created to store movies that the user had added to their horror list.
Horror List also uses local authorization (passport-local) to authenticate a user and keep data safe.

## Stretch goals!

~I completed the stretch goal of styling on my app. Future stretch goals include a rating system for a movie, and a secondary database from tastekid that would suggest movies based on your horror list.

## How to use Horror List

~ To use horror list you need to create an account. Once you've created an account it will take you to the home page. From there you can search a horror film and a results page will populate. To add a film to your list, click on the film, and it will redirect to the show page for that movie. Click "add to horror list" and the movie will be added to your personal horror list. To delete a movie from the horror list, click on the Horror List link in the nav bar and your list will populate. Click delete on the movie that you want to delete.

## So you want to install and run this yourself?
    ~ Get your API Key from https://developers.themoviedb.org/3/getting-started/introduction
    ~Fork and clone this repository using the HTTPS link inside of your terminal.
    ~Install the dependencies of this application with npm install.
    ~Create a local database
    ~Update your config.json file
    ~sequelize db:migrate
    ~Create a .env file for a few things such as the URL, the Session secret, and the API Key.
    ~Run with nodemon on your local 3000

