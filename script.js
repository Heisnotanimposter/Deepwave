document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Navigation Feature
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Get the target element ID (e.g., #projects)
            const targetId = this.getAttribute('href');
            
            // Scroll smoothly to the target element
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 2. Button OnClick Method
    //const alertButton = document.getElementById('alert-button');
    //if (alertButton) {
        //alertButton.addEventListener('click', () => {
            //alert('🚀 Quick Fact: Robotics relies heavily on object-oriented programming (OOP) in Python for complex control structures!');
        //});
    //}

    // 3. Hyperlink features are handled directly in HTML (mailto, target="_blank").
    
});