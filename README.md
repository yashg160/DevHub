# Reactora React-Front

The front end for Reactora, Quora clone created using React.js and Material UI. 

## Working of Home and Dashboard redirection

On opening the home page, the app checks for two conditions, executing different logic on each.

1. It checks if 'code' parameter exists in the url of the page. If it does, that means that the user was redirected from Github authentication and is just logging in. In this case, it save the login Code as a cookie and moves to the Dashboard

2. The app checks if the 'CODE' cookies already exists. If it does, then that means that the user has already logged in and then straightaway redirects to the Dashboard.

The Dashboard screen takes the value of Code from the cookie 'CODE' and makes an API call to the backend on the branch 'Backend', to get the user data from Github. Data is saved into state for later use.

This has the advantage that the user does not need to log in over and over again. On logging in once, when the user opens the homepage in the future again, they are automatically redirected to the Dashboard.

To change this behaviour, a simple 'Remember Me' checkbox can be added to control the saving of the 'CODE' cookie.


# Ongoing / Planned Tasks (Backend) : 
1. ✔ Provide basic OAuth facility using 3rd party authenticator (Github)

2. ✔ Handle data storage for Authenticated users (Automatic Basic Profile Creation)

3. ✔ Create basic models(Question, Answer, Comments, Topics)

4. ✔ Create basic homepage for auth_users

5. CRUD operations on all the created models.

# Ongoing / Planned Tasks (Frontend) : 
1. Include other authentication options

2. Create a theme, including colors and typographies

3. Create a page for downloading app

4. Create other pages (about, help etc.)

5. Create a 'Remember Me' checkbox


# Resource 
### 1. /api/genre : 
> GET : Returns all the Genres, along with information about whether a user is subscribed or not.
```
{
    "status" : "success"
    "data" : {
        "Technology" : false,
        "Religion" : true,
        ...

        "Health" : false
    }
}
```

### 2. /api/genres/subscribe : 
> POST : Subscribe to the genres specified in body, which may look like this :
```
## Request body 
{
    "genres" : "Technology,Politics"
}

## Response
{
    "status": "success",
    "message": "Subscribed lance69 to Technology,Politics"
}
```

### 3. /api/home :
> GET : Returns questions with their top upvoted answers (With Genres that are subscribed by the user)
```
{
    "count": 55,
    "next": "http://127.0.0.1:8000/api/home?page=2",
    "previous": null,
    "results": [
        {
            "question": "Is math related to science?",
            ... 
        },
        ...
        ...
    ]
}
         
```

### 4. /api/questions :
> POST : Create a new questions by making a POST request to this endpoint.
```
## Request body 
{
    "question" : "Is math related to science"
}

## Response body
{
    "status" : "success",
    "message" : "Question added successfully"
} 
```

### 5. /api/questions/<question_url>
> GET : Get all the details along with all answers for this question

> PUT : Update an existing question
```
## PUT request example
{
    "question" : "<updated-question-here>,
    "requested" : ["keshav01", "lance69"] // Newly answer requested people
    "followed" : True // Makes the current user follow the question
    "unfollowed" : False // Makes the current user unfollow the question 
}
```
> DELETE : Delete the question, if you're the owner

### 6. /api/answers
> POST : Create a new answer to a question.
```
## Request example
{
    "question" : "is-math-related-to-science", // This is the url of the question
    "answer" : "Well that really is hard to answer if we considering the current state of ...
                ..."
}
```

### 7. /api/answers/<answer_id>
> GET : Get the answer stored on this ID

> PUT : Update the answer stored on this ID (obviously allowed only of you're the author)

> DELETE : Delete the answer stored on this ID

### 8. /api/comments
> POST : Add a new comment to an answer
```
## Request example
{
    "comment" : "Hey this is a comment",
    "answer" : "<answer_id> // Required
    "parent_comment" : "<id_of_parent_comment>" // to be used if reply to another comment
}
```
### 9. /api/comments/<comment_id>
> GET : Get the answer stored on this ID

> PUT : Update the answer stored on this ID (obviously allowed only of you're the author)
```
## PUT request example
{
    "comment" : "<updated-comment-here>,
    "upvote" : True // Makes the current user upvote the question
    "remove_upvote" : True // Makes the current user unfollow the question 
}
```

> DELETE : Delete the answer stored on this ID

### 10. /user/<user_name>
> Get : Get the profile data of specified username
