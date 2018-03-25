# OVRSalt

a very very very very WIP OpenVR overlay system using React + Pixi.JS.

## Abstract/Story Time

So you're a web dev, and you just got a shiny new VR headset. You start needing an overlay to see your friends talk to you on Discord or on Twitch chat, so you buy OVRDrop or install some other thing. You're left unsatisfied with just putting windows into the game because Electron apps kinda suck at working with OVRDrop. So, you start looking into what OVRDrop and other OpenVR overlay systems are built with. Unity? Qt? Neither of those make sense to you. You're a web dev.

So you build OVRSalt. And throw React, Mobx, Redux, Pixi and other web dev UI fun at your problem.

And you didn't even use OpenGL or DirectX.

## Architecture

OVRSalt is in 3 parts,

- **Backend** (Windows C++) is the OpenVR connector, which provides IPC and launches Runtime processes, as well as passes events throughout the system. It recieves RGBA uint8 arrays from the Runtime processes it runs, and updates OpenVR overlay with that data.

- **Runtime** (Windows Node.js) is the JS renderer, which connects to IPC and provides a virtual DOM environment for React and Pixi to do their business. It takes ideally 60 fps snapshots of the Pixi.JS canvas to send to the Backend process via IPC. This is built with `pkg` for production/.exe builds, and built copies include Frontend UI bundles.

- **Frontend** (Node.js) is the UI component and dev environment. It's based on regular old create-react-app, with pixi-fiber and routers in tow. Also contains the Salt UI kit, a home-grown rectangle-based UI library built specifically for OVRSalt. In development, it uses the regular CRA development paths; while in production/VR, it uses rollup bundles from *.main.js files. A primary goal is to remain very easy to develop with.

## Developing

I'm still unsure of workflows re: Windows. PRs are open for any workflow improvements that can be made.

**Clone this repo:** (since we have submodules)
```
git clone --recursive https://github.com/kayteh/ovrsalt.git
```

### Tools

- Visual Studio 2017
- Node.js 9.x (ideally installed at the default node.js install location if on Windows.)
- Yarn
- SteamVR

### General Setup

- In Frontend, `yarn`
- In Runtime, `yarn`

### VR

If you plan to develop VR-related systems, follow this path.

- In Frontend, `yarn build`
- In Runtime, `yarn build`, (Runtime **must** be built after Frontend.)
- In Backend, build the solution, run it.

*If you do not have a VR HMD connected, you must turn on SteamVR's "null" driver. This obviously means you miss out on a lot of features, but you can still test if displaying works.*

*On that note, It's possible this all works with Daydream/Gear/Cardboard/PS4VR right now. YMMV.*

### UI

If you just plan to work on the UI, follow this path. This path does not currently mirror to VR. 
This is a planned feature of the development toolkit.

- In Frontend, `yarn start`

## Current Status

**Not production ready.**  
**Not ready for users.**

This system doesn't work yet. It's a big proof of concept we'll break apart and optimize later. It's currently only tested on Oculus Rift and Null OpenVR drivers, but *hopefully* OpenVR's claim of the One True VR SDK™ holds up for other platforms.

## Goals

- [ ] Multiple headless overlays
- [ ] High-level UI kit
- [ ] Frontend: Dashboard app
- [ ] Frontend: Spotify + Discord + Twitch Chat tabbed overlay (*this was my original goal*)
- [ ] A marvelous system of wiggles.
- [ ] React-Native-OpenVR? Possible SDK-ish system.
- [ ] In-browser + In-VR development simultaneously.