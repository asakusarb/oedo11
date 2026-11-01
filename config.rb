activate :autoprefixer do |prefix|
  prefix.browsers = 'last 2 versions'
end

set :haml, format: :html5
set :relative_links, true
activate :relative_assets

helpers do
  # Icons saved by script/fetch_speaker_icons.rb; nil when none is saved yet.
  def speaker_icon_path(account)
    %w[jpg png].map { |ext| "speakers/x-#{account}.#{ext}" }
      .find { |path| sitemap.find_resource_by_path("images/#{path}") }
  end
end
