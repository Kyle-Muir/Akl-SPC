$(function() {
	var url = 'http://sp2013vm/_api/web/lists/getbytitle(\'Movies\')/items';
	var action = new SPC.Ajax.Action();
	action.get(url, {}, function(resp) {
		console.log(resp);
	});
});