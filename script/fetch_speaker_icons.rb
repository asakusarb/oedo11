# data/timetable.yml の登壇者の X アイコンを unavatar.io から取得し、
# source/images/speakers/x-<account>.jpg（または .png）に保存します。保存済みのものはスキップします。
# 先頭に x- を付けるのは、_ko1 のような _ 始まりのファイルを Middleman が公開しないためです。
#
#   ruby script/fetch_speaker_icons.rb

require 'yaml'
require 'net/http'
require 'fileutils'

root = File.expand_path('..', __dir__)
dir = File.join(root, 'source/images/speakers')
FileUtils.mkdir_p(dir)

accounts = YAML.load_file(File.join(root, 'data/timetable.yml'))
  .flat_map { |slot| slot['talks'] || [] }
  .map { |talk| talk['account'] }
  .uniq

extensions = {'image/jpeg' => 'jpg', 'image/png' => 'png'}

accounts.each do |account|
  next if extensions.values.any? { |ext| File.exist?(File.join(dir, "x-#{account}.#{ext}")) }

  response = Net::HTTP.get_response(URI("https://unavatar.io/x/#{account}?fallback=false"))
  ext = extensions[response['content-type']]
  if response.is_a?(Net::HTTPSuccess) && ext
    File.binwrite(File.join(dir, "x-#{account}.#{ext}"), response.body)
    puts "saved #{account}.#{ext}"
  else
    warn "failed #{account}: #{response.code} #{response['content-type']}"
  end
end
