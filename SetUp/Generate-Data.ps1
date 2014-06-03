Add-PsSnapIn Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

$siteUrl = "http://sp2013vm/sites/test123" #your site address here
$web = Get-SPWeb $siteUrl
$list = $web.Lists["Movies"]

function Add-NewItem($title, $description, $rating, $releaseDate, $videoUrl, $thumbnail) {
	$item = $list.Items.Add()
	$item["Title"] = $title
	$item["Description"] = $description
	$item["Rating"] = $rating
	$item["Release Date"] = $releaseDate
	$item["Thumbnail"] = "$thumbnail, thumbnail"
	$item["Video URL"] = "$videoUrl, video"
}

Add-NewItem "X-Men: Days of Future Past" "The ultimate X-Men ensemble fights a war for the survival of the species across two time periods in X-MEN: DAYS OF FUTURE PAST. The beloved characters from the original "X-Men" film trilogy join forces with their younger selves from the past, "X-Men: First Class," in order to change a major historical event and fight in an epic battle that could save our future. ​" "M" "5/23/2014" "https://www.youtube.com/watch?v=gsjtg7m1MMM" "http://content7.flixster.com/movie/11/17/70/11177049_det.jpg"