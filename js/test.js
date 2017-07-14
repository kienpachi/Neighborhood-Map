var viewModel = function() {
    this.name = 'Best Places';
    
    this.works = function () {
        alert("works!");
    };
};

// apply Knockout Bindings
ko.applyBindings(viewModel);