$ErrorActionPreference = "Stop"

function p([string]$out) {
    Write-Host $out
}

function c([string]$cmd) {
    p "> $cmd"
    Invoke-Expression $cmd
}

function help() {
    p "OVRSalt Dev Tools"
    p "~~~~~~~~~~~~~~~~~"
    p ""
    p "Commands:"
    p "  help  - this help text"
    p "  vr    - builds prerequistites for a VR dev environment"
    p "  ui    - starts UI dev environment"
    p "  rel   - builds the entire project for release"
}

function vr() {
    Set-Location $PSScriptRoot\Frontend
    c "yarn"
    c "yarn build"

    Set-Location $PSScriptRoot\Runtime
    c "yarn"

    p ""
    p "** OK. You're good to build and run stuff in Visual Studio now."

    Set-Location $PSScriptRoot
}

function ui() {
    Set-Location $PSScriptRoot\Frontend
    c "yarn"
    c "yarn start"
    Set-Location $PSScriptRoot
}

function rel() {
    $BuildRoot = $args[1]
    if ($BuildRoot -match "") {
        $BuildRoot = ".\x64\Release"
    }

    vr
    Set-Location $PSScriptRoot\Runtime
    c "yarn build"

    Set-Location $PSScriptRoot

    $ErrorActionPreference = ""    
    Copy-Item -Recurse $PSScriptRoot\Backend\lib\openvr-sdk\bin\win64\* $BuildRoot
    
    mkdir $BuildRoot\runtime
    Copy-Item -Recurse $PSScriptRoot\Runtime\build\* $BuildRoot\runtime
    $ErrorActionPreference = "Stop"   
    
    Set-Location $PSScriptRoot
}

function main([string]$action = "help") {
    Set-Location $PSScriptRoot
    &$action
}

main $args[0]