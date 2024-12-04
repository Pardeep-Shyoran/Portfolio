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


    // Form submission handling
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var name = this.name.value;
        var email = this.email.value;
        var message = this.message.value;

        // Display the message in the modal
        document.getElementById('modal-message').innerHTML = `
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Message:</strong> ${message}
        `;

        // Show the modal
        modal.style.display = "block";

        // Here you would typically send the form data to a server
        console.log('Form submitted:', { name, email, message });

        // Reset the form
        this.reset();
    });

    // Email button click handling
    document.getElementById('email-button').addEventListener('click', function() {
        var recipient = 'your.email@example.com';
        var subject = 'Inquiry from Portfolio Website';
        var body = 'Hello Pardeep Shyoran,\n\nI visited your portfolio website and I would like to get in touch with you regarding...';

        var mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

        window.location.href = mailtoLink;
    });
});