$(function() {
  if (history.pushState) {
    
    $('.pagination a').on('click', function(e) {
      e.preventDefault();
      history.pushState({
        url: location.pathname
      }, document.title, this.href);
      window.dispatchEvent(new PopStateEvent('popstate', {
        bubbles: false,
        cancelable: false,
        state: {
          url: this.pathname
        }
      }));
    });

    $(window).on('popstate', function(e) {
      console.log('popstate event, e: ', e);
      // TODO start loading indicator
      $.ajax({
        url: e.path,
      })
      .done(function(data) {
        data = data || {};
        if (data.status == 'ok') {
            var html = [];
            data.users.forEach(function(user) {
              html.push(views['views/__admin-users-table']({
                user: user
              }));
            });
            $('#table-body').html(html.join(''));
          }
        // TODO stop loading indicator
      })
      .fail(function() {
        location.href = e.path;
      });
    });

  }
});