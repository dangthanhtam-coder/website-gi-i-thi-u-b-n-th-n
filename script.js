function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}

function sendMessage() {
  alert('Gửi thành công!');
}