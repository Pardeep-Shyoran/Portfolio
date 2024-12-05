document.addEventListener('DOMContentLoaded', function() {
    var typed = new Typed('#element', {
        strings: ['Web-Developer.', ' Graphics Designer.', ' Video Editor.', ' Photographer.'],
        typeSpeed: 100,
        backSpeed: 50,
        loop: true
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // Email button click handling
    // document.getElementById('email-button').addEventListener('click', function() {
    //     var recipient = 'pardeepsheoran2004@gmail.com';
    //     var subject = 'Inquiry from Portfolio Website';
    //     var body = 'Hello Pardeep Shyoran,\n\nI visited your portfolio website and I would like to get in touch with you regarding...';

    //     var mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    //     window.location.href = mailtoLink;
    // });

    document.getElementById('email-button').addEventListener('click', function() {
        var recipient = 'pardeepsheoran2004@gmail.com';
        var subject = 'Inquiry from Portfolio Website';
        var body = `Hello Pardeep Sheoran,\n\nI visited your portfolio website and I would like to get in touch with you regarding...`;
    
        var mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
        window.location.href = mailtoLink;
    });
    
});