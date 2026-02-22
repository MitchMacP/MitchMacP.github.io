export function createGallery(images) {

    let html = ``;

    if (images) {
        html = `
        <div class="gallery">
            ${images.map(src => `
                <div class="gallery-item">
                <img src="${src}" /> 
                </div>`)
                .join("")}
        </div>
        `;
    } else {
        html = `<p class="panel_p">No Screenshots available.</p>`;
    }

    return html;
}