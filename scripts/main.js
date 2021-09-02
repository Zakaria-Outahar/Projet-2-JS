import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";

const CLEFAPI = '8ea39d16e1854e5a05697dbc67190c42';
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-prevision-nom');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long,lat);
    }, () => {
        alert(`Vous devez activer votre géolocalisation pour faire fonctionner l'application`);
    })
}

function AppelAPI(long, lat){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then(reponse => {
        return reponse.json();
    })
    .then(data => {
        resultatsAPI = data;
        console.log(resultatsAPI);
        temps.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°C`;
        localisation.innerText = resultatsAPI.timezone;

        let heureActuelle = new Date().getHours();

        for(let i = 0; i < heure.length; i++){
            let heureIncr = heureActuelle + i*3;
            if(heureIncr > 24){
                heureIncr = heureIncr - 24;
            } else if(heureIncr === 24){
                heureIncr = "00";
            }
            heure[i].innerText = `${heureIncr}h`
        }

        for(let i = 0; i < tempPourH.length; i++){
            tempPourH[i].innerText = `${Math.trunc(resultatsAPI.hourly[i*3].temp)}°C`;
        }

        for(let i = 0; i < tabJoursEnOrdre.length; i++){
            joursDiv[i].innerText = tabJoursEnOrdre[i].slice(0,3);
        }

        for(let i = 0; i < 7; i++){
            tempDiv[i].innerText = `${Math.trunc(resultatsAPI.daily[i].temp.day)}°C`;
        }

        if(heureActuelle >= 6 && heureActuelle < 21){
            imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
        } else{
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
        }

        chargementContainer.classList.add('disparition');
        setTimeout(() =>  chargementContainer.style.display = "none",1100);
    })
}