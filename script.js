// 1. Selectăm elementele din pagina HTML cu care vom interacționa
const castButton = document.getElementById('cast-spell-btn');
const tableBody = document.getElementById('spell-table-body');

// URL-ul oficial al API-ului
const API_URL = "https://wizard-world-api.herokuapp.com/Spells";

// 2. Adăugăm un "ascultător" de evenimente pe buton
// Când dai click, se execută funcția 'castSpell'
castButton.addEventListener('click', castSpell);

// 3. Funcția principală (Asyncronă pentru că așteptăm date de pe net)
async function castSpell() {
    
    // Log start proces
    console.log("--- 🪄 Începe Ritualul de Invocare ---");
    
    // Modificăm butonul pentru a arăta că lucrează
    const originalText = castButton.innerText;
    castButton.innerText = "Se invocă...";
    castButton.disabled = true; // Dezactivăm butonul să nu se apese de 2 ori

    try {
        // Pasul A: Cerem datele de la API
        console.log("1. Se trimite bufnița către server (Fetch API)...");
        const response = await fetch(API_URL);

        // Verificăm dacă serverul a răspuns cu succes (cod 200-299)
        if (!response.ok) {
            throw new Error(`Eroare de rețea: ${response.status}`);
        }

        // Pasul B: Transformăm răspunsul în format JSON (text în date)
        const allSpells = await response.json();
        console.log(`2. Date primite! Am găsit ${allSpells.length} vrăji în total.`);

        // Pasul C: Alegem o vrajă aleatorie
        // Math.random() dă un număr între 0 și 1, înmulțim cu lungimea listei
        const randomIndex = Math.floor(Math.random() * allSpells.length);
        const selectedSpell = allSpells[randomIndex];

        console.log("3. Vraja aleasă de soartă este:", selectedSpell);
        console.log(`   - Nume: ${selectedSpell.name}`);
        console.log(`   - Efect: ${selectedSpell.effect}`);

        // Pasul D: Afișăm datele în tabelul HTML
        displaySpell(selectedSpell);

    } catch (error) {
        // Aici ajungem doar dacă ceva s-a stricat (ex: nu ai internet)
        console.error("❌ A apărut o eroare neprevăzută:", error);
        
        // Afișăm eroarea și în tabel ca să vadă utilizatorul
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" style="color: #ff6b6b; font-weight: bold;">
                    Vraja a eșuat! Verifică consola (F12).
                </td>
            </tr>
        `;
    } finally {
        // Acest cod se execută mereu la final, indiferent dacă a reușit sau nu
        console.log("--- Ritual Finalizat ---\n");
        castButton.innerText = originalText;
        castButton.disabled = false; // Reactivăm butonul
    }
}

// Funcție separată pentru a "desena" rândul în tabel
function displaySpell(spell) {
    // Verificăm dacă există incantație (unele vrăji sunt non-verbale)
    // Dacă e null, afișăm "Non-verbală"
    const incantationText = spell.incantation ? spell.incantation : "(Non-verbală)";

    // Construim HTML-ul pentru noul rând
    const rowHTML = `
        <tr>
            <td>${spell.name}</td>
            <td style="font-style: italic;">"${incantationText}"</td>
            <td>${spell.type}</td>
        </tr>
    `;

    // Introducem HTML-ul în corpul tabelului
    tableBody.innerHTML = rowHTML;
}