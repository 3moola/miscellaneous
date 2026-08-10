// ==UserScript==
// @name         YouTube Mobile 144p (5-Second Force)
// @version      1.0
// @description  Forces 144p for the first 5 seconds of a video, then stops to allow manual changes.
// @match        *://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license   MIT
// ==/UserScript==
 
(function() {
    'use strict';
 
    let currentVideoId = "";
    let enforcementStartTime = 0;
    const ENFORCE_DURATION = 5000; // Force quality for 5 seconds
 
    function getVideoId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('v') || (window.location.pathname.includes('/shorts/') ? window.location.pathname : null);
    }
 
    function enforceQuality() {
        const newVideoId = getVideoId();
 
        // 1. Detect if it's a new video
        if (newVideoId && newVideoId !== currentVideoId) {
            currentVideoId = newVideoId;
            enforcementStartTime = Date.now(); // Start the 5-second timer
            console.log("New video detected. Enforcing 144p for 5 seconds...");
        }
 
        // 2. If we are within the 5-second window, FORCE 144p
        if (Date.now() - enforcementStartTime < ENFORCE_DURATION) {
            const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
 
            if (player && typeof player.setPlaybackQuality === 'function') {
                // Try to set 'tiny' (144p)
                const currentQ = player.getPlaybackQuality();
                if (currentQ !== 'tiny') {
                    player.setPlaybackQuality('tiny');
                }
 
                // Also try setPlaybackQualityRange (often needed for mobile)
                if (typeof player.setPlaybackQualityRange === 'function') {
                    player.setPlaybackQualityRange('tiny', 'tiny');
                }
            }
        }
    }
 
    // Run heavily to catch the load moment
    setInterval(enforceQuality, 500);
})();
