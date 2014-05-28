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
		var ratings = _.uniq(_.pluck(self.movies(), 'rating'));
		self.filterCategories.push(new Category('Rating', true, ratings));
		var releaseDate = _.uniq(_.pluck(self.movies(), 'releaseDate'));
		self.filterCategories.push(new Category('Release Date', false, releaseDate));
	}
	
	self.search = function() {
		var term = self.searchTerms().toLowerCase().replace('*', '').trim();
		var searchResults = _.filter(this.allMovies(), function(movie) {
			var containsTitle = movie.title && movie.title.toLowerCase().indexOf(term) !== -1;
			var containsRating = movie.rating && movie.rating.toLowerCase().indexOf(term) !== -1;
			var containsReleaseDate = movie.releaseDate && movie.releaseDate.toLowerCase().indexOf(term) !== -1;
			
			return containsTitle || containsRating || containsReleaseDate;
		});
		self.movies(searchResults);
	}
	
	self.clearFilters = function() {
		self.movies(self.allMovies());
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
	this.releaseDate = new Date(releaseDate).toDateString();
	this.thumbnail = thumbnail;
	this.trailerLink = trailerLink;
}

$(function() {
	var viewModel = new ViewModel();
	viewModel.populate();
	ko.applyBindings(viewModel, $('#movies')[0]);
});