function switchToInstructorForm() {
  document.getElementById('instructorForm').classList.remove('hidden');
  document.getElementById('studentForm').classList.add('hidden');
  document.getElementById('instructorTab').classList.add('active-tab');
  document.getElementById('studentTab').classList.remove('active-tab');
}

function switchToStudentForm() {
  document.getElementById('studentForm').classList.remove('hidden');
  document.getElementById('instructorForm').classList.add('hidden');
  document.getElementById('studentTab').classList.add('active-tab');
  document.getElementById('instructorTab').classList.remove('active-tab');
}

document.getElementById('studentTab').addEventListener('click', function() {
  switchToStudentForm();
  window.history.pushState({}, '', window.location.pathname);
});

document.getElementById('instructorTab').addEventListener('click', function() {
  switchToInstructorForm();
  window.history.pushState({}, '', updateQueryStringParameter(window.location.href, 'role', 'instructor'));
});

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('role') === 'instructor') {
    switchToInstructorForm();
  } else {
    switchToStudentForm();
  }
};
