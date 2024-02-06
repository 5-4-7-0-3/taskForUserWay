TASK 1

    How to run:

    1 - copy .env.sample to .env

    2 - Start docker.
        docker-compose -f docker-compose.dev.yml up

    3 - Start the migration in the container.
        npm run migration:run

    4 - Available routes:

        http://localhost:5000/auth/register
        body{ username, email, password} 

        http://localhost:5000/auth/login
        body{ email, password }

        http://localhost:5000/users
        body{ username }

    5 - Tests are run in a docker container
        npm run test 
        npm run test:e2e

TASK 2

    So, if we're talking about a cool registration and login service that needs to handle thousands of requests per second, 
    here's the plan. Let's break it down into parts for easy scalability. For data storage, we'll go with databases like 
    Cassandra or DynamoDB - they handle a high volume of records well. A bit of caching and CDN for speed improvement. 
    And, of course, some load balancing and containers with Kubernetes for slick automated scaling. And don't forget 
    about JWT - it's a time-saver for authentication.

TASK 3

    Implementing social login involves integrating with OAuth-based authentication systems provided by social networking 
    services like Facebook, Twitter, or Google. Here's a simplified sequence of steps:

    User Initiation:

    User clicks on the social login option (e.g., "Sign in with Google").
    Your service redirects the user to the respective social network's authorization endpoint.
    Authorization Request:

    The user is prompted to log in to their social account (if not already logged in) and grant permission for your 
    service to access their information.The social network generates an authorization code.
    Authorization Grant:

    Your service exchanges the authorization code for an access token by making a secure server-to-server request to the 
    social network's token endpoint.
    The access token is used to retrieve user information.
    User Information Retrieval:

    Your service uses the access token to fetch the user's profile information from the social network's API.
    This information may include the user's name, email, and profile picture.
    User Creation/Authentication:

    Your service checks if the user's social ID (unique identifier provided by the social network) already exists in your
    system. If the user is new, create an account using the received information; otherwise, authenticate the user.
    User Session Establishment:

    Generate a session token or JWT for the user, indicating they are now authenticated within your system.
    Redirect the user to the desired page within your application.
    This sequence ensures a secure and seamless integration with social login, providing a convenient and efficient 
    sign-in experience for users.
