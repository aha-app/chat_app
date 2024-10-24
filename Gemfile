source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.3.4"

gem "ruby_bots"

gem "rails", "~> 7.2.1", ">= 7.2.1"
gem "sprockets-rails"
gem "sqlite3", "~> 1.4"
gem "puma", "~> 6.0"
gem "importmap-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"

gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

gem "bootsnap", require: false

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
end

group :development do
  gem "web-console"
  gem "pry"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "webdrivers"
end
