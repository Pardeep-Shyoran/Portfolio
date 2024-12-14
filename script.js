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

    const cardWrapper = document.querySelector('.cards');
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            const clone = card.cloneNode(true);
            cardWrapper.appendChild(clone);
        });

        const totalWidth = cards.length * (350 + 60);

        cardWrapper.style.width = `${totalWidth * 2}px`;

        const animationDuration = cards.length * 3;
        cardWrapper.style.animationDuration = `${animationDuration}s`;


    // Email button click handling
    // document.getElementById('email-button').addEventListener('click', function() {
    //     var recipient = 'pardeepsheoran2004@gmail.com';
    //     var subject = 'Inquiry from Portfolio Website';
    //     var body = 'Hello Pardeep Shyoran,\n\nI visited your portfolio website and I would like to get in touch with you regarding...';

    //     var mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    //     window.location.href = mailtoLink;
    // });

    document.getElementById('email-button').addEventListener('click', function() {
        var recipient = 'pardeep75889@gmail.com';
        var subject = 'Inquiry from Portfolio Website';
        var body = `Hello Pardeep Shyoran,\n\nI visited your portfolio website and I would like to get in touch with you regarding...`;
    
        var mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
        window.location.href = mailtoLink;
    });
    
});
