let currentPage = 0;
const videosPerPage = 5;
const loadingElement = document.getElementById('loading');

function loadVideos() {
    loadingElement.style.display = 'block';

    fetch('list_video.json')
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('videoContainer');
            const videos = data.videos;
            const start = currentPage * videosPerPage;
            const end = start + videosPerPage;

            if (start >= videos.length) {
                loadingElement.style.display = 'none'; 
                return; 
            }

            videos.slice(start, end).forEach(video => {
                const videoWrapper = document.createElement('div');
                videoWrapper.classList.add('video-wrapper');

                const videoElement = document.createElement('video');
                videoElement.setAttribute('data-src', video.url);
                videoElement.controls = true;

                const titleElement = document.createElement('p');
                titleElement.innerText = video.title;

               
                const thumbnailCanvas = document.createElement('canvas');
                const ctx = thumbnailCanvas.getContext('2d');

                videoElement.src = video.url;
                videoElement.addEventListener('loadeddata', () => {
                    videoElement.currentTime = 1; 
                });

                videoElement.addEventListener('seeked', () => {
                    ctx.drawImage(videoElement, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
                    const thumbnail = thumbnailCanvas.toDataURL('image/jpeg');
                    videoElement.setAttribute('poster', thumbnail); 
                });

                videoWrapper.appendChild(videoElement);
                videoWrapper.appendChild(titleElement);
                videoContainer.appendChild(videoWrapper);

                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const video = entry.target;
                            video.src = video.getAttribute('data-src'); 
                            observer.unobserve(video); 
                        }
                    });
                });

                observer.observe(videoElement);
            });

            currentPage++;
            loadingElement.style.display = 'none';
        })
        .catch(error => console.error('Hata:', error));
}

loadVideos();

window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight * 0.85;

    if (scrollPosition >= threshold) {
        loadVideos();
    }
});
