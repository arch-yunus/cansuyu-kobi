document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('destekListesi');
    const searchInput = document.getElementById('searchInput');
    const filtersContainer = document.getElementById('categoryFilters');
    
    let allData = [];
    let activeCategory = 'Tümü';

    try {
        const response = await fetch('../data/aktif-destekler.json');
        allData = await response.json();
        initApp();
    } catch (error) {
        listContainer.innerHTML = `<p style="color:red">Veri yüklenirken hata oluştu: ${error.message}</p>`;
    }

    function initApp() {
        renderFilters();
        renderList(allData);

        searchInput.addEventListener('input', handleFilter);
    }

    function renderFilters() {
        const categories = ['Tümü', ...new Set(allData.map(item => item.kategori))];
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${cat === 'Tümü' ? 'active' : ''}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = cat;
                handleFilter();
            });
            filtersContainer.appendChild(btn);
        });
    }

    function handleFilter() {
        const searchTerm = searchInput.value.toLowerCase();
        
        const filtered = allData.filter(item => {
            const matchesSearch = item.destek_adi.toLowerCase().includes(searchTerm) || 
                                  item.kurum.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'Tümü' || item.kategori === activeCategory;
            
            return matchesSearch && matchesCategory;
        });

        renderList(filtered);
    }

    function renderList(data) {
        listContainer.innerHTML = '';
        
        if (data.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1 / -1; color: var(--text-secondary);">Aradığınız kritere uygun destek bulunamadı.</p>';
            return;
        }

        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${index * 0.1}s`;

            const formatCurrency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(item.maksimum_tutar);

            card.innerHTML = `
                <div class="card-header">
                    <span class="badge">${item.kategori}</span>
                </div>
                <h2>${item.destek_adi}</h2>
                <p class="kurum">${item.kurum}</p>
                
                <div class="amount">
                    ${formatCurrency} <span>Maks. Destek</span>
                </div>

                <a href="${item.basvuru_linki}" target="_blank">Başvuruyu İncele →</a>
            `;
            listContainer.appendChild(card);
        });
    }
});
