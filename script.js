        function showTab(tabId) {
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        }

        let currentCategory = 'todos';
        let currentPage = 1;
        const itemsPerPage = 9; // Cantidad de productos por página (3 filas x 3 columnas)

        function filterCategory(category, btnElement) {
            currentCategory = category;
            currentPage = 1; // Volver a la página 1 al cambiar de categoría
            const buttons = document.querySelectorAll('.btn-filter');
            buttons.forEach(btn => btn.classList.remove('active'));
            btnElement.classList.add('active');
            filterProducts();
        }

        function filterProducts() {
            const searchInput = document.getElementById('catalogSearch');
            const searchText = searchInput ? searchInput.value.toLowerCase() : '';
            const cards = Array.from(document.querySelectorAll('.product-card'));

            // 1. Filtrar productos por búsqueda y categoría
            const matchingCards = cards.filter(card => {
                const cardCategories = card.getAttribute('data-category') || '';
                const cardName = card.getAttribute('data-name') || '';
                const matchesCategory = currentCategory === 'todos' || cardCategories.includes(currentCategory);
                const matchesSearch = cardName.includes(searchText);
                return matchesCategory && matchesSearch;
            });

            // 2. Ocultar todos los productos
            cards.forEach(card => card.style.display = 'none');

            // 3. Calcular total de páginas
            const totalPages = Math.ceil(matchingCards.length / itemsPerPage) || 1;
            if (currentPage > totalPages) currentPage = 1;

            // 4. Mostrar solo los 9 productos correspondientes a la página actual
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageCards = matchingCards.slice(startIndex, endIndex);

            pageCards.forEach(card => {
                card.style.display = 'flex';
            });

            // 5. Renderizar los botones de numeración de páginas
            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
            const container = document.getElementById('paginationContainer');
            if (!container) return;

            if (totalPages <= 1) {
                container.innerHTML = '';
                return;
            }

            let html = '';

            // Botón Anterior
            html += `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">❮</button>`;

            // Botones de Páginas (1, 2, 3...)
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            }

            // Botón Siguiente
            html += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">❯</button>`;

            container.innerHTML = html;
        }

        function changePage(page) {
            currentPage = page;
            filterProducts();
            
            // Desplazamiento suave al inicio de la lista de productos
            const catalogHeader = document.querySelector('.catalog-header');
            if (catalogHeader) {
                catalogHeader.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Ejecutar paginación inicial al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            filterProducts();
        });
