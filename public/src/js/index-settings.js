$(function() {

  var form = $('#form');
  var language = $('#language');
  var country = $('#country');
  var timezone = $('#timezone');
  var email = $('#email');
  var currentPassword = $('#cpassword');
  var newPassword = $('#npassword');
  var languageField = language.find('select');
  var countryField = country.find('select');
  var timezoneField = timezone.find('select');
  var emailField = email.find('input');
  var currentPasswordField = currentPassword.find('input');
  var newPasswordField = newPassword.find('input');
  var languageHelp = language.find('.help-block');
  var countryHelp = country.find('.help-block');
  var timezoneHelp = timezone.find('.help-block');
  var emailHelp = email.find('.help-block');
  var currentPasswordHelp = currentPassword.find('.help-block');
  var newPasswordHelp = newPassword.find('.help-block');
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
      url: '/settings',
      method: 'POST',
      data: {
        language: $('#language select option:selected').val(),
        country: $('#country select option:selected').val(),
        timezone: $('#timezone select option:selected').val(),
        email: emailField.val(),
        cpassword: currentPasswordField.val(),
        npassword: newPasswordField.val()
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
      if (errors.language) {
        language.addClass('has-error');
        languageHelp.text(errors.language).removeClass('hidden');
      }
      if (errors.country) {
        country.addClass('has-error');
        countryHelp.text(errors.country).removeClass('hidden');
      }
      if (errors.timezone) {
        timezone.addClass('has-error');
        timezoneHelp.text(errors.timezone).removeClass('hidden');
      }
      if (errors.email) {
        email.addClass('has-error');
        emailHelp.text(errors.email).removeClass('hidden');
      }
      if (errors.cpassword) {
        currentPassword.addClass('has-error');
        currentPasswordHelp.text(errors.cpassword).removeClass('hidden');
      }
      if (errors.npassword) {
        newPassword.addClass('has-error');
        newPasswordHelp.text(errors.npassword).removeClass('hidden');
      }
    })
    .fail(submitForm);
  });

});