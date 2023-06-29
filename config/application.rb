require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module ChatApp
  class Application < Rails::Application
    config.load_defaults 7.0

    # This line is very important in making sure that
    # the events are properly streamed and not batched in the middleware
    config.middleware.delete Rack::ETag
  end
end
