// ===================================================================
// FICHIER : script.js (CORRIGÉ ET COMPLET)
// ===================================================================

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVfVa4g4ksagR1SJX0sXuv4E4yuABtZAPQC5va8Ju3Pc0kIr6Mbmtz95bnXpMdkBdel7wZbHuOdEd9/pub?output=tsv";

// --- CONSTANTE DE DATE LIMITE (MODIFIÉE) ---
// Date : 19 octobre 2025 à 11h57 (Le mois est 0-indexé, donc octobre est 9)
const DEADLINE = new Date(2025, 9, 20, 11, 30, 0); 


// -------------------------------------------------------------------
// --- 1. FONCTION DE TRAITEMENT DU CLASSEMENT ---
// -------------------------------------------------------------------
function displayClassement(tsvData) {
    // CORRECTION : Sélecteur déplacé ici
    const classementDiv = document.getElementById('classement');
    
    const rows = tsvData.trim().split('\n');
    
    // Si pas de données
    if (rows.length <= 1) {
        if (classementDiv) classementDiv.innerHTML = "<p>Aucune donnee de classement trouvee pour le moment.</p>";
        return;
    }

    const header = rows[0].split('\t');
    const dataRows = rows.slice(1);

    const equipes = dataRows.map(row => {
        const columns = row.split('\t');
        const equipe = columns[0];
        const victoires = parseInt(columns[1], 10) || 0; 
        const defaites = parseInt(columns[2], 10) || 0;
        const capitaine = columns[3];
        
        const totalMatchs = victoires + defaites;
        const ratio = totalMatchs > 0 ? (victoires / totalMatchs) * 100 : 0;
        
        return {
            equipe,
            victoires,
            defaites,
            capitaine,
            ratio: parseFloat(ratio.toFixed(2)),
            totalMatchs
        };
    });

    equipes.sort((a, b) => {
        if (b.ratio !== a.ratio) {
            return b.ratio - a.ratio;
        }
        return b.victoires - a.victoires;
    });

    let htmlContent = '<h2>Classement Actuel du Tournoi</h2>';
    htmlContent += '<table class="ranking-table">';
    
    htmlContent += '<thead><tr>';
    htmlContent += '<th>#</th>';
    htmlContent += '<th>Equipe</th>';
    htmlContent += '<th>V</th>';
    htmlContent += '<th>D</th>';
    htmlContent += '<th>Ratio (%)</th>'; 
    htmlContent += '<th>Capitaine</th>';
    htmlContent += '</tr></thead>';

    htmlContent += '<tbody>';
    
    equipes.forEach((equipe, index) => {
        const rang = index + 1; 
        
        htmlContent += '<tr>';
        htmlContent += `<td>${rang}</td>`;
        htmlContent += `<td>${equipe.equipe}</td>`;
        htmlContent += `<td>${equipe.victoires}</td>`;
        htmlContent += `<td>${equipe.defaites}</td>`;
        htmlContent += `<td>${equipe.ratio}%</td>`;
        htmlContent += `<td>${equipe.capitaine}</td>`;
        htmlContent += '</tr>';
    });
    
    htmlContent += '</tbody></table>';

    if (classementDiv) classementDiv.innerHTML = htmlContent;
}


// -------------------------------------------------------------------
// --- 2. FONCTION POUR CHARGER LES DONNÉES ET DÉMASQUER ---
// -------------------------------------------------------------------
function loadClassement() {
    // CORRECTION : Sélecteurs déplacés ici
    const mainContent = document.querySelector('main');
    const classementDiv = document.getElementById('classement');

    // 1. Démasquer la section <main> (la page 'tournois')
    if (mainContent) {
        mainContent.style.display = 'block'; 
        mainContent.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 2. Lancement du Fetch
    fetch(GOOGLE_SHEET_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            displayClassement(data);
        })
        .catch(error => {
            console.error("Erreur de chargement de la Google Sheet :", error);
            if (classementDiv) classementDiv.innerHTML = "<p class='error-message'>🛑 Erreur: Impossible de charger le classement.</p>";
        });
}


// -------------------------------------------------------------------
// --- 3. MISE À JOUR DES BOUTONS ET GESTIONNAIRE D'ÉVÉNEMENTS ---
// -------------------------------------------------------------------

function updateInscriptionButton() {
    // Récupérer l'heure actuelle MAINTENANT pour une comparaison précise
    const now = new Date(); 
    
    const followContainer = document.querySelector('.follow-button-container');

    if (now >= DEADLINE) {
        // --- CAS INSCRIPTIONS FERMÉES ---
        
        // Remplacer le bouton "Inscriptions ouvertes" par "Inscriptions Fermées"
        const closedButtonHTML = `
            <a href="#" class="button-link button-big button-closed">
                Inscriptions Fermées
            </a>
        `;
        const openButton = document.querySelector('.button-container a[href="inscription.html"]');
        if (openButton) openButton.outerHTML = closedButtonHTML;

        // Afficher le conteneur du bouton "Suivre le tournois"
        if (followContainer) {
            followContainer.style.display = 'block';
            
            // Attacher l'événement de clic au bouton vert
            const followButton = document.getElementById('follow-tournament-button');
            if (followButton) {
                followButton.addEventListener('click', (event) => {
                    event.preventDefault(); 
                    loadClassement();       
                });
            }
        }
        
    } else {
        // --- CAS INSCRIPTIONS OUVERTES ---
        
        // S'assurer que le bouton "Suivre le tournois" est masqué
        if (followContainer) {
            followContainer.style.display = 'none';
        }
    }
}

// Lancer la mise à jour des boutons au chargement de la page
document.addEventListener('DOMContentLoaded', updateInscriptionButton);

// CORRECTION : L'accolade '}' en trop a été supprimée d'ici.
