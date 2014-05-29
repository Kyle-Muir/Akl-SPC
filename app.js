var ViewModel = function() {
	var self = this;
	self.allMovies = ko.observableArray([]);
	self.movies = ko.observableArray([]);
	self.searchTerms = ko.observable('');
	self.filterCategories = ko.observableArray([]);
	self.populate = function() {
		var url = 'http://sp2013vm/_api/web/lists/getbytitle(\'Movies\')/items';
		$.ajax({
			url: url,
			headers: {
				Accept: 'application/json;odata=verbose' //Tell SP to return JSON instead of XML
			},
			success: function (response) {
				var listItems = response.d.results; //process results
				var movies = [];
				$.each(listItems, function(index, item) {
					var model = new MovieModel(item.Title, item.Description, item.Rating, item.Release_x0020_Date, item.Thumbnail.Url, item.Video_x0020_URL.Url);
					movies.push(model); //build up movie items
				});
				self.allMovies(movies);
				self.movies(movies); 
				self.populateFilterCategories();
			},
			error: function (response) {
				console.log(response); //Error handling can go here.
			}
		});
	}
	
	self.populateFilterCategories = function() {
		//pull all ratings off the movies gathered and create new categories for them.
    	var ratings = _.uniq(_.pluck(self.allMovies(), 'rating'));
    	ratings = ratings.map(function(item){return {name: 'rating', value: item}})
		self.filterCategories.push(new Category('Rating', true, ratings));

		//pull all release dates off the movies gathered and create new categories for them.
		var releaseDate = _.uniq(_.pluck(self.allMovies(), 'releaseDate'));
       	releaseDate = releaseDate.map(function(item){return {name: 'releaseDate', value: item}})
		self.filterCategories.push(new Category('Release Date', false, releaseDate));
	}
	
	self.search = function() {
		var term = self.searchTerms().toLowerCase().replace('*', '').trim();
		var searchResults = _.filter(self.movies(), function(movie) { //search runs on the filtered set.
			var containsTitle = movie.title && movie.title.toLowerCase().indexOf(term) !== -1;
			var containsRating = movie.rating && movie.rating.toLowerCase().indexOf(term) !== -1;
			var containsReleaseDate = movie.releaseDate && movie.releaseDate.toLowerCase().indexOf(term) !== -1;
			
			return containsTitle || containsRating || containsReleaseDate;
		});
		if (searchResults.length > 0) { //if we have results, set them.
			self.movies(searchResults); 
		}
	}
	
	self.clearFilters = function() {
		self.movies(self.allMovies());
	}

	self.toggleFilter = function(filter) {
		var filteredItems = _.filter(self.allMovies(), function(movie) {
			return movie[filter.name] === filter.value;
		});
		self.movies(filteredItems);
	}
}

var Category = function(name, isExpanded, subItems) {
	var self = this;
	self.name = name;
	self.isExpanded = ko.observable(isExpanded);
	self.subItems = subItems;
	self.categoryExpander = ko.computed({
			read: function() {
				return (self.isExpanded() ? 'category-expanded' : 'category-collapsed');
			}
		});
	
	self.hideCategory = function() {
		self.isExpanded(!self.isExpanded());
	}
}
	
var MovieModel = function(title, description, rating, releaseDate, thumbnail, trailerLink) {
	this.title = title;
	this.description = $('<div />').html(description).text() //pulls text out of rich text areas, removes unwanted mark up.
	this.rating = rating;
	this.releaseDate = new Date(releaseDate).toDateString(); //friendly dates!
	this.thumbnail = thumbnail;
	this.trailerLink = trailerLink;
}

$(function() { 										//document ready hooks
	var viewModel = new ViewModel(); 				//create viewmodel
	viewModel.populate(); 							//populate it
	ko.applyBindings(viewModel, $('#movies')[0]); 	//bind it to the UI
});