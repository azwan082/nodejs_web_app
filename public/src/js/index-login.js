$(function() {

  var form = $('#form');
  var login = $('#login');
  var password = $('#password');
  var loginField = login.find('input');
  var passwordField = password.find('input');
  var loginHelp = login.find('.help-block');
  var passwordHelp = password.find('.help-block');
  var rememberHelp = $('#remember .help-block');
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
      method: 'POST',
      url: '/login',
      data: {
        login: loginField.val(),
        password: passwordField.val(),
        remember: $('#remember input:checked').val()
      },
      dataType: 'json'
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
      if (errors.login) {
        login.addClass('has-error');
        loginHelp.text(errors.login).removeClass('hidden');
      }
      if (errors.password) {
        password.addClass('has-error');
        passwordHelp.text(errors.password).removeClass('hidden');
      }
    })
    .fail(submitForm);
  });

  loginField.on('change', function() {
    if (login.hasClass('has-error')) {
      login.removeClass('has-error');
      loginHelp.addClass('hidden').text('');
    }
  });

  passwordField.on('change', function() {
    if (password.hasClass('has-error')) {
      password.removeClass('has-error');
      passwordHelp.addClass('hidden').text('');
    }
  });

});