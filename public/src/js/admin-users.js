$(function() {
  if (history.pushState) {
    
    $('.pagination a').on('click', function(e) {
      e.preventDefault();
      var self = $(this);
      var state = {};
      history.pushState(state, self.text(), self.attr('href'));
      window.dispatchEvent(new PopStateEvent('popstate', {
        bubbles: false,
        cancelable: false,
        state: state
      }))
    });

    $(window).on('popstate', function(e) {
      console.log('popstate event, e: ', e);
    });

  }
});