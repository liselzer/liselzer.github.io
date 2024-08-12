
function toggleAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection.classList.contains('hidden')) {
        aboutSection.classList.remove('hidden');
    } else {
        aboutSection.classList.add('hidden');
    }
}