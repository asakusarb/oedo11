activate :autoprefixer do |prefix|
  prefix.browsers = 'last 2 versions'
end

set :haml, format: :html5
set :relative_links, true
activate :relative_assets
