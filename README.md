# RubyBots Example Chat Rails Application

This is an example Rails application that uses the `ruby_bots` gem to create a streaming chat interface with OpenAI. The application provides an example of streaming the response using Server Sent Events and an example using Turbo Streams.

To run the application, set up your `OPENAI_ACCESS_TOKEN` in the environment.

    export OPENAI_ACCESS_TOKEN=<your_token>

Next, install the bundle

    bundle install

And finally run the rails server

    bundle exec rails s

The chat interface will exist at http://localhost:3000

For more information on ruby bots, see the repository [here](https://github.com/aha-app/ruby_bots)
