Add-PsSnapIn Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

$siteUrl = "http://sp2013vm/sites/test123" #your site address here

$web = Get-SPWeb $siteUrl
$list = $web.Lists.TryGetList("Movies")
if (!$list) {
	$listTemplate = [Microsoft.SharePoint.SPListTemplateType]::GenericList
	$web.Lists.Add("Movies", "A list of movies to make some stuff with!", $listTemplate)
	$list = $web.Lists["Movies"]
	$list.Fields.Add("Video URL", [Microsoft.SharePoint.SPFieldType]::URL, $false)
	$list.Fields.Add("Thumbnail", [Microsoft.SharePoint.SPFieldType]::URL, $false)
	$list.Fields.Add("Release Date", [Microsoft.SharePoint.SPFieldType]::DateTime, $false)
	$list.Fields.Add("Description", [Microsoft.SharePoint.SPFieldType]::Note, $false)
	$list.Fields.Add("Rating", [Microsoft.SharePoint.SPFieldType]::Choice, $false)
	$ratings = $list.Fields["Rating"]
	$ratings.Choices.Add("G")
	$ratings.Choices.Add("PG")
	$ratings.Choices.Add("M")
	$ratings.Choices.Add("R16")
	$ratings.Choices.Add("R18")
	$ratings.Update()
	$list.Update()
}