document.addEventListener('DOMContentLoaded', () => {
    const takePicBtn = document.getElementById('takePicBtn');
    const voiceInputBtn = document.getElementById('voiceInputBtn');
    const productNameInput = document.getElementById('productName');
    const productForm = document.getElementById('productForm');
    const productPreview = document.getElementById('productPreview');
    const productImage = document.getElementById('productImage');
    const productDetails = document.getElementById('productDetails');

    let capturedImage = null;  // To store captured image URL

    // Enable Webcam for taking picture
    takePicBtn.addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // Create canvas for capturing a snapshot
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Show the video stream in a temporary video element
        document.body.appendChild(video);
        
        // Display the webcam video and add a "Capture" button
        const captureButton = document.createElement('button');
        captureButton.innerText = 'Capture Picture';
        document.body.appendChild(captureButton);
        
        captureButton.addEventListener('click', () => {
            // Capture the image
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            capturedImage = canvas.toDataURL('image/png');

            // Set the captured image as the product image
            productImage.src = capturedImage;
            productPreview.style.display = 'block';

            // Cleanup
            video.pause();
            document.body.removeChild(video);
            document.body.removeChild(captureButton);
            
            // Enable Voice Input button
            voiceInputBtn.disabled = false;
        });
    });

    // Start Voice Input (after the picture is taken)
    voiceInputBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.start();
        voiceInputBtn.textContent = '🎙️ Listening...';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            productNameInput.value = transcript;
            voiceInputBtn.textContent = '🎙️ Start Voice Input'; // Reset button
        };

        recognition.onerror = (event) => {
            console.error('Voice Input Error:', event.error);
            alert('Error with voice input.');
            voiceInputBtn.textContent = '🎙️ Start Voice Input'; // Reset button
        };
    });

    // Handle product submission
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const color = document.getElementById('colorOptions').value;
        const condition = document.getElementById('productState').value;

        // Generate random price
        const randomPrice = (Math.random() * (5000 - 100) + 100).toFixed(2);

        // Create product description
        const description = `${productNameInput.value} | Color: ${color} | Condition: ${condition} | Price: R${randomPrice}`;

        // Display the final product details
        productDetails.textContent = description;
    });
});
