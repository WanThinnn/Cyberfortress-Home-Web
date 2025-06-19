// Modal functionality for SIEM Central

// Modal controller
class ModalController {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        this.initializeImageModal();
        this.bindEvents();
    }

    initializeImageModal() {
        const imageModal = document.getElementById('imageModal');
        if (imageModal) {
            this.modals.set('image', imageModal);
        }
    }

    bindEvents() {
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Click outside modal to close
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Prevent body scroll when modal is open
        this.modals.forEach(modal => {
            const observer = new MutationObserver(() => {
                if (modal.style.display === 'block') {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            observer.observe(modal, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        });
    }

    openModal(modalId, options = {}) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        // Apply options
        if (options.imageUrl && modalId === 'image') {
            const modalImage = modal.querySelector('#modalImage');
            if (modalImage) {
                modalImage.src = options.imageUrl;
                modalImage.alt = options.alt || 'Modal Image';
            }
        }

        // Show modal with animation
        modal.style.display = 'block';
        modal.style.opacity = '0';
        
        requestAnimationFrame(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        });

        // Add modal content animation
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.7) translateY(-50px)';
            modalContent.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            
            requestAnimationFrame(() => {
                modalContent.style.transform = 'scale(1) translateY(0)';
            });
        }
    }

    closeModal(modal) {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '0';

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.7) translateY(-50px)';
        }

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    closeAllModals() {
        this.modals.forEach(modal => {
            if (modal.style.display === 'block') {
                this.closeModal(modal);
            }
        });
    }
}

// Gallery functionality for architecture images
class ImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.collectImages();
        this.setupImageClickHandlers();
    }

    collectImages() {
        const galleryImages = document.querySelectorAll('.arch-img, .gallery-image');
        
        galleryImages.forEach(img => {
            this.images.push({
                src: img.src,
                alt: img.alt,
                title: img.dataset.title || img.alt
            });
        });
    }

    setupImageClickHandlers() {
        const clickableImages = document.querySelectorAll('.arch-img, .gallery-image');
        
        clickableImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.openGallery(index);
            });
        });
    }

    openGallery(startIndex = 0) {
        this.currentIndex = startIndex;
        this.createGalleryModal();
    }

    createGalleryModal() {
        // Remove existing gallery modal
        const existingModal = document.getElementById('galleryModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'galleryModal';
        modal.className = 'gallery-modal';
        modal.innerHTML = this.createGalleryHTML();

        document.body.appendChild(modal);
        this.bindGalleryEvents(modal);

        // Show modal
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }

    createGalleryHTML() {
        const currentImage = this.images[this.currentIndex];
        
        return `
            <div class="gallery-overlay"></div>
            <div class="gallery-content">
                <button class="gallery-close">&times;</button>
                <div class="gallery-main">
                    <button class="gallery-nav gallery-prev" ${this.currentIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="gallery-image-container">
                        <img src="${currentImage.src}" alt="${currentImage.alt}" class="gallery-current-image">
                        <div class="gallery-info">
                            <h3>${currentImage.title}</h3>
                            <p>${this.currentIndex + 1} / ${this.images.length}</p>
                        </div>
                    </div>
                    <button class="gallery-nav gallery-next" ${this.currentIndex === this.images.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-thumbnails">
                    ${this.images.map((img, index) => `
                        <img src="${img.src}" alt="${img.alt}" 
                             class="gallery-thumb ${index === this.currentIndex ? 'active' : ''}"
                             data-index="${index}">
                    `).join('')}
                </div>
            </div>
        `;
    }

    bindGalleryEvents(modal) {
        // Close button
        const closeBtn = modal.querySelector('.gallery-close');
        closeBtn.addEventListener('click', () => this.closeGallery(modal));

        // Navigation buttons
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');

        prevBtn.addEventListener('click', () => this.navigateGallery(-1, modal));
        nextBtn.addEventListener('click', () => this.navigateGallery(1, modal));

        // Thumbnail clicks
        const thumbnails = modal.querySelectorAll('.gallery-thumb');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.goToImage(index, modal);
            });
        });

        // Keyboard navigation
        const keyHandler = (e) => {
            switch (e.key) {
                case 'Escape':
                    this.closeGallery(modal);
                    break;
                case 'ArrowLeft':
                    this.navigateGallery(-1, modal);
                    break;
                case 'ArrowRight':
                    this.navigateGallery(1, modal);
                    break;
            }
        };

        document.addEventListener('keydown', keyHandler);
        modal.dataset.keyHandler = 'attached';

        // Click outside to close
        const overlay = modal.querySelector('.gallery-overlay');
        overlay.addEventListener('click', () => this.closeGallery(modal));
    }

    navigateGallery(direction, modal) {
        const newIndex = this.currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.images.length) {
            this.goToImage(newIndex, modal);
        }
    }

    goToImage(index, modal) {
        this.currentIndex = index;
        const currentImage = this.images[index];

        // Update main image
        const mainImg = modal.querySelector('.gallery-current-image');
        const imgContainer = modal.querySelector('.gallery-image-container');
        
        // Fade out
        imgContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            mainImg.src = currentImage.src;
            mainImg.alt = currentImage.alt;
            
            // Update info
            const title = modal.querySelector('.gallery-info h3');
            const counter = modal.querySelector('.gallery-info p');
            
            if (title) title.textContent = currentImage.title;
            if (counter) counter.textContent = `${index + 1} / ${this.images.length}`;
            
            // Update thumbnails
            const thumbnails = modal.querySelectorAll('.gallery-thumb');
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
            
            // Update navigation buttons
            const prevBtn = modal.querySelector('.gallery-prev');
            const nextBtn = modal.querySelector('.gallery-next');
            
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === this.images.length - 1;
            
            // Fade in
            imgContainer.style.opacity = '1';
        }, 150);
    }

    closeGallery(modal) {
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.remove();
            
            // Remove keyboard event listener
            const keyHandlers = document.querySelectorAll('[data-key-handler]');
            keyHandlers.forEach(handler => {
                document.removeEventListener('keydown', handler);
            });
        }, 300);
    }
}

// Global functions for modal control
function openImageModal() {
    const modalController = window.modalController;
    if (modalController) {
        modalController.openModal('image', {
            imageUrl: 'img/deployment-architecture.png',
            alt: 'SIEM Deployment Architecture'
        });
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal && window.modalController) {
        window.modalController.closeModal(modal);
    }
}

// Enhanced modal styles
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .gallery-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .gallery-content {
            width: 95%;
            max-width: 1200px;
            height: 90%;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .gallery-close {
            position: absolute;
            top: -50px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 10;
            padding: 10px;
            transition: opacity 0.3s ease;
        }

        .gallery-close:hover {
            opacity: 0.7;
        }

        .gallery-main {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .gallery-nav {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 15px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .gallery-nav:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .gallery-nav:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .gallery-image-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: opacity 0.3s ease;
        }

        .gallery-current-image {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .gallery-info {
            text-align: center;
            color: white;
            margin-top: 20px;
        }

        .gallery-info h3 {
            margin: 0 0 5px 0;
            font-size: 1.2rem;
        }

        .gallery-info p {
            margin: 0;
            opacity: 0.7;
        }

        .gallery-thumbnails {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
            overflow-x: auto;
            padding: 10px 0;
        }

        .gallery-thumb {
            width: 60px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .gallery-thumb:hover {
            opacity: 0.8;
            transform: scale(1.1);
        }

        .gallery-thumb.active {
            opacity: 1;
            border-color: #4A90E2;
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            .gallery-content {
                width: 100%;
                height: 100%;
                padding: 20px;
            }

            .gallery-main {
                flex-direction: column;
                gap: 10px;
            }

            .gallery-nav {
                padding: 10px;
            }

            .gallery-thumbnails {
                gap: 5px;
            }

            .gallery-thumb {
                width: 40px;
                height: 30px;
            }
        }
    `;

    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add modal styles
    addModalStyles();
    
    // Initialize modal controller
    window.modalController = new ModalController();
    
    // Initialize image gallery
    window.imageGallery = new ImageGallery();
});

// Export for global access
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
