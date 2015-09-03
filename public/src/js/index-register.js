$(function() {

  var form = $('#form');
  var username = $('#username');
  var email = $('#email');
  var password = $('#password');
  var agree = $('#agree');
  var usernameField = username.find('input');
  var emailField = email.find('input');
  var passwordField = password.find('input');
  var agreeField = agree.find('input');
  var usernameHelp = username.find('.help-block');
  var emailHelp = email.find('.help-block');
  var passwordHelp = password.find('.help-block');
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
      url: '/register',
      method: 'POST',
      data: {
        username: usernameField.val(),
        email: emailField.val(),
        password: passwordField.val(),
        agree: $('#agree input:checked').val()
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
      if (errors.username) {
        username.addClass('has-error');
        usernameHelp.text(errors.username).removeClass('hidden');
      }
      if (errors.email) {
        email.addClass('has-error');
        emailHelp.text(errors.email).removeClass('hidden');
      }
      if (errors.password) {
        password.addClass('has-error');
        passwordHelp.text(errors.password).removeClass('hidden');
      }
      if (errors.agree) {
        agree.addClass('has-error');
      }
    })
    .fail(submitForm);
  });

  usernameField.on('change', function() {
    if (username.hasClass('has-error')) {
      username.removeClass('has-error');
      usernameHelp.addClass('hidden').text('');
    }
  });

  emailField.on('change', function() {
    if (email.hasClass('has-error')) {
      email.removeClass('has-error');
      emailHelp.addClass('hidden').text('');
    }
  });

  passwordField.on('change', function() {
    if (password.hasClass('has-error')) {
      password.removeClass('has-error');
      passwordHelp.addClass('hidden').text('');
    }
  });

  agreeField.on('change', function() {
    if (agree.hasClass('has-error')) {
      agree.removeClass('has-error');
    }
  });

});