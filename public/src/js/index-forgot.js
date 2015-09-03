$(function() {

  var form = $('#form');
  var email = $('#email');
  var emailField = email.find('input');
  var emailHelp = email.find('.help-block');
  var doSubmit = false;

  form.on('submit', function(e) {
    if (doSubmit) {
      return;
    }
    e.preventDefault();
    var submitForm = function() {
      doSubmit = true;
      form.submit();
    };
    $.ajax({
      url: '/forgot',
      method: 'POST',
      data: {
        email: emailField.val()
      }
    })
    .done(function(data) {
      data = data || {};
      if (data.status != 'ok') {
        return submitForm();
      }
      var errors = data.errors || {};
      if (Object.keys(errors).length === 0) {
        return submitForm();
      }
      if (errors.email) {
        email.addClass('has-error');
        emailHelp.text(errors.email).removeClass('hidden');
      }
    })
    .fail(submitForm);
  });

  emailField.on('change', function() {
    if (email.hasClass('has-error')) {
      email.removeClass('has-error');
      emailField.addClass('hidden').text('');
    }
  });

});