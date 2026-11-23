fx_version 'cerulean'
game 'gta5'

name 'MZM-WORKS Loading Screen'
author 'MZM-WORKS'
description 'Premium responsive FiveM loading screen'
version '1.0.0'

loadscreen 'html/index.html'
loadscreen_manual_shutdown 'yes'

files {
    'html/index.html',
    'html/styles.css',
    'html/script.js',
    'html/config.js',
    'html/assets/*'
}

client_script 'client.lua'
