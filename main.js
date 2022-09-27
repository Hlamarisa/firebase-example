// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

import { getDatabase, onValue, push, ref } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBui7V9RvI-zewcsQcQsIw63o5R9_wnGMw",

  authDomain: "fir-example-1e226.firebaseapp.com",

  projectId: "fir-example-1e226",

  storageBucket: "fir-example-1e226.appspot.com",

  messagingSenderId: "906508398842",

  appId: "1:906508398842:web:4bbf09af1009965d2e5943",

  measurementId: "G-3XV02824LL"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const auth = getAuth()


// Get btns
const loginBtn = document.querySelector("#login-btn")
const logoutBtn = document.querySelector("#logout-btn")
const usernameDiv = document.querySelector("#username")

// Leaflet set up
const map = L.map("map").setView([-25.754, 28.229], 18)

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "© OpenStreetMap"
}).addTo(map)

// Work some magic
let username = ""
loginBtn.addEventListener('click',() => {
	signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
		 const user = result.user
		 console.log(user)
		 username = user.displayName
		usernameDiv.innerHTML = username
	})
})

logoutBtn.addEventListener('click', () => {
	signOut(auth)
	username = ""
	usernameDiv.innerHTML = "Welcome"
})

let marker = null

map.addEventListener('click', (event) => {
	if (username)
	{
		const coords = event.latlng
		marker = L.marker()
		marker.setLatLng(coords).addTo(map)
		push(ref(db, `users/${username}`), {coords})
	}
	else 
	{
		alert('Please login')
	}
	
})
document.addEventListener('DOMContentLoaded', () => 
{
	const pointsRef = ref(db, `users/`)
	onValue(pointsRef, (snapshot) => 
	{
     const points = snapshot.val()
     if (points) {const users = Object.values(points)
		users.map((user) => {
			const dataVal = Object.values(user)
			dataVal.map((val) => {
				marker = L.marker()
				marker.setLatLng(val.coords).addTo(map)
			})
		})
	}
	})
})